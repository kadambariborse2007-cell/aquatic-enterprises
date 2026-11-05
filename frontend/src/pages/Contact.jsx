import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading.jsx";

const API_URL = "http://127.0.0.1:8001/enquiries";
const WHATSAPP_NUMBER = "919220770110";
const EMAIL_ADDRESS = "aquaticajay@gmail.com";

const enquiryTypes = [
  { value: "pump", label: "New Pump Enquiry" },
  { value: "service", label: "Repair & Servicing" },
  { value: "parts", label: "Spare Parts Enquiry" },
  { value: "general", label: "General Enquiry" },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") || "general");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const requested = searchParams.get("type");

    if (requested && enquiryTypes.some((item) => item.value === requested)) {
      setType(requested);
    }
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();

    const method = event.nativeEvent.submitter?.value;

    if (method !== "whatsapp" && method !== "email") {
      return;
    }

    setSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    const selectedType =
      enquiryTypes.find((item) => item.value === type)?.label ||
      "General Enquiry";

    // Prepare complete enquiry message
    const enquiryMessage = `
Hello Aquatic Enterprises,

I would like to make an enquiry.

Enquiry Type: ${selectedType}

Customer Name: ${values.full_name}
Email: ${values.email}
Phone: ${values.phone}
Company: ${values.company || "Not provided"}

Pump Type / Application: ${values.pumpType || "Not provided"}
Quantity: ${values.quantity || "Not provided"}
Pump Model: ${values.pumpModel || "Not provided"}
Service Location: ${values.serviceLocation || "Not provided"}
Part Name: ${values.partName || "Not provided"}

Message:
${values.message}

Thank you.
    `.trim();

    // Open the selected sending option
    if (method === "whatsapp") {
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        enquiryMessage
      )}`;

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    } else {
      const subject = encodeURIComponent(`Aquatic Enterprises - ${selectedType}`);
      const body = encodeURIComponent(enquiryMessage);

      // Opens the mail app without leaving a blank tab behind
      window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
    }

    // Save the enquiry in PostgreSQL
    const databaseData = {
      enquiry_type: type,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      company: values.company || null,
      message: enquiryMessage,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(databaseData),
        keepalive: true,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Unable to save enquiry.");
      }

      setStatus(
        method === "whatsapp"
          ? "WhatsApp opened! Please review your message and press Send. Your enquiry has also been saved."
          : "Email opened! Please review your email and press Send. Your enquiry has also been saved."
      );
    } catch (error) {
      setStatus(
        method === "whatsapp"
          ? "WhatsApp opened. Please press Send. Database saving could not be confirmed."
          : "Email opened. Please press Send. Database saving could not be confirmed."
      );

      console.error("Enquiry database error:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-banner compact-page-banner">
        <span className="eyebrow">CONTACT AQUATIC ENTERPRISES</span>

        <h1>
          How Can We <strong>Help You?</strong>
        </h1>

        <p>
          Choose the type of enquiry and share a few details. Our team can
          follow up with you.
        </p>
      </section>

      <section className="section contact-page">
        <SectionHeading
          eyebrow="GET IN TOUCH"
          title="Send Us an Enquiry"
          description="Fill out the form below and choose WhatsApp or Email to send your enquiry."
        />

        <div className="contact-layout">
          <form className="enquiry-form" onSubmit={handleSubmit}>
            <label>
              Enquiry type
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                {enquiryTypes.map((item) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-row">
              <label>
                Full name
                <input
                  required
                  name="full_name"
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email address
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                Phone number
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="+91"
                />
              </label>

              <label>
                Company (optional)
                <input name="company" placeholder="Company name" />
              </label>
            </div>

            {type === "pump" && (
              <div className="form-row">
                <label>
                  Pump type / application
                  <input name="pumpType" placeholder="e.g. borewell pump" />
                </label>

                <label>
                  Quantity
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                  />
                </label>
              </div>
            )}

            {type === "service" && (
              <div className="form-row">
                <label>
                  Pump brand / model
                  <input name="pumpModel" placeholder="Brand and model" />
                </label>

                <label>
                  Service location
                  <input name="serviceLocation" placeholder="Area / city" />
                </label>
              </div>
            )}

            {type === "parts" && (
              <div className="form-row">
                <label>
                  Part name / number
                  <input name="partName" placeholder="Part name or number" />
                </label>

                <label>
                  Pump brand / model
                  <input name="pumpModel" placeholder="Brand and model" />
                </label>
              </div>
            )}

            <label>
              How can we help?
              <textarea
                required
                name="message"
                rows="5"
                placeholder={
                  type === "service"
                    ? "Describe the pump issue..."
                    : type === "parts"
                    ? "Describe the spare part you need..."
                    : type === "pump"
                    ? "Tell us about your pump requirements..."
                    : "Write your message..."
                }
              />
            </label>

            {/* TWO ENQUIRY BUTTONS */}
            <div className="enquiry-actions">
              <button
                className="enquiry-send-button whatsapp"
                type="submit"
                name="sendMethod"
                value="whatsapp"
                disabled={submitting}
              >
                <span>●</span>
                Send via WhatsApp →
              </button>

              <button
                className="enquiry-send-button email"
                type="submit"
                name="sendMethod"
                value="email"
                disabled={submitting}
              >
                <span>✉</span>
                Send via Email →
              </button>
            </div>

            {status && (
              <p role="status" aria-live="polite" className="enquiry-status">
                {status}
              </p>
            )}

            <p className="form-note">
              Please don't include passwords or sensitive personal information
              in this form.
            </p>
          </form>

          {/* CONTACT DETAILS */}
          <aside className="contact-card">
            <h3>Contact Details</h3>

            <p>
              <strong>Phone</strong>
              <br />
              <a href="tel:+919220770110">+91 9220770110</a>
            </p>

            <p>
              <strong>Email</strong>
              <br />
              <a href="mailto:aquaticajay@gmail.com">aquaticajay@gmail.com</a>
            </p>

            <p>
              <strong>WhatsApp</strong>
              <br />
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                Chat with us on WhatsApp →
              </a>
            </p>

            <p>
              <strong>Location</strong>
              <br />
              Ganpatipada, Old Thane-Belapur Road, Near Hindalco Company, Opp.
              Vitawa, Thane - 400605
            </p>

            <div className="contact-note">
              <strong>What happens next?</strong>

              <p>
                Choose WhatsApp or Email to send your enquiry. Our team can
                review your details and get back to you.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
