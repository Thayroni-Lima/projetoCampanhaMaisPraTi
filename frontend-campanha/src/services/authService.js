// src/services/AuthService.js
import axios from "axios";

const API_URL = "http://localhost:8080/auth"; 

export async function login(credentials) {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return {
      token: response.data.token,
      user: { email: credentials.email },
    };
  } catch (error) {
    console.error("Erro no login:", error.response || error);
    throw error.response?.data || { message: "Erro ao fazer login" };
  }
}

export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao registrar" };
  }
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export const api = axios.create({
  baseURL: "http://localhost:8080/",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
