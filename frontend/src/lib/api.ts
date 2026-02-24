import axios from "axios";
import Router from "next/router";
import { getCookie, deleteCookie } from "cookies-next/client";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// injeta token do cookie
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getCookie("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
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
        deleteCookie("token"); // Remove do cookie em vez do localStorage
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;