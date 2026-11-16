import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminReviews, setReviewStatus, deleteReview } from "../api";
import ProductsManager from "../components/productsManager";
import BusinessManager from "../components/BusinessManager";
import BannerManager from "../components/BannerManager";
import CustomersManager from "../components/CustomersManager";

const TABS = [
  { id: "reviews", label: "Customer Reviews", icon: "⭐" },
  { id: "products", label: "Products", icon: "📦" },
  { id: "business", label: "Business Details", icon: "🏢" },
  { id: "banner", label: "Offers Banner", icon: "📢" },
  { id: "customers", label: "Customers", icon: "👥" },
];

const TAB_INFO = {
  reviews: "Approve, reject or delete what customers write about you.",
  products: "Edit categories, pump models and product photos.",
  business: "Update your phone, WhatsApp, email, address and working hours.",
  banner: "Show an offer or announcement at the top of your website.",
  customers: "See customers who registered on your website.",
};

const STATUS_COLORS = {
  pending: { background: "#fef3c7", color: "#92400e" },
  approved: { background: "#dcfce7", color: "#166534" },
  rejected: { background: "#fee2e2", color: "#991b1b" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const adminDetails = JSON.parse(
    localStorage.getItem("adminDetails") || "{}"
  );

  const displayName =
    (adminDetails.name || "").replace(/\s*admin\s*$/i, "").trim() ||
    "Aquatic Enterprises";

  const [tab, setTab] = useState("reviews");
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const activeTab = TABS.find((item) => item.id === tab);

  return (
    <div className="dash-layout">
      <style>{css}</style>

      <aside className="dash-side">
        <div className="dash-brand">
          <div className="dash-logo">💧</div>
          <div>
            <strong>Aquatic Enterprises</strong>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <nav className="dash-nav">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={tab === item.id ? "dash-nav-btn active" : "dash-nav-btn"}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="dash-logout">
          ⎋ Logout
        </button>
      </aside>

      <div className="dash-main">
        <header className="dash-top">
          <div className="dash-top-text">
            <h1>{activeTab.label}</h1>
            <p>{TAB_INFO[tab]}</p>
          </div>
          <div className="dash-welcome">
            <div className="dash-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span>{displayName}</span>
          </div>
        </header>

        <main className="dash-content">
          {tab === "reviews" && (
            <section>
              <div className="dash-filters">
                {["pending", "approved", "rejected", ""].map((item) => (
                  <button
                    key={item || "all"}
                    onClick={() => setFilter(item)}
                    className={filter === item ? "dash-pill active" : "dash-pill"}
                  >
                    {item === ""
                      ? "All"
                      : item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>

              {message && <p className="dash-error">{message}</p>}

              {loading && <p>Loading reviews...</p>}

              {!loading && !message && reviews.length === 0 && (
                <div className="dash-empty">
                  <div>💬</div>
                  <p>No reviews found here.</p>
                </div>
              )}

              {!loading &&
                reviews.map((review) => (
                  <div key={review.id} className="dash-review">
                    <div className="dash-review-top">
                      <div className="dash-avatar small">
                        {(review.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="dash-review-name">
                        <strong>{review.name}</strong>
                        <span className="dash-stars">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <span
                        className="dash-status"
                        style={STATUS_COLORS[review.status] || {}}
                      >
                        {review.status}
                      </span>
                    </div>

                    <p className="dash-review-text">{review.comment}</p>

                    <div className="dash-actions">
                      <button
                        onClick={() => handleStatus(review.id, "approved")}
                        className="dash-btn green"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatus(review.id, "rejected")}
                        className="dash-btn amber"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="dash-btn red"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </section>
          )}

          {tab === "products" && <ProductsManager />}
          {tab === "business" && <BusinessManager />}
          {tab === "banner" && <BannerManager />}
          {tab === "customers" && <CustomersManager />}
        </main>
      </div>
    </div>
  );
}

const css = `
.dash-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f9ff;
  font-family: Arial, sans-serif;
}

/* ---------- sidebar ---------- */
.dash-side {
  width: 260px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #082b49 0%, #0b3d66 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 26px 16px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  height: 100vh;
}
.dash-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 20px;
}
.dash-brand strong { display: block; font-size: 16px; }
.dash-brand span { font-size: 12px; color: #9fd8de; }
.dash-logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #00bac4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.dash-nav { display: flex; flex-direction: column; gap: 6px; }
.dash-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #cfe3f0;
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.dash-nav-btn:hover { background: rgba(255, 255, 255, 0.1); }
.dash-nav-btn.active {
  background: #00bac4;
  color: #082b49;
  font-weight: bold;
}
.dash-nav-icon { font-size: 18px; }
.dash-logout {
  margin-top: auto;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  background: transparent;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
.dash-logout:hover { background: rgba(255, 255, 255, 0.1); }

/* ---------- main area ---------- */
.dash-main {
  flex: 1;
  min-width: 0;
  background:
    radial-gradient(circle at 12% 20%, rgba(0, 186, 196, 0.18) 0, transparent 38%),
    radial-gradient(circle at 88% 14%, rgba(99, 102, 241, 0.14) 0, transparent 36%),
    radial-gradient(circle at 80% 90%, rgba(56, 189, 248, 0.18) 0, transparent 40%),
    #f5f9ff;
  background-attachment: fixed;
}

/* floating header card */
.dash-top {
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin: 24px 40px 0;
  max-width: 1000px;
  padding: 28px 32px;
  background: linear-gradient(120deg, #082b49 0%, #0b5a85 55%, #00a9b5 100%);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(8, 43, 73, 0.2);
}
.dash-top::before {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  right: -60px;
  top: -90px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}
.dash-top::after {
  content: "";
  position: absolute;
  width: 140px;
  height: 140px;
  right: 120px;
  bottom: -80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.07);
}
.dash-top > * { position: relative; z-index: 1; }
.dash-top h1 { margin: 0; font-size: 28px; color: white; }
.dash-top p { margin: 6px 0 0; color: #cdeef2; font-size: 14px; }
.dash-welcome {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: white;
  background: rgba(255, 255, 255, 0.16);
  padding: 8px 18px 8px 8px;
  border-radius: 999px;
}
.dash-welcome .dash-avatar {
  background: white;
  color: #082b49;
}
.dash-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #082b49;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.dash-avatar.small {
  width: 38px;
  height: 38px;
  background: #00bac4;
  color: #082b49;
  flex-shrink: 0;
}
.dash-content { padding: 26px 40px 60px; max-width: 1000px; }
.dash-content h2,
.dash-content h2 + p { display: none; }
.dash-content > section { margin-top: 0 !important; }

/* ---------- reviews ---------- */
.dash-filters { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.dash-pill {
  padding: 9px 18px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: white;
  color: #082b49;
  cursor: pointer;
}
.dash-pill.active {
  background: #082b49;
  border-color: #082b49;
  color: white;
}
.dash-review {
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}
.dash-review-top { display: flex; align-items: center; gap: 12px; }
.dash-review-name { display: flex; flex-direction: column; flex: 1; }
.dash-stars { color: #f59e0b; letter-spacing: 2px; }
.dash-status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
  text-transform: capitalize;
}
.dash-review-text { color: #334155; line-height: 1.6; margin: 14px 0; }
.dash-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.dash-btn {
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
.dash-btn.green { background: #16a34a; }
.dash-btn.amber { background: #f59e0b; }
.dash-btn.red { background: #dc2626; }
.dash-btn:hover { opacity: 0.9; }
.dash-empty {
  background: white;
  border-radius: 14px;
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-size: 15px;
}
.dash-empty div { font-size: 38px; }
.dash-error { color: #dc2626; font-weight: bold; }

/* ---------- phone / small screens ---------- */
@media (max-width: 800px) {
  .dash-layout { flex-direction: column; }
  .dash-side {
    width: 100%;
    height: auto;
    position: static;
    padding: 16px;
  }
  .dash-brand { padding-bottom: 14px; margin-bottom: 12px; }
  .dash-nav { flex-direction: row; flex-wrap: wrap; }
  .dash-nav-btn { width: auto; padding: 10px 12px; font-size: 14px; }
  .dash-logout { margin-top: 12px; }
  .dash-top { margin: 16px 16px 0; padding: 20px; }
  .dash-content { padding: 20px 16px 40px; }
}
`;