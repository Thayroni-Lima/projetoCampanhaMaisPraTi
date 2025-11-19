import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCampaignById,
  updateCampaign,
} from "../../../services/campaignService";

export default function CampaignEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    deadline: "",
    category: "",
    city: "",
    state: "",
    imageUrl: "",
    preview: "",
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await getCampaignById(id);
        const campaign = response.data;

        // Formatar deadline para input type="date" (YYYY-MM-DD)
        const deadlineDate = new Date(campaign.deadline);
        const formattedDeadline = deadlineDate.toISOString().split("T")[0];

        setFormData({
          title: campaign.title || "",
          description: campaign.description || "",
          goal: campaign.goal?.toString() || "",
          deadline: formattedDeadline,
          category: campaign.category || "",
          city: campaign.city || "",
          state: campaign.state || "",
          imageUrl: campaign.imageUrl || "",
          preview: campaign.preview || "",
        });
      } catch (error) {
        console.error("Erro ao carregar campanha:", error);
        alert("Erro ao carregar campanha. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        goal: parseFloat(formData.goal),
        deadline: new Date(`${formData.deadline}T00:00:00Z`).toISOString(),
      };

      await updateCampaign(id, dataToSend);
      alert("Campanha atualizada com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      alert(
        "Erro ao atualizar campanha. Verifique os dados e tente novamente."
      );
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Carregando dados da campanha...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          Editar Campanha {formData.title ? `- ${formData.title}` : ""}
        </h2>
        <div>
          <input
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            required
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <textarea
            name="description"
            placeholder="Descrição"
            value={formData.description}
            onChange={handleChange}
            required
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            name="goal"
            type="number"
            placeholder="Meta (R$)"
            value={formData.goal}
            onChange={handleChange}
            required
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <p className="text-black mu-3 w-full rounded">Prazo máximo</p>
          <input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            name="category"
            placeholder="Categoria"
            value={formData.category}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            name="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            name="state"
            placeholder="Estado"
            value={formData.state}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            name="imageUrl"
            placeholder="URL da imagem"
            value={formData.imageUrl}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />
          <input
            name="preview"
            placeholder="Resumo (preview)"
            value={formData.preview}
            onChange={handleChange}
            className="border text-black p-2 mb-3 w-full rounded"
          />

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Editar Campanha
          </button>
        </div>
      </form>
    </div>
  );
}
