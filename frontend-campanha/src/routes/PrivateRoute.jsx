import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return <p>Carregando...</p>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}