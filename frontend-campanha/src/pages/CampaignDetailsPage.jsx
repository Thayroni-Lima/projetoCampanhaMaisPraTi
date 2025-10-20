import { useParams } from "react-router-dom";

export default function CampaignDetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <h1 className="text-2xl text-black font-bold">Detalhes da Campanha #{id}</h1>
      <p className="mt-2 text-black">Informações completas da campanha...</p>
    </div>
  );
}
