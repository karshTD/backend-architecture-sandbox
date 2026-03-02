"""
Loan Stress Analyzer - ML Model
================================
Uses a RandomForestClassifier trained on synthetic data to classify loan stress.

Features used:
  - emi_ratio:       EMI / monthly_income  (primary driver)
  - tenure_norm:     tenure / 360          (longer = riskier)
  - interest_norm:   interest_rate / 30    (higher = riskier)

Labels:
  0 = Low stress
  1 = Medium stress
  2 = High stress
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# ── Synthetic data generation ──────────────────────────────────────────────────

def _generate_synthetic_data(n=2000, seed=42):
    rng = np.random.default_rng(seed)

    # Random feature ranges
    emi_ratio     = rng.uniform(0.05, 0.90, n)   # 5% – 90% of income
    tenure_norm   = rng.uniform(0.03, 1.00, n)   # 1 month – 30 years
    interest_norm = rng.uniform(0.03, 1.00, n)   # ~1% – 30%

    # Weighted stress score (deterministic rule, then add noise)
    raw = (0.60 * emi_ratio +
           0.25 * tenure_norm +
           0.15 * interest_norm +
           rng.normal(0, 0.04, n))  # small noise so tree isn't too clean
    raw = np.clip(raw, 0, 1)

    # Bin into 3 classes
    labels = np.where(raw < 0.35, 0,
             np.where(raw < 0.60, 1, 2))

    X = np.column_stack([emi_ratio, tenure_norm, interest_norm])
    return X, labels


# ── Train once at import time ──────────────────────────────────────────────────

_X, _y = _generate_synthetic_data()

_scaler = StandardScaler()
_X_scaled = _scaler.fit_transform(_X)

_clf = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42
)
_clf.fit(_X_scaled, _y)

RISK_LABELS = {0: "Low", 1: "Medium", 2: "High"}


# ── Public inference function ──────────────────────────────────────────────────

def predict_stress(monthly_income: float, emi: float,
                   tenure_months: float, interest_rate: float) -> dict:
    """
    Returns a dict with:
      stress_score  – 0-100 (derived from class probabilities)
      risk_level    – "Low" | "Medium" | "High"
      emi_ratio     – EMI / monthly_income
    """
    emi_ratio     = emi / monthly_income
    tenure_norm   = tenure_months / 360          # normalise to 30-year max
    interest_norm = interest_rate / 30           # normalise to 30% max

    features = np.array([[emi_ratio, tenure_norm, interest_norm]])
    features_scaled = _scaler.transform(features)

    proba = _clf.predict_proba(features_scaled)[0]  # [P_low, P_med, P_high]
    predicted_class = int(np.argmax(proba))

    # Stress score: weighted average of class indices → scale to 0-100
    # 0*P0 + 50*P1 + 100*P2  gives a smooth score
    stress_score = round(float(0 * proba[0] + 50 * proba[1] + 100 * proba[2]))

    return {
        "stress_score": stress_score,
        "risk_level":   RISK_LABELS[predicted_class],
        "emi_ratio":    round(emi_ratio, 4),
        "probabilities": {
            "low":    round(float(proba[0]), 3),
            "medium": round(float(proba[1]), 3),
            "high":   round(float(proba[2]), 3),
        }
    }
