
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
