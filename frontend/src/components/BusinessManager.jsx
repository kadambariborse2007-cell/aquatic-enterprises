import { useEffect, useState } from "react";
import { fetchBusiness, updateBusiness } from "../api";

function Field({ label, value, onChange, hint }) {
  return (
    <label style={styles.label}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
      {hint && <span style={styles.hint}>{hint}</span>}
    </label>
  );
}

export default function BusinessManager() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchBusiness()
      .then(setForm)
      .catch(() =>
        setError("Could not load business details. Check that the backend is running.")
      );
  }, []);

  async function handleSave() {
    setError("");
    setNotice("");

    if (!form.phone.trim() || !form.whatsapp.trim() || !form.email.trim()) {
      setError("Phone, WhatsApp and email cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      await updateBusiness(form);
      setNotice("Business details saved. The website will show them now.");
    } catch (e) {
      setError(e.message || "Could not save. Please log out and log in again.");
    }

    setSaving(false);
  }

  return (
    <section style={styles.section}>
      <h2>Business Details</h2>
      <p>These details are shown on your website (header, footer and Contact page).</p>

      {error && <p style={styles.error}>{error}</p>}
      {notice && <p style={styles.notice}>{notice}</p>}

      {form && (
        <div style={styles.card}>
          <div style={styles.form}>
            <Field
              label="Phone number"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              
            />
            <Field
              label="WhatsApp number"
              value={form.whatsapp}
              onChange={(v) => setForm({ ...form, whatsapp: v })}
              
            />
            <Field
              label="Email address"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <Field
              label="Address"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
            />
            <Field
              label="Working hours"
              value={form.working_hours}
              onChange={(v) => setForm({ ...form, working_hours: v })}
              
            />

            <div>
              <button style={styles.greenButton} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save business details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  section: { marginTop: "40px" },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    marginBottom: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  input: {
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "normal",
  },
  hint: { color: "#475569", fontSize: "13px", fontWeight: "normal" },
  greenButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
  },
  error: { color: "#dc2626", fontWeight: "bold" },
  notice: { color: "#16a34a", fontWeight: "bold" },
};