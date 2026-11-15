import { useState } from "react";
import ShopMap from "../components/ShopMap.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

// Put your shop photos in: frontend/public/shop/
// Photos that are missing are hidden automatically.
const PHOTOS = [
  { src: "/shop/shop1.jpg", alt: "Shop front" },
  { src: "/shop/shop2.jpg", alt: "Water pumps on display" },
  { src: "/shop/shop3.jpg", alt: "Repair and servicing workshop" },
  { src: "/shop/shop4.jpg", alt: "Spare parts section" },
];

export default function Shop() {
  const [activePhoto, setActivePhoto] = useState(null);
  const [hidden, setHidden] = useState([]);

  const visiblePhotos = PHOTOS.filter((photo) => !hidden.includes(photo.src));

  return (
    <>
      <section className="page-banner compact-page-banner">
        <span className="eyebrow">VISIT US</span>

        <h1>
          Find <strong>Our Shop</strong>
        </h1>

        <p>
          See our location, check if we are open right now, and take a look
          at the shop before you visit.
        </p>
      </section>

      {/* MAP + OPEN / CLOSED */}
      <ShopMap />

      {/* PHOTO GALLERY */}
      {visiblePhotos.length > 0 && (
        <section className="section shop-gallery">
          <SectionHeading
            eyebrow="INSIDE THE SHOP"
            title="Shop Photos"
            description="A quick look at our shop, products and workshop."
          />

          <div className="gallery-grid">
            {visiblePhotos.map((photo) => (
              <button
                type="button"
                key={photo.src}
                className="gallery-item"
                onClick={() => setActivePhoto(photo)}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  onError={() => setHidden((prev) => [...prev, photo.src])}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* REVIEWS */}
      <ReviewsSection />

      {/* ENLARGED PHOTO */}
      {activePhoto && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.alt}
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close photo"
            onClick={() => setActivePhoto(null)}
          >
            ×
          </button>
          <img src={activePhoto.src} alt={activePhoto.alt} />
        </div>
      )}
    </>
  );
}
