import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading.jsx";

const featuredProducts = [
  { title: "Borewell Submersible Pumps", image: "/images/borewell-submersible-pumps.jpg", icon: "💧" },
  { title: "Monobloc & Domestic Pumps", image: "/images/monobloc-domestic-pumps.jpg", icon: "⚙️" },
  { title: "Openwell & Vertical Pumps", image: "/images/openwell-vertical-pumps.jpg", icon: "🔧" },
];

const services = [
  ["⚙️", "Installation", "Pump selection guidance and professional installation."],
  ["🔧", "Repair & Servicing", "Pump, motor and control-panel repair support."],
  ["💧", "Borewell Services", "Drilling, flushing, cleaning and maintenance."],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-shade" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">WATER PUMPS &amp; BOREWELL EXPERTS <span /></div>
            <h1>Reliable Pumps for a <strong>Sustainable Tomorrow</strong></h1>
            <p>We provide water pump solutions, borewell drilling, installation and expert servicing for residential, agricultural and industrial needs.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/products">Explore Products <span>→</span></Link>
              <Link className="button button-outline" to="/about">Discover Our Company</Link>
            </div>
            <div className="trust-row">
              <div className="trust-item"><b>♢</b><span><strong>Trusted Brands</strong><small>KSB · Lakshmi · More</small></span></div>
              <div className="trust-item"><b>⚙</b><span><strong>Expert Installation</strong><small>Professional Team</small></span></div>
              <div className="trust-item"><b>♧</b><span><strong>Reliable Service</strong><small>After-Sales Support</small></span></div>
            </div>
          </div>
          <div className="hero-handwriting">Pumps for<br />Every Need<span /></div>
        </div>
      </section>

      <section className="section products-preview">
        <SectionHeading eyebrow="OUR PRODUCT RANGE" title="Solutions for Every Application" description="From borewells to buildings, find a pump for your needs." />
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <Link className="product-card" to="/products/new-pumps" key={product.title}>
              <div className="product-image"><img src={product.image} alt={product.title} loading="lazy" /></div>
              <div className="product-info"><span className="round-icon">{product.icon}</span><span>{product.title}</span><b className="card-arrow">→</b></div>
            </Link>
          ))}
        </div>
        <div className="center-action"><Link className="button button-primary" to="/products">View All Products &amp; Services →</Link></div>
      </section>

      <section className="section service-preview">
        <SectionHeading eyebrow="HOW WE HELP" title="Support Beyond the Sale" description="Practical help for pump selection, installation and maintenance." />
        <div className="service-grid">
          {services.map(([icon, title, desc]) => <article className="service-card" key={title}><span className="round-icon">{icon}</span><h3>{title}</h3><p>{desc}</p></article>)}
        </div>
        <div className="center-action"><Link className="button button-outline-dark" to="/products/services">Explore Services →</Link></div>
      </section>

      <section className="cta-band">
        <div><span className="eyebrow">AQUATIC ENTERPRISES · SINCE 1980</span><h2>Need help choosing the right solution?</h2><p>Tell us what you need and our team can guide you.</p></div>
        <Link className="button button-primary" to="/contact">Contact Us →</Link>
      </section>
    </>
  );
}
