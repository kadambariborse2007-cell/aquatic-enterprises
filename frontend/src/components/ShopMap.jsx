import { useEffect, useState } from "react";

// ====== EDIT THESE ======
const SHOP_NAME = "Aquatic Enterprises";
const SHOP_ADDRESS =
  "Ganpatipada, Old Thane-Belapur Road, Near Hindalco Company, Opp. Vitawa, Thane - 400605";

// 0 = Sunday ... 6 = Saturday. Use "HH:MM" in 24-hour format, or null if closed.
const HOURS = {
  0: null,                    // Sunday
  1: ["09:30", "18:30"],      // Monday
  2: ["09:30", "18:30"],      // Tuesday
  3: ["09:30", "18:30"],      // Wednesday
  4: ["09:30", "18:30"],      // Thursday
  5: ["09:30", "18:30"],      // Friday
  6: ["09:30", "16:30"],      // Saturday
};
// ========================

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];
const SHORT_TO_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${SHOP_NAME}, ${SHOP_ADDRESS}`
)}&output=embed`;

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${SHOP_NAME}, ${SHOP_ADDRESS}`
)}`;

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// Current day + time in India, whatever the visitor's own timezone is
function getIndiaNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type)?.value;

  return {
    day: SHORT_TO_INDEX[get("weekday")],
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function getShopStatus() {
  const { day, minutes } = getIndiaNow();
  const today = HOURS[day];

  if (today) {
    const open = toMinutes(today[0]);
    const close = toMinutes(today[1]);

    if (minutes >= open && minutes < close) {
      return { isOpen: true, text: `Open now · Closes at ${formatTime(today[1])}`, day };
    }
    if (minutes < open) {
      return { isOpen: false, text: `Closed · Opens today at ${formatTime(today[0])}`, day };
    }
  }

  // Closed for today: find the next opening day
  for (let i = 1; i <= 7; i += 1) {
    const nextDay = (day + i) % 7;
    const next = HOURS[nextDay];
    if (next) {
      const when = i === 1 ? "tomorrow" : DAY_NAMES[nextDay];
      return { isOpen: false, text: `Closed · Opens ${when} at ${formatTime(next[0])}`, day };
    }
  }

  return { isOpen: false, text: "Closed", day };
}

export default function ShopMap() {
  const [status, setStatus] = useState(getShopStatus);

  // Refresh the open/closed status every minute
  useEffect(() => {
    const timer = setInterval(() => setStatus(getShopStatus()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section shop-map">
      <div className="shop-map-header">
        <h2>Visit Our Shop</h2>

        <p
          className={`shop-status ${status.isOpen ? "open" : "closed"}`}
          role="status"
          aria-live="polite"
        >
          <span className="shop-status-dot" />
          {status.text}
        </p>
      </div>

      <div className="shop-map-layout">
        <div className="shop-map-frame">
          <iframe
            title={`${SHOP_NAME} location on map`}
            src={MAP_EMBED_URL}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <aside className="shop-map-info">
          <h3>Opening Hours</h3>

          <ul className="shop-hours">
            {DAY_NAMES.map((name, index) => (
              <li key={name} className={index === status.day ? "today" : ""}>
                <span>{name}</span>
                <span>
                  {HOURS[index]
                    ? `${formatTime(HOURS[index][0])} – ${formatTime(HOURS[index][1])}`
                    : "Closed"}
                </span>
              </li>
            ))}
          </ul>

          <p className="shop-address">{SHOP_ADDRESS}</p>

          <a
            className="shop-directions"
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions →
          </a>
        </aside>
      </div>
    </section>
  );
}
