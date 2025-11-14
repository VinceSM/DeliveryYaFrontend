// src/screens/Productos/VerProductoScreen.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Edit } from 'lucide-react';
import { useProductos } from "../../hooks/useProductos";
import Sidebar from "../../components/screens/Sidebar";
import "../../styles/screens/ProductosScreen.css";

export default function VerProductoScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { productos } = useProductos();
  
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const productoEncontrado = productos.find(p => p.idProducto === parseInt(id));
    setProducto(productoEncontrado);
  }, [id, productos]);

  const formatearPrecio = (precio) => {
    if (!precio) return "$0,00";
    
    const numero = parseFloat(precio);
    const partes = numero.toFixed(2).split(".");
    const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const parteDecimal = partes[1];
    
    return `$${parteEntera},${parteDecimal}`;
  };

  if (!producto) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8">
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">Producto no encontrado</p>
              <button
                onClick={() => navigate('/productos')}
                className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Volver a Productos
              </button>
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
          <div className="productos-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/productos')}
                  className="btn-volver"
                >
                  <ArrowLeft size={18} /> Volver
                </button>
                <div>
                  <h1 className="content-title">Detalles del Producto</h1>
                  <p className="text-gray-600 text-lg mt-1">Información del producto</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/productos/editar/${id}`)}
                className="btn-guardar"
              >
                <Edit size={18} />
                Editar Producto
              </button>
            </div>
          </div>

          <div className="content-card">
            <div className="form-grid">
              {/* Nombre del Producto */}
              <div>
                <label className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  value={producto.nombre}
                  className="form-input"
                  readOnly
                />
              </div>

              {/* Precio */}
              <div>
                <label className="form-label">Precio</label>
                <input
                  type="text"
                  value={formatearPrecio(producto.precio)}
                  className="form-input"
                  readOnly
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="form-label">Categoría</label>
                <input
                  type="text"
                  value={producto.categoria || "Sin categoría"}
                  className="form-input"
                  readOnly
                />
              </div>

              {/* Estado */}
              <div>
                <label className="form-label">Estado</label>
                <div className="flex gap-6 items-center h-[42px]">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${producto.estado ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {producto.estado ? 'Disponible' : 'Sin stock'}
                  </span>
                </div>
              </div>

              {/* Unidad de Medida */}
              <div>
                <label className="form-label">Unidad de Medida</label>
                <input
                  type="text"
                  value={producto.unidadMedida || "unidad"}
                  className="form-input"
                  readOnly
                />
              </div>

              {/* Imagen */}
              <div>
                <label className="form-label">Imagen del Producto</label>
                <div className="flex items-center gap-3">
                  {producto.imagenUrl ? (
                    <img 
                      src={producto.imagenUrl || "/placeholder.svg"} 
                      alt={producto.nombre}
                      className="h-20 w-20 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-50 rounded-lg border border-gray-300 flex items-center justify-center">
                      <Package size={32} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <label className="form-label">Descripción</label>
              <textarea
                value={producto.descripcion || "Sin descripción"}
                className="form-textarea"
                rows="4"
                readOnly
              />
            </div>

            {/* Producto en Oferta */}
            <div className="mt-6">
              <label className="form-label">Producto en Oferta</label>
              <input
                type="text"
                value={producto.enOferta ? "Si" : "No"}
                className="form-input"
                readOnly
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
