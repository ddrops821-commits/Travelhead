"use client";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function numberToWords(num) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (!num || isNaN(num)) return "";
  const n = parseInt(num);
  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numberToWords(n % 100) : "");
  if (n < 100000) return numberToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numberToWords(n % 1000) : "");
  if (n < 10000000) return numberToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numberToWords(n % 100000) : "");
  return numberToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numberToWords(n % 10000000) : "");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

const initialRow = { desc: "", subdesc: "", rate: "", qty: 1 };

export default function Home() {
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [billName, setBillName] = useState("");
  const [billAddr, setBillAddr] = useState("");
  const [rows, setRows] = useState([{ ...initialRow }]);
  const [notes, setNotes] = useState("Thanks for your business.");
  const [terms, setTerms] = useState("Due on Receipt");
  const [cabType, setCabType] = useState("Etios");
  const [driver, setDriver] = useState("Sebastian KA644114");

  const invoiceRef = useRef();
  const invoiceNumber = useRef("FEABA" + Math.floor(Date.now() / 1000));

  const subTotal = rows.reduce((s, r) => s + (parseFloat(r.rate) * (parseInt(r.qty) || 1) || 0), 0);

  const updateRow = (i, field, val) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };

  const addRow = () => setRows(prev => [...prev, { ...initialRow }]);
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const downloadPDF = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(invoiceNumber.current + ".pdf");
  };

  const S = styles;

  return (
    <div style={S.page}>
      <style>{globalCSS}</style>

      {/* FORM PANEL */}
      <div style={S.formPanel}>
        <div style={S.formHeader}>
          <span style={S.formLogo}>🚖</span>
          <div>
            <div style={S.formTitle}>Invoice Generator</div>
            <div style={S.formSub}>FEABA Travels</div>
          </div>
        </div>

        <Section label="Trip Details">
          <Row>
            <Field label="Invoice Date">
              <input style={S.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
            </Field>
            <Field label="Due Date">
              <input style={S.input} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </Field>
          </Row>
          <Row>
            <Field label="Cab Type">
              <input style={S.input} value={cabType} onChange={e => setCabType(e.target.value)} placeholder="Etios" />
            </Field>
            <Field label="Driver / Vehicle No.">
              <input style={S.input} value={driver} onChange={e => setDriver(e.target.value)} placeholder="Sebastian KA644114" />
            </Field>
          </Row>
          <Field label="Terms">
            <input style={S.input} value={terms} onChange={e => setTerms(e.target.value)} placeholder="Due on Receipt" />
          </Field>
        </Section>

        <Section label="Bill To">
          <Field label="Company / Person Name">
            <input style={S.input} value={billName} onChange={e => setBillName(e.target.value)} placeholder="Inheaden India Pvt Ltd" />
          </Field>
          <Field label="Address (one line per line)">
            <textarea style={{ ...S.input, height: 80, resize: "vertical" }} value={billAddr} onChange={e => setBillAddr(e.target.value)} placeholder={"#3769, 13th B main\nIndiranagar, Bengaluru\n560008 Karnataka, India"} />
          </Field>
        </Section>

        <Section label="Line Items">
          {rows.map((r, i) => (
            <div key={i} style={S.lineItem}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={S.lineNum}>{i + 1}</span>
                <input style={{ ...S.input, flex: 2 }} value={r.desc} onChange={e => updateRow(i, "desc", e.target.value)} placeholder="Item name (e.g. Cab Airport Service)" />
                <input style={{ ...S.input, flex: 1, maxWidth: 80 }} type="number" value={r.rate} onChange={e => updateRow(i, "rate", e.target.value)} placeholder="Rate ₹" />
                {rows.length > 1 && <button style={S.delBtn} onClick={() => removeRow(i)}>✕</button>}
              </div>
              <input style={{ ...S.input, marginTop: 4, fontSize: 12 }} value={r.subdesc} onChange={e => updateRow(i, "subdesc", e.target.value)} placeholder="Sub-description (e.g. Cab used by Florian)" />
            </div>
          ))}
          <button style={S.addBtn} onClick={addRow}>+ Add Line Item</button>
        </Section>

        <Section label="Notes">
          <textarea style={{ ...S.input, height: 60, resize: "vertical" }} value={notes} onChange={e => setNotes(e.target.value)} />
        </Section>

        <button style={S.downloadBtn} onClick={downloadPDF}>
          ⬇ Download PDF
        </button>
      </div>

      {/* INVOICE PREVIEW */}
      <div style={S.previewPanel}>
        <div style={S.previewLabel}>PREVIEW</div>
        <div style={S.invoiceWrap}>
          <div ref={invoiceRef} style={S.invoice}>
            {/* Header */}
            <div style={S.invHeader}>
              <div style={S.invCompany}>
                <div style={S.invCompanyName}>FEABA TRAVELS</div>
                <div style={S.invCompanyAddr}>Bommanahalli</div>
                <div style={S.invCompanyAddr}>Bengaluru Karnataka</div>
                <div style={S.invCompanyAddr}>98801 59085</div>
              </div>
              <div style={S.invTaxLabel}>TAX INVOICE</div>
            </div>

            {/* Meta row */}
            <div style={S.metaGrid}>
              <div style={S.metaLeft}>
                <MetaRow label="#" value={invoiceNumber.current} />
                <MetaRow label="Invoice Date" value={formatDate(date)} />
                <MetaRow label="Terms" value={terms} />
                <MetaRow label="Due Date" value={dueDate ? formatDate(dueDate) : formatDate(date)} />
              </div>
              <div style={S.metaDivider} />
              <div style={S.metaRight}>
                <MetaRow label="Cab Type" value={cabType} />
                <MetaRow label="Driver Name/Vehicle Number" value={driver} />
              </div>
            </div>

            {/* Bill To */}
            <div style={S.billToHeader}>Bill To</div>
            <div style={S.billToBody}>
              {billName && <div style={{ fontWeight: 700, marginBottom: 2 }}>{billName}</div>}
              {billAddr
                ? billAddr.split("\n").map((l, i) => <div key={i}>{l}</div>)
                : <div style={{ color: "#aaa", fontStyle: "italic" }}>No billing address</div>
              }
            </div>

            {/* Items Table */}
            <table style={S.table}>
              <thead>
                <tr style={S.tableHead}>
                  <th style={{ ...S.th, width: 30 }}>#</th>
                  <th style={{ ...S.th, textAlign: "left" }}>Item &amp; Description</th>
                  <th style={{ ...S.th, textAlign: "right", width: 100 }}>Rate</th>
                  <th style={{ ...S.th, textAlign: "right", width: 100 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const amt = (parseFloat(r.rate) * (parseInt(r.qty) || 1)) || 0;
                  return (
                    <tr key={i} style={S.tableRow}>
                      <td style={{ ...S.td, textAlign: "center" }}>{i + 1}</td>
                      <td style={S.td}>
                        <div style={{ fontWeight: 500 }}>{r.desc || <span style={{ color: "#bbb" }}>Item name</span>}</div>
                        {r.subdesc && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{r.subdesc}</div>}
                      </td>
                      <td style={{ ...S.td, textAlign: "right" }}>{r.rate ? Number(r.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 }) : ""}</td>
                      <td style={{ ...S.td, textAlign: "right" }}>{amt ? amt.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer totals */}
            <div style={S.footerGrid}>
              <div style={S.footerLeft}>
                <div style={S.totalWords}>Total In Words</div>
                <div style={S.totalWordsVal}>
                  {subTotal ? `Indian Rupee ${numberToWords(subTotal)} Only` : "—"}
                </div>
                {notes && (
                  <>
                    <div style={{ ...S.totalWords, marginTop: 10 }}>Notes</div>
                    <div style={{ fontSize: 11 }}>{notes}</div>
                  </>
                )}
              </div>
              <div style={S.footerRight}>
                <TotalRow label="Sub Total" value={subTotal} />
                <TotalRow label="Total" value={subTotal} bold />
                <TotalRow label="Balance Due" value={subTotal} bold />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small helper components ── */
function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={styles.sectionLabel}>{label}</div>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 8, flex: 1 }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}
function Row({ children }) {
  return <div style={{ display: "flex", gap: 12 }}>{children}</div>;
}
function MetaRow({ label, value }) {
  return (
    <div style={styles.metaRow}>
      <span style={styles.metaLabel}>{label}</span>
      <span style={styles.metaValue}>: {value}</span>
    </div>
  );
}
function TotalRow({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderTop: label === "Balance Due" ? "1.5px solid #222" : "none" }}>
      <span style={{ fontWeight: bold ? 700 : 400, fontSize: bold ? 13 : 12 }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 400, fontSize: bold ? 13 : 12 }}>
        {value ? `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "₹0.00"}
      </span>
    </div>
  );
}

/* ── Styles ── */
const styles = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0f2f5" },
  formPanel: { width: 380, minWidth: 340, background: "#1a1f2e", color: "#e0e6f0", padding: "28px 24px", overflowY: "auto", minHeight: "100vh", boxSizing: "border-box" },
  formHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  formLogo: { fontSize: 32 },
  formTitle: { fontSize: 18, fontWeight: 700, color: "#fff" },
  formSub: { fontSize: 12, color: "#7a8aaa" },
  sectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#5b7fa6", textTransform: "uppercase", marginBottom: 8 },
  sectionBody: { background: "#232b3e", borderRadius: 8, padding: "12px 14px" },
  label: { display: "block", fontSize: 11, color: "#7a8aaa", marginBottom: 4 },
  input: { width: "100%", boxSizing: "border-box", background: "#1a1f2e", border: "1px solid #2e3a52", borderRadius: 6, color: "#e0e6f0", padding: "7px 10px", fontSize: 13, outline: "none", fontFamily: "inherit" },
  lineItem: { background: "#1a1f2e", borderRadius: 6, padding: "8px 10px", marginBottom: 8 },
  lineNum: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, background: "#2e3a52", borderRadius: "50%", fontSize: 11, color: "#7a8aaa", flexShrink: 0 },
  addBtn: { background: "none", border: "1px dashed #2e3a52", color: "#5b7fa6", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", width: "100%", marginTop: 4 },
  delBtn: { background: "#2e3a52", border: "none", color: "#e06060", borderRadius: 4, width: 24, height: 24, cursor: "pointer", fontSize: 12, flexShrink: 0 },
  downloadBtn: { width: "100%", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8, letterSpacing: "0.02em" },

  previewPanel: { flex: 1, padding: "32px 40px", overflowY: "auto" },
  previewLabel: { fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", color: "#9ca3af", marginBottom: 16, textTransform: "uppercase" },
  invoiceWrap: { background: "#fff", boxShadow: "0 4px 32px rgba(0,0,0,0.12)", borderRadius: 4, overflow: "hidden" },

  invoice: { background: "#fff", padding: "28px 32px", minWidth: 500, fontSize: 12, color: "#222", lineHeight: 1.5 },
  invHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, borderBottom: "2px solid #222", paddingBottom: 14 },
  invCompanyName: { fontSize: 20, fontWeight: 800, letterSpacing: "0.05em", marginBottom: 2 },
  invCompanyAddr: { fontSize: 11, color: "#444" },
  invTaxLabel: { fontSize: 22, fontWeight: 300, letterSpacing: "0.1em", color: "#222" },

  metaGrid: { display: "flex", borderBottom: "1px solid #ddd", marginBottom: 0 },
  metaLeft: { flex: 1, padding: "10px 12px 10px 0" },
  metaDivider: { width: 1, background: "#ddd", margin: "8px 0" },
  metaRight: { flex: 1, padding: "10px 0 10px 12px" },
  metaRow: { display: "flex", gap: 4, marginBottom: 2, fontSize: 11.5 },
  metaLabel: { color: "#555", minWidth: 130 },
  metaValue: { fontWeight: 600, color: "#222" },

  billToHeader: { background: "#e8e8e8", padding: "5px 12px", fontWeight: 700, fontSize: 12, borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc" },
  billToBody: { padding: "10px 12px 12px", fontSize: 12, borderBottom: "1px solid #ddd" },

  table: { width: "100%", borderCollapse: "collapse", borderBottom: "1px solid #ccc" },
  tableHead: { background: "#f5f5f5" },
  th: { padding: "7px 10px", fontSize: 11.5, fontWeight: 700, borderBottom: "1.5px solid #ccc", borderTop: "1.5px solid #ccc" },
  tableRow: { borderBottom: "1px solid #eee" },
  td: { padding: "8px 10px", verticalAlign: "top", fontSize: 12 },

  footerGrid: { display: "flex", gap: 0, marginTop: 0, borderTop: "1px solid #ddd" },
  footerLeft: { flex: 1.5, padding: "12px 12px 16px 0" },
  footerRight: { width: 220, padding: "12px 0 12px 16px", borderLeft: "1px solid #eee" },
  totalWords: { fontSize: 10.5, fontWeight: 700, color: "#555", marginBottom: 2 },
  totalWordsVal: { fontSize: 11.5, fontWeight: 600, fontStyle: "italic" },
};

const globalCSS = `
  input::placeholder { color: #3d4f6a; }
  textarea::placeholder { color: #3d4f6a; }
  input:focus, textarea:focus { border-color: #3b82f6 !important; }
  * { box-sizing: border-box; }
  @media (max-width: 800px) {
    div[style*="display: flex"][style*="minHeight"] { flex-direction: column; }
  }
`;
