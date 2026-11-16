import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBanner } from "../api";

export default function WelcomePopup() {
  const [banner, setBanner] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("welcomePopupSeen")) return;

    let active = true;
    let timer;

    fetchBanner()
      .then((data) => {
        if (!active) return;
        if (data && data.active && data.message) {
          setBanner(data);
          timer = setTimeout(() => setOpen(true), 3800);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  function close() {
    sessionStorage.setItem("welcomePopupSeen", "1");
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !banner) return null;

  const link = banner.link || "";
  const isInternal = link.startsWith("/");

  return (
    <div className="welcome-overlay" onClick={close}>
      <div
        className="welcome-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="welcome-close" onClick={close} aria-label="Close">
          ×
        </button>

        <div className="welcome-icon">💧</div>
        <span className="welcome-tag">AQUATIC ENTERPRISES</span>
        <h2>Special Offer</h2>
        <p>{banner.message}</p>

        <div className="welcome-actions">
          {link &&
            (isInternal ? (
              <Link to={link} className="button button-primary" onClick={close}>
                Know More
              </Link>
            ) : (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary"
                onClick={close}
              >
                Know More
              </a>
            ))}
          <button className="button welcome-later" onClick={close}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}