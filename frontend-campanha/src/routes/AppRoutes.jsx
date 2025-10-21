import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

import CampanhaDetailsPage from "../pages/private/CampaignDetailsPage";
import CampanhaFormPage from "../pages/private/CampaignFormPage";
import CampaignListPage from "../pages/private/CampaignListPage";
import DashboardPage from "../pages/private/DashboardPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
          path="/campanhas"
          element={
            <PrivateRoute>
              <CampaignListPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/campanhas/nova"
          element={
            <PrivateRoute>
              <CampanhaFormPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/campanhas/:id"
          element={
            <PrivateRoute>
              <CampanhaDetailsPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to={"/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
