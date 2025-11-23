import pickle
from pathlib import Path
import numpy as np

REPO_ROOT = Path(__file__).parent.parent
DOMAINS = ["projects", "writings"] # Start small
INPUT_PKLS = {d: REPO_ROOT / "taratai" / f"embeddings-{d}.pkl" for d in DOMAINS}

for d, p in INPUT_PKLS.items():
    print(f"Loading {d}...")
    if p.exists():
        with open(p, 'rb') as f:
            data = pickle.load(f)
            emb = data['embeddings']
            print(f"Loaded {len(emb)} items.")
    else:
        print(f"File not found: {p}")

