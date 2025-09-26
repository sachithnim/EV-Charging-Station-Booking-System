import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
    return response;
    }, (error) => {
    if (error.response && error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/sign-in";
    }
    return Promise.reject(error);
}
);


export default axiosInstance;
