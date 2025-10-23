import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCampaigns } from "../../../services/campaignService";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      const response = await getAllCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    }
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

      {campaigns.length === 0 ? (
        <p className="text-gray-500">Nenhuma campanha encontrada.</p>
      ) : (
        <div className="w-fit grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
