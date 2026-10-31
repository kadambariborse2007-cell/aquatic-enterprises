import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading.jsx";

const specialties = [
  ["💧", "Submersible Pumps"], ["⚙️", "Dewatering Pumps"], ["🔧", "Vertical Pumps"],
  ["🏠", "Monobloc Pumps"], ["🔌", "Control Panels"], ["🛠️", "Pump Repair & Installation"],
  ["🚰", "Tube Wells"], ["💦", "Borewells"],
];

export default function About() {
  return (
    <>
      <section className="page-banner compact-page-banner"><span className="eyebrow">ABOUT OUR COMPANY</span><h1>A Legacy of Trust <strong>Since 1982</strong></h1><p>Experience, technical knowledge and customer-first service for water pump and borewell requirements.</p></section>
      <section className="section about-section">
        <div className="about-container">
          <div className="about-image"><img src="/images/owner.jpeg" alt="Tanaji (Ajay) Kamble, Proprietor of Aquatic Enterprises" /><div className="owner-label"><h3>Tanaji (Ajay) Kamble</h3><p>Proprietor, Aquatic Enterprises</p></div></div>
          <div className="about-content">
            <span className="about-tag">OUR STORY</span>
            <h2>Built on Experience and Trust</h2>
            <p>Aquatic Enterprises was founded by Shree Pandit B. Kamble in 1982. The company specializes in water pumps and borewell solutions, with a focus on quality work and customer satisfaction.</p>
            <p>Today, Tanaji (Ajay) Kamble is the proprietor. Our experienced technical personnel provide pump installation, borewell services, repairs and after-sales support across Mumbai, Navi Mumbai and Thane.</p>
            <h3>Our Mission</h3><p>To deliver a high level of customer satisfaction through quality output, cost-effective services and real value for money.</p>
            <div className="about-features"><div><strong>1982</strong><span>Year Established</span></div><div><strong>Expert</strong><span>Technical Team</span></div><div><strong>Reliable</strong><span>Service &amp; Support</span></div></div>
          </div>
        </div>
      </section>
      <section className="section soft-section">
        <SectionHeading eyebrow="OUR JOURNEY" title="The Beginning of Aquatic Enterprises" description="Founded in 1982 to provide practical solutions for water-related problems." />
        <div className="history-card"><div className="history-year">1982</div><div><h3>A customer-first foundation</h3><p>From water pumps and borewells to installation and customer service, the business has grown around helping customers find reliable water solutions.</p></div></div>
      </section>
      <section className="section">
        <SectionHeading eyebrow="OUR SPECIALTIES" title="What We Specialize In" description="Pump solutions and borewell services for different water requirements." />
        <div className="specialty-grid">{specialties.map(([icon, title]) => <article className="specialty-card" key={title}><span>{icon}</span><h3>{title}</h3></article>)}</div>
      </section>
      <section className="cta-band"><div><span className="eyebrow">LET'S WORK TOGETHER</span><h2>Explore the right pump for your needs</h2><p>Browse our product categories or contact us for guidance.</p></div><div className="hero-actions"><Link className="button button-primary" to="/products">Explore Products →</Link><Link className="button button-outline" to="/contact">Contact Us →</Link></div></section>
    </>
  );
}
