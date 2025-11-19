import { Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import UserServices from "../services/UserService";
import RecuperarSenhaModal from "./RecuperarSenhaModal";

export default function ProfileBarComponent({ isOpen, onClose }) {
  const { fetchUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showRecuperarSenha, setShowRecuperarSenha] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  async function fetchUserData() {
    try {
      setLoading(true);
      setError("");
      const userData = await UserServices.getUser();
      setUser(userData);
      setEditedUser({
        name: userData.name || "",
        email: userData.email || "",
        avatarUrl: userData.avatarUrl || "",
        city: userData.city || "",
        state: userData.state || "",
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setError("Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Verifica se há alterações comparando com os dados originais
  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      editedUser.name !== (user.name || "") ||
      editedUser.email !== (user.email || "") ||
      editedUser.avatarUrl !== (user.avatarUrl || "") ||
      editedUser.city !== (user.city || "") ||
      editedUser.state !== (user.state || "")
    );
  }, [user, editedUser]);

  async function handleSave() {
    try {
      setSaving(true);
      setError("");

      // Prepara os dados para envio (remove campos vazios)
      const dataToSend = {};
      if (editedUser.name !== (user?.name || "")) {
        dataToSend.name = editedUser.name;
      }
      if (editedUser.email !== (user?.email || "")) {
        dataToSend.email = editedUser.email;
      }
      if (editedUser.avatarUrl !== (user?.avatarUrl || "")) {
        dataToSend.avatarUrl = editedUser.avatarUrl;
      }
      if (editedUser.city !== (user?.city || "")) {
        dataToSend.city = editedUser.city;
      }
      if (editedUser.state !== (user?.state || "")) {
        dataToSend.state = editedUser.state;
      }

      const updatedUser = await UserServices.updateUser(dataToSend);
      setUser(updatedUser);

      // Atualiza o contexto de autenticação
      if (fetchUser) {
        await fetchUser();
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setError(error.response?.data?.message || "Erro ao salvar alterações");
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange() {
    const newPhoto = prompt("Informe o link da nova foto de perfil:");
    if (newPhoto) {
      handleChange("avatarUrl", newPhoto);
    }
  }

  function handleCancel() {
    // Restaura os valores originais
    if (user) {
      setEditedUser({
        name: user.name || "",
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
        city: user.city || "",
        state: user.state || "",
      });
    }
    setError("");
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Fundo escurecido */}
      <div className="fixed inset-0 bg-opacity-50 z-40" onClick={onClose} />

      {/* Painel lateral direito */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-indigo-800 text-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-600 sticky top-0 bg-indigo-800">
          <h2 className="text-lg font-bold">Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-700 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-4">
            <p className="text-sm text-gray-300">Carregando dados...</p>
          </div>
        ) : user ? (
          <div className="p-4 space-y-4">
            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded-lg p-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Foto de perfil */}
            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={handlePhotoChange}
              >
                <img
                  src={
                    editedUser.avatarUrl ||
                    user.avatarUrl ||
                    "https://via.placeholder.com/100"
                  }
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full border-4 border-indigo-600 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full hidden group-hover:flex items-center justify-center text-sm">
                  Alterar
                </div>
              </div>
              {editedUser.avatarUrl !== (user.avatarUrl || "") && (
                <p className="text-xs text-yellow-300 mt-2">
                  Foto alterada (não salva)
                </p>
              )}
            </div>

            {/* Campos editáveis */}
            {[
              { key: "name", label: "Nome", type: "text" },
              { key: "email", label: "Email", type: "email" },
              { key: "city", label: "Cidade", type: "text" },
              { key: "state", label: "Estado", type: "text" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-sm text-indigo-300 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  value={editedUser[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={`Digite o ${label.toLowerCase()}`}
                  className="w-full bg-indigo-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 border border-indigo-600"
                />
                {editedUser[key] !== (user[key] || "") && (
                  <p className="text-xs text-yellow-300 mt-1">
                    {label} alterado (não salvo)
                  </p>
                )}
              </div>
            ))}

            {/* URL do Avatar (campo separado) */}
            <div>
              <label className="block text-sm text-indigo-300 mb-1">
                URL do Avatar
              </label>
              <input
                type="text"
                value={editedUser.avatarUrl || ""}
                onChange={(e) => handleChange("avatarUrl", e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="w-full bg-indigo-700 text-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 border border-indigo-600 text-sm"
              />
            </div>

            {/* Botões de ação */}
            {hasChanges && (
              <div className="pt-4 border-t border-indigo-600 space-y-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Senha (apenas visual) */}
            <div className="pt-4 border-t border-indigo-600">
              <label className="block text-sm text-indigo-300 mb-1">
                Senha
              </label>
              <p
                className="cursor-pointer hover:text-indigo-300 transition"
                onClick={() => setShowRecuperarSenha(true)}
              >
                ****** (Alterar senha)
              </p>
            </div>

            <div className="pt-4 border-t border-indigo-600">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-center cursor-pointer"
              >
                Sair do Sistema
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm text-gray-300">
              Erro ao carregar dados do usuário
            </p>
          </div>
        )}
      </div>
      {showRecuperarSenha && (
        <RecuperarSenhaModal onClose={() => setShowRecuperarSenha(false)} />
      )}
    </>
  );
}
