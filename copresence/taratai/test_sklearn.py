from sklearn.manifold import TSNE
import numpy as np
X = np.random.rand(10, 5)
tsne = TSNE(n_components=2, perplexity=2)
res = tsne.fit_transform(X)
print("TSNE success")

