# Tarat's Garden 🌱

A personal digital garden built with Next.js 16 — featuring writings, projects, experiments, and an AI-powered knowledge base.

## ✨ Features

### Core Content

- **📝 Writings** - Blog posts, essays, and thoughts (paginated, chronological)
- **🚀 Projects** - Side projects and experiments (paginated, tag-filtered)
- **📚 Library** - Reading list with status and ratings
- **🎯 List 100** - Life goals and bucket list
- **💼 Resume** - Work experience and achievements

### Interactive Features

#### 🌐 Copresence
Real-time cursor visualization showing other visitors on the site. Built with PartyKit WebSockets, creates a beautiful heat-map effect that shows where people are looking.

**Tech:** PartyKit, Canvas API, WebSockets

#### 🔮 Semantic Network (/network)
Interactive D3.js force-directed graph visualizing connections between projects, writings, and experience based on semantic similarity of embeddings.

**Features:**
- Cosine similarity-based connections
- Domain-specific coloring (projects, writings, experience)
- Draggable nodes
- Zoom/pan navigation
- Click nodes to navigate

**Tech:** D3.js, sentence-transformers embeddings

#### 🤖 Tarat AI (/tarat-ai)
RAG-powered AI assistant trained on all content. Ask questions about projects, writings, books, or work experience.

**How it works:**
1. Pre-generated embeddings for all content (projects, writings, books, list100, experience)
2. Client-side semantic search using `@xenova/transformers` (all-mpnet-base-v2)
3. Query classification to determine which domain to search
4. Top-K retrieval of relevant context
5. LLM generation (Groq API) with style-matched responses

**Features:**
- Fully client-side embedding search (no backend vector DB)
- Domain-aware routing (automatically picks projects/writings/books/experience/list100)
- Progressive model loading with status indicators
- Markdown-formatted responses

**Tech:** @xenova/transformers, Groq API, Python (sentence-transformers for embedding generation)

#### 🎵 Spotify Integration
Shows top track of the week on homepage using Spotify API.

**Tech:** spotify-web-api-node, Next.js Server Actions

#### ❤️ Like Button
Firebase-powered like button on writings (real-time counter, IP-based rate limiting).

**Tech:** Firebase Admin SDK, Firestore

### Technical Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** TailwindCSS 4 + Custom Prose
- **Fonts:** Geist Sans, Geist Mono, Canela (display)
- **Content:** Markdown + Gray Matter (frontmatter parsing)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics
- **Real-time:** PartyKit (WebSockets)
- **AI/ML:** @xenova/transformers, Groq API, sentence-transformers (Python)
- **Database:** Firebase (likes)
- **Visualization:** D3.js (network graph)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for Next.js 16)
- Python 3.11+ (for embedding generation)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Python dependencies for embeddings (optional)
cd taratai
pip install -r requirements.txt
cd ..
```

### Environment Variables

Create a `.env.local` file:

```env
# Groq API (for Tarat AI)
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key

# PartyKit (for Copresence)
NEXT_PUBLIC_PARTYKIT_URL=your_partykit_url

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token

# Firebase (for like button)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

### Development

```bash
# Start dev server (uses webpack for @xenova/transformers compatibility)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Note:** This project uses `--webpack` flag instead of Turbopack due to `@xenova/transformers` requiring specific webpack configurations for browser compatibility.

### Building for Production

```bash
npm run build
npm run start
```

## 📊 Generating Embeddings (for Tarat AI)

Embeddings are pre-generated for all content and stored as JSON files in `/public`.

```bash
cd taratai

# Generate embeddings (creates .pkl files)
python3 create_embeddings.py

# Convert to JSON for Next.js
python3 covert_to_json.py

# Outputs to /public/embeddings-{domain}.json
```

**Domains:** projects, writings, experience, list100, books

## 📁 Project Structure

```
copresence/
├── src/
│   ├── app/
│   │   ├── (with-nav)/          # Routes with navigation
│   │   │   ├── projects/         # Projects listing + detail pages
│   │   │   ├── writings/         # Writings listing + detail pages
│   │   │   ├── library/          # Book library
│   │   │   ├── list100/          # Life goals
│   │   │   ├── resume/           # Work experience
│   │   │   ├── tarat-ai/         # RAG AI assistant
│   │   │   └── easter-eggs/      # Fun stuff
│   │   ├── network/              # Semantic network viz (no nav)
│   │   ├── api/
│   │   │   ├── tarat-ai/         # RAG endpoint
│   │   │   ├── likes/            # Like button API
│   │   │   └── writings/         # Writings metadata
│   │   ├── page.tsx              # Homepage
│   │   └── layout.tsx            # Root layout
│   ├── components/
│   │   ├── Copresence.tsx        # Real-time cursor viz
│   │   ├── GardenMap.tsx         # Semantic network
│   │   ├── LikeButton.tsx        # Firebase-powered likes
│   │   ├── TopNav.tsx            # Navigation bar
│   │   └── InstagramEmbed.tsx    # Social embeds
│   ├── lib/
│   │   ├── projects.ts           # Project loader
│   │   └── writings.ts           # Writings loader
│   └── utils/
│       ├── firebase.ts           # Firebase client
│       ├── firebase-admin.ts     # Firebase admin
│       └── colorsAPI.tsx         # Theming
├── projects/                     # Project markdown files
├── writings/                     # Writing markdown files
├── public/
│   ├── embeddings-*.json         # Pre-generated embeddings
│   ├── garden-map.json           # Network graph data
│   └── assets/                   # Images
├── taratai/                      # Python scripts for embeddings
│   ├── create_embeddings.py      # Generate embeddings
│   ├── covert_to_json.py         # Convert pkl to JSON
│   └── requirements.txt          # Python deps
├── party-kit-server/             # PartyKit server for copresence
└── next.config.ts                # Next.js config (webpack setup)
```

## 🎨 Key Design Decisions

### Why Webpack instead of Turbopack?

`@xenova/transformers` requires specific webpack configurations (fallbacks, aliases) that Turbopack doesn't support yet in Next.js 16. The `--webpack` flag is added to all build scripts.

### Why Client-Side Embeddings?

Instead of using a vector database (Pinecone, Weaviate), embeddings are:
- Pre-generated during build time
- Served as static JSON
- Searched client-side using `@xenova/transformers`

**Benefits:**
- No backend infrastructure
- No API costs for embeddings
- Works offline after initial load
- Privacy-preserving (all searches happen locally)

**Tradeoffs:**
- Larger initial bundle (~5MB for embeddings JSON)
- Model loading time (~3-5s on first visit)
- Need to regenerate embeddings when content changes

### Markdown Processing

- Frontmatter parsed with `gray-matter`
- Rendered with custom MDX pipeline (rehype-pretty-code, remark-gfm)
- Syntax highlighting with Shiki

### Pagination Strategy

- **Writings:** Server-side pagination (URL params)
- **Projects:** Client-side pagination + tag filtering

## 🔧 Configuration

### Updating Content

1. Add/edit markdown files in `/projects` or `/writings`
2. Regenerate embeddings: `cd taratai && python3 create_embeddings.py && python3 covert_to_json.py`
3. Rebuild: `npm run build`

### Customizing AI Personality

Edit the style guide in `src/app/api/tarat-ai/route.ts`:

```typescript
const styleGuide = `
🧠 Style & Personality Guide
You are [Your Name]...
`;
```

### Adjusting Network Graph

Modify constants in `src/components/GardenMap.tsx`:

```typescript
const SIMILARITY_THRESHOLD = 0.35;  // Link threshold
const MAX_NEIGHBORS = 4;            // Max connections per node
```

## 📝 Writing Content

### Projects

Create `projects/my-project.md`:

```markdown
---
title: My Project
description: Short description
category: project
date: 2025-01-15
tags:
  - python
  - machine-learning
links:
  - type: github
    url: https://github.com/user/repo
  - type: link
    url: https://example.com
---

## Intro

Content here...
```

### Writings

Create `writings/my-post.md`:

```markdown
---
title: My Post
description: Short description
category: tech
date: 2025-01-15
---

Content here...
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

**Important:** Vercel will use webpack automatically due to `package.json` scripts.

### Manual Deployment

```bash
npm run build
npm run start
```

Serve on port 3000.

## 🤝 Contributing

This is a personal site, but feel free to:
- Report bugs
- Suggest features
- Fork for your own digital garden

## 📄 License

MIT License - See LICENSE file for details

---

**Built with 🌱 by Tarat**

[tarat.space](https://tarat.space) • [@tarat_211](https://x.com/tarat_211)
