import { useState, useRef } from "react";

/* ─── palette & tokens ────────────────────────────────────────────────── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:      #0f0e0c;
    --paper:    #f5f1eb;
    --cream:    #ede8e0;
    --line:     #d4cec4;
    --low:      #2d6a4f;
    --low-bg:   #d8f3dc;
    --med:      #b5651d;
    --med-bg:   #fde8d0;
    --high:     #9b1c1c;
    --high-bg:  #fee2e2;
    --accent:   #c1440e;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
  }

  /* ── layout ─────────────────────────────────── */
  .shell {
    max-width: 780px;
    margin: 0 auto;
    padding: 48px 24px 96px;
  }

  /* ── header ─────────────────────────────────── */
  .header {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 8px;
    border-bottom: 2px solid var(--ink);
    padding-bottom: 16px;
  }
  .header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 5vw, 42px);
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .header .tagline {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--accent);
    padding: 3px 8px;
    border-radius: 2px;
    white-space: nowrap;
  }
  .sub {
    font-size: 14px;
    color: #666;
    margin-bottom: 40px;
    margin-top: 10px;
  }

  /* ── card ────────────────────────────────────── */
  .card {
    background: #fff;
    border: 1.5px solid var(--line);
    border-radius: 4px;
    padding: 32px;
    margin-bottom: 24px;
  }
  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-title span.num {
    display: inline-flex;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--ink);
    color: #fff;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ── upload zone ─────────────────────────────── */
  .upload-zone {
    border: 2px dashed var(--line);
    border-radius: 4px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: #fff8f5; }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .upload-zone .icon { font-size: 28px; margin-bottom: 8px; }
  .upload-zone p { font-size: 14px; color: #555; }
  .upload-zone p strong { color: var(--accent); }
  .file-name {
    margin-top: 12px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    background: var(--cream);
    padding: 6px 12px;
    border-radius: 2px;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── field grid ──────────────────────────────── */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media(max-width: 480px) { .grid { grid-template-columns: 1fr; } }

  .field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 6px;
  }
  .field .input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--line);
    border-radius: 3px;
    background: var(--paper);
    overflow: hidden;
    transition: border-color 0.15s;
  }
  .field .input-wrap:focus-within { border-color: var(--ink); }
  .field .prefix {
    padding: 0 10px;
    font-size: 13px;
    color: #999;
    background: var(--cream);
    height: 40px;
    display: flex;
    align-items: center;
    border-right: 1.5px solid var(--line);
    font-family: 'DM Mono', monospace;
  }
  .field input {
    border: none;
    outline: none;
    background: transparent;
    padding: 0 12px;
    height: 40px;
    width: 100%;
    font-size: 15px;
    font-family: 'DM Mono', monospace;
    color: var(--ink);
  }

  /* ── submit ──────────────────────────────────── */
  .btn {
    width: 100%;
    height: 52px;
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .btn:hover:not(:disabled) { background: #222; }
  .btn:active:not(:disabled) { transform: scale(0.99); }
  .btn:disabled { background: #aaa; cursor: not-allowed; }

  /* ── spinner ─────────────────────────────────── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* ── error ────────────────────────────────────── */
  .error-box {
    background: var(--high-bg);
    border: 1.5px solid #f9a8a8;
    border-radius: 3px;
    padding: 14px 16px;
    font-size: 14px;
    color: var(--high);
    margin-bottom: 24px;
  }

  /* ── results ─────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .results { animation: fadeUp 0.4s ease; }

  .result-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  .score-ring-wrap { position: relative; flex-shrink: 0; }
  .score-ring-wrap svg { display: block; }
  .score-label {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .score-label .num {
    font-family: 'DM Serif Display', serif;
    font-size: 34px;
    line-height: 1;
  }
  .score-label .of { font-size: 11px; color: #888; letter-spacing: 0.06em; }

  .risk-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 2px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .risk-Low    { color: var(--low);  background: var(--low-bg); }
  .risk-Medium { color: var(--med);  background: var(--med-bg); }
  .risk-High   { color: var(--high); background: var(--high-bg); }
  .risk-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .dot-Low    { background: var(--low); }
  .dot-Medium { background: var(--med); }
  .dot-High   { background: var(--high); }

  .result-meta h2 {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    margin-bottom: 8px;
  }
  .summary-text {
    font-size: 14px;
    line-height: 1.7;
    color: #444;
    margin-top: 12px;
  }

  /* ── stat row ────────────────────────────────── */
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--line);
  }
  .stat {
    background: var(--paper);
    border-radius: 3px;
    padding: 14px;
    text-align: center;
  }
  .stat .val {
    font-family: 'DM Mono', monospace;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .stat .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; }

  /* ── probability bars ────────────────────────── */
  .prob-bars { margin-top: 20px; }
  .prob-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .prob-bar-label { font-size: 12px; width: 56px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
  .prob-bar-track { flex: 1; height: 8px; background: var(--cream); border-radius: 99px; overflow: hidden; }
  .prob-bar-fill  { height: 100%; border-radius: 99px; transition: width 0.6s cubic-bezier(.25,.8,.25,1); }
  .fill-Low    { background: var(--low); }
  .fill-Medium { background: var(--med); }
  .fill-High   { background: var(--high); }
  .prob-pct { font-family: 'DM Mono', monospace; font-size: 12px; width: 38px; text-align: right; color: #666; }

  /* ── pdf preview ─────────────────────────────── */
  .pdf-preview {
    margin-top: 16px;
    padding: 14px;
    background: var(--cream);
    border-radius: 3px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    line-height: 1.6;
    color: #555;
    white-space: pre-wrap;
    max-height: 120px;
    overflow-y: auto;
  }
  .section-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    margin-bottom: 8px;
  }

  /* ── reset btn ────────────────────────────────── */
  .reset-btn {
    background: none;
    border: 1.5px solid var(--line);
    border-radius: 3px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    margin-top: 20px;
    transition: border-color 0.15s;
  }
  .reset-btn:hover { border-color: var(--ink); }
`;

/* ── Score ring SVG ───────────────────────────────────────────────────────── */
function ScoreRing({ score, riskLevel }) {
  const size = 110, stroke = 9, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const colors = { Low: "#2d6a4f", Medium: "#b5651d", High: "#9b1c1c" };
  const dash = (score / 100) * circ;

  return (
    <div className="score-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="#ede8e0" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={colors[riskLevel] || "#ccc"}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.25,.8,.25,1)" }}
        />
      </svg>
      <div className="score-label">
        <span className="num">{score}</span>
        <span className="of">/ 100</span>
      </div>
    </div>
  );
}

/* ── Probability bars ────────────────────────────────────────────────────── */
function ProbBars({ probs }) {
  const rows = [
    { key: "low",    label: "Low" },
    { key: "medium", label: "Med" },
    { key: "high",   label: "High" },
  ];
  return (
    <div className="prob-bars">
      <p className="section-label">Model confidence</p>
      {rows.map(({ key, label }) => (
        <div key={key} className="prob-bar-row">
          <span className="prob-bar-label">{label}</span>
          <div className="prob-bar-track">
            <div
              className={`prob-bar-fill fill-${label === "Med" ? "Medium" : label}`}
              style={{ width: `${Math.round(probs[key] * 100)}%` }}
            />
          </div>
          <span className="prob-pct">{Math.round(probs[key] * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────── */
function Field({ label, prefix, name, placeholder, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap">
        {prefix && <span className="prefix">{prefix}</span>}
        <input
          type="number"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min="0"
          step="any"
        />
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [pdf, setPdf]       = useState(null);
  const [drag, setDrag]     = useState(false);
  const [fields, setFields] = useState({ monthly_income: "", emi: "", tenure_months: "", interest_rate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  const handleField = e => setFields(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = file => {
    if (file && file.type === "application/pdf") setPdf(file);
    else alert("Please select a PDF file.");
  };

  const handleDrop = e => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const canSubmit = fields.monthly_income && fields.emi && fields.tenure_months && fields.interest_rate;

  const submit = async () => {
    setLoading(true); setError(null); setResult(null);

    const form = new FormData();
    if (pdf) form.append("pdf", pdf);
    Object.entries(fields).forEach(([k, v]) => form.append(k, v));

    try {
      const res = await fetch("/analyze", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(null); setPdf(null); setFields({ monthly_income: "", emi: "", tenure_months: "", interest_rate: "" }); };

  return (
    <>
      <style>{css}</style>
      <div className="shell">

        {/* Header */}
        <div className="header">
          <h1>Loan Stress Analyzer</h1>
          <span className="tagline">AI-Powered</span>
        </div>
        <p className="sub">Upload your loan document and enter your financial details to get an instant stress assessment.</p>

        {!result ? (
          <>
            {/* Step 1 – PDF */}
            <div className="card">
              <p className="card-title"><span className="num">1</span> Loan Document <span style={{fontSize:12,color:'#aaa',fontFamily:'DM Sans',fontWeight:400}}>(optional)</span></p>
              <div
                className={`upload-zone${drag ? " drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}
              >
                <input ref={fileRef} type="file" accept=".pdf"
                  onChange={e => handleFile(e.target.files[0])} />
                <div className="icon">📄</div>
                <p><strong>Click to upload</strong> or drag & drop a PDF</p>
                <p style={{fontSize:12,marginTop:4,color:'#aaa'}}>Loan agreement, sanction letter, statement</p>
              </div>
              {pdf && <div className="file-name">✓ {pdf.name}</div>}
            </div>

            {/* Step 2 – Financials */}
            <div className="card">
              <p className="card-title"><span className="num">2</span> Financial Details</p>
              <div className="grid">
                <Field label="Monthly Income" prefix="₹" name="monthly_income" placeholder="50000" value={fields.monthly_income} onChange={handleField} />
                <Field label="Monthly EMI" prefix="₹" name="emi" placeholder="15000" value={fields.emi} onChange={handleField} />
                <Field label="Loan Tenure" prefix="mo" name="tenure_months" placeholder="84" value={fields.tenure_months} onChange={handleField} />
                <Field label="Interest Rate" prefix="%" name="interest_rate" placeholder="12.5" value={fields.interest_rate} onChange={handleField} />
              </div>
            </div>

            {error && <div className="error-box">⚠ {error}</div>}

            <button className="btn" onClick={submit} disabled={loading || !canSubmit}>
              {loading ? <><div className="spinner" /> Analyzing…</> : "→ Analyze Stress"}
            </button>
          </>
        ) : (
          /* Results */
          <div className="results">
            <div className="card">
              <div className="result-header">
                <ScoreRing score={result.stress_score} riskLevel={result.risk_level} />
                <div className="result-meta">
                  <span className={`risk-badge risk-${result.risk_level}`}>
                    <span className={`risk-dot dot-${result.risk_level}`} />
                    {result.risk_level} Risk
                  </span>
                  <h2>Stress Score: {result.stress_score}</h2>
                </div>
              </div>

              <p className="summary-text">{result.summary}</p>

              <div className="stats">
                <div className="stat">
                  <div className="val">{(result.emi_ratio * 100).toFixed(1)}%</div>
                  <div className="lbl">EMI / Income</div>
                </div>
                <div className="stat">
                  <div className="val">{fields.tenure_months} mo</div>
                  <div className="lbl">Tenure</div>
                </div>
                <div className="stat">
                  <div className="val">{fields.interest_rate}%</div>
                  <div className="lbl">Interest Rate</div>
                </div>
              </div>

              {result.probabilities && <ProbBars probs={result.probabilities} />}

              {result.pdf_text_preview && (
                <div style={{ marginTop: 20 }}>
                  <p className="section-label">PDF extract (preview)</p>
                  <div className="pdf-preview">{result.pdf_text_preview}</div>
                </div>
              )}
            </div>

            {/* Raw JSON */}
            <div className="card">
              <p className="section-label" style={{marginBottom:12}}>Raw JSON response</p>
              <div className="pdf-preview" style={{maxHeight:160}}>
                {JSON.stringify({
                  stress_score: result.stress_score,
                  risk_level: result.risk_level,
                  emi_ratio: result.emi_ratio,
                  summary: result.summary,
                  probabilities: result.probabilities,
                }, null, 2)}
              </div>
            </div>

            <button className="reset-btn" onClick={reset}>← Analyze another loan</button>
          </div>
        )}
      </div>
    </>
  );
}
