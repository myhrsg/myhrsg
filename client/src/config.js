// Central configuration for API endpoints
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://myhrsg-omega.vercel.app"
).replace(/\/$/, "");

// Ensure API_URL targets the backend /api route prefix
export const API_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

export default {
  API_BASE_URL,
  API_URL,
};

