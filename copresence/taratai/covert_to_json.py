#!/usr/bin/env python3
"""
Convert per-domain pickle embeddings to JSON files for Next.js compatibility.
Reads embeddings-{domain}.pkl from taratai/ and writes
public/embeddings-{domain}.json for each available domain.
"""

import pickle
import json
import numpy as np
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).parent.parent
DOMAINS = ["projects", "writings", "experience", "list100", "books"]
INPUT_PKLS = {d: REPO_ROOT / "taratai" / f"embeddings-{d}.pkl" for d in DOMAINS}
OUTPUT_JSONS = {d: REPO_ROOT / "public" / f"embeddings-{d}.json" for d in DOMAINS}


def convert_embeddings():
    """Convert available per-domain pickle embeddings to JSON files."""
    written = 0
    for domain in DOMAINS:
        pkl_path = INPUT_PKLS[domain]
        out_path = OUTPUT_JSONS[domain]
        if not pkl_path.exists():
            logger.warning(f"Skipping domain '{domain}': {pkl_path} not found")
            continue
        try:
            logger.info(f"Loading embeddings from {pkl_path}")
            with open(pkl_path, 'rb') as f:
                data = pickle.load(f)

            # Convert embeddings to plain lists, handling both ndarray and list-of-ndarrays
            emb = data.get('embeddings')
            if isinstance(emb, np.ndarray):
                embeddings_list = emb.tolist()
            elif isinstance(emb, list):
                if len(emb) > 0 and hasattr(emb[0], 'tolist'):
                    embeddings_list = [e.tolist() for e in emb]
                else:
                    embeddings_list = emb
            else:
                raise TypeError(
                    f"Unsupported embeddings type: {type(emb)}"
                )

            output_data = {
                'model': data['model'],
                'embeddings': embeddings_list,
                'texts': data.get('texts', []),
                'embed_texts': data.get('embed_texts', []),
                'metadata': data.get('metadata', []),
                'count': data.get('count', len(embeddings_list)),
                'domain': domain,
            }

            logger.info(f"Writing JSON to {out_path}")
            out_path.parent.mkdir(parents=True, exist_ok=True)
            with open(out_path, 'w') as f:
                json.dump(output_data, f)

            file_size_mb = out_path.stat().st_size / 1024 / 1024
            logger.info(f"✅ {domain}: {file_size_mb:.2f} MB, {len(embeddings_list)} vectors")
            written += 1
        except Exception as e:
            logger.error(f"Error converting domain '{domain}': {e}", exc_info=True)
            raise
    if written == 0:
        logger.warning("No domains converted. Did you run create_embeddings.py?")


if __name__ == "__main__":
    convert_embeddings()
