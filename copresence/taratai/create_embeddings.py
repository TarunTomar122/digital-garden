#!/usr/bin/env python3
"""
TaratAI Embedding Generator

Reads content from four domains (projects, writings, list100, books),
applies domain-aware preprocessing and chunking, and generates per-domain
embeddings using a local model. Outputs four pickle files suitable for
conversion to JSON for the Next.js app.
"""

import json
import pickle
from pathlib import Path
from typing import Dict, List, Any, Tuple
import numpy as np
import logging

from sentence_transformers import SentenceTransformer

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
REPO_ROOT = Path(__file__).parent.parent
PROJECTS_DIR = REPO_ROOT / "projects"
WRITINGS_DIR = REPO_ROOT / "writings"
EXPERIENCE_FILE = REPO_ROOT / "src" / "app" / "(with-nav)" / "experience" / "experience.md"
LIST100_FILE = REPO_ROOT / "src" / "app" / "list100.json"
BOOKS_FILE = (
    REPO_ROOT / "src" / "app" / "(with-nav)" / "library" / "books.json"
)
OUTPUT_DIR = Path(__file__).parent
OUTPUT_FILES = {
    "projects": OUTPUT_DIR / "embeddings-projects.pkl",
    "writings": OUTPUT_DIR / "embeddings-writings.pkl",
    "experience": OUTPUT_DIR / "embeddings-experience.pkl",
    "list100": OUTPUT_DIR / "embeddings-list100.pkl",
    "books": OUTPUT_DIR / "embeddings-books.pkl",
}

MODEL_NAME = "all-mpnet-base-v2"


def load_markdown_files(directory: Path) -> Dict[str, str]:
    """Load all markdown files from a directory."""
    content = {}
    md_files = list(directory.glob("*.md"))
    logger.info(f"Found {len(md_files)} markdown files in {directory}")

    for md_file in md_files:
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content[str(md_file.stem)] = f.read()
            logger.debug(f"Loaded {md_file.name}")
        except Exception as e:
            logger.error(f"Error loading {md_file}: {e}")

    return content

