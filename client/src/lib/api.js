import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE + "/api",
  // other defaults can be added here (timeout, headers, etc.)
});

export default api;
