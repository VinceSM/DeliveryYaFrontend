// src/screens/Productos/ProductosScreen.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Package, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { useProductos } from "../../hooks/useProductos";
import Sidebar from "../../components/screens/Sidebar";

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
          {/* Header */}
          <div className="content-header mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="content-title">Gestión de Productos</h1>
                <p className="content-subtitle">Administra tu inventario de productos</p>
              </div>
              <button
                onClick={() => navigate('/productos/crear')}
                className="btn-primary"
              >
                <Plus size={18} />
                Nuevo Producto
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="content-card text-center">
              <div className="text-2xl font-bold text-blue-600">{estadisticas.totalProductos}</div>
              <div className="text-sm text-gray-600">Total Productos</div>
            </div>
            <div className="content-card text-center">
              <div className="text-2xl font-bold text-green-600">{estadisticas.productosActivos}</div>
              <div className="text-sm text-gray-600">En Stock</div>
            </div>
            <div className="content-card text-center">
              <div className="text-2xl font-bold text-red-600">{estadisticas.productosAgotados}</div>
              <div className="text-sm text-gray-600">Agotados</div>
            </div>
            <div className="content-card text-center">
              <div className="text-2xl font-bold text-purple-600">{estadisticas.categoriasCount}</div>
              <div className="text-sm text-gray-600">Categorías</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="content-card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filtro por categoría */}
              <div className="w-full md:w-64">
                <select
                  value={categoriaFiltro}
                  onChange={(e) => setCategoriaFiltro(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          {/* Lista de Productos */}
          <div className="content-card">
            <div className="flex items-center justify-between mb-4">
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
              <div className="grid gap-4">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.idProducto}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {producto.imagen && producto.imagen !== 'default.jpg' ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-16 h-16 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center ${producto.imagen && producto.imagen !== 'default.jpg' ? 'hidden' : 'block'}`}>
                        <Package size={24} className="text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{producto.nombre}</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">{producto.descripcion}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">{producto.categoria}</span>
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            producto.estado === 'activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">${producto.precio}</div>
                        {producto.estado === 'activo' ? 'En stock' : 'Agotado'}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/productos/ver/${producto.idProducto}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/productos/editar/${producto.idProducto}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Editar producto"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleEliminarProducto(producto.idProducto, producto.nombre)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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