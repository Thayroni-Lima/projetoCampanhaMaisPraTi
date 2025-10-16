import { createContext, useContext, useState } from "react";
import { login as loginService, saveToken, removeToken, getToken } from "../services/authService";

const AuthContext = createContext();

// Hook pra facilitar o uso do contexto
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

// Provider que vai envolver todo o app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(false);

  // Função de login
  async function login(credentials) {
    setLoading(true);
    try {
      const data = await loginService(credentials); // chama authService.js
      setUser(data.user);
      setToken(data.token);
      saveToken(data.token);
    } finally {
      setLoading(false);
    }
  }

  // Função de logout
  function logout() {
    setUser(null);
    setToken(null);
    removeToken();
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
