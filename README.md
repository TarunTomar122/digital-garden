# Tarat's Digital Garden 🌱

> A living document of my journey building and rebuilding my personal corner of the internet

This repository contains multiple iterations of my digital garden — from early experiments to the current production version. Each version taught me something new about web development, design, and what it means to maintain a personal site.

## 🎯 Current Version: **Copresence**

The latest iteration is in the `/copresence` folder. It's a Next.js 16 app featuring:

- **Real-time cursor visualization** (PartyKit WebSockets)
- **RAG-powered AI assistant** (talk to my content!)
- **Semantic network graph** (D3.js visualization of connections)
- **Projects, writings, library, goals, resume**
- **Spotify integration** (top track of the week)
- **Like button** (Firebase-powered)

**Live:** [tarat.space](https://tarat.space)

→ **[See full README](./copresence/README.md)** for setup, architecture, and features

---

## 📚 Version History

### `/copresence` - **v4** (Current, Dec 2024 - Present)

The "copresence" version — focused on connection and intelligence.

**Key Features:**
- Real-time visitor presence (heat-map effect)
- RAG AI trained on all my content
- Semantic network visualization
- Client-side embedding search (no backend!)
- Paginated projects & writings
- Tag-based filtering

**Tech:** Next.js 16, TailwindCSS 4, PartyKit, @xenova/transformers, D3.js, Firebase

**Philosophy:** "Show presence. Enable discovery. Let people talk to my work."

### `/v3/faster-digital-garden` - **v3** (2024)

Focused on performance and minimalism.

**Learnings:**
- PPR (Partial Pre-Rendering) in Next.js
- Streaming React components
- Optimizing for Core Web Vitals
- Markdown rendering pipelines

### `/v2/my-garden` - **v2** (2023-2024)

The "my garden" version — experimenting with structure.

**Learnings:**
- MDX for rich content
- Dynamic routing patterns
- Custom design systems
- Content organization at scale

### `/` (Root) - **v1** (2023)

The first version — learning the basics.

**Learnings:**
- Next.js fundamentals
- API routes
- Static generation vs. SSR
- Deploying to Vercel

### `/start-basic` - **Experimental** (2024)

A Tanstack Start experiment — trying new frameworks.

**Learnings:**
- File-based routing alternatives
- Client-side state management
- Different meta-framework philosophies

---

## 🛠️ Tech Evolution

| Version | Framework | Styling | Deployment | Notable Features |
|---------|-----------|---------|------------|------------------|
| v1 | Next.js 13 | CSS Modules | Vercel | Basic blog |
| v2 | Next.js 14 | TailwindCSS 3 | Vercel | MDX, Custom fonts |
| v3 | Next.js 14 | TailwindCSS 3 | Vercel | PPR, Performance focus |
| v4 (Current) | Next.js 16 | TailwindCSS 4 | Vercel | RAG AI, Real-time features |

---

## 🌟 Key Learnings

### What Worked

1. **Markdown-based content** — Easy to write, version control, and migrate
2. **Static generation** — Fast, cheap, and simple to host
3. **Incremental complexity** — Start simple, add features as needed
4. **Local-first AI** — Client-side embeddings remove infrastructure overhead

### What I'd Do Differently

1. **Start with a design system** — Consistency is hard to retrofit
2. **Plan content structure early** — Moving files between `/projects` and `/writings` is tedious
3. **Embrace edge functions** — Could've used them earlier for API routes
4. **Document as you go** — This README should've existed from day one

---

## 📦 Repository Structure

```
tarats-garden/
├── copresence/           # Current version (v4)
│   ├── src/
│   ├── projects/
│   ├── writings/
│   ├── public/
│   └── README.md
├── v3/
│   └── faster-digital-garden/
├── v2/
│   └── my-garden/
├── start-basic/          # Tanstack Start experiment
└── README.md             # This file
```

---

## 🚀 Getting Started

### Running the Current Version

```bash
cd copresence
npm install
npm run dev
```

See [copresence/README.md](./copresence/README.md) for full setup instructions.

### Exploring Old Versions

Each version has its own `package.json` and can be run independently:

```bash
cd v2/my-garden  # or v3/faster-digital-garden
npm install
npm run dev
```

---

## 🎨 Design Philosophy

### Current (v4 - Copresence)

**"A garden, not a blog. A conversation, not a broadcast."**

Principles:
- Show, don't just tell (real-time presence, semantic networks)
- Make content discoverable (AI search, graph visualization, tags)
- Optimize for browsing, not just reading
- Use AI to enhance, not replace, human connection

### Evolution

- **v1:** "Just ship something"
- **v2:** "Make it look good"
- **v3:** "Make it fast"
- **v4:** "Make it interactive and intelligent"

---

## 📝 Content Types

### Projects
Build logs and experiments — things I've made.

**Examples:**
- Lumi (AI-powered todo app)
- Tarat AI (RAG for digital garden)
- Collaborative RL Agents
- Tiny model experiments

### Writings
Essays, thoughts, and explorations.

**Examples:**
- Technical deep-dives
- Reflections on building
- Trip reports
- Career thoughts

### Library
Books I've read with ratings and status.

### List 100
Life goals and bucket list.

---

## 🔮 Future Ideas

Things I'm considering for v5:

- [ ] Bi-directional links (Obsidian-style)
- [ ] Version control UI (show edit history inline)
- [ ] Comments (maybe? still thinking about this)
- [ ] Newsletter integration (Substack/Buttondown)
- [ ] ActivityPub support (Fediverse integration)
- [ ] Local LLM option (replace Groq with Ollama)
- [ ] Mobile app (React Native? Flutter?)

---

## 🤔 Why So Many Versions?

**Because iteration is how you learn.**

Each version taught me something:
- v1 taught me **Next.js basics**
- v2 taught me **content architecture**
- v3 taught me **performance optimization**
- v4 taught me **AI/ML integration** and **real-time systems**

I could've kept "perfecting" v1, but rebuilding forces you to question assumptions and try new things.

---

## 🤝 Inspiration & Credits

### Inspired By

- [Andy Matuschak's notes](https://notes.andymatuschak.org/)
- [Maggie Appleton's digital garden](https://maggieappleton.com/)
- [Tom MacWright's blog](https://macwright.com/)
- [Josh Comeau's blog](https://www.joshwcomeau.com/)

### Built With

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [PartyKit](https://www.partykit.io/)
- [Transformers.js](https://huggingface.co/docs/transformers.js)
- [D3.js](https://d3js.org/)
- [Vercel](https://vercel.com/)

---

## 📄 License

MIT License

Feel free to fork, learn from, or use as inspiration for your own digital garden.

If you do build something based on this, I'd love to see it! Tag me [@tarat_211](https://x.com/tarat_211) on X.

---

## 📬 Contact

- **Website:** [tarat.space](https://tarat.space)
- **Twitter/X:** [@tarat_211](https://x.com/tarat_211)
- **GitHub:** [@TarunTomar122](https://github.com/TarunTomar122)
- **LinkedIn:** [Tarun Tomar](https://www.linkedin.com/in/tarun-tomar-4ab0b5193/)

---

**Last Updated:** December 2024

*This README is a living document. It grows as the garden grows.*
