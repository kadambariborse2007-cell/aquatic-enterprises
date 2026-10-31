import { Link } from "react-router-dom";

export default function Footer() {
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
          <a href="tel:+919220770110">+91 9220770110</a>
          <a href="mailto:aquaticajay@gmail.com">aquaticajay@gmail.com</a>
          <p>Ganpatipada, Old Thane-Belapur Road, Thane - 400605</p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Aquatic Enterprises. All rights reserved.</div>
    </footer>
  );
}
