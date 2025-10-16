import { BrowserRouter as Router, Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "../pages/PrivateRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

export default function AppRoutes() {
  return (

    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rota privada */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="*" element={<Navigate to={"/login"} replace/>}
        />

      </Routes>
    </BrowserRouter>


  );
}
