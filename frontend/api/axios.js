import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL?.trim();

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
