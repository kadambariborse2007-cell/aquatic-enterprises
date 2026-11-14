import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";

const API_BASE = "http://127.0.0.1:8001";

// Optional Google review link. Replace YOUR_PLACE_ID, or leave "" to hide the button.
const GOOGLE_REVIEW_URL = "";
// e.g. "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"

function Stars({ rating }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={n <= value ? "on" : ""}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function RatingSummary({ summary }) {
  return (
    <div className="review-summary">
      <div className="summary-score">
        <strong>{summary.average}</strong>
        <span>/ 5</span>
        <Stars rating={Math.round(summary.average)} />
        <small>
          Based on {summary.count} review{summary.count === 1 ? "" : "s"}
        </small>
      </div>

      <div className="summary-bars">
        {[5, 4, 3, 2, 1].map((star) => {
          const total = summary.breakdown[String(star)] || 0;
          const percent = summary.count ? Math.round((total / summary.count) * 100) : 0;
          return (
            <div className="bar-row" key={star}>
              <span>{star} ★</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${percent}%` }} />
              </div>
              <span>{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewForm({ onSubmitted }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (rating === 0) {
      setMessage({ type: "error", text: "Please choose a star rating." });
      return;
    }

    setSending(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? result.detail
            : "Could not submit your review. Please check the details and try again."
        );
      }

      setMessage({ type: "success", text: result.message });
      setName("");
      setRating(0);
      setComment("");
      onSubmitted?.();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>

      <label>
        Your name
        <input
          required
          minLength={2}
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
        />
      </label>

      <div className="review-form-rating">
        Your rating
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <label>
        Your experience
        <textarea
          required
          minLength={5}
          maxLength={1000}
          rows="4"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Tell us about the product or service..."
        />
      </label>

      <button type="submit" className="review-submit" disabled={sending}>
        {sending ? "Submitting..." : "Submit Review"}
      </button>

      {message && (
        <p role="status" className={`form-message ${message.type}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [reviewsError, setReviewsError] = useState(false);

  async function loadReviews() {
    try {
      const [listResponse, summaryResponse] = await Promise.all([
        fetch(`${API_BASE}/reviews`),
        fetch(`${API_BASE}/reviews/summary`),
      ]);

      if (!listResponse.ok || !summaryResponse.ok) {
        throw new Error("Failed to load reviews");
      }

      setReviews(await listResponse.json());
      setSummary(await summaryResponse.json());
      setReviewsError(false);
    } catch (error) {
      console.error("Reviews error:", error);
      setReviewsError(true);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <section className="section shop-reviews">
      <SectionHeading
        eyebrow="CUSTOMER REVIEWS"
        title="What Customers Say"
        description="Reviews are checked before they appear on the website."
      />

      {summary && summary.count > 0 && <RatingSummary summary={summary} />}

      {reviews.length > 0 && (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <Stars rating={review.rating} />
              <p>“{review.comment}”</p>
              <strong>{review.name}</strong>
              <small className="review-date">
                {new Date(review.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </small>
            </article>
          ))}
        </div>
      )}

      <ReviewForm onSubmitted={loadReviews} />

      {GOOGLE_REVIEW_URL && (
        <div className="reviews-cta">
          <a
            className="review-button"
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            ★ Also review us on Google
          </a>
        </div>
      )}
    </section>
  );
}