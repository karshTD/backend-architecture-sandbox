"""
Loan Stress Analyzer - Flask Backend
=====================================
Single endpoint:  POST /analyze
Accepts: multipart/form-data  (pdf + numeric fields)
Returns: JSON with stress score, risk level, emi ratio, summary
"""

import io
import os
import textwrap

import pdfplumber
from flask import Flask, jsonify, request
from flask_cors import CORS

from model import predict_stress

app = Flask(__name__)
CORS(app)  # allow React dev-server (localhost:3000) to call us


# ── Helper: build a human-readable summary ────────────────────────────────────

def _build_summary(emi_ratio: float, stress_score: int, risk_level: str,
                   interest_rate: float, tenure_months: float) -> str:
    emi_pct = round(emi_ratio * 100, 1)

    if risk_level == "Low":
        opening = (f"Your EMI is {emi_pct}% of your monthly income, "
                   "which is within a healthy range.")
        advice  = ("You have comfortable repayment capacity. "
                   "Consider maintaining an emergency fund of 3-6 months of expenses.")
    elif risk_level == "Medium":
        opening = (f"Your EMI consumes {emi_pct}% of your monthly income, "
                   "which is moderate but warrants attention.")
        advice  = ("Try to reduce discretionary spending or consider prepaying "
                   "the principal when possible to lower long-term interest costs.")
    else:
        opening = (f"Your EMI consumes {emi_pct}% of your monthly income, "
                   "indicating significant financial stress.")
        advice  = ("This level of debt obligation leaves little buffer for "
                   "emergencies. Consider refinancing at a lower rate or "
                   "extending the tenure to reduce monthly outflow.")

    rate_note = ""
    if interest_rate > 14:
        rate_note = (f" The interest rate of {interest_rate}% is above average; "
                     "exploring a lower-rate product could save substantially.")

    tenure_note = ""
    if tenure_months > 120:
        tenure_note = (f" With {int(tenure_months)} months remaining, "
                       "you are carrying long-term debt exposure.")

    return f"{opening} {advice}{rate_note}{tenure_note}"


# ── Main endpoint ─────────────────────────────────────────────────────────────

@app.route("/analyze", methods=["POST"])
def analyze():
    # ── 1. Parse numeric inputs ──────────────────────────────────────────────
    try:
        monthly_income = float(request.form["monthly_income"])
        emi            = float(request.form["emi"])
        tenure_months  = float(request.form["tenure_months"])
        interest_rate  = float(request.form["interest_rate"])
    except (KeyError, ValueError) as exc:
        return jsonify({"error": f"Invalid or missing field: {exc}"}), 400

    if monthly_income <= 0 or emi <= 0:
        return jsonify({"error": "Income and EMI must be positive numbers."}), 400

    # ── 2. Extract PDF text (optional – stored for future NLP use) ───────────
    pdf_text = ""
    if "pdf" in request.files:
        pdf_file = request.files["pdf"]
        if pdf_file.filename:
            try:
                pdf_bytes = pdf_file.read()
                with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                    pages = [page.extract_text() or "" for page in pdf.pages]
                    pdf_text = "\n".join(pages).strip()
            except Exception as exc:
                # Non-fatal: we still score with numeric features
                pdf_text = f"[PDF extraction failed: {exc}]"

    # ── 3. Run ML model ───────────────────────────────────────────────────────
    result = predict_stress(monthly_income, emi, tenure_months, interest_rate)

    # ── 4. Build human summary ────────────────────────────────────────────────
    summary = _build_summary(
        result["emi_ratio"],
        result["stress_score"],
        result["risk_level"],
        interest_rate,
        tenure_months,
    )

    # ── 5. Return JSON response ───────────────────────────────────────────────
    return jsonify({
        "stress_score": result["stress_score"],
        "risk_level":   result["risk_level"],
        "emi_ratio":    result["emi_ratio"],
        "summary":      summary,
        "probabilities": result["probabilities"],
        "pdf_text_preview": pdf_text[:500] if pdf_text else None,
    })


# ── Health check ──────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)
