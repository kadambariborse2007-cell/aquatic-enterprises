
const API_BASE_URL = "http://127.0.0.1:8001";

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