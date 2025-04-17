import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const instance = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
