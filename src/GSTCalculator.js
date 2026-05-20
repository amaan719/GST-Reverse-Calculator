import { useState, useEffect } from "react";

const GST_RATES = [3, 5, 12, 18, 28];

const fmt = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Mobile First Base ── */
  .gst-root {
    min-height: 100vh;
    min-height: 100dvh;
    background: #FFF3DC;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 16px 12px 32px;
    font-family: 'Baloo 2', cursive;
    position: relative;
    overflow-x: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  .gst-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at 15% 20%, rgba(255,107,0,0.09) 0%, transparent 50%),
      radial-gradient(circle at 85% 75%, rgba(0,168,107,0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .gst-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 100%;
  }

  /* ── Header ── */
  .gst-header {
    text-align: center;
    margin-bottom: 16px;
    animation: fadeDown 0.55s ease both;
  }

  .gst-badge {
    display: inline-block;
    background: #FF6B00;
    color: white;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 12px;
    border-radius: 20px;
    margin-bottom: 6px;
  }

  .gst-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1A1200;
    line-height: 1.1;
    margin: 0;
  }

  .gst-title span { color: #FF6B00; }

  .gst-subtitle {
    color: #7A5C1E;
    font-size: 0.82rem;
    margin-top: 4px;
  }

  /* ── Card ── */
  .gst-card {
    background: #FFF8ED;
    border: 2px solid #FFD480;
    border-radius: 20px;
    padding: 18px 16px;
    box-shadow: 0 6px 0 #FFCF60, 0 10px 28px rgba(255,107,0,0.12);
    animation: fadeUp 0.55s ease 0.1s both;
  }

  /* ── Label ── */
  .gst-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    color: #7A5C1E;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  /* ── Input ── */
  .gst-input-wrap {
    position: relative;
    margin-bottom: 16px;
  }

  .gst-prefix {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    font-weight: 800;
    color: #FF6B00;
    pointer-events: none;
  }

  .gst-input {
    width: 100%;
    padding: 12px 12px 12px 34px;
    border: 2px solid #FFD480;
    border-radius: 12px;
    font-family: 'Baloo 2', cursive;
    font-size: 1.25rem;
    font-weight: 700;
    background: white;
    color: #1A1200;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -moz-appearance: textfield;
    /* Prevents zoom on iOS */
    font-size: max(16px, 1.25rem);
  }
  .gst-input::-webkit-inner-spin-button,
  .gst-input::-webkit-outer-spin-button { -webkit-appearance: none; }
  .gst-input:focus {
    border-color: #FF6B00;
    box-shadow: 0 0 0 3px rgba(255,107,0,0.12);
  }

  /* ── Rate Buttons ── */
  .gst-rates-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    margin-bottom: 12px;
  }

  .rate-btn {
    padding: 9px 2px;
    border: 2px solid #FFD480;
    border-radius: 10px;
    background: white;
    font-family: 'Baloo 2', cursive;
    font-size: 0.85rem;
    font-weight: 700;
    color: #7A5C1E;
    cursor: pointer;
    transition: all 0.18s ease;
    text-align: center;
    touch-action: manipulation;
    min-height: 44px;
  }

  .rate-btn:active:not(.rate-active) {
    border-color: #FF6B00;
    color: #FF6B00;
    transform: scale(0.96);
  }

  .rate-btn.rate-active {
    background: #FF6B00;
    border-color: #FF6B00;
    color: white;
    box-shadow: 0 4px 0 #E05500;
    transform: translateY(-2px);
  }

  /* ── Custom Toggle ── */
  .custom-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    cursor: pointer;
    color: #7A5C1E;
    font-size: 0.82rem;
    font-weight: 600;
    width: fit-content;
    min-height: 36px;
  }

  .custom-toggle input[type="checkbox"] {
    accent-color: #FF6B00;
    width: 17px;
    height: 17px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .custom-input-wrap {
    margin-bottom: 14px;
    animation: fadeUp 0.25s ease both;
  }

  /* ── Result Box ── */
  .result-box {
    background: white;
    border: 2px solid #FFD480;
    border-radius: 16px;
    padding: 14px 16px;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.35s ease;
    pointer-events: none;
    margin-top: 4px;
  }

  .result-box.result-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .res-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    gap: 8px;
  }

  .res-row + .res-row { border-top: 1px dashed #FFD480; }

  .res-lbl {
    font-size: 0.78rem;
    font-weight: 600;
    color: #7A5C1E;
    flex-shrink: 0;
  }

  .res-val {
    font-size: 1rem;
    font-weight: 700;
    color: #1A1200;
    text-align: right;
  }

  .res-val.val-green {
    font-size: 1.35rem;
    font-weight: 800;
    color: #00A86B;
  }

  .res-val.val-orange {
    font-size: 1rem;
    color: #FF6B00;
  }

  .divider {
    height: 2px;
    background: linear-gradient(90deg, #FF6B00, #FFB800, #00A86B);
    border-radius: 2px;
    margin: 8px 0;
  }

  /* ── Formula ── */
  .formula-box {
    margin-top: 12px;
    background: rgba(255,107,0,0.06);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 0.74rem;
    color: #7A5C1E;
    text-align: center;
    word-break: break-all;
  }

  .formula-box code {
    font-family: monospace;
    font-size: 0.78rem;
    font-weight: 700;
    color: #FF6B00;
    word-break: break-all;
  }

  /* ── Reset ── */
  .reset-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #FF6B00;
    font-family: 'Baloo 2', cursive;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0;
    margin-left: 6px;
    text-decoration: underline;
  }

  /* ── Footer ── */
  .gst-footer {
    text-align: center;
    margin-top: 14px;
    font-size: 0.72rem;
    color: #7A5C1E;
  }

  /* ── Tablet (≥480px) ── */
  @media (min-width: 480px) {
    .gst-root { padding: 24px 20px 40px; align-items: center; }
    .gst-wrapper { max-width: 440px; }
    .gst-title { font-size: 2rem; }
    .gst-subtitle { font-size: 0.9rem; }
    .gst-card { padding: 24px 22px; border-radius: 22px; }
    .gst-input { font-size: 1.35rem; padding: 13px 14px 13px 38px; }
    .rate-btn { font-size: 0.9rem; padding: 10px 4px; }
    .res-val.val-green { font-size: 1.45rem; }
    .formula-box { font-size: 0.8rem; }
    .formula-box code { font-size: 0.82rem; }
  }

  /* ── Desktop (≥768px) ── */
  @media (min-width: 768px) {
    .gst-root { padding: 32px 24px; }
    .gst-wrapper { max-width: 460px; }
    .gst-header { margin-bottom: 24px; }
    .gst-title { font-size: 2.2rem; }
    .gst-badge { font-size: 11px; padding: 4px 14px; }
    .gst-subtitle { font-size: 0.95rem; }
    .gst-card { padding: 30px 26px; box-shadow: 0 8px 0 #FFCF60, 0 14px 36px rgba(255,107,0,0.12); }
    .gst-label { font-size: 0.8rem; margin-bottom: 8px; }
    .gst-input { font-size: 1.4rem; padding: 13px 16px 13px 40px; }
    .rate-btn { font-size: 0.95rem; border-radius: 12px; }
    .rate-btn:hover:not(.rate-active) { border-color: #FF6B00; color: #FF6B00; }
    .result-box { padding: 18px 20px; }
    .res-lbl { font-size: 0.86rem; }
    .res-val { font-size: 1.05rem; }
    .res-val.val-green { font-size: 1.5rem; }
    .res-val.val-orange { font-size: 1.1rem; }
    .formula-box { font-size: 0.8rem; padding: 9px 14px; }
    .formula-box code { font-size: 0.85rem; }
    .gst-footer { font-size: 0.78rem; margin-top: 18px; }
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [selectedRate, setSelectedRate] = useState(18);
  const [useCustom, setUseCustom] = useState(false);
  const [customRate, setCustomRate] = useState("");
  const [mode, setMode] = useState("reverse");
  const [result, setResult] = useState(null);

  const activeRate = useCustom ? parseFloat(customRate) || 0 : selectedRate;
  const isReverseMode = mode === "reverse";

  // Live calculation
  useEffect(() => {
    const a = parseFloat(amount);
    if (!isNaN(a) && a > 0 && activeRate > 0) {
      if (isReverseMode) {
        const withoutGST = a / (1 + activeRate / 100);
        const gstAmt = a - withoutGST;
        setResult({ withGST: a, gstAmt, withoutGST, rate: activeRate });
      } else {
        const withoutGST = a;
        const gstAmt = a * (activeRate / 100);
        const withGST = a + gstAmt;
        setResult({ withGST, gstAmt, withoutGST, rate: activeRate });
      }
    } else {
      setResult(null);
    }
  }, [amount, activeRate, isReverseMode]);

  const handleReset = () => {
    setAmount("");
    setCustomRate("");
    setResult(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="gst-root">
        <div className="gst-wrapper">

          {/* Header */}
          <div className="gst-header">
            <div className="gst-badge">🇮🇳 India GST</div>
            <h1 className="gst-title">
              GST <span>Calculator</span>
              <br />Mode Selector
            </h1>
            <p className="gst-subtitle">GST Amount से Price निकालें या Price में GST जोड़ें</p>
          </div>

          {/* Card */}
          <div className="gst-card">

            {/* Mode Selector */}
            <label className="gst-label">Mode चुनें</label>
            <div className="gst-rates-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <button
                className={`rate-btn${isReverseMode ? " rate-active" : ""}`}
                onClick={() => setMode("reverse")}
              >
                Reverse
              </button>
              <button
                className={`rate-btn${!isReverseMode ? " rate-active" : ""}`}
                onClick={() => setMode("forward")}
              >
                Forward
              </button>
            </div>

            {/* Amount Input */}
            <label className="gst-label">
              {isReverseMode ? "GST के साथ Amount (₹)" : "Base Price बिना GST (₹)"}
            </label>
            <div className="gst-input-wrap">
              <span className="gst-prefix">₹</span>
              <input
                className="gst-input"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Rate Selector */}
            <label className="gst-label">GST Rate चुनें</label>
            <div className="gst-rates-grid">
              {GST_RATES.map((r) => (
                <button
                  key={r}
                  className={`rate-btn${!useCustom && selectedRate === r ? " rate-active" : ""}`}
                  onClick={() => { setSelectedRate(r); setUseCustom(false); }}
                >
                  {r}%
                </button>
              ))}
            </div>

            {/* Custom Rate Toggle */}
            <label className="custom-toggle">
              <input
                type="checkbox"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
              />
              Custom Rate use करें
            </label>

            {useCustom && (
              <div className="custom-input-wrap">
                <label className="gst-label">Custom GST Rate (%)</label>
                <div className="gst-input-wrap" style={{ marginBottom: 0 }}>
                  <span className="gst-prefix" style={{ color: "#00A86B" }}>%</span>
                  <input
                    className="gst-input"
                    type="number"
                    placeholder="e.g. 9"
                    min="0"
                    max="100"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Result */}
            <div className={`result-box${result ? " result-visible" : ""}`}>
              <div className="res-row">
                <span className="res-lbl">
                  {isReverseMode ? "GST के साथ Amount" : "Base Price"}
                </span>
                <span className="res-val">
                  {result ? fmt(isReverseMode ? result.withGST : result.withoutGST) : "—"}
                </span>
              </div>
              <div className="res-row">
                <span className="res-lbl">GST Amount ({result ? result.rate : 0}%)</span>
                <span className="res-val val-orange">{result ? fmt(result.gstAmt) : "—"}</span>
              </div>
              <div className="divider" />
              <div className="res-row">
                <span className="res-lbl">
                  {isReverseMode ? "✅ Without GST Amount" : "✅ Total Amount with GST"}
                </span>
                <span className="res-val val-green">
                  {result ? fmt(isReverseMode ? result.withoutGST : result.withGST) : "—"}
                </span>
              </div>
            </div>

            {/* Formula */}
            {result && (
              <div className="formula-box">
                {isReverseMode ? (
                  <>Formula: <code>{fmt(result.withGST)} ÷ (1 + {result.rate}/100) = {fmt(result.withoutGST)}</code></>
                ) : (
                  <>Formula: <code>{fmt(result.withoutGST)} + ({result.rate}% of {fmt(result.withoutGST)}) = {fmt(result.withGST)}</code></>
                )}
                <button className="reset-btn" onClick={handleReset}>Reset</button>
              </div>
            )}
          </div>

          <div className="gst-footer">
            Developed by: Amaan Web Tech
          </div>
        </div>
      </div>
    </>
  );
}
