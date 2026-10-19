import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

export function resolveApiUrl(path: string): string {
  if (!path || /^https?:\/\//.test(path)) return path;
  const origin = baseUrl.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
}

export default api