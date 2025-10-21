import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerService } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatarUrl: "",
    city: "",
    state: "",
    userTypeLabel: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerService(formData);
      setSuccess("Usuário cadastrado com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Erro ao registrar usuário");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          Criar Conta
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
            required
          />
          <input
            type="text"
            name="avatarUrl"
            placeholder="URL do Avatar (opcional)"
            value={formData.avatarUrl}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="Estado (ex: SP)"
            value={formData.state}
            onChange={handleChange}
            maxLength={2}
            className="border text-black p-2 mb-3 w-full rounded uppercase"
          />
          <input
            type="text"
            name="userTypeLabel"
            placeholder="Tipo de usuário (NORMAL ou ADMIN)"
            value={formData.userTypeLabel}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />
        </div>

        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-3">{success}</p>
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Registrar
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
