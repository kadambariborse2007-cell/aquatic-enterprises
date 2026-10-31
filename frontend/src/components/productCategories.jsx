import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import "./products.css";

export default function ProductCategories() {
  return (
    <section className="cat-section">
      <h2>Our Products</h2>
      <div className="cat-list">
        {categories.map((c, i) => (
          <article className={`cat-row ${i % 2 ? "reverse" : ""}`} key={c.slug}>
            <div className="cat-img">
              <img src={c.image} alt={c.name} />
            </div>
            <div className="cat-info">
              <h3>{c.name}</h3>
              <p className="cat-tagline">{c.tagline}</p>
              <p className="cat-desc">{c.description}</p>
              <ul className="cat-points">
                {c.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p className="cat-price">Approx. price: <b>{c.price}</b></p>
              <Link className="cat-btn" to={`/category/${c.slug}`}>Explore more products</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}