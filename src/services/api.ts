import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Interceptor untuk setiap request
 * Menyisipkan token Bearer otomatis ke header Authorization.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Jika Content-Type belum diset, default ke application/json
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ Interceptor untuk setiap response
 * Jika response status 401 (Unauthorized), arahkan user ke halaman login.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Hapus token dari localStorage (opsional, agar tidak digunakan lagi)
      localStorage.removeItem("access_token");

      // Redirect ke halaman login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
