import { Edit, Eye, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteCampaign,
  getAllCampaigns,
} from "../../services/campaignService";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    goalMin: "",
    goalMax: "",
    deadlineFrom: "",
    deadlineTo: "",
    category: "",
  });

  const loadCampaigns = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await getAllCampaigns();
      // Filtrar apenas campanhas do usuário logado
      const userCampaigns = response.data.filter(
        (campaign) => campaign.userId === user.id
      );
      setCampaigns(userCampaigns);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // Filtrar campanhas baseado nos filtros
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const nameMatch =
        !filters.name ||
        campaign.title.toLowerCase().includes(filters.name.toLowerCase());
      const goalMinMatch =
        !filters.goalMin || campaign.goal >= parseFloat(filters.goalMin);
      const goalMaxMatch =
        !filters.goalMax || campaign.goal <= parseFloat(filters.goalMax);
      const deadlineFromMatch =
        !filters.deadlineFrom ||
        new Date(campaign.deadline) >= new Date(filters.deadlineFrom);
      const deadlineToMatch =
        !filters.deadlineTo ||
        new Date(campaign.deadline) <= new Date(filters.deadlineTo);
      const categoryMatch =
        !filters.category ||
        campaign.category
          ?.toLowerCase()
          .includes(filters.category.toLowerCase());

      return (
        nameMatch &&
        goalMinMatch &&
        goalMaxMatch &&
        deadlineFromMatch &&
        deadlineToMatch &&
        categoryMatch
      );
    });
  }, [campaigns, filters]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({
      name: "",
      goalMin: "",
      goalMax: "",
      deadlineFrom: "",
      deadlineTo: "",
      category: "",
    });
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  async function handleDelete(campaignId) {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) {
      return;
    }
    try {
      await deleteCampaign(campaignId);
      loadCampaigns(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
      alert("Erro ao excluir campanha. Tente novamente.");
    }
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Bem-vindo(a), {user?.name || "Usuário"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas campanhas de forma centralizada
          </p>
        </div>
        <button
          onClick={() => navigate("/campanhas/nova")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Nova Campanha
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition text-sm"
            >
              <X size={16} />
              Limpar Filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Campanha
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Mínima (R$)
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={filters.goalMin}
              onChange={(e) => handleFilterChange("goalMin", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Máxima (R$)
            </label>
            <input
              type="number"
              placeholder="999999.99"
              value={filters.goalMax}
              onChange={(e) => handleFilterChange("goalMax", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prazo Inicial
            </label>
            <input
              type="date"
              value={filters.deadlineFrom}
              onChange={(e) =>
                handleFilterChange("deadlineFrom", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prazo Final
            </label>
            <input
              type="date"
              value={filters.deadlineTo}
              onChange={(e) => handleFilterChange("deadlineTo", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <input
              type="text"
              placeholder="Ex: Saúde, Educação..."
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ring-2 ring-black text-black"
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">
            Total de Campanhas
          </p>
          <p className="text-2xl font-bold text-blue-900">{campaigns.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 font-medium">
            Campanhas Filtradas
          </p>
          <p className="text-2xl font-bold text-green-900">
            {filteredCampaigns.length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Meta Total</p>
          <p className="text-2xl font-bold text-purple-900">
            {formatCurrency(
              campaigns.reduce((sum, c) => sum + parseFloat(c.goal || 0), 0)
            )}
          </p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Carregando campanhas...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {campaigns.length === 0
                  ? "Você ainda não possui campanhas. Crie sua primeira campanha!"
                  : "Nenhuma campanha encontrada com os filtros aplicados."}
              </p>
              {campaigns.length === 0 && (
                <button
                  onClick={() => navigate("/campanhas/nova")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Criar Primeira Campanha
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prazo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.title}
                      </div>
                      {campaign.preview && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {campaign.preview}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(campaign.goal)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(campaign.deadline)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(campaign.deadline) < new Date()
                          ? "Vencida"
                          : new Date(campaign.deadline) <=
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ? "Vence em breve"
                          : "Ativa"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {campaign.category || "Sem categoria"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {campaign.city || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.state || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/campanhas/${campaign.id}`)}
                          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <Eye size={16} />
                          Detalhes
                        </button>
                        <button
                          onClick={() => {
                            const url = `/campanhas/editar/${campaign.id}`;
                            window.open(url, "_blank");
                          }}
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          <Edit size={16} />
                          Alterar
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
