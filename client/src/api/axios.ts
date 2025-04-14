import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const instance = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000"
    : import.meta.env.VITE_API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message;

    if (
      error.response?.status === 401 ||
      message === "Invalid token" ||
      message === "Token expired"
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default instance;
