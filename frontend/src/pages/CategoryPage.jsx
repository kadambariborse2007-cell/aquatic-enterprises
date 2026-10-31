import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { categories } from "../data/categories";
import "../components/products.css";

export default function CategoryPage() {
  const { slug } = useParams();
  const cat = categories.find((c) => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!cat) {
    return (
      <p style={{ padding: 40 }}>
        Category not found. <Link to="/products">Back</Link>
      </p>
    );
  }

  return (
    <section className="cat-section">
      <Link className="back-btn" to="/products">← Back</Link>

      <div className="cat-hero">
        <img src={cat.image} alt={cat.name} />
        <div>
          <h2>{cat.name}</h2>
          <p className="cat-tagline">{cat.tagline}</p>
          <p className="cat-desc">{cat.description}</p>
          <p className="cat-price">Approx. price: <b>{cat.price}</b></p>
        </div>
      </div>

      <h3 className="cat-sub">Best Used For</h3>
      <div className="chip-row">
        {cat.applications.map((a) => (
          <span className="chip" key={a}>{a}</span>
        ))}
      </div>

      <h3 className="cat-sub">Available Series</h3>
      <div className="table-wrap">
        <table className="series-table">
          <thead>
            <tr><th>Series</th><th>Power</th><th>Details</th></tr>
          </thead>
          <tbody>
            {cat.series.map((s) => (
              <tr key={s.name}>
                <td><b>{s.name}</b></td>
                <td>{s.hp}</td>
                <td>{s.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}