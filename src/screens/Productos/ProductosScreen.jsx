// src/screens/Productos/ProductosScreen.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package, Search, Edit, Trash2, Eye, Box, CheckCircle, XCircle, Tags } from "lucide-react";
import { useProductos } from "../../hooks/useProductos";
import Sidebar from "../../components/screens/Sidebar";
import "../../styles/components/BotonesAccion.css";
import "../../styles/screens/ProductosScreen.css";

export default function ProductosScreen() {
  const navigate = useNavigate();
  const { productos, categorias, estadisticas, loading, error, borrarProducto } = useProductos();
  
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = !categoriaFiltro || producto.categoria === categoriaFiltro;
    
    return coincideBusqueda && coincideCategoria;
  });

  const handleEliminarProducto = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) {
      try {
        await borrarProducto(id);
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8">
            <div className="text-center py-12">
              <Package className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">Cargando productos...</p>
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
          {/* Header Mejorado */}
          <div className="productos-header">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="h1-titulo">
                    Gestión de Productos
                  </h1>
                  <p className="text-gray-600 text-lg mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Administra y controla tu inventario de productos
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Estadísticas con tus clases CSS */}
          <div className="stats-productos">
            <div className="stat-producto primary">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Box size={24} className="text-blue-600" />
                <div>
                  <div className="stat-number">{estadisticas.totalProductos}</div>
                  <div className="stat-label">Total Productos</div>
                </div>
              </div>
            </div>
            
            <div className="stat-producto success">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <div className="stat-number text-green-600">{estadisticas.productosActivos}</div>
                  <div className="stat-label">En Stock</div>
                </div>
              </div>
            </div>
            
            <div className="stat-producto secondary">
              <div className="flex items-center justify-center gap-3 mb-2">
                <XCircle size={24} className="text-red-600" />
                <div>
                  <div className="stat-number text-red-600">{estadisticas.productosAgotados}</div>
                  <div className="stat-label">Agotados</div>
                </div>
              </div>
            </div>
            
            <div className="stat-producto">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Tags size={24} className="text-purple-600" />
                <div>
                  <div className="stat-number text-purple-600">{estadisticas.categoriasCount}</div>
                  <div className="stat-label">Categorías con Productos</div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/productos/crear')}
            className="btn-accion btn-crear btn-grande"
            >
            <Plus size={18} />
            Nuevo Producto
          </button>

          {/* Filtros */}
          <div className="content-card mb-6">
            <div className="header-actions">
              {/* Búsqueda */}
              <div className="search-container">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Filtro por categoría */}
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Productos - MODO LISTA */}
          <div className="content-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Productos</h3>
              <span className="text-sm text-gray-500">
                {productosFiltrados.length} de {productos.length} productos
              </span>
            </div>

            {productosFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No se encontraron productos</p>
                <p className="text-sm text-gray-500 mt-2">
                  {productos.length === 0 
                    ? "Comienza agregando tu primer producto" 
                    : "Intenta con otros términos de búsqueda"}
                </p>
              </div>
            ) : (
              <div className="productos-lista">
                {productosFiltrados.map((producto) => (
                  <div key={producto.idProducto} className="producto-item">
                    {/* Imagen del producto */}
                    <div className="producto-imagen">
                      {producto.imagen && producto.imagen !== 'default.jpg' ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-gray-100 rounded-lg flex items-center justify-center ${producto.imagen && producto.imagen !== 'default.jpg' ? 'hidden' : 'flex'}`}>
                        <Package size={24} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Información principal */}
                    <div className="producto-info">
                      <div className="producto-principal">
                        <h3 className="producto-nombre">{producto.nombre}</h3>
                        <p className="producto-descripcion">{producto.descripcion || "Sin descripción"}</p>
                      </div>
                      
                      <div className="producto-detalles">
                        <div className="producto-precio">${producto.precio}</div>
                        
                        <div className="producto-estados">
                          <span className={`estado-badge ${producto.estado === 'activo' ? 'estado-activo' : 'estado-inactivo'}`}>
                            {producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                          </span>
                          
                          {producto.oferta && (
                            <span className="oferta-badge">
                              🏷️ Oferta
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones del producto */}
                    <div className="producto-acciones">
                      <button
                        onClick={() => navigate(`/productos/ver/${producto.idProducto}`)}
                        className="btn-accion btn-ver btn-pequeno"
                        title="Ver detalles"
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/productos/editar/${producto.idProducto}`)}
                        className="btn-accion btn-modificar btn-pequeno"
                        title="Editar producto"
                      >
                        <Edit size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarProducto(producto.idProducto, producto.nombre)}
                        className="btn-accion btn-eliminar btn-pequeno"
                        title="Eliminar producto"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}