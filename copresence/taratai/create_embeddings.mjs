#!/usr/bin/env node
/**
 * Regenerates public/embeddings-{domain}.json for Tarat's AI + Garden Galaxy.
 *
 * Uses the same model the app uses at query time (Xenova/all-mpnet-base-v2 via
 * @xenova/transformers), so document and query vectors come from one encoder.
 *
 * Domains: projects, writings, experience, list100, books.
 * Hidden writings (frontmatter `hidden: true`) are skipped.
 *
 * Usage: npm run embeddings
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline, env } from "@xenova/transformers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PROJECTS_DIR = path.join(ROOT, "projects");
const WRITINGS_DIR = path.join(ROOT, "writings");
const EXPERIENCE_FILE = path.join(PUBLIC_DIR, "resume.txt");
const SITE_FILE = path.join(PUBLIC_DIR, "llms.txt");
const LIST100_FILE = path.join(ROOT, "src/app/list100.json");
const BOOKS_FILE = path.join(ROOT, "src/app/(with-nav)/library/books.json");

const MODEL = "Xenova/all-mpnet-base-v2";
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const BATCH_SIZE = 8;

env.allowLocalModels = false;
env.cacheDir = path.join(__dirname, ".cache");

function log(...args) {
  console.log("[embeddings]", ...args);
}

function loadMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return {};
  const out = {};
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
    out[file.replace(/\.(md|mdx)$/i, "")] = fs.readFileSync(
      path.join(dir, file),
      "utf8"
    );
  }
  return out;
}

function isHidden(content) {
  const match = content.match(/^---[\s\S]*?---/);
  if (!match) return false;
  return /^hidden:\s*true\s*$/m.test(match[0]);
}

function stripMarkdown(text) {
  let t = text.replace(/^---[\s\S]*?---\s*/, "");
  t = t.replace(/```/g, " ").replace(/`/g, " ");
  for (const h of ["###### ", "##### ", "#### ", "### ", "## ", "# "]) {
    t = t.split(h).join("");
  }
  t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  t = t.replace(/[*_>]/g, "");
  t = t.replace(/\s+/g, " ").trim();
  return t;
}

function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  const step = size - overlap;
  for (let i = 0; i < text.length; i += step) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks.length ? chunks : [text];
}

function meanVector(vectors) {
  if (!vectors.length) return [];
  const dim = vectors[0].length;
  const out = new Array(dim).fill(0);
  for (const vec of vectors) {
    for (let i = 0; i < dim; i++) out[i] += vec[i];
  }
  for (let i = 0; i < dim; i++) out[i] /= vectors.length;
  return out;
}

async function encodeAll(extractor, texts) {
  const vectors = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const output = await extractor(batch, { pooling: "mean", normalize: true });
    const dim = output.dims[output.dims.length - 1];
    const flat = output.data;
    for (let b = 0; b < batch.length; b++) {
      vectors.push(Array.from(flat.slice(b * dim, (b + 1) * dim)));
    }
    log(`  encoded ${Math.min(i + BATCH_SIZE, texts.length)}/${texts.length}`);
  }
  return vectors;
}

function writeDomain(domain, { embeddings, texts, embedTexts, metadata }) {
  const outPath = path.join(PUBLIC_DIR, `embeddings-${domain}.json`);
  const payload = {
    model: MODEL,
    embeddings,
    texts,
    embed_texts: embedTexts,
    metadata,
    count: embeddings.length,
    domain,
  };
  fs.writeFileSync(outPath, JSON.stringify(payload));
  const size = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2);
  log(`✅ ${domain}: ${embeddings.length} docs, ${size} MB`);
}

async function prepareDocuments(extractor, docs, prefix) {
  const displayTexts = [];
  const embedTexts = [];
  const metadata = [];
  const chunksPerDoc = [];

  for (const [name, content] of Object.entries(docs)) {
    displayTexts.push(content);
    metadata.push({
      type: prefix.toLowerCase(),
      name,
      path: `${prefix === "PROJECT" ? "projects" : "writings"}/${name}.md`,
    });
    const raw = stripMarkdown(content);
    const chunks = chunkText(raw).map((c) => `${prefix}: ${name}. Content: ${c}`);
    chunksPerDoc.push(chunks);
  }

  const flat = chunksPerDoc.flat();
  log(`  ${displayTexts.length} docs → ${flat.length} chunks`);
  const chunkVectors = await encodeAll(extractor, flat);

  const embeddings = [];
  let idx = 0;
  for (const chunks of chunksPerDoc) {
    embeddings.push(meanVector(chunkVectors.slice(idx, idx + chunks.length)));
    idx += chunks.length;
    embedTexts.push(chunks[0] ?? "");
  }

  return { embeddings, texts: displayTexts, embedTexts, metadata };
}

async function main() {
  log(`Loading model ${MODEL} (downloads on first run)...`);
  const extractor = await pipeline("feature-extraction", MODEL, {
    quantized: true,
  });

  // projects
  log("Projects...");
  const projects = loadMarkdownFiles(PROJECTS_DIR);
  writeDomain("projects", await prepareDocuments(extractor, projects, "PROJECT"));

  // writings (skip hidden)
  log("Writings...");
  const writings = loadMarkdownFiles(WRITINGS_DIR);
  const visibleWritings = Object.fromEntries(
    Object.entries(writings).filter(([, content]) => !isHidden(content))
  );
  const skipped = Object.keys(writings).length - Object.keys(visibleWritings).length;
  if (skipped) log(`  skipped ${skipped} hidden writing(s)`);
  writeDomain(
    "writings",
    await prepareDocuments(extractor, visibleWritings, "WRITING")
  );

  // experience (from the resume source)
  log("Experience...");
  if (fs.existsSync(EXPERIENCE_FILE)) {
    const content = fs.readFileSync(EXPERIENCE_FILE, "utf8");
    const chunks = chunkText(stripMarkdown(content)).map((c) => `EXPERIENCE: ${c}`);
    const vectors = await encodeAll(extractor, chunks);
    writeDomain("experience", {
      embeddings: [meanVector(vectors)],
      texts: [content],
      embedTexts: chunks,
      metadata: [{ type: "experience", name: "experience", path: "resume.txt" }],
    });
  } else {
    log("  no resume.txt found, skipping");
  }

  // site (llms.txt chunks — always retrieved alongside the classified domain)
  log("Site summary (llms.txt)...");
  if (fs.existsSync(SITE_FILE)) {
    const content = fs.readFileSync(SITE_FILE, "utf8");
    const chunks = chunkText(content, 1400, 200);
    const vectors = await encodeAll(extractor, chunks);
    writeDomain("site", {
      embeddings: vectors,
      texts: chunks,
      embedTexts: chunks,
      metadata: chunks.map((_, i) => ({
        type: "site",
        name: "llms.txt",
        part: i + 1,
        path: "llms.txt",
      })),
    });
  } else {
    log("  no llms.txt found, skipping");
  }

  // list100 (single aggregated doc)
  log("List 100...");
  const list100 = JSON.parse(fs.readFileSync(LIST100_FILE, "utf8")).list100 ?? [];
  const listLines = list100
    .map((i) => `${i.text} [status: ${i.status || "unknown"}]`)
    .join("; ");
  const listDisplay = ["# List 100", ...list100.map((i) => `- ${i.text} (status: ${i.status || "unknown"})`)].join("\n");
  writeDomain("list100", {
    embeddings: await encodeAll(extractor, [`LIST100 SUMMARY: ${listLines}`]),
    texts: [listDisplay],
    embedTexts: [`LIST100 SUMMARY: ${listLines}`],
    metadata: [{ type: "list100_summary", count: list100.length, path: "list100.json" }],
  });

  // books (single aggregated doc)
  log("Books...");
  const books = JSON.parse(fs.readFileSync(BOOKS_FILE, "utf8")).books ?? [];
  const bookLines = books
    .map(
      (b) =>
        `${b.title} by ${b.author} [status: ${b.status || "unknown"}, rating: ${b.rating || "n/a"}]`
    )
    .join("; ");
  const bookDisplay = ["# Books Summary", ...books.map((b) => `- ${b.title} — ${b.author} (status: ${b.status || "unknown"})`)].join("\n");
  writeDomain("books", {
    embeddings: await encodeAll(extractor, [`BOOKS SUMMARY: ${bookLines}`]),
    texts: [bookDisplay],
    embedTexts: [`BOOKS SUMMARY: ${bookLines}`],
    metadata: [{ type: "books_summary", count: books.length, path: "library/books.json" }],
  });

  log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
