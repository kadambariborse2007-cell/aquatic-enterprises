
import { useEffect, useState } from "react";

const TITLE = "AQUATIC ENTERPRISES";
const TAGLINE = "TRUSTED SINCE 1982";

export default function SplashScreen() {
  const [visible, setVisible] = useState(
    () => !sessionStorage.getItem("splashSeen")
  );
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (!visible) return;

    sessionStorage.setItem("splashSeen", "1");
    document.body.style.overflow = "hidden";

    const hideTimer = setTimeout(() => setHiding(true), 2600);
    const removeTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 3300);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={hiding ? "splash splash-hide" : "splash"}>
      <div className="splash-center">

        <div className="splash-ring">
          <div className="splash-logo">
            <img
              src="/images/aquatic-logo1.jpg"
              alt="Aquatic Enterprises"
            />
          </div>
        </div>

        <h1 className="splash-title">
          {TITLE.split("").map((ch, i) => (
            <span
              key={i}
              style={{ animationDelay: `${0.6 + i * 0.045}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>

        <div className="splash-tagline">
          {TAGLINE.split("").map((ch, i) => (
            <span
              key={i}
              style={{ animationDelay: `${1.5 + i * 0.04}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>

        <div className="splash-bar">
          <span />
        </div>

      </div>
    </div>
  );
}
