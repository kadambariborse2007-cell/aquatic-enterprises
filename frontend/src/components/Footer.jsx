import { Link } from "react-router-dom";
import useBusiness from "../useBusiness";

export default function Footer() {
  const business = useBusiness();
  const phoneLink = business.phone.replace(/\s+/g, "");

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img src="/images/aquatic-logo.png" alt="Aquatic Enterprises" />
          <p>Water pumps, borewell solutions, installation, repair and after-sales support.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/products">Products &amp; Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h3>Contact</h3>
          <a href={`tel:${phoneLink}`}>{business.phone}</a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <p>{business.address}</p>
          {business.working_hours && <p>{business.working_hours}</p>}
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Aquatic Enterprises. All rights reserved.
        {" · "}
        <Link
          to="/admin/login"
          style={{
            display: "inline-block",
            marginLeft: "12px",
            padding: "6px 16px",
            border: "1px solid #00bac4",
            borderRadius: "20px",
            color: "#00bac4",
            fontSize: "15px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Staff Login
        </Link>
      </div>
    </footer>
  );
}