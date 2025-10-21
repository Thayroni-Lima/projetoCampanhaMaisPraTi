import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-screen text-black flex flex-col items-center text-center justify-center">
      <h1 className="text-3xl font-bold">
        Bem-vindo(a), {user?.email || "Usuário"}!
      </h1>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  );
}
