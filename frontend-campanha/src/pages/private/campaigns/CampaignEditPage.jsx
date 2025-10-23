import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCampaign } from "../../../services/campaignService";

export default function CampaignEditPage() {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        deadline: new Date(`${formData.deadline}T00:00:00Z`).toISOString(),
      };

      await createCampaign(dataToSend);
      alert("Campanha criada com sucesso!");
      navigate("/campanhas");
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      // Opcionalmente, mostre a mensagem de erro pro usuário
      alert("Erro ao criar campanha. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-900 text-center">
          Nova Campanha
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
            Criar Campanha
          </button>
        </div>
      </form>
    </div>
  );
}
