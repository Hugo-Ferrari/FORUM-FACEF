import axios from "axios";
import Router from "next/router";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// injeta token / user-id
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["user-id"] = token; // remova ou ajuste se backend espera outro valor
    }
  }
  return config;
});

// tratamento global de respostas
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;