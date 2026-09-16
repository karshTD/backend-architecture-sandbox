
---

## What's covered

**Phase 1 — Pre-December sprint (Weeks 1–7)**

| Week | Topic | Build | Trade-off doc |
|------|-------|-------|---------------|
| 1 | Linear Regression | Closed-form + GD | Closed-form vs GD |
| 2 | Logistic Regression | Sigmoid + log-loss + MLE | Log-loss vs MSE |
| 3 | Regularization | Ridge + Lasso (coordinate descent) | Ridge vs Lasso |
| 4 | Cross-Validation | k-fold + bias-variance sweep | k-fold vs holdout vs LOOCV |
| 5 | kNN Classifier | Naive kNN + boundary plots | kNN vs logistic regression |
| 6 | Naive Bayes | Multinomial + Gaussian on text | NB vs logistic regression |
| 7 | Random Forest | Decision tree + Gini + bootstrap | RF vs tree vs boosting |

**Phase 2 — Embeddings + Vector Search (post-December)**

- Word2Vec (skip-gram) from scratch
- Contrastive learning + Sentence-BERT
- FAISS internals: IVF, HNSW
- Chunking strategies
- Retrieval metrics: recall@k, MRR, NDCG
- Cross-encoder reranking

**Phase 3 — Transformers + RAG**

- Scaled dot-product attention from scratch
- Single transformer block
- Full RAG loop, no frameworks
- RAG evals + hallucination grounding
- Capstone: rebuild Contract Analyzer's RAG layer

---

## Repo rules

- Every algorithm implemented in NumPy first. sklearn only for validation.
- Every week: 1 from-scratch build + 1 trade-off doc.
- Missing a week is fine. Doubling up is not.
- No orphan notes — every note links to at least one other.

---

## Setup

```bash
git clone <repo> ml-from-scratch
cd ml-from-scratch
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
