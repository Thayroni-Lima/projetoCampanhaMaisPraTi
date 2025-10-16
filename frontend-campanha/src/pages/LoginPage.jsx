import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      alert("Login realizado!");
    } catch (error) {
      alert(error.message || "Erro ao fazer login");
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-amber-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-amber-300">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border text-black p-2 mb-3 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="border text-black p-2 mb-3 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600">
          Entrar
        </button>
      </form>
    </div>
  );
}
