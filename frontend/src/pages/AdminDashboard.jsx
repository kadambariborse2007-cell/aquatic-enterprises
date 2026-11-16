import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const adminDetails = JSON.parse(
    localStorage.getItem("adminDetails") || "{}"
  );

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    navigate("/admin/login");
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1>Aquatic Enterprises</h1>
          <p>Administrator Dashboard</p>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      <main style={styles.content}>
        <h2>Welcome, {adminDetails.name || "Admin"}!</h2>
        <p>Manage your website from this dashboard.</p>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Products</h3>
            <p>Manage your water pump products.</p>
            <span>Coming next</span>
          </div>

          <div style={styles.card}>
            <h3>Enquiries</h3>
            <p>View and manage customer enquiries.</p>
            <span>Coming next</span>
          </div>

          <div style={styles.card}>
            <h3>Reviews</h3>
            <p>Approve or reject customer reviews.</p>
            <span>Coming next</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#082b49",
    color: "white",
    padding: "22px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    padding: "35px 5%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "22px",
    marginTop: "30px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
  },
  logoutButton: {
    padding: "11px 20px",
    border: "none",
    borderRadius: "7px",
    background: "#00bac4",
    color: "#082b49",
    fontWeight: "bold",
    cursor: "pointer",
  },
};