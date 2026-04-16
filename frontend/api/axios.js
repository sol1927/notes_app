import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
