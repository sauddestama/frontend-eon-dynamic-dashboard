// file: src/utils/auth.ts
import api from "./api";

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      // Store token, userId, username, and role in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      // Return all user information
      return {
        token: response.data.token,
        userId: response.data.userId,
        username: response.data.username,
        role: response.data.role,
      };
    }
    throw new Error("Login failed");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export function logout() {
  // Clear all stored items on logout
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserInfo() {
  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  };
}

export function isAuthenticated() {
  return !!getToken();
}
