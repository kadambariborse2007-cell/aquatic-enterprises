import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import useBusiness from "../useBusiness";

export default function Header() {
  const { user } = useAuth();
  const business = useBusiness();
  const phoneLink = business.phone.replace(/\s+/g, "");

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span className="topbar-location">📍 {business.address}</span>
          <span className="topbar-tagline">Your Trusted Partner in Water Pump Solutions</span>
          <div className="topbar-contact">
            <a href={`tel:${phoneLink}`}>☎ {business.phone}</a>
            <a href={`mailto:${business.email}`}>✉ {business.email}</a>
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
          <NavLink to="/shop">Visit Us</NavLink>
        </nav>
      </header>
    </>
  );
}