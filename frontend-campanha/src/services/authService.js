import axios from "axios";

// URL base da sua API Spring Boot
const API_URL = "http://localhost:8080/auth"; 
// Exemplo: endpoints -> /login, /register, /refresh-token

export async function login(credentials) {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    // A API retorna apenas o token, então construímos manualmente o objeto esperado:
    return {
      token: response.data.token,
      user: { email: credentials.email }, // opcional, só pra ter algo no contexto
    };
  } catch (error) {
    console.error("Erro no login:", error.response || error);
    throw error.response?.data || { message: "Erro ao fazer login" };
  }
}

// Registro: cria um novo usuário
export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Erro ao registrar" };
  }
}

// Função utilitária: salva e remove token do localStorage
export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

// Instância do axios com token automático (pra endpoints protegidos)
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
