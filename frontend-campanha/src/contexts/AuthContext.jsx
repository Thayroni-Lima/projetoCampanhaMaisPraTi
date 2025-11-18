import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  api,
  getToken,
  login as loginService,
  removeToken,
  saveToken,
} from "../services/authService";

const AuthContext = createContext();

// Hook pra facilitar o uso do contexto
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export default function Loader() {
  return (
    <div className="h-screen flex items-center justify-center">
      <span className="text-xl animate-pulse text-gray-600">Carregando...</span>
    </div>
  );
}

// Provider que vai envolver todo o app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true); // <- começa carregando

  // Busca dados do usuário quando há token
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setUser(null);
    }
  }, []);

  // Checa se há token salvo no início
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    }
    setLoading(false);
  }, [fetchUser]);

  async function login(credentials) {
    setLoading(true);
    try {
      const data = await loginService(credentials); // chama authService.js
      saveToken(data.token);
      setToken(data.token);
      // Busca dados completos do usuário após login
      await fetchUser();
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
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
