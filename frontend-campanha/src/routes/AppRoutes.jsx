import { BrowserRouter as Router, Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
  import PrivateRoute from "../pages/PrivateRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import DashboardPage from "../pages/DashboardPage";
import CampaignListPage from "../pages/CampaignListPage";
import CampanhaFormPage from "../pages/CampaignFormPage";
import CampanhaDetailsPage from "../pages/CampaignDetailsPage"

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

        <Route
          path="*" element={<Navigate to={"/login"} replace/>}
        />

      </Routes>
    </BrowserRouter>


  );
}
