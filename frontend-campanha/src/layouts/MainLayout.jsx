import HeaderComponent from "../components/HeaderComponent";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderComponent />
      <main className="pt-16 p-4">
        <Outlet />
      </main>
    </div>
  );
}