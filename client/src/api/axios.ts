import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const instance = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000" 
    : import.meta.env.VITE_API_URL, 
  withCredentials: true,
});

export default instance;
