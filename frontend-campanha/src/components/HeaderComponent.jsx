import { useState } from "react";
import { Menu, User } from "lucide-react";
import SidebarComponent from "./SideBarComponent";
import ProfilebarComponet from "./ProfileBarComponent";
import { useNavigate } from "react-router-dom";

export default function HeaderComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfilebarOpen, setIsProfilebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Header fixo */}
      <header className="fixed top-0 left-0 w-full bg-indigo-700 text-white shadow-md z-50 flex items-center justify-between px-4 py-3">
        {/* Botão Sanduíche */}
        <button
          className="p-2 hover:bg-indigo-600 rounded-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Nome do Projeto */}
        <p
          className="p-2 hover:cursor-pointer rounded-lg"
          onClick={() => navigate('/homepage')}
        >
          <h2 className="text-lg font-bold tracking-wide">Projeto Campanha</h2>
        </p>

        {/* Ícone de Perfil */}
        <button 
          className="p-2 hover:bg-indigo-600 rounded-lg"
          onClick={() => setIsProfilebarOpen(true)}>
          <User size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <SidebarComponent
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <ProfilebarComponet
        isOpen={isProfilebarOpen}
        onClose={() => setIsProfilebarOpen(false)}
      />
    </>
  );
}
