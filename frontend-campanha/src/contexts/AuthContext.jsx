import { createContext, useContext, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true); // <- começa carregando

  // Checa se há token salvo no início
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      // Aqui você pode futuramente validar o token com a API (opcional)
    }
    setLoading(false);
  }, []);

  async function login(credentials) {
    setLoading(true);
    try {
      const data = await loginService(credentials); // chama authService.js
      saveToken(data.token);
      setToken(data.token);
      setUser(data.user || { email: credentials.email });
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
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
