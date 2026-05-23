import { useState, useEffect } from "react";
import developerLogo from "./developer-logo.jpg";

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

  :root {
    color-scheme: light;
    --bg: #FFF3DC;
    --surface: #FFF8ED;
    --border: #FFD480;
    --text: #1A1200;
    --muted: #7A5C1E;
    --accent: #FF6B00;
    --accent-soft: rgba(255,107,0,0.12);
    --shadow: rgba(255,107,0,0.12);
    --input-bg: white;
    --input-border: #FFD480;
    --result-bg: white;
    --button-bg: white;
    --button-text: #7A5C1E;
    --button-active: #FF6B00;
    --card-shadow: 0 6px 0 #FFCF60, 0 10px 28px rgba(255,107,0,0.12);
  }

  .gst-root.dark {
    color-scheme: dark;
    --bg: #121212;
    --surface: #1E1E28;
    --border: #3A3A4A;
    --text: #F5F5F7;
    --muted: #C3C3D0;
    --accent: #FFA64D;
    --accent-soft: rgba(255,166,77,0.16);
    --shadow: rgba(0,0,0,0.25);
    --input-bg: #262635;
    --input-border: #3A3A4A;
    --result-bg: #23232F;
    --button-bg: #262635;
    --button-text: #F5F5F7;
    --button-active: #FFA64D;
    --card-shadow: 0 6px 0 rgba(255,166,77,0.14), 0 10px 28px rgba(0,0,0,0.2);
  }

  /* ── Mobile First Base ── */
  .gst-root {
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--bg);
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
    background: var(--button-active);
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
    color: var(--text);
    line-height: 1.1;
    margin: 0;
  }

  .gst-title span { color: var(--button-active); }

  .gst-subtitle {
    color: var(--muted);
    font-size: 0.82rem;
    margin-top: 4px;
  }

  /* ── Card ── */
  .gst-card {
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: 20px;
    padding: 18px 16px;
    box-shadow: var(--card-shadow);
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
    border: 2px solid var(--input-border);
    border-radius: 12px;
    font-family: 'Baloo 2', cursive;
    font-size: 1.25rem;
    font-weight: 700;
    background: var(--input-bg);
    color: var(--text);
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
    border: 2px solid var(--border);
    border-radius: 10px;
    background: var(--button-bg);
    font-family: 'Baloo 2', cursive;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--button-text);
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
    background: var(--button-active);
    border-color: var(--button-active);
    color: white;
    box-shadow: 0 4px 0 rgba(224,85,0,0.9);
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
    background: var(--result-bg);
    border: 2px solid var(--border);
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

  .res-row + .res-row { border-top: 1px dashed var(--border); }

  .res-lbl {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    flex-shrink: 0;
  }

  .res-val {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
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
    background: rgba(255,107,0,0.08);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 0.74rem;
    color: var(--muted);
    text-align: center;
    word-break: break-all;
  }

  .formula-box code {
    font-family: monospace;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--button-active);
    word-break: break-all;
  }

  .action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 12px;
    justify-content: center;
  }

  .action-btn {
    border: 2px solid var(--button-active);
    background: var(--button-active);
    color: white;
    border-radius: 12px;
    padding: 10px 14px;
    cursor: pointer;
    font-family: 'Baloo 2', cursive;
    font-size: 0.9rem;
    font-weight: 700;
    transition: transform 0.18s ease, opacity 0.18s ease;
  }

  .action-btn:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }

  .action-whatsapp {
    background: #25D366;
    border-color: #1DA851;
  }

  /* ── Reset ── */
  .reset-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--button-active);
    font-family: 'Baloo 2', cursive;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0;
    margin-left: 6px;
    text-decoration: underline;
  }

  /* ── Footer ── */
  .gst-footer {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    margin-top: 14px;
    font-size: 0.72rem;
    color: #7A5C1E;
  }

  .developer-logo {
    width: 42px;
    height: 42px;
    object-fit: contain;
    border-radius: 6px;
    border: 1px solid rgba(125, 98, 32, 0.18);
    background: white;
    padding: 2px;
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
  const [theme, setTheme] = useState("light");
  const [result, setResult] = useState(null);

  const [useIGST, setUseIGST] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [items, setItems] = useState([]);
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemRate, setNewItemRate] = useState(selectedRate);

  const activeRate = useCustom ? parseFloat(customRate) || 0 : selectedRate;
  const isReverseMode = mode === "reverse";
  const isDarkMode = theme === "dark";
  const cgstAmt = result && !bulkMode ? (useIGST ? 0 : result.gstAmt / 2) : 0;
  const sgstAmt = result && !bulkMode ? (useIGST ? 0 : result.gstAmt / 2) : 0;
  const igstAmt = result && !bulkMode ? (useIGST ? result.gstAmt : 0) : 0;

  const handleCopy = () => {
    if (!result) return;
    const modeLabel = isReverseMode ? "Reverse" : "Forward";

    if (result.items) {
      let text = `GST Calculator - Bulk Items (Mode: ${modeLabel})\n`;
      let i = 1;
      result.items.forEach(it => {
        text += `Item ${i}: Rate ${it.rate}% - ${isReverseMode ? `Price with GST: ${fmt(it.withGST)}` : `Base Price: ${fmt(it.withoutGST)}`}\n`;
        text += `GST: ${fmt(it.gstAmt)} ${useIGST ? `(IGST: ${fmt(it.gstAmt)})` : `(CGST: ${fmt(it.gstAmt/2)}, SGST: ${fmt(it.gstAmt/2)})`}\n`;
        i++;
      });
      text += `---\nTotals: GST ${fmt(result.totals.totalGST)}, Without GST ${fmt(result.totals.totalWithout)}, With GST ${fmt(result.totals.totalWith)}\n`;
      navigator.clipboard?.writeText(text).catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      });
      return;
    }

    const shareText = `GST Calculator Result:\nMode: ${modeLabel}\nRate: ${result.rate}%\n${isReverseMode ? `Total Price with GST: ${fmt(result.withGST)}` : `Base Price: ${fmt(result.withoutGST)}`}\nGST Amount: ${fmt(result.gstAmt)}\n${useIGST ? `IGST: ${fmt(igstAmt)}` : `CGST: ${fmt(cgstAmt)}\nSGST: ${fmt(sgstAmt)}`}\nNet ${isReverseMode ? `Price without GST: ${fmt(result.withoutGST)}` : `Price with GST: ${fmt(result.withGST)}`}`;

    navigator.clipboard?.writeText(shareText).catch(() => {
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    });
  };

  const handleWhatsApp = () => {
    if (!result) return;
    const modeLabel2 = isReverseMode ? "Reverse" : "Forward";

    if (result.items) {
      let text = `GST Calculator - Bulk Items (Mode: ${modeLabel2})\n`;
      let i = 1;
      result.items.forEach(it => {
        text += `Item ${i}: Rate ${it.rate}% - ${isReverseMode ? `Price with GST: ${fmt(it.withGST)}` : `Base Price: ${fmt(it.withoutGST)}`}\n`;
        text += `GST: ${fmt(it.gstAmt)} ${useIGST ? `(IGST: ${fmt(it.gstAmt)})` : `(CGST: ${fmt(it.gstAmt/2)}, SGST: ${fmt(it.gstAmt/2)})`}\n`;
        i++;
      });
      text += `---\nTotals: GST ${fmt(result.totals.totalGST)}, Without GST ${fmt(result.totals.totalWithout)}, With GST ${fmt(result.totals.totalWith)}\n`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
      return;
    }

    const whatsappText = `GST Calculator Result:\nMode: ${modeLabel2}\nRate: ${result.rate}%\n${isReverseMode ? `Total Price with GST: ${fmt(result.withGST)}` : `Base Price: ${fmt(result.withoutGST)}`}\nGST Amount: ${fmt(result.gstAmt)}\n${useIGST ? `IGST: ${fmt(igstAmt)}` : `CGST: ${fmt(cgstAmt)}\nSGST: ${fmt(sgstAmt)}`}\n${isReverseMode ? `Price without GST: ${fmt(result.withoutGST)}` : `Price with GST: ${fmt(result.withGST)}`}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
    window.open(url, "_blank");
  };

  // Live calculation for single-item mode only
  useEffect(() => {
    const a = parseFloat(amount);
    if (!bulkMode) {
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
    }
  }, [amount, activeRate, isReverseMode, bulkMode]);

  const handleReset = () => {
    setAmount("");
    setCustomRate("");
    setResult(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`gst-root ${isDarkMode ? "dark" : "light"}`}>
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

            {/* Theme Selector */}
            <label className="custom-toggle">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setTheme(isDarkMode ? "light" : "dark")}
              />
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </label>

            {/* Mode Selector */}
            <label className="gst-label">Mode चुनें</label>
            <div className="gst-rates-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <button
                className={`rate-btn${mode === "reverse" ? " rate-active" : ""}`}
                onClick={() => setMode("reverse")}
              >
                Reverse
              </button>
              <button
                className={`rate-btn${mode === "forward" ? " rate-active" : ""}`}
                onClick={() => setMode("forward")}
              >
                Forward
              </button>
            </div>

            {/* Amount Input */}
            {!bulkMode && (
              <>
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
              </>
            )}

            {bulkMode && (
              <div className="custom-input-wrap">
                <label className="gst-label">Bulk Items</label>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div className="gst-input-wrap">
                      <span className="gst-prefix">₹</span>
                      <input
                        className="gst-input"
                        type="number"
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                        value={newItemAmount}
                        onChange={(e) => setNewItemAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <input
                    className="gst-input"
                    style={{ width: 110 }}
                    type="number"
                    placeholder="Rate (%)"
                    min="0"
                    max="100"
                    step="0.01"
                    value={newItemRate}
                    onChange={(e) => setNewItemRate(e.target.value)}
                  />
                  <button
                    className="action-btn"
                    onClick={() => {
                      const a = newItemAmount;
                      const r = newItemRate || selectedRate;
                      if (!a) return;
                      setItems(prev => [...prev, { id: Date.now(), amount: a, rate: r }]);
                      setNewItemAmount("");
                      setNewItemRate(selectedRate);
                    }}
                  >
                    Add to List
                  </button>
                </div>

                {items.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {items.map((it, idx) => (
                      <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ minWidth: 80 }}>#{idx + 1}</div>
                          <div>{fmt(parseFloat(it.amount) || 0)}</div>
                          <div>{it.rate}%</div>
                        </div>
                        <div>
                          <button className="rate-btn" onClick={() => setItems(prev => prev.filter(p => p.id !== it.id))}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="action-btn" onClick={() => {
                    // calculate bulk
                    const parsed = items.map(it => {
                      const a = parseFloat(it.amount);
                      const r = parseFloat(it.rate) || activeRate;
                      if (!isNaN(a) && a > 0 && r > 0) {
                        if (isReverseMode) {
                          const withoutGST = a / (1 + r / 100);
                          const gstAmt = a - withoutGST;
                          return { id: it.id, withGST: a, gstAmt, withoutGST, rate: r };
                        } else {
                          const withoutGST = a;
                          const gstAmt = a * (r / 100);
                          const withGST = a + gstAmt;
                          return { id: it.id, withGST, gstAmt, withoutGST, rate: r };
                        }
                      }
                      return null;
                    }).filter(Boolean);

                    if (parsed.length === 0) {
                      setResult(null);
                      return;
                    }

                    const totals = parsed.reduce((acc, it) => {
                      acc.totalGST += it.gstAmt;
                      acc.totalWithout += it.withoutGST;
                      acc.totalWith += it.withGST;
                      return acc;
                    }, { totalGST: 0, totalWithout: 0, totalWith: 0 });

                    setResult({ items: parsed, totals });
                  }}>Calculate All</button>
                  <button className="rate-btn" onClick={() => { setItems([]); setResult(null); }}>Clear List</button>
                </div>
              </div>
            )}

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

            <label className="custom-toggle">
              <input
                type="checkbox"
                checked={useIGST}
                onChange={(e) => setUseIGST(e.target.checked)}
              />
              Use IGST (Inter-state)
            </label>

            <label className="custom-toggle">
              <input
                type="checkbox"
                checked={bulkMode}
                onChange={(e) => setBulkMode(e.target.checked)}
              />
              Bulk Items Mode
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
              {!bulkMode ? (
                <>
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
                  {useIGST ? (
                    <div className="res-row">
                      <span className="res-lbl">IGST</span>
                      <span className="res-val">{result ? fmt(igstAmt) : "—"}</span>
                    </div>
                  ) : (
                    <>
                      <div className="res-row">
                        <span className="res-lbl">CGST</span>
                        <span className="res-val">{result ? fmt(cgstAmt) : "—"}</span>
                      </div>
                      <div className="res-row">
                        <span className="res-lbl">SGST</span>
                        <span className="res-val">{result ? fmt(sgstAmt) : "—"}</span>
                      </div>
                    </>
                  )}
                  <div className="divider" />
                  <div className="res-row">
                    <span className="res-lbl">
                      {isReverseMode ? "✅ Without GST Amount" : "✅ Total Amount with GST"}
                    </span>
                    <span className="res-val val-green">
                      {result ? fmt(isReverseMode ? result.withoutGST : result.withGST) : "—"}
                    </span>
                  </div>
                  <div className="action-row">
                    <button className="action-btn" onClick={handleCopy}>Copy Result</button>
                    <button className="action-btn action-whatsapp" onClick={handleWhatsApp}>Send to WhatsApp</button>
                  </div>
                </>
              ) : (
                result ? (
                  <>
                    {result.items.map((it, idx) => (
                      <div className="res-row" key={it.id}>
                        <span className="res-lbl">Item {idx + 1} ({it.rate}%)</span>
                        <span className="res-val">{isReverseMode ? fmt(it.withGST) : fmt(it.withoutGST)}</span>
                      </div>
                    ))}
                    <div className="res-row">
                      <span className="res-lbl">Total GST</span>
                      <span className="res-val val-orange">{fmt(result.totals.totalGST)}</span>
                    </div>
                    {useIGST ? (
                      <div className="res-row">
                        <span className="res-lbl">IGST Total</span>
                        <span className="res-val">{fmt(result.totals.totalGST)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="res-row">
                          <span className="res-lbl">CGST Total</span>
                          <span className="res-val">{fmt(result.totals.totalGST / 2)}</span>
                        </div>
                        <div className="res-row">
                          <span className="res-lbl">SGST Total</span>
                          <span className="res-val">{fmt(result.totals.totalGST / 2)}</span>
                        </div>
                      </>
                    )}
                    <div className="divider" />
                    <div className="res-row">
                      <span className="res-lbl">Totals (Without GST)</span>
                      <span className="res-val val-green">{fmt(result.totals.totalWithout)}</span>
                    </div>
                    <div className="res-row">
                      <span className="res-lbl">Totals (With GST)</span>
                      <span className="res-val val-green">{fmt(result.totals.totalWith)}</span>
                    </div>
                    <div className="action-row">
                      <button className="action-btn" onClick={handleCopy}>Copy Result</button>
                      <button className="action-btn action-whatsapp" onClick={handleWhatsApp}>Send to WhatsApp</button>
                    </div>
                  </>
                ) : (
                  <div className="res-row">
                    <span className="res-lbl">No valid items</span>
                    <span className="res-val">—</span>
                  </div>
                )
              )}
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
            <img
              src={developerLogo}
              alt="Developer logo"
              className="developer-logo"
            />
            <span>Developed by: Amaan Web Tech</span>
          </div>
        </div>
      </div>
    </>
  );
}
