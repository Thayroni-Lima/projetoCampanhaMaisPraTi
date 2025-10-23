import {Menu, User} from "lucide-react";

export default function HeaderComponent() {
  return (
    <div>
      <header className="fixed top-0 left-0 w-full bg-indigo-700 text-white shadow-md z-50 flex items-center justify-between px-4 py-3">

        <button className="p-2 hover:bg-indigo-600 rounded-lg">
          <Menu size={24} />
        </button>

        <button className="p-2 hover:bg-indigo-600 bg-indigo-600 rounded-lg">
          <h2 className="text-lg font-bold tracking-wide ">Projeto Campanha</h2>
        </button>

        

        <button className="p-2 hover:bg-indigo-600 rounded-lg">
          <User size={24}/>
        </button>
      </header>
    </div>
  );
}
