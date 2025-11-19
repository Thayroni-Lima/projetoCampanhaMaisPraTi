import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:8080";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validar token ao carregar a página
  useEffect(() => {
    if (!token) {
      setError("Token não fornecido. Verifique o link do e-mail.");
      setValidatingToken(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(
          `${API_URL}/auth/reset-password?token=${token}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          setTokenValid(true);
        } else {
          const errorData = await response.json().catch(() => ({}));
          setError(
            errorData.message ||
              "Token inválido ou expirado. Solicite um novo link."
          );
        }
      } catch(err) {
        setError(err.message || "Erro ao validar token. Tente novamente.");
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpar erros ao digitar
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validações
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir senha.");
      }

      setSuccess(
        "Senha redefinida com sucesso! Redirecionando para o login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto valida token
  if (validatingToken) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
          <p className="text-gray-600">Validando token...</p>
        </div>
      </div>
    );
  }

  // Se token inválido, mostrar mensagem
  if (!tokenValid) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-96 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">
            Token Inválido
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          Redefinir Senha
        </h2>

        <div className="space-y-4">
          <input
            type="password"
            name="newPassword"
            placeholder="Nova senha"
            value={formData.newPassword}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
            required
            minLength={6}
            disabled={loading}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirme a nova senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
            required
            minLength={6}
            disabled={loading}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm text-center mt-3">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg"
        >
          {loading ? "Redefinindo..." : "Redefinir Senha"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Lembrou sua senha?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}
