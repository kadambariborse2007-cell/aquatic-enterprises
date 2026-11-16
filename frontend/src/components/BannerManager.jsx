import { useEffect, useState } from "react";
import { fetchBanner, updateBanner } from "../api";

export default function BannerManager() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchBanner()
      .then(setForm)
      .catch(() =>
        setError("Could not load the banner. Check that the backend is running.")
      );
  }, []);

  async function handleSave() {
    setError("");
    setNotice("");

    if (form.active && !form.message.trim()) {
      setError("Please type a message before switching the banner on.");
      return;
    }

    setSaving(true);

    try {
      await updateBanner(form);
      setNotice(
        form.active
          ? "Banner saved and ON. It now shows at the top of your website."
          : "Banner saved and OFF. It is hidden on your website."
      );
    } catch (e) {
      setError(e.message || "Could not save. Please log out and log in again.");
    }

    setSaving(false);
  }

  return (
    <section style={styles.section}>
      <h2>Offers Banner</h2>
      <p>Show an offer or announcement at the top of your website.</p>

      {error && <p style={styles.error}>{error}</p>}
      {notice && <p style={styles.notice}>{notice}</p>}

      {form && (
        <div style={styles.card}>
          <div style={styles.form}>
            <label style={styles.label}>
              Banner message
              <input
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={styles.input}
                maxLength={200}
              />
            </label>

            <label style={styles.label}>
              Link (optional, example: /contact)
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                style={styles.input}
              />
            </label>

            <label style={styles.checkRow}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Show this banner on the website (ON)
            </label>

            <div>
              <button
                style={styles.greenButton}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save banner"}
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
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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