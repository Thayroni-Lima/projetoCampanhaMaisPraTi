import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/authService";
import { getAllCampaigns } from "../../../services/campaignService";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [filters, setFilters] = useState({ name: "", category: "" });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
    loadCampaigns();
  }, []);

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
      const response = await getAllCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    }
  }

  const filteredCampaigns = useMemo(() => {
    const notOwn = campaigns.filter((c) => c.userId !== user?.id);
    return notOwn.filter((c) => {
      const nameOk = !filters.name || c.title?.toLowerCase().includes(filters.name.toLowerCase());
      const catOk = !filters.category || c.category?.toLowerCase().includes(filters.category.toLowerCase());
      return nameOk && catOk;
    });
  }, [campaigns, filters, user?.id]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          Campanhas
        </h1>
        <button
          onClick={() => navigate("/campanhas/nova")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nova Campanha
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Campanha
            </label>
            <input
              name="name"
              type="text"
              placeholder="Buscar por nome..."
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <input
              name="category"
              type="text"
              placeholder="Ex: Saúde, Educação..."
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
            />
          </div>
        </div>
      </div>

      {filteredCampaigns.length === 0 ? (
        <p className="text-gray-500">Nenhuma campanha encontrada.</p>
      ) : (
        <div className="w-fit grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredCampaigns.map((c) => (
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

                <div className="mt-3 text-sm text-gray-500">
                  <p>
                    <strong>Meta:</strong> {c.goal}
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
                    <strong>Criador:</strong>{" "}
                    {usersMap[c.userId] || "Carregando..."}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/campanhas/${c.id}`);
                    }}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
                  >
                    Detalhes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/campanhas/${c.id}`);
                    }}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
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
