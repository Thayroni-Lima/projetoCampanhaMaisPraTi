import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import UserServices from "../services/UserService";

export default function ProfileBarComponent({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempUser, setTempUser] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  async function fetchUserData() {
    try {
      const userData = await UserServices.getUser();
      setUser(userData);
      setTempUser(userData);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  function handleEdit(field) {
    setEditingField(field);
  }

  function handleChange(e) {
    setTempUser({ ...tempUser, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    try {
      const updatedUser = await UserServices.updateUser(tempUser);
      setUser(updatedUser);
      setEditingField(null);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  }

  async function handlePhotoChange() {
    const newPhoto = prompt("Informe o link da nova foto de perfil:");
    if (newPhoto) {
      try {
        const updatedUser = await UserServices.updateUser({
          ...user,
          photoUrl: newPhoto,
        });
        setUser(updatedUser);
      } catch (error) {
        console.error("Erro ao atualizar foto:", error);
      }
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Fundo escurecido */}
      <div
        className="fixed inset-0  z-40"
        onClick={onClose}
      />

      {/* Painel lateral direito */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-indigo-800 text-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-1000 ease-in-out z-50 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          <h2 className="text-lg font-bold">Perfil</h2>
          <button onClick={onClose} className="p-2 hover:bg-indigo-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {user ? (
          <div className="p-4 space-y-4">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={handlePhotoChange}
              >
                <img
                  src={user.photoUrl || "https://via.placeholder.com/100"}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full border-4 border-indigo-600 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full hidden group-hover:flex items-center justify-center text-sm">
                  Alterar
                </div>
              </div>
            </div>

            {/* Campos editáveis */}
            {["name", "email", "city", "state"].map((field) => (
              <div key={field}>
                <label className="block text-sm text-indigo-300 capitalize">
                  {field}
                </label>
                {editingField === field ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name={field}
                      value={tempUser[field] || ""}
                      onChange={handleChange}
                      className="w-full bg-indigo-700 rounded px-2 py-1 outline-none"
                    />
                    <button
                      onClick={() => handleSave(field)}
                      className="p-1 hover:bg-indigo-600 rounded-md"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                ) : (
                  <p
                    className="cursor-pointer hover:text-indigo-300"
                    onClick={() => handleEdit(field)}
                  >
                    {user[field] || "Não informado"}
                  </p>
                )}
              </div>
            ))}

            {/* Tipo de usuário (imutável) */}
            <div>
              <label className="block text-sm text-indigo-300">Tipo de Usuário</label>
              <p className="font-semibold">{user.userTypeLabel}</p>
            </div>

            {/* Senha (apenas visual) */}
            <div>
              <label className="block text-sm text-indigo-300">Senha</label>
              <p
                className="cursor-pointer hover:text-indigo-300"
                onClick={() => alert("Aqui abrirá o ResetPasswordComponent futuramente.")}
              >
                ****** (Alterar senha)
              </p>
            </div>
          </div>
        ) : (
          <p className="p-4 text-sm text-gray-300">Carregando dados...</p>
        )}
      </div>
    </>
  );
}
