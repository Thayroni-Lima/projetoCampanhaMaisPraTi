// src/pages/CampaignDetailsPage.jsx
import { ArrowLeft, HandHeart, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/authService";
import {
  deleteCampaign,
  donateCampaign,
  getCampaignById,
} from "../../../services/campaignService";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaignById(id);
        setCampaign(response.data);

        // Buscar nome do criador
        if (response.data.userId) {
          try {
            const usersResponse = await api.get("/users");
            const creator = usersResponse.data.find(
              (u) => u.id === response.data.userId
            );
            if (creator) {
              setCreatorName(creator.name);
            }
          } catch (err) {
            console.error("Erro ao buscar criador:", err);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar campanha:", err);
        setError("Não foi possível carregar a campanha.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!campaign)
    return <p className="text-center mt-10">Campanha não encontrada.</p>;

  const handleEdit = () => {
    navigate(`/campanhas/editar/${campaign.id}`);
  };

  const handleDonate = async () => {
    try {
      await donateCampaign(campaign.id);
      // Atualiza localmente o contador de doações
      setCampaign((prev) => ({
        ...prev,
        donationsCount: (prev?.donationsCount || 0) + 1,
      }));
      alert("Obrigado pela sua doação!");
    } catch (err) {
      console.error("Erro ao doar:", err);
      alert(
        err?.response?.data?.message ||
          "Não foi possível realizar a doação. Tente novamente."
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?"))
      return;
    try {
      await deleteCampaign(campaign.id);
      alert("Campanha excluída com sucesso.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao excluir campanha:", err);
      alert("Erro ao excluir campanha. Tente novamente.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 rounded-lg p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4 transition"
      >
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </button>
      <h2 className="text-3xl font-bold text-indigo-700 mb-4">
        {campaign.title}
      </h2>

      <img
        src={
          campaign.imageUrl ||
          "https://grs.com.br/wp-content/themes/grs19/img/img-indisponivel.jpg"
        }
        alt={campaign.title}
        className="w-full h-40 object-cover"
      />

      <p className="border-black text-gray-700 mb-4">{campaign.description}</p>

      <div className="grid grid-cols-2 gap-4 text-gray-600 mb-6">
        <p>
          <strong>Meta:</strong> R$ {campaign.goal?.toFixed(2)}
        </p>
        <p>
          <strong>Doações:</strong> {campaign.donationsCount ?? 0}
        </p>
        <p>
          <strong>Prazo:</strong>{" "}
          {new Date(campaign.deadline).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {new Date(campaign.deadline) < new Date() ? "Encerrada" : "Ativa"}
        </p>
        <p>
          <strong>Criador:</strong> {creatorName || "Carregando..."}
        </p>
      </div>

      <div className="flex gap-3">
        {/* Voltar já acima */}
        {campaign.userId !== user?.id && (
          <button
            onClick={handleDonate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            <HandHeart size={18} /> Doar
          </button>
        )}
        {campaign.userId === user?.id && (
          <>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <Pencil size={18} /> Editar
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <Trash2 size={18} /> Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
}
