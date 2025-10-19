// authService.ts
import api from "./api"; // axios instance

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // redirect ke halaman login
  }
}
