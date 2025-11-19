// src/pages/CampaignDetailsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/authService";
import { deleteCampaign, getCampaignById } from "../../../services/campaignService";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatorName, setCreatorName] = useState("");
  const [donations, setDonations] = useState(0);

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

  useEffect(() => {
    // carrega contagem de doações do localStorage
    try {
      const raw = localStorage.getItem(`donations_${id}`);
      if (raw) setDonations(parseInt(raw, 10) || 0);
    } catch (e) {
      // ignore
    }
  }, [id]);

  function handleDonate() {
    const next = donations + 1;
    setDonations(next);
    try {
      localStorage.setItem(`donations_${id}`, String(next));
    } catch (e) {
      // ignore storage errors
    }
  }

  async function handleDelete() {
    if (!window.confirm("Tem certeza que deseja excluir esta campanha?")) return;
    try {
      await deleteCampaign(id);
      alert("Campanha excluída com sucesso!");
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir campanha.");
    }
  }

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;
  if (!campaign)
    return <p className="text-center mt-10">Campanha não encontrada.</p>;

  const handleEdit = () => {
    navigate(`/campanhas/editar/${campaign.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10  rounded-lg p-6">
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
          <strong>Doações (simples):</strong> {donations}
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

      <div className="flex gap-3 mt-4">
        {/* Botão doar: habilitado apenas se campanha não for do usuário */}
        {campaign.userId !== user?.id && (
          <button
            onClick={handleDonate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Doar
          </button>
        )}

        {/* Botões para campanhas próprias */}
        {campaign.userId === user?.id && (
          <>
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
}
