
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8001";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Admin login failed.");
      }

      localStorage.setItem("adminToken", data.access_token);
      localStorage.setItem("adminDetails", JSON.stringify(data.admin));

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h1 style={styles.heading}>Aquatic Enterprises</h1>
        <p style={styles.subtitle}>Administrator Login</p>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Admin Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          required
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter admin password"
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef5fa",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "36px",
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 8px 30px rgba(8, 43, 73, 0.12)",
  },
  heading: {
    color: "#082b49",
    textAlign: "center",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: "28px",
  },
  label: {
    display: "block",
    color: "#082b49",
    fontWeight: "600",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#087eaa",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "18px",
  },
};
