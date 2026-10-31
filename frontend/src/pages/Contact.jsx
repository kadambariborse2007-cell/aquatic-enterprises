import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading.jsx";

const enquiryTypes = [
  { value: "pump", label: "New Pump Enquiry" },
  { value: "service", label: "Repair & Servicing" },
  { value: "parts", label: "Spare Parts Enquiry" },
  { value: "general", label: "General Enquiry" },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") || "general");

  useEffect(() => {
    const requested = searchParams.get("type");
    if (requested && enquiryTypes.some((item) => item.value === requested)) setType(requested);
  }, [searchParams]);

  function handleSubmit(event) {
    event.preventDefault();
    window.alert("This is the frontend form preview. It will submit and email the owner after the backend is built.");
  }

  return (
    <>
      <section className="page-banner compact-page-banner"><span className="eyebrow">CONTACT AQUATIC ENTERPRISES</span><h1>How Can We <strong>Help You?</strong></h1><p>Choose the type of enquiry and share a few details. Our team can follow up with you.</p></section>
      <section className="section contact-page">
        <SectionHeading eyebrow="GET IN TOUCH" title="Send Us an Enquiry" description="The form below is currently frontend-only. We will connect it to FastAPI and email later." />
        <div className="contact-layout">
          <form className="enquiry-form" onSubmit={handleSubmit}>
            <label>Enquiry type
              <select value={type} onChange={(event) => setType(event.target.value)}>
                {enquiryTypes.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
              </select>
            </label>
            <div className="form-row">
              <label>Full name<input required name="name" placeholder="Your full name" /></label>
              <label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label>
            </div>
            <div className="form-row">
              <label>Phone number<input required type="tel" name="phone" placeholder="+91" /></label>
              <label>Company (optional)<input name="company" placeholder="Company name" /></label>
            </div>
            {type === "pump" && <div className="form-row"><label>Pump type / application<input name="pumpType" placeholder="e.g. borewell pump" /></label><label>Quantity<input name="quantity" type="number" min="1" placeholder="1" /></label></div>}
            {type === "service" && <div className="form-row"><label>Pump brand / model<input name="pumpModel" placeholder="Brand and model if known" /></label><label>Service location<input name="serviceLocation" placeholder="Area / city" /></label></div>}
            {type === "parts" && <div className="form-row"><label>Part name / number<input name="partName" placeholder="Part name or number" /></label><label>Pump brand / model<input name="pumpModel" placeholder="Brand and model if known" /></label></div>}
            <label>How can we help?<textarea required name="message" rows="5" placeholder={type === "service" ? "Describe the pump issue..." : type === "parts" ? "Describe the spare part you need..." : type === "pump" ? "Tell us about your pump requirements..." : "Write your message..."} /></label>
            <button className="button button-primary" type="submit">Submit Enquiry →</button>
            <p className="form-note">Please don't include passwords or sensitive personal information in this form.</p>
          </form>
          <aside className="contact-card">
            <h3>Contact Details</h3>
            <p><strong>Phone</strong><br /><a href="tel:+919220770110">+91 9220770110</a></p>
            <p><strong>Email</strong><br /><a href="mailto:aquaticajay@gmail.com">aquaticajay@gmail.com</a></p>
            <p><strong>Location</strong><br />Ganpatipada, Old Thane-Belapur Road, Near Hindalco Company, Opp. Vitawa, Thane - 400605</p>
            <div className="contact-note"><strong>What happens next?</strong><p>After the backend is connected, your enquiry will be saved securely and the owner will receive an email notification.</p></div>
          </aside>
        </div>
      </section>
    </>
  );
}
