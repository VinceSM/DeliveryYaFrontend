import "../../styles/screens/ProductosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { Package, Plus, Search } from "lucide-react";

export default function ProductosScreen() {
  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          <div className="content-header">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="content-title">Gestión de Productos</h1>
                <p className="content-subtitle">Administra el inventario de tu comercio</p>
              </div>
              <button className="btn-primary">
                <Plus size={18} />
                Nuevo Producto
              </button>
            </div>
          </div>
          
          <div className="content-card">
            <p>Contenido de gestión de productos...</p>
          </div>
        </div>
      </main>
    </div>
  );
}