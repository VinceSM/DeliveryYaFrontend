// src/screens/Productos/VerProductoScreen.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Edit } from "lucide-react";
import { useProductos } from "../../hooks/useProductos";
import Sidebar from "../../components/screens/Sidebar";

export default function VerProductoScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { productos } = useProductos();
  
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const productoEncontrado = productos.find(p => p.idProducto === parseInt(id));
    setProducto(productoEncontrado);
  }, [id, productos]);

  if (!producto) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8">
            <div className="text-center py-12">
              <p className="text-gray-600">Producto no encontrado</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {/* Header */}
          <div className="content-header mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/productos')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="content-title">Detalles del Producto</h1>
                  <p className="content-subtitle">Información completa del producto</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/productos/editar/${id}`)}
                className="btn-primary"
              >
                <Edit size={18} />
                Editar Producto
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}