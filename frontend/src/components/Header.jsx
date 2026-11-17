import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";
import useBusiness from "../useBusiness";
import { fetchBanner } from "../api";
import SplashScreen from "./SplashScreen";
import WelcomePopup from "./WelcomePopup";
const bannerStyle = {
  background: "#00bac4",
  color: "#082b49",
  textAlign: "center",
  padding: "10px 5%",
  fontWeight: "bold",
  fontSize: "15px",
};

const bannerLinkStyle = {
  color: "#082b49",
  textDecoration: "underline",
};

function OfferBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let active = true;

    fetchBanner()
      .then((data) => {
        if (active) setBanner(data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  if (!banner || !banner.active || !banner.message) {
    return null;
  }

  const isInternal = banner.link.startsWith("/");

  return (
    <div style={bannerStyle}>
      {banner.link ? (
        isInternal ? (
          <Link to={banner.link} style={bannerLinkStyle}>
            {banner.message}
          </Link>
        ) : (
          <a
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer"
            style={bannerLinkStyle}
          >
            {banner.message}
          </a>
        )
      ) : (
        banner.message
      )}
    </div>
  );
}

export default function Header() {
  const { user } = useAuth();
  const business = useBusiness();
  const phoneLink = business.phone.replace(/\s+/g, "");

  return (
    <>
      <OfferBanner />
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
      <SplashScreen />
      <WelcomePopup/>
    </>
  );
}