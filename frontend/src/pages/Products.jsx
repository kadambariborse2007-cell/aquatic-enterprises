import { useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading.jsx";
import ProductCategories from "../components/productCategories.jsx";

const tabs = [
  { id: "pumps", label: "New Pumps", path: "/products/new-pumps" },
  { id: "service", label: "Repair & Servicing", path: "/products/services" },
  { id: "parts", label: "Spare Parts", path: "/products/spare-parts" },
];

const services = [
  {
    icon: "🔧",
    title: "Pump & Motor Repair",
    description: "Enquire about pump and motor faults.",
    points: [
      "Motor rewinding",
      "Bearing and mechanical seal replacement",
      "Capacitor replacement",
      "Impeller repair",
    ],
  },
  {
    icon: "⚙️",
    title: "Installation & Inspection",
    description: "Get assistance with pump installation and checks.",
    points: [
      "New pump installation",
      "Replacement of existing pumps",
      "Pipe and valve fitting",
      "Pump performance checks",
    ],
  },
  {
    icon: "💧",
    title: "Borewell Maintenance",
    description: "Enquire about borewell pump maintenance.",
    points: [
      "Pump removal and reinstallation",
      "Cable replacement",
      "Borewell cleaning and flushing",
      "Starter and panel checks",
    ],
  },
];

const commonProblems = [
  { icon: "⏻", title: "Pump won't start" },
  { icon: "💧", title: "No water coming out" },
  { icon: "📉", title: "Low water pressure" },
  { icon: "🔊", title: "Noise or vibration" },
  { icon: "🌡️", title: "Motor overheating" },
  { icon: "🛠️", title: "Water leakage" },
];

const processSteps = [
  {
    number: "01",
    title: "Call or Enquire",
    description: "Tell us about your pump and the problem you're facing.",
  },
  {
    number: "02",
    title: "Inspection",
    description: "The inspection requirements can be discussed with our team.",
  },
  {
    number: "03",
    title: "Quotation",
    description: "Confirm the repair requirements and quotation before proceeding.",
  },
  {
    number: "04",
    title: "Repair & Delivery",
    description: "Confirm the repair plan and expected completion time with the team.",
  },
];

const spareParts = [
  {
    icon: "⚙️",
    title: "Impeller & Diffuser",
    description: "For enquiries about impellers and diffusers.",
  },
  {
    icon: "⭕",
    title: "Mechanical Seal",
    description: "Ask about replacement mechanical seals.",
  },
  {
    icon: "🔩",
    title: "Bearings",
    description: "Enquire about suitable pump and motor bearings.",
  },
  {
    icon: "🔌",
    title: "Motor & Winding Parts",
    description: "Ask about motor components and winding parts.",
  },
  {
    icon: "⚡",
    title: "Capacitor & Starter",
    description: "Enquire about capacitors and pump starters.",
  },
  {
    icon: "🔗",
    title: "Cable & Panel",
    description: "Ask about cables and control-panel components.",
  },
  {
    icon: "🚰",
    title: "NRV & Valves",
    description: "Enquire about non-return valves and related parts.",
  },
  {
    icon: "📊",
    title: "Pressure Switch & Gauge",
    description: "Ask about pressure-control components for booster systems.",
  },
  {
    icon: "🌊",
    title: "Float Switch",
    description: "Enquire about float switches for sewage pump systems.",
  },
];

const enquiryDetails = [
  "Pump brand and model",
  "Pump HP and single-phase or three-phase supply",
  "Part name or part number",
  "A clear photo of the existing part",
];

const faqs = [
  {
    question: "How long does pump repair take?",
    answer:
      "Repair time depends on the fault, inspection findings and part availability. Contact the team to discuss the expected timeline.",
  },
  {
    question: "Is on-site service available?",
    answer:
      "Contact the team to confirm whether on-site inspection or repair is available for your location.",
  },
  {
    question: "Is a repair warranty available?",
    answer:
      "Please confirm the applicable warranty terms with the team before approving a repair.",
  },
  {
    question: "How do I know if my pump needs repair?",
    answer:
      "A pump that won't start, delivers little or no water, makes unusual noises, overheats or leaks may need inspection.",
  },
];

const sparePartFaqs = [
  {
    question: "Can I enquire about parts for an older pump?",
    answer:
      "Yes, you can submit an enquiry. Share the pump's nameplate photo and available model details so the team can check compatibility and availability.",
  },
  {
    question: "Are the parts original or compatible alternatives?",
    answer:
      "Part type and compatibility should be confirmed with the team for your specific pump model.",
  },
  {
    question: "Can you install the spare part?",
    answer:
      "Contact the team to confirm whether installation or repair assistance is available for your requirement.",
  },
];

function ContactActions({ type = "service" }) {
  const isParts = type === "parts";

  const message = isParts
    ? "Hello, I would like to enquire about a pump spare part."
    : "Hello, I would like to enquire about pump repair or servicing.";

  return (
    <div className="contact-actions">
      <Link
        className="button button-primary"
        to={`/contact?type=${type}`}
      >
        {isParts ? "Enquire About Parts" : "Request Repair / Service"} →
      </Link>

      <a
        className="button button-outline-dark"
        href="tel:+919220770110"
      >
        ☎ Call Now
      </a>

      <a
        className="button button-whatsapp"
        href={`https://wa.me/919220770110?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp ↗
      </a>
    </div>
  );
}

function FAQSection({ items, title = "Frequently Asked Questions" }) {
  return (
    <section className="content-section">
      <SectionHeading
        eyebrow="NEED TO KNOW?"
        title={title}
        description="Find answers to common questions or contact our team for clarification."
      />

      <div className="faq-list">
        {items.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function Products({ initialTab = "pumps" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <>
      <section className="page-banner compact-page-banner">
        <span className="eyebrow">PRODUCTS &amp; SERVICES</span>
        <h1>
          Solutions for <strong>Every Application</strong>
        </h1>
        <p>
          Explore pumps, request repair services or enquire about replacement
          spare parts.
        </p>
      </section>

      <section className="section products-page">
        <div
          className="category-tabs"
          role="tablist"
          aria-label="Product and service categories"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              className={
                activeTab === tab.id
                  ? "category-tab active"
                  : "category-tab"
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NEW PUMPS */}
        {activeTab === "pumps" && <ProductCategories />}

        {/* REPAIR & SERVICING */}
        {activeTab === "service" && (
          <div
            className="category-content"
            id="panel-service"
            role="tabpanel"
            aria-labelledby="tab-service"
          >
            <SectionHeading
              eyebrow="REPAIR & SERVICING"
              title="Keep Your Pump Working Reliably"
              description="From pump faults to installation enquiries, tell us what you need help with."
            />

            <div className="service-grid enhanced-grid">
              {services.map((service) => (
                <article className="service-card enhanced-card" key={service.title}>
                  <span className="round-icon" aria-hidden="true">
                    {service.icon}
                  </span>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>

                  <ul className="feature-list">
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  <Link
                    className="text-link"
                    to={`/contact?type=service&issue=${encodeURIComponent(service.title)}`}
                  >
                    Enquire About This Service →
                  </Link>
                </article>
              ))}
            </div>

            <section className="content-section">
              <SectionHeading
                eyebrow="WHAT'S THE PROBLEM?"
                title="Common Pump Problems"
                description="Choose the problem you're experiencing to send a more specific enquiry."
              />

              <div className="problem-grid">
                {commonProblems.map((problem) => (
                  <Link
                    className="problem-card"
                    key={problem.title}
                    to={`/contact?type=service&issue=${encodeURIComponent(problem.title)}`}
                  >
                    <span className="problem-icon" aria-hidden="true">
                      {problem.icon}
                    </span>
                    <span>{problem.title}</span>
                    <span className="problem-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="content-section">
              <SectionHeading
                eyebrow="OUR PROCESS"
                title="How It Works"
                description="Understand the typical steps involved in a service enquiry."
              />

              <div className="process-grid">
                {processSteps.map((step) => (
                  <article className="process-card" key={step.number}>
                    <span className="process-number">{step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="service-area-note">
              <span aria-hidden="true">📍</span>
              <div>
                <h3>Looking for service in your area?</h3>
                <p>
                  Contact us to confirm service availability in Thane and
                  nearby areas, along with working hours and the expected
                  response time.
                </p>
              </div>
            </div>

            <div className="contact-cta">
              <h3>Need help with your pump?</h3>
              <p>
                Tell us about the issue and ask the team about the next steps.
              </p>
              <ContactActions type="service" />
            </div>

            <FAQSection items={faqs} />
          </div>
        )}

        {/* SPARE PARTS */}
        {activeTab === "parts" && (
          <div
            className="category-content"
            id="panel-parts"
            role="tabpanel"
            aria-labelledby="tab-parts"
          >
            <SectionHeading
              eyebrow="SPARE PARTS"
              title="Find the Right Replacement Part"
              description="Choose a part and share your pump details to help the team check compatibility and availability."
            />

            <div className="parts-grid">
              {spareParts.map((part) => (
                <article className="part-card" key={part.title}>
                  <span className="part-icon" aria-hidden="true">
                    {part.icon}
                  </span>

                  <h3>{part.title}</h3>
                  <p>{part.description}</p>

                  <Link
                    className="text-link"
                    to={`/contact?type=parts&part=${encodeURIComponent(part.title)}`}
                  >
                    Enquire →
                  </Link>
                </article>
              ))}
            </div>

            <section className="content-section">
              <SectionHeading
                eyebrow="BEFORE YOU ENQUIRE"
                title="Details That Help Us Identify Your Part"
                description="Share as much of the following information as you can."
              />

              <div className="enquiry-info-grid">
                <div className="enquiry-checklist">
                  {enquiryDetails.map((detail) => (
                    <div className="checklist-item" key={detail}>
                      <span aria-hidden="true">✓</span>
                      <p>{detail}</p>
                    </div>
                  ))}
                </div>

                <aside className="model-guide">
                  <span className="round-icon" aria-hidden="true">
                    📋
                  </span>
                  <h3>Where can I find the model number?</h3>
                  <p>
                    Look for the nameplate attached to the pump or motor. It
                    may be a metal plate or a printed sticker containing
                    identification details.
                  </p>
                  <p>
                    If you cannot find the model number, send a clear photo of
                    the nameplate and the existing part.
                  </p>
                </aside>
              </div>
            </section>

            <div className="availability-note">
              <span aria-hidden="true">ℹ️</span>
              <p>
                Stock availability, compatible alternatives, delivery options
                and estimated timelines must be confirmed by the team for
                each enquiry.
              </p>
            </div>

            <div className="contact-cta">
              <h3>Looking for a specific spare part?</h3>
              <p>
                Share your pump details or a photo of the part to get started.
              </p>
              <ContactActions type="parts" />
            </div>

            <FAQSection
              items={sparePartFaqs}
              title="Spare Parts FAQs"
            />

            <div className="repair-cross-link">
              <div>
                <h3>Need help installing a spare part?</h3>
                <p>
                  Enquire about pump repair and servicing options.
                </p>
              </div>

              <button
                className="button button-outline-dark"
                type="button"
                onClick={() => setActiveTab("service")}
              >
                Explore Repair Services →
              </button>
            </div>
          </div>
        )}

        <div className="help-strip">
          <div>
            <h3>Not sure which category you need?</h3>
            <p>
              Tell us about your application and we'll help direct your enquiry.
            </p>
          </div>

          <Link className="button button-outline-dark" to="/contact">
            Contact Us →
          </Link>
        </div>
      </section>
    </>
  );
}