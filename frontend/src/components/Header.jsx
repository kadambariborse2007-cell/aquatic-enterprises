import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
export default function Header() {
  const { user } = useAuth();
  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span className="topbar-location">📍 Ganpatipada, Old Thane-Belapur Road, Near Hindalco Company, Opp. Vitawa, Thane - 400605</span>
          <span className="topbar-tagline">Your Trusted Partner in Water Pump Solutions</span>
          <div className="topbar-contact">
            <a href="tel:+919220770110">☎ +91 9220770110</a>
            <a href="mailto:aquaticajay@gmail.com">✉ aquaticajay@gmail.com</a>
          </div>
        </div>
      </div>
      <header className="navbar">
        <Link className="brand" to="/" aria-label="Aquatic Enterprises home">
          <img src="/images/aquatic-logo.png" alt="Aquatic Enterprises - Water Pumps and Borewell" />
        </Link>
        <nav className="navlinks" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/products">Products &amp; Services</NavLink>
          <NavLink to={user ? "/account" : "/login"}>My Account</NavLink>          
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </header>
    </>
  );
}
