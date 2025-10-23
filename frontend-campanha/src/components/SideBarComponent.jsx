import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function SidebarComponent({ isOpen, onClose }) {
  return (
    <>
      {/* Fundo escurecido ao abrir */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-50 bg-indigo-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out z-50 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-indigo-700 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-3">
          <Link
            to="/dashboard"
            className="hover:bg-indigo-700 p-2 rounded-md transition"
            onClick={onClose}
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/campanhas"
            className="hover:bg-indigo-700 p-2 rounded-md transition"
            onClick={onClose}
          >
            📢 Campanhas
          </Link>
        </nav>
      </div>
    </>
  );
}
