import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Rocket, Target, Users, HeartHandshake } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="self-center-safe min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white text-gray-800 p-6">
      <div className="max-w-4xl text-center space-y-8">
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800">
          Bem-vindo ao <span className="text-blue-600">Projeto Campanha</span> 🎯
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-gray-700">
          Uma plataforma feita para conectar pessoas e causas.  
          Crie, apoie e acompanhe campanhas que fazem a diferença.
        </p>

        {/* Cards de funcionalidades */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <FeatureCard
            icon={<Rocket className="w-8 h-8 text-blue-600" />}
            title="Crie Campanhas"
            description="Publique campanhas para arrecadar fundos, divulgar causas sociais ou impulsionar projetos comunitários."
          />
          <FeatureCard
            icon={<Target className="w-8 h-8 text-blue-600" />}
            title="Acompanhe Metas"
            description="Defina uma meta e acompanhe o progresso em tempo real das suas arrecadações."
          />
        </div>

        <div>

        </div>

          <FeatureCard
            icon={<HeartHandshake className="w-8 h-8 text-blue-600" />}
            title="Transparência e Confiança"
            description="Cada campanha é vinculada a um usuário autenticado, garantindo credibilidade e responsabilidade."
          />


        {/* Call to Action */}
        <div className="mt-12 space-x-4">
          <button
            onClick={() => navigate("/campanhas")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ver Campanhas
          </button>

          <button
            onClick={() => navigate("/campanhas/nova")}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Criar Campanha
          </button>
        </div>

        {/* Rodapé */}
        <footer className="mt-16 text-sm text-gray-500">
          {user ? (
            <p>Olá, <span className="font-semibold text-blue-600">{user.name}</span> 👋</p>
          ) : (
            <p>Faça login para começar sua jornada solidária!</p>
          )}
          <p className="mt-2">© {new Date().getFullYear()} Campanha Solidária. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

// 🔹 Componente auxiliar para os cards de funcionalidade
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      {icon}
      <h3 className="text-xl font-semibold mt-4 text-blue-800">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
