import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import MainLayout from "../layouts/MainLayout";

import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

import CampanhaFormPage from "../pages/private//campaigns/CampaignFormPage";
import CampanhaDetailsPage from "../pages/private/campaigns/CampaignDetailsPage";
import CampaignEditPage from "../pages/private/campaigns/CampaignEditPage";
import CampaignListPage from "../pages/private/campaigns/CampaignListPage";
import DashboardPage from "../pages/private/DashboardPage";
import HomePage from "../pages/private/HomePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas - SEM MainLayout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Rotas privadas - COM MainLayout */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/campanhas" element={<CampaignListPage />} />

          {/* IMPORTANTE: Rotas mais específicas ANTES das genéricas */}
          <Route path="/campanhas/nova" element={<CampanhaFormPage />} />
          <Route path="/campanhas/editar/:id" element={<CampaignEditPage />} />
          <Route path="/campanhas/:id" element={<CampanhaDetailsPage />} />
        </Route>
        *
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
