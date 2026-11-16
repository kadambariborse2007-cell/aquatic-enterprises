import { useEffect, useState } from "react";

// Deployment ke time isko live backend address se badalna (step 8)
const API_URL = "http://127.0.0.1:8001";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    fetch(`${API_URL}/admin/customers`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return res.json();
      })
      .then((data) => setCustomers(data))
      .catch(() =>
        setError("Could not load customers. Please log out and log in again.")
      )
      .finally(() => setLoading(false));
  }, []);

  const query = search.trim().toLowerCase();
  const visible = customers.filter(
    (c) =>
      !query ||
      (c.name || "").toLowerCase().includes(query) ||
      (c.email || "").toLowerCase().includes(query) ||
      (c.phone || "").toLowerCase().includes(query)
  );

  return (
    <section>
      <div style={styles.topRow}>
        <div style={styles.countCard}>
          <strong style={styles.countNumber}>{customers.length}</strong>
          <span>Registered customers</span>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone"
          style={styles.search}
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading customers...</p>}

      {!loading && !error && visible.length === 0 && (
        <div style={styles.empty}>
          <div style={{ fontSize: "38px" }}>👤</div>
          <p>No customers found.</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div style={styles.tableCard}>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Registered on</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr key={c.id}>
                    <td style={styles.td}>
                      <div style={styles.nameCell}>
                        <span style={styles.avatar}>
                          {(c.name || "?").charAt(0).toUpperCase()}
                        </span>
                        {c.name}
                      </div>
                    </td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.phone || "-"}</td>
                    <td style={styles.td}>{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  topRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: "20px",
  },
  countCard: {
    display: "flex",
    flexDirection: "column",
    padding: "14px 22px",
    borderRadius: "14px",
    background: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    color: "#64748b",
    fontSize: "13px",
  },
  countNumber: { fontSize: "28px", color: "#082b49" },
  search: {
    flex: 1,
    minWidth: "220px",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
  },
  tableCard: {
    background: "white",
    borderRadius: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#082b49",
    color: "white",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 16px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
  },
  nameCell: { display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#00bac4",
    color: "#082b49",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
  },
  empty: {
    background: "white",
    borderRadius: "14px",
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
  },
  error: { color: "#dc2626", fontWeight: "bold" },
};