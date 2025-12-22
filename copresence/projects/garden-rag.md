---
title: Tarat AI
description: A RAG based AI assistant for my digital garden
category: project
date: 2025-10-20
tags:
    - machine-learning
    - python
    - nextjs
links:   
    - type: link
      url: https://www.tarat.space/tarat-ai
    - type: github
      url: https://github.com/TarunTomar122/digital-garden/tree/main/copresence/taratai
---

So I knew what RAG is and how it works but I never actually built one. So I decided to build one for my digital garden.
It's actually pretty straightforward and below I will take you through the process of how I built one for this website.

####

> You can try it out [here](https://www.tarat.space/tarat-ai)

### The Problem

I've been writing this digital garden for a while now — projects, blog posts, books I've read, random life goals, work experience. It's all scattered across markdown files. And honestly, searching through it manually is annoying.

####

So I thought, what if I could just ask questions like "What projects has Tarat built?" or "What books does he like?" and get instant answers? Not from ChatGPT making stuff up — but from my actual content.

####

That's the whole point of RAG (Retrieval-Augmented Generation). You give the AI your own data, it finds the relevant pieces, and then generates an answer based only on what you gave it.

### Step 1: Collecting the data

The first step is to collect the data that we want to use to build the RAG. In this case, we want to use the content of this website. Luckily, the way this website works is that I write stuff in `.md` files and then render them to html and so I could use these `.md` files to build the RAG.

####

I organized the content into five domains:

####

- **Projects** — All my side projects and experiments
- **Writings** — Blog posts and essays
- **Experience** — Work history and resume stuff
- **List100** — My life goals and bucket list
- **Books** — Everything I've read with ratings and status

####

Each domain lives in a different folder or JSON file, but the loading logic is basically the same — read the markdown/JSON, strip out the noise, and prepare it for embedding.

### Step 2: Preprocessing and chunking

Raw markdown is messy. It has frontmatter, code fences, heading markers, links — stuff that doesn't help an embedding model understand the content.

####

So I wrote a simple preprocessor that:

####

- Removes YAML frontmatter
- Strips markdown syntax (headings, links, code blocks)
- Collapses whitespace

####

```python
def strip_markdown_simple(text: str) -> str:
    import re
    # Remove YAML frontmatter first
    t = re.sub(r'^---[\s\S]*?---\s*', '', text)
    # Remove code fences/backticks
    t = t.replace("```", " ").replace("`", " ")
    # Remove headings markers
    for h in ("###### ", "##### ", "#### ", "### ", "## ", "# "):
        t = t.replace(h, "")
    # Replace links [text](url) -> text
    t = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\\1", t)
    # Collapse multiple spaces/newlines
    t = re.sub(r"\s+", " ", t).strip()
    return t
```

####

After cleaning, I chunk the text into 1200-character blocks with 200-character overlap. This helps capture context without losing information at boundaries.

####

```python
def chunk_text(text: str, chunk_size: int = 1200, overlap: int = 200) -> List[str]:
    chunks = []
    step = chunk_size - overlap
    for i in range(0, len(text), step):
        chunks.append(text[i:i + chunk_size])
    return chunks
```

### Step 3: Creating embeddings

Now comes the fun part — turning text into vectors.

####

I used `sentence-transformers` with the `all-mpnet-base-v2` model. It's fast, open-source, and works locally without any API calls.

####

The key insight here is that I don't just embed raw text — I add domain-specific prefixes to give the model context:

####

```python
# For projects
f"PROJECT: {filename}. Content: {chunk}"

# For writings
f"WRITING: {filename}. Paragraph: {chunk}"

# For list100
f"LIST100 SUMMARY: {items}"
```

####

This helps the model understand what kind of content it's looking at. When someone asks "What projects has Tarat built?", the model knows to look for things labeled "PROJECT".

####

For documents with multiple chunks, I do mean pooling — average all the chunk embeddings into a single document embedding. This way, each project or blog post gets one vector.

####

```python
model = SentenceTransformer("all-mpnet-base-v2")
embeddings = model.encode(chunks, show_progress_bar=True)

# Mean pooling across chunks
pooled_vec = doc_matrix.mean(axis=0)
```

####

The output? Five pickle files — one per domain — containing embeddings, original text, and metadata.

### Step 4: Converting to JSON for Next.js

Python pickle files don't work in a Next.js frontend. So I wrote a conversion script that loads the pickles and dumps them to JSON.

####

```python
with open(pkl_path, 'rb') as f:
    data = pickle.load(f)

embeddings_list = data['embeddings'].tolist()

output_data = {
    'model': data['model'],
    'embeddings': embeddings_list,
    'texts': data['texts'],
    'metadata': data['metadata'],
    'domain': domain,
}

with open(out_path, 'w') as f:
    json.dump(output_data, f)
```

####

These JSON files live in `/public`, so the frontend can fetch them directly.

### Step 5: Building the frontend

The frontend is where things get interesting. I wanted the entire RAG pipeline to run locally in the browser — no backend database, no vector store, just pure client-side search.

####

Here's how it works:

####

1. **Load the embedding model** — I use `@xenova/transformers` to load the same `all-mpnet-base-v2` model in the browser. It's quantized, so it's fast enough to run on client hardware.

2. **Classify the query** — Before searching, I classify the user's question to figure out which domain to search:

```javascript
const classifyDomain = (q: string): Domain => {
  const s = q.toLowerCase();
  if (/(experience|resume|work|job|adobe)/.test(s)) return "experience";
  if (/(book|read|author|library)/.test(s)) return "books";
  if (/(project|build|code|github)/.test(s)) return "projects";
  if (/(goal|list|bucket|achieve)/.test(s)) return "list100";
  return "writings";
};
```

3. **Compute query embedding** — The user's question gets embedded using the same model:

```javascript
const extractor = await pipeline("feature-extraction", "Xenova/all-mpnet-base-v2");
const queryVec = await extractor(query, { pooling: "mean", normalize: true });
```

4. **Cosine similarity search** — I compute cosine similarity between the query vector and all document vectors in that domain, then return the top 3 results:

```javascript
const cosineTopK = (embs, norms, queryVec, topK = 5) => {
  const scores = [];
  for (let i = 0; i < embs.length; i++) {
    let dot = 0;
    for (let j = 0; j < embs[i].length; j++) dot += embs[i][j] * queryVec[j];
    const score = dot / (norms[i] * qnorm);
    scores.push({ index: i, score });
  }
  return scores.sort((a, b) => b.score - a.score).slice(0, topK);
};
```

5. **Send to LLM** — The retrieved context + query go to Groq's API (using `gpt-oss-20b`). I crafted a detailed style guide so the AI responds in my voice:

```typescript
const styleGuide = `
You are Tarun Tomar (also known as Tarat) — a curious, creative, and technically sharp builder.
You speak and think as Tarat, in first person (use "I", "my").
Core Identity: I am an engineer at Adobe, working on design systems...
Speaking Style: Friendly, direct, confident, slightly informal...
If the information is not present, reply: "I am not going to answer this :)"
`;
```

####

The LLM generates a response grounded in the retrieved context — no hallucinations, no made-up projects.

### Why I built it this way

There are simpler ways to do RAG — use Pinecone, Weaviate, or just OpenAI embeddings. But I wanted to:

####

- **Keep it local** — No external vector database. Everything runs in the browser or in static JSON files.
- **Stay lightweight** — The entire embedding model fits in ~80MB and runs fast on any device.
- **Avoid vendor lock-in** — No paid APIs for embeddings. I generate them once and deploy them as static assets.
- **Make it domain-aware** — Instead of one giant embedding pool, I separate by content type and classify queries before searching. This improves relevance.

####

The tradeoff? I have to regenerate embeddings every time I add new content. But that's fine — I just run `python create_embeddings.py` and `python covert_to_json.py`, and it's done.

### What I learned

RAG isn't magic. It's just:

####

1. Embed your documents
2. Embed the user's query
3. Find the most similar documents
4. Send those + the query to an LLM

####

The hard parts are preprocessing (cleaning markdown), chunking (without losing context), and tuning retrieval (how many results? which domain?).

####

But once you get it working, it's incredibly satisfying. I can now ask my digital garden questions and get real, grounded answers — not generic AI slop.

####

If you want to try it, check out the live version [here](https://www.tarat.space/tarat-ai). And if you want to see the code, it's all on [GitHub](https://github.com/TarunTomar122/digital-garden/tree/main/copresence/taratai).

