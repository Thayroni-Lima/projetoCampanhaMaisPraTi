import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/homepage");
    } catch (error) {
      alert(error.message || "Erro ao fazer login");
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          Loginn
        </h2>
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

        <p className="text-sm text-center mt-4 text-gray-600">
          Não possui uma conta? <Link to="/register">Registrar</Link>
        </p>
      </form>
    </div>
  );
}
