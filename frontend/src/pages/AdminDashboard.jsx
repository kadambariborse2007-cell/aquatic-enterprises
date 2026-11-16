import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminReviews, setReviewStatus, deleteReview } from "../api";
import ProductsManager from "../components/ProductsManager";
import BusinessManager from "../components/BusinessManager";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const adminDetails = JSON.parse(
    localStorage.getItem("adminDetails") || "{}"
  );

  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    navigate("/admin/login");
  }

  async function loadReviews() {
    setLoading(true);
    setMessage("");

    try {
      const data = await fetchAdminReviews(filter);
      setReviews(data);
    } catch (error) {
      setMessage("Could not load reviews. Please log out and log in again.");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
  }, [filter]);

  async function handleStatus(reviewId, status) {
    try {
      await setReviewStatus(reviewId, status);
      loadReviews();
    } catch (error) {
      setMessage("Could not update the review. Please try again.");
    }
  }

  async function handleDelete(reviewId) {
    const sure = window.confirm("Delete this review permanently?");
    if (!sure) return;

    try {
      await deleteReview(reviewId);
      loadReviews();
    } catch (error) {
      setMessage("Could not delete the review. Please try again.");
    }
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

    

        <section style={styles.reviewSection}>
          <h2>Customer Reviews</h2>

          <div style={styles.filters}>
            {["pending", "approved", "rejected", ""].map((item) => (
              <button
                key={item || "all"}
                onClick={() => setFilter(item)}
                style={
                  filter === item
                    ? styles.filterButtonActive
                    : styles.filterButton
                }
              >
                {item === "" ? "All" : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {message && <p style={styles.error}>{message}</p>}

          {loading && <p>Loading reviews...</p>}

          {!loading && !message && reviews.length === 0 && (
            <p>No reviews found here.</p>
          )}

          {!loading &&
            reviews.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewTop}>
                  <strong>{review.name}</strong>
                  <span>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  <span style={styles.statusTag}>{review.status}</span>
                </div>

                <p>{review.comment}</p>

                <div style={styles.actions}>
                  <button
                    onClick={() => handleStatus(review.id, "approved")}
                    style={styles.approveButton}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(review.id, "rejected")}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </section>

        <ProductsManager />
        <BusinessManager />
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
  reviewSection: {
    marginTop: "40px",
  },
  filters: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    margin: "15px 0",
  },
  filterButton: {
    padding: "9px 16px",
    border: "1px solid #082b49",
    borderRadius: "7px",
    background: "white",
    color: "#082b49",
    cursor: "pointer",
  },
  filterButtonActive: {
    padding: "9px 16px",
    border: "1px solid #082b49",
    borderRadius: "7px",
    background: "#082b49",
    color: "white",
    cursor: "pointer",
  },
  reviewCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    marginBottom: "15px",
  },
  reviewTop: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  statusTag: {
    background: "#e2e8f0",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  approveButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    fontWeight: "bold",
  },
};