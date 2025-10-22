import { api } from "./authService";

// 🔹 Buscar todas as campanhas
export const getAllCampaigns = () => api.get("/campaigns");

// 🔹 Buscar campanha por ID
export const getCampaignById = (id) => api.get(`/campaigns/${id}`);

// 🔹 Criar nova campanha
export const createCampaign = async (data) => {
  try {
    return await api.post("/campaigns", data);
  } catch (error) {
    console.error("createCampaign error.response:", error.response);
    throw error; // relança para o componente tratar
  }
};

// 🔹 Atualizar campanha (pedenten do back) 
// export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);

// 🔹 Excluir campanha (pedenten do back)
// export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);
