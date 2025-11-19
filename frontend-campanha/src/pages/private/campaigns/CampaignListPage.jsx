import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/authService";
import {
  donateCampaign,
  getAllCampaigns,
} from "../../../services/campaignService";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameFilter, categoryFilter]);

  async function loadUsers() {
    try {
      const response = await api.get("/users");
      const map = {};
      response.data.forEach((user) => {
        map[user.id] = user.name;
      });
      setUsersMap(map);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  }

  async function loadCampaigns() {
    try {
      const response = await getAllCampaigns({
        excludeMine: true,
        title: nameFilter || undefined,
        category: categoryFilter || undefined,
      });
      setCampaigns(response.data);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    }
  }

  const handleDonate = async (e, id) => {
    e.stopPropagation();
    try {
      await donateCampaign(id);
      alert("Obrigado pela sua doação!");
      // Opcional: atualizar contadores no card se exibirmos
    } catch (err) {
      console.error("Erro ao doar:", err);
      alert("Não foi possível realizar a doação. Tente novamente.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Campanhas</h1>
        <button
          onClick={() => navigate("/campanhas/nova")}
          className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
        >
          Nova Campanha
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nome</label>
            <input
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Categoria</label>
            <input
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="Ex: Saúde, Educação..."
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-gray-500">Nenhuma campanha encontrada.</p>
      ) : (
        <div className="w-fit grid grid-cols-1 md:grid-cols-4 gap-6">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/campanhas/${c.id}`)}
            >
              <img
                src={
                  c.imageUrl ||
                  "https://grs.com.br/wp-content/themes/grs19/img/img-indisponivel.jpg"
                }
                alt={c.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{c.title}</h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {c.preview}
                </p>

                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    <strong>Meta:</strong> R$ {Number(c.goal).toFixed(2)}
                  </p>
                  <p>
                    <strong>Categoria:</strong> {c.category}
                  </p>
                  <p>
                    <strong>Local:</strong> {c.city} / {c.state}
                  </p>
                  <p>
                    <strong>Prazo:</strong>{" "}
                    {new Date(c.deadline).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Criador:</strong> {usersMap[c.userId] || "..."}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/campanhas/${c.id}`);
                    }}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={(e) => handleDonate(e, c.id)}
                    disabled={c.userId === user?.id}
                    className={`flex-1 px-3 py-2 rounded-md transition ${
                      c.userId === user?.id
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Doar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
