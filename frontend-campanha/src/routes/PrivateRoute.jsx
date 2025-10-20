import { Navigate } from "react-router-dom";
import Loader, { useAuth } from "../contexts/AuthContext";


export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return <Loader />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}