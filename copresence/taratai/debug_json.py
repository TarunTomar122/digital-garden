import json
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
DOMAINS = ["projects", "writings"] 
INPUT_JSONS = {d: REPO_ROOT / "public" / f"embeddings-{d}.json" for d in DOMAINS}

for d, p in INPUT_JSONS.items():
    print(f"Loading {d} from JSON...")
    if p.exists():
        with open(p, 'r') as f:
            data = json.load(f)
            emb = data['embeddings']
            print(f"Loaded {len(emb)} items.")
    else:
        print(f"File not found: {p}")

