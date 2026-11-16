import { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addModel,
  updateModel,
  deleteModel,
  uploadImage,
  imageUrl,
} from "../api";

function Field({ label, value, onChange, multiline }) {
  return (
    <label style={styles.label}>
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={styles.input}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
      )}
    </label>
  );
}

const EMPTY_CATEGORY = {
  slug: null,
  name: "",
  image: "",
  tagline: "",
  description: "",
  price: "",
  highlights: "",
  applications: "",
};

export default function ProductsManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [openSlug, setOpenSlug] = useState("");
  const [categoryForm, setCategoryForm] = useState(null);
  const [modelForm, setModelForm] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (e) {
      setError("Could not load products. Check that the backend is running.");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startNewCategory() {
    setError("");
    setNotice("");
    setModelForm(null);
    setCategoryForm({ ...EMPTY_CATEGORY });
  }

  function startEditCategory(category) {
    setError("");
    setNotice("");
    setModelForm(null);
    setCategoryForm({
      slug: category.slug,
      name: category.name,
      image: category.image,
      tagline: category.tagline,
      description: category.description,
      price: category.price,
      highlights: category.highlights.join("\n"),
      applications: category.applications.join("\n"),
    });
  }

  async function saveCategory() {
    setError("");
    setNotice("");

    if (categoryForm.name.trim().length < 2) {
      setError("Please enter a category name (at least 2 letters).");
      return;
    }

    const data = {
      name: categoryForm.name,
      image: categoryForm.image,
      tagline: categoryForm.tagline,
      description: categoryForm.description,
      price: categoryForm.price,
      highlights: categoryForm.highlights.split("\n"),
      applications: categoryForm.applications.split("\n"),
    };

    try {
      if (categoryForm.slug) {
        await updateCategory(categoryForm.slug, data);
        setNotice("Category saved.");
      } else {
        await createCategory(data);
        setNotice("New category added. It now shows on your Products page.");
      }

      setCategoryForm(null);
      load();
    } catch (e) {
      setError("Could not save the category. If it still fails, log out and log in again.");
    }
  }

  async function removeCategory(slug, name) {
    const sure = window.confirm(
      `Delete the category "${name}" and ALL its models permanently?`
    );
    if (!sure) return;

    setError("");
    setNotice("");

    try {
      await deleteCategory(slug);
      setCategoryForm(null);
      setOpenSlug("");
      setNotice("Category deleted.");
      load();
    } catch (e) {
      setError("Could not delete the category. Please try again.");
    }
  }

  function startModelForm(slug, model) {
    setError("");
    setNotice("");
    setCategoryForm(null);
    setModelForm({
      slug,
      id: model ? model.id : null,
      name: model ? model.name : "",
      hp: model ? model.hp : "",
      info: model ? model.info : "",
    });
  }

  async function saveModel() {
    setError("");
    setNotice("");

    if (!modelForm.name.trim()) {
      setError("Please enter a model name.");
      return;
    }

    const data = {
      name: modelForm.name,
      hp: modelForm.hp,
      info: modelForm.info,
    };

    try {
      if (modelForm.id) {
        await updateModel(modelForm.id, data);
      } else {
        await addModel(modelForm.slug, data);
      }

      setModelForm(null);
      setNotice("Model saved.");
      load();
    } catch (e) {
      setError("Could not save the model. If it still fails, log out and log in again.");
    }
  }

  async function removeModel(model) {
    const sure = window.confirm(`Delete "${model.name}" permanently?`);
    if (!sure) return;

    setError("");
    setNotice("");

    try {
      await deleteModel(model.id);
      setNotice("Model deleted.");
      load();
    } catch (e) {
      setError("Could not delete the model. Please try again.");
    }
  }

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setNotice("");
    setUploading(true);

    try {
      const result = await uploadImage(file);
      setCategoryForm((current) => ({ ...current, image: result.path }));
      setNotice("Image uploaded. Now click Save category.");
    } catch (e) {
      setError(e.message || "Could not upload the image.");
    }

    setUploading(false);
    event.target.value = "";
  }

  function renderCategoryForm() {
    const isNew = !categoryForm.slug;

    return (
      <div style={styles.form}>
        <h4 style={{ margin: 0 }}>
          {isNew ? "Add new category" : "Edit category"}
        </h4>

        <Field label="Name" value={categoryForm.name} onChange={(v) => setCategoryForm({ ...categoryForm, name: v })} />
        <Field label="Price text (example: ₹ 4,500 – 9,000)" value={categoryForm.price} onChange={(v) => setCategoryForm({ ...categoryForm, price: v })} />
        <Field label="Tagline" value={categoryForm.tagline} onChange={(v) => setCategoryForm({ ...categoryForm, tagline: v })} />
        <Field label="Image path (example: /images/booster-pressure-systems.jpg)" value={categoryForm.image} onChange={(v) => setCategoryForm({ ...categoryForm, image: v })} />

        <div style={styles.uploadBox}>
          <label style={styles.uploadButton}>
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
          <span style={styles.small}>
            JPG, PNG or WEBP, up to 5 MB. The path above fills in automatically.
          </span>
        </div>

        {categoryForm.image && (
          <img
            src={imageUrl(categoryForm.image)}
            alt="Preview"
            style={styles.preview}
          />
        )}

        <Field multiline label="Description" value={categoryForm.description} onChange={(v) => setCategoryForm({ ...categoryForm, description: v })} />
        <Field multiline label="Highlights (one per line)" value={categoryForm.highlights} onChange={(v) => setCategoryForm({ ...categoryForm, highlights: v })} />
        <Field multiline label="Applications (one per line)" value={categoryForm.applications} onChange={(v) => setCategoryForm({ ...categoryForm, applications: v })} />

        <div style={styles.row}>
          <button style={styles.greenButton} onClick={saveCategory}>
            {isNew ? "Add category" : "Save category"}
          </button>
          <button style={styles.lightButton} onClick={() => setCategoryForm(null)}>
            Cancel
          </button>
          {!isNew && (
            <button
              style={styles.redButton}
              onClick={() => removeCategory(categoryForm.slug, categoryForm.name)}
            >
              Delete category
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.top}>
        <div>
          <h2>Products</h2>
          <p>Edit categories and pump models shown on your website.</p>
        </div>

        <button style={styles.greenButton} onClick={startNewCategory}>
          + Add new category
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {notice && <p style={styles.notice}>{notice}</p>}
      {loading && <p>Loading products...</p>}

      {categoryForm && !categoryForm.slug && (
        <div style={styles.card}>{renderCategoryForm()}</div>
      )}

      {categories.map((category) => (
        <div key={category.slug} style={styles.card}>
          <div style={styles.top}>
            <div>
              <strong>{category.name}</strong>
              <div style={styles.small}>{category.price}</div>
            </div>

            <div style={styles.row}>
              <button
                style={styles.lightButton}
                onClick={() =>
                  setOpenSlug(openSlug === category.slug ? "" : category.slug)
                }
              >
                {openSlug === category.slug ? "Hide models" : `Show models (${category.series.length})`}
              </button>
              <button
                style={styles.darkButton}
                onClick={() => startEditCategory(category)}
              >
                Edit category
              </button>
            </div>
          </div>

          {categoryForm && categoryForm.slug === category.slug && renderCategoryForm()}

          {openSlug === category.slug && (
            <div style={styles.models}>
              {category.series.map((model) => (
                <div key={model.id} style={styles.modelRow}>
                  <div>
                    <strong>{model.name}</strong>
                    <span style={styles.hp}>{model.hp}</span>
                    <div style={styles.small}>{model.info}</div>
                  </div>

                  <div style={styles.row}>
                    <button style={styles.lightButton} onClick={() => startModelForm(category.slug, model)}>Edit</button>
                    <button style={styles.redButton} onClick={() => removeModel(model)}>Delete</button>
                  </div>
                </div>
              ))}

              <button style={styles.greenButton} onClick={() => startModelForm(category.slug, null)}>
                + Add new model
              </button>
            </div>
          )}

          {modelForm && modelForm.slug === category.slug && (
            <div style={styles.form}>
              <h4 style={{ margin: 0 }}>{modelForm.id ? "Edit model" : "Add new model"}</h4>
              <Field label="Model name" value={modelForm.name} onChange={(v) => setModelForm({ ...modelForm, name: v })} />
              <Field label="HP range (example: 0.5 – 1.5 HP)" value={modelForm.hp} onChange={(v) => setModelForm({ ...modelForm, hp: v })} />
              <Field label="Short info (example: Self-priming monobloc, 220V)" value={modelForm.info} onChange={(v) => setModelForm({ ...modelForm, info: v })} />

              <div style={styles.row}>
                <button style={styles.greenButton} onClick={saveModel}>Save model</button>
                <button style={styles.lightButton} onClick={() => setModelForm(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

const styles = {
  section: { marginTop: "40px" },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    marginBottom: "15px",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  row: { display: "flex", gap: "10px", flexWrap: "wrap" },
  small: { color: "#475569", fontSize: "14px", marginTop: "4px" },
  hp: {
    marginLeft: "10px",
    background: "#e2e8f0",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  models: {
    marginTop: "15px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "15px",
  },
  modelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  form: {
    marginTop: "15px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  input: {
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "normal",
  },
  uploadBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  uploadButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#00bac4",
    color: "#082b49",
    fontWeight: "bold",
    cursor: "pointer",
  },
  preview: {
    maxWidth: "220px",
    maxHeight: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  },
  lightButton: {
    padding: "9px 16px",
    border: "1px solid #082b49",
    borderRadius: "7px",
    background: "white",
    color: "#082b49",
    cursor: "pointer",
  },
  darkButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#082b49",
    color: "white",
    cursor: "pointer",
  },
  greenButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
  },
  redButton: {
    padding: "9px 16px",
    border: "none",
    borderRadius: "7px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
  },
  error: { color: "#dc2626", fontWeight: "bold" },
  notice: { color: "#16a34a", fontWeight: "bold" },
};