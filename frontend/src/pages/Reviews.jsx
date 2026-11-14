import ReviewsSection from "../components/ReviewsSection.jsx";

export default function Reviews() {
  return (
    <>
      <section className="page-banner compact-page-banner">
        <span className="eyebrow">REVIEWS</span>

        <h1>
          Customer <strong>Reviews</strong>
        </h1>

        <p>See what our customers say, or share your own experience.</p>
      </section>

      <ReviewsSection />
    </>
  );
}