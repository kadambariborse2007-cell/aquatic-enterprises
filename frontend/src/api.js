export const API_BASE_URL = "https://aquatic-enterprises.onrender.com";

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

export async function checkDatabaseHealth() {
  const response = await fetch(`${API_BASE_URL}/db-health`);

  if (!response.ok) {
    throw new Error("Database health check failed");
  }

  return response.json();
}


function getAdminHeaders() {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchAdminReviews(status = "") {
  const url = status
    ? `${API_BASE_URL}/admin/reviews?status=${status}`
    : `${API_BASE_URL}/admin/reviews`;

  const response = await fetch(url, { headers: getAdminHeaders() });

  if (!response.ok) {
    throw new Error("Could not load reviews");
  }

  return response.json();
}

export async function setReviewStatus(reviewId, status) {
  const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
    method: "PATCH",
    headers: getAdminHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Could not update review");
  }

  return response.json();
}

export async function deleteReview(reviewId) {
  const response = await fetch(`${API_BASE_URL}/admin/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not delete review");
  }

  return response.json();
}
export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Could not load categories");
  }

  return response.json();
}

export async function updateCategory(slug, data) {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${slug}`, {
    method: "PUT",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Could not update category");
  }

  return response.json();
}

export async function addModel(slug, data) {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${slug}/models`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Could not add model");
  }

  return response.json();
}

export async function updateModel(modelId, data) {
  const response = await fetch(`${API_BASE_URL}/admin/models/${modelId}`, {
    method: "PUT",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Could not update model");
  }

  return response.json();
}

export async function deleteModel(modelId) {
  const response = await fetch(`${API_BASE_URL}/admin/models/${modelId}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not delete model");
  }

  return response.json();
}
export async function createCategory(data) {
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Could not create category");
  }

  return response.json();
}

export async function deleteCategory(slug) {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${slug}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not delete category");
  }

  return response.json();
}

export async function uploadImage(file) {
  const token = localStorage.getItem("adminToken");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/admin/upload-image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not upload image");
  }

  return response.json();
}

export function imageUrl(path) {
  if (path && path.startsWith("/uploads/")) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
}

export async function fetchBusiness() {
  const response = await fetch(`${API_BASE_URL}/business`);

  if (!response.ok) {
    throw new Error("Could not load business details");
  }

  return response.json();
}

export async function updateBusiness(data) {
  const response = await fetch(`${API_BASE_URL}/admin/business`, {
    method: "PUT",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not save business details");
  }

  return response.json();
}

export async function fetchBanner() {
  const response = await fetch(`${API_BASE_URL}/banner`);

  if (!response.ok) {
    throw new Error("Could not load banner");
  }

  return response.json();
}

export async function updateBanner(data) {
  const response = await fetch(`${API_BASE_URL}/admin/banner`, {
    method: "PUT",
    headers: getAdminHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Could not save banner");
  }

  return response.json();
}