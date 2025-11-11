import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";

export default function MainLayout() {
  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-x-hidden">
      <HeaderComponent />
      <main className="pt-16 p-4">
        <Outlet />
      </main>
    </div>
  );
}