def load_single_file(file_path: Path) -> str:
    """Load a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        logger.warning(f"File not found: {file_path}")
        return ""
    except Exception as e:
        logger.error(f"Error loading {file_path}: {e}")
        return ""

def chunk_text(
    text: str,
    chunk_size: int = 1200,
    overlap: int = 200,
) -> List[str]:
    """Split long text into overlapping chunks (approx by characters)."""
    if chunk_size <= overlap:
        raise ValueError("chunk_size must be greater than overlap")
    chunks: List[str] = []
    step = chunk_size - overlap
    for i in range(0, len(text), step):
        chunks.append(text[i:i + chunk_size])
    return chunks

def strip_markdown_simple(text: str) -> str:
    """Lightweight removal of common markdown artifacts to reduce noise."""
    # Remove code fences/backticks
    t = text.replace("```", " ").replace("`", " ")
    # Remove headings markers
    for h in ("###### ", "##### ", "#### ", "### ", "## ", "# "):
        t = t.replace(h, "")
    # Replace links [text](url) -> text
    import re
    t = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\\1", t)
    # Collapse multiple spaces/newlines
    t = re.sub(r"\s+", " ", t).strip()
    return t

def load_list100() -> List[Dict[str, Any]]:
    """Load list100 items."""
    try:
        with open(LIST100_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        items = data.get("list100", [])
        logger.info(f"Loaded {len(items)} items from list100")
        return items
    except Exception as e:
        logger.error(f"Error loading list100: {e}")
        return []


def load_books() -> List[Dict[str, Any]]:
    """Load books from library."""
    try:
        with open(BOOKS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        books = data.get("books", [])
        logger.info(f"Loaded {len(books)} books from library")
        return books
    except Exception as e:
        logger.error(f"Error loading books: {e}")
        return []



def prepare_projects() -> Tuple[List[str], List[List[str]], List[Dict[str, Any]]]:
    logger.info("Loading projects markdown...")
    texts_display: List[str] = []
    chunks_per_doc: List[List[str]] = []
    metadata: List[Dict[str, Any]] = []
    projects = load_markdown_files(PROJECTS_DIR)
    for filename, content in projects.items():
        raw = strip_markdown_simple(content)
        chunks = chunk_text(raw)
        texts_display.append(raw)
        chunks_per_doc.append(
            [
                f"PROJECT: {filename}. Content: {c}"
                for c in chunks
            ]
        )
        metadata.append({
            "type": "project",
            "name": filename,
            "path": f"projects/{filename}.md",
        })
    logger.info(
        f"Prepared {len(texts_display)} project documents"
    )
    return texts_display, chunks_per_doc, metadata



def prepare_writings() -> Tuple[List[str], List[List[str]], List[Dict[str, Any]]]:
    logger.info("Loading writings markdown...")
    texts_display: List[str] = []
    chunks_per_doc: List[List[str]] = []
    metadata: List[Dict[str, Any]] = []
    writings = load_markdown_files(WRITINGS_DIR)
    for filename, content in writings.items():
        raw = strip_markdown_simple(content)
        chunks = chunk_text(raw)
        texts_display.append(raw)
        chunks_per_doc.append(
            [
                f"WRITING: {filename}. Paragraph: {c}"
                for c in chunks
            ]
        )
        metadata.append({
            "type": "writing",
            "name": filename,
            "path": f"writings/{filename}.md",
        })
    logger.info(
        f"Prepared {len(texts_display)} writing documents"
    )
    return texts_display, chunks_per_doc, metadata



def prepare_experience() -> Tuple[List[str], List[List[str]], List[Dict[str, Any]]]:
    logger.info("Loading experience markdown...")
    texts_display: List[str] = []
    chunks_per_doc: List[List[str]] = []
    metadata: List[Dict[str, Any]] = []
    experience_content = load_single_file(EXPERIENCE_FILE)
    if experience_content:
        raw = strip_markdown_simple(experience_content)
        chunks = chunk_text(raw)
        texts_display.append(raw)
        chunks_per_doc.append(
            [
                f"EXPERIENCE: {c}"
                for c in chunks
            ]
        )
        metadata.append({
            "type": "experience",
            "name": "experience",
            "path": "experience/experience.md",
        })
    logger.info(
        f"Prepared {len(texts_display)} experience document"
    )
    return texts_display, chunks_per_doc, metadata



def prepare_list100() -> Tuple[List[str], List[str], List[Dict[str, Any]]]:
    logger.info("Loading list100 items...")
    items = load_list100()
    # Aggregate all items into a single document
    lines_display: List[str] = []
    lines_embed: List[str] = []
    for item in items:
        text = (item.get("text", "") or "").strip()
        status = (item.get("status", "") or "").strip()
        if not text:
            continue
        lines_display.append(f"- {text} (status: {status or 'unknown'})")
        lines_embed.append(f"{text} [status: {status or 'unknown'}]")
    doc_display = "\n".join(["# List 100", *lines_display])
    doc_embed = "LIST100 SUMMARY: " + "; ".join(lines_embed)
    metadata = [{
        "type": "list100_summary",
        "count": len(lines_display),
        "path": "list100.json",
    }]
    logger.info(
        f"Prepared 1 list100 document containing {len(lines_display)} items"
    )
    return [doc_display], [doc_embed], metadata



def prepare_books() -> Tuple[List[str], List[str], List[Dict[str, Any]]]:
    logger.info("Loading books...")
    books = load_books()
    # Aggregate all books into a single document
    lines_display: List[str] = []
    lines_embed: List[str] = []
    for book in books:
        title = (book.get('title', '') or '').strip()
        author = (book.get('author', '') or '').strip()
        status = (book.get('status', '') or '').strip()
        rating = (book.get('rating', '') or '').strip()
        line = f"- {title} — {author} (status: {status or 'unknown'}, rating: {rating or 'n/a'})"
        lines_display.append(line)
        lines_embed.append(f"{title} by {author} [status: {status or 'unknown'}, rating: {rating or 'n/a'}]")
    doc_display = "\n".join(["# Books Summary", *lines_display])
    doc_embed = "BOOKS SUMMARY: " + "; ".join(lines_embed)
    metadata = [{
        "type": "books_summary",
        "count": len(lines_display),
        "path": "library/books.json",
    }]
    logger.info(
        f"Prepared 1 books document containing {len(lines_display)} entries"
    )
    return [doc_display], [doc_embed], metadata



def create_embeddings(
    embed_texts: List[str],
    display_texts: List[str],
    metadata: List[Dict]
) -> Dict[str, Any]:
    """
    Create embeddings for all texts using sentence-transformers.
    """
    logger.info(f"Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    logger.info(
        f"Creating embeddings for {len(embed_texts)} texts..."
    )
    embeddings = model.encode(embed_texts, show_progress_bar=True)

    result = {
        "model": MODEL_NAME,
        "embeddings": embeddings,
        "texts": display_texts,
        "embed_texts": embed_texts,
        "metadata": metadata,
        "count": len(embed_texts),
    }

    logger.info(
        f"Successfully created {len(embeddings)} embeddings"
    )
    return result



def create_embeddings_from_chunks(
    chunks_per_doc: List[List[str]],
    display_texts: List[str],
    metadata: List[Dict]
) -> Dict[str, Any]:
    """
    Create one embedding per document by mean-pooling over chunk embeddings.
    """
    logger.info(f"Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    logger.info(
        f"Encoding {sum(len(c) for c in chunks_per_doc)} chunks across "
        f"{len(chunks_per_doc)} docs..."
    )
    flat: List[str] = [t for doc in chunks_per_doc for t in doc]
    chunk_vectors = model.encode(flat, show_progress_bar=True)
    dim = len(chunk_vectors[0]) if len(chunk_vectors) else 0

    pooled: List[np.ndarray] = []
    idx = 0
    for doc_chunks in chunks_per_doc:
        n = len(doc_chunks)
        if n == 0:
            pooled.append(np.zeros((dim,), dtype=np.float32))
            continue
        doc_vecs = chunk_vectors[idx: idx + n]
        idx += n
        doc_matrix = np.stack(doc_vecs, axis=0)
        pooled_vec = doc_matrix.mean(axis=0)
        pooled.append(pooled_vec.astype(np.float32))

    result = {
        "model": MODEL_NAME,
        "embeddings": pooled,
        "texts": display_texts,
        "metadata": metadata,
        "count": len(display_texts),
    }
    logger.info(
        f"Successfully created {len(pooled)} document embeddings"
    )
    return result



def save_embeddings(data: Dict[str, Any], output_file: Path) -> None:
    """Save embeddings to a pickle file."""
    try:
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'wb') as f:
            pickle.dump(data, f)
        logger.info(f"Embeddings saved to {output_file}")
        logger.info(
            f"File size: {output_file.stat().st_size / 1024 / 1024:.2f} MB"
        )
    except Exception as e:
        logger.error(f"Error saving embeddings: {e}")
        raise



def main():
    """Main entry point."""
    try:
        logger.info("Starting TaratAI Embedding Generation")
        logger.info(f"Repository root: {REPO_ROOT}")

        proj_texts, proj_chunks, proj_meta = prepare_projects()
        writ_texts, writ_chunks, writ_meta = prepare_writings()
        exp_texts, exp_chunks, exp_meta = prepare_experience()
        list_texts, list_embed, list_meta = prepare_list100()
        book_texts, book_embed, book_meta = prepare_books()

        domains = [
            ("projects", proj_chunks, proj_texts, proj_meta),
            ("writings", writ_chunks, writ_texts, writ_meta),
            ("experience", exp_chunks, exp_texts, exp_meta),
            ("list100", list_embed, list_texts, list_meta),
            ("books", book_embed, book_texts, book_meta),
        ]

        total = 0
        for name, embed_source, display_texts, meta in domains:
            if not embed_source:
                logger.warning(f"No texts found for domain: {name}")
                continue
            logger.info(f"\n=== Domain: {name} ===")
            if name in ("projects", "writings", "experience"):
                data = create_embeddings_from_chunks(
                    embed_source,
                    display_texts,
                    meta,
                )
            else:
                data = create_embeddings(
                    embed_source,
                    display_texts,
                    meta,
                )
            save_embeddings(data, OUTPUT_FILES[name])
            total += data["count"]

        logger.info("✅ Embedding generation complete for all domains!")
        logger.info(f"Total items across domains: {total}")
        logger.info(f"Model: {MODEL_NAME}")
        logger.info(
            f"Outputs: {', '.join(str(p) for p in OUTPUT_FILES.values())}"
        )

    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    main()
