import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img className="auth-logo" src="/images/aquatic-logo.png" alt="Aquatic Enterprises" />
        <h2>My Account</h2>
        <p className="auth-sub">Welcome, {user?.name}</p>
        <p className="auth-info"><strong>Name:</strong> {user?.name}</p>
        <p className="auth-info"><strong>Email:</strong> {user?.email}</p>
        <p className="auth-info"><strong>Phone:</strong> {user?.phone}</p>
        <button className="auth-btn" onClick={() => { logout(); navigate("/"); }}>Logout</button>
      </div>
    </div>
  );
}
