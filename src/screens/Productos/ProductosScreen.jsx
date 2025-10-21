import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/screens/ProductosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { Package, Plus, Search, Filter, Edit, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { useProductos } from "../../hooks/useProductos";

export default function ProductosScreen() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  
  const { 
    productos, 
    categorias, 
    estadisticas, 
    loading, 
    error, 
    borrarProducto, 
    recargarProductos 
  } = useProductos();

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "todos" || producto.categoria === filtroCategoria;
    const coincideEstado = filtroEstado === "todos" || producto.estado === filtroEstado;
    
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const handleEditarProducto = (id) => {
    navigate(`/productos/editar/${id}`);
  };

  const handleNuevoProducto = () => {
    navigate("/productos/nuevo");
  };

  const handleEliminarProducto = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      try {
        await borrarProducto(id);
        console.log(`✅ Producto ${id} eliminado`);
      } catch (error) {
        console.error('❌ Error eliminando producto:', error);
        alert(`Error al eliminar producto: ${error.message}`);
      }
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activo": return "estado-activo";
      case "inactivo": return "estado-inactivo";
      case "agotado": return "estado-agotado";
      default: return "estado-inactivo";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw size={48} className="animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && productos.length === 0) {
    return (
      <div className="dashboard-container flex h-screen">
        <Sidebar />
        <main className="main-content flex-1 overflow-y-auto">
          <div className="content-wrapper min-h-full p-8 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar productos</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={recargarProductos}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Reintentar
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
          {/* Header */}
          <div className="content-header">
            <div className="productos-header">
              <div>
                <h1 className="content-title">Gestión de Productos</h1>
                <p className="content-subtitle">Administra el inventario de tu comercio</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={recargarProductos}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  Actualizar
                </button>
                <button className="btn-primary" onClick={handleNuevoProducto}>
                  <Plus size={18} />
                  Nuevo Producto
                </button>
              </div>
            </div>
          </div>

          {/* Mostrar error si existe pero hay productos */}
          {error && productos.length > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-600" />
                <p className="text-yellow-800 text-sm">
                  <strong>Advertencia:</strong> {error}
                </p>
              </div>
            </div>
          )}

          {/* Estadísticas */}
          <div className="stats-productos">
            <div className="stat-producto primary">
              <Package size={24} color="#FF4D4D" />
              <div className="stat-number">{estadisticas.totalProductos}</div>
              <div className="stat-label">Total Productos</div>
            </div>
            
            <div className="stat-producto success">
              <Package size={24} color="#28a745" />
              <div className="stat-number">{estadisticas.productosActivos}</div>
              <div className="stat-label">Productos Activos</div>
            </div>
            
            <div className="stat-producto secondary">
              <Package size={24} color="#FFC947" />
              <div className="stat-number">{estadisticas.productosAgotados}</div>
              <div className="stat-label">Productos Agotados</div>
            </div>
            
            <div className="stat-producto primary">
              <Package size={24} color="#FF4D4D" />
              <div className="stat-number">{estadisticas.categoriasCount}</div>
              <div className="stat-label">Categorías</div>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="header-actions">
            <div className="search-container">
              <Search size={20} color="#6c757d" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select 
              value={filtroCategoria} 
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="agotado">Agotados</option>
            </select>
          </div>

          {/* Grid de Productos */}
          <div className="productos-grid">
            {productosFiltrados.map((producto) => (
              <div key={producto.idProducto} className="producto-card">
                <div className="producto-header">
                  <div className="producto-image">
                    {producto.imagen || '📦'}
                  </div>
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <div className="producto-precio">${producto.precio}</div>
                  </div>
                  <div className={`producto-estado ${getEstadoColor(producto.estado)}`}>
                    {producto.estado}
                  </div>
                </div>
                
                <div className="producto-detalles">
                  <div className="detalle-producto">
                    <span className="detalle-label">Categoría</span>
                    <span className="detalle-valor">{producto.categoria}</span>
                  </div>
                  <div className="detalle-producto">
                    <span className="detalle-label">Stock</span>
                    <span className="detalle-valor" style={{ 
                      color: producto.stock === 0 ? '#FF4D4D' : producto.stock < 10 ? '#FFC947' : '#28a745' 
                    }}>
                      {producto.stock}
                    </span>
                  </div>
                </div>
                
                <div className="producto-acciones">
                  <button 
                    className="btn-producto btn-editar"
                    onClick={() => handleEditarProducto(producto.idProducto)}
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button 
                    className="btn-producto btn-eliminar"
                    onClick={() => handleEliminarProducto(producto.idProducto, producto.nombre)}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay productos */}
          {productosFiltrados.length === 0 && (
            <div className="content-card text-center">
              <Package size={48} color="#6c757d" />
              <h3 style={{ color: '#333', margin: '1rem 0' }}>No se encontraron productos</h3>
              <p style={{ color: '#6c757d' }}>
                {productos.length === 0 
                  ? "Aún no tienes productos. ¡Crea tu primer producto!" 
                  : "Intenta ajustar los filtros de búsqueda"
                }
              </p>
              {productos.length === 0 && (
                <button 
                  className="btn-primary mt-4"
                  onClick={handleNuevoProducto}
                >
                  <Plus size={18} />
                  Crear Primer Producto
                </button>
              )}
            </div>
          )}

          {/* Información de Prueba */}
          {productos.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Nota:</strong> Actualmente se muestran {productos.length} productos. 
                Conecta los endpoints reales en el backend para gestionar productos en tiempo real.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}