import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/account";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img className="auth-logo" src="/images/aquatic-logo.png" alt="Aquatic Enterprises" />
        <h2>Create Account</h2>
        <p className="auth-sub">Aquatic Enterprises</p>
        <form onSubmit={submit}>
          <div className="auth-field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" value={form.name} onChange={change} required />
          </div>
          <div className="auth-field">
            <label htmlFor="remail">Email</label>
            <input id="remail" name="email" type="email" value={form.email} onChange={change} required />
          </div>
          <div className="auth-field">
            <label htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" value={form.phone} onChange={change} required />
          </div>
          <div className="auth-field">
            <label htmlFor="rpassword">Password</label>
            <div className="auth-pw">
              <input id="rpassword" name="password" type={showPw ? "text" : "password"} value={form.password} onChange={change} required />
              <button type="button" className="auth-show" onClick={() => setShowPw(!showPw)}>{showPw ? "Hide" : "Show"}</button>
            </div>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn" disabled={busy}>{busy ? "Please wait..." : "Register"}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login" state={{ from }}>Log in</Link></p>
      </div>
    </div>
  );
}
