// src/screens/Categorias/GestionCategoriasScreen.jsx - VERSIÓN UNIFICADA
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Eye, ShoppingBag, RefreshCw, AlertCircle, CheckCircle, Plus, Trash2, Search, X } from 'lucide-react';
import { getTodasLasCategorias, getProductosPorCategoria } from "../../api/categorias";
import { 
  getCategoriasPorComercio, 
  agregarCategoriaAComercio, 
  eliminarCategoriaDeComercio 
} from "../../api/comercioCategorias";
import Sidebar from "../../components/screens/Sidebar";
import "../../styles/screens/GestionCategoriasScreen.css";

export default function GestionCategoriasScreen() {
  const navigate = useNavigate();
  const [comercioId] = useState(1); 
  
  // Estados principales
  const [todasLasCategorias, setTodasLasCategorias] = useState([]);
  const [categoriasDelComercio, setCategoriasDelComercio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [procesando, setProcesando] = useState(false);
  
  // Estados para productos
  const [productosPorCategoria] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [cargandoProductos] = useState(false);
  
  // Estados para búsqueda
  const [busqueda, setBusqueda] = useState("");
  const [mostrarDisponibles, setMostrarDisponibles] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      console.log('🔄 Cargando categorías...');
      
      const [todasCategorias, categoriasComercio] = await Promise.all([
        getTodasLasCategorias(),
        getCategoriasPorComercio(comercioId)
      ]);
      
      console.log('✅ Todas las categorías:', todasCategorias);
      console.log('✅ Categorías del comercio:', categoriasComercio);
      
      setTodasLasCategorias(todasCategorias);
      
      // Obtener cantidad de productos para cada categoría del comercio
      const categoriasConDetalles = await Promise.all(
        categoriasComercio.map(async (categoria) => {
          try {
            const productos = await getProductosPorCategoria(categoria.id || categoria.idCategoria);
            return {
              ...categoria,
              idCategoria: categoria.id || categoria.idCategoria,
              cantidadProductos: productos.length,
              productos: productos
            };
          } catch (error) {
            console.warn(`⚠️ Error obteniendo productos para categoría ${categoria.nombre}:`, error.message);
            return {
              ...categoria,
              idCategoria: categoria.id || categoria.idCategoria,
              cantidadProductos: 0,
              productos: []
            };
          }
        })
      );
      
      setCategoriasDelComercio(categoriasConDetalles);
      
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarCategoria = async (categoriaId) => {
    try {
      setProcesando(true);
      setError("");
      
      console.log(`➕ Agregando categoría ${categoriaId} al comercio...`);
      
      await agregarCategoriaAComercio(comercioId, categoriaId);
      
      // Recargar datos para actualizar
      await cargarDatos();
      
      setSuccess('Categoría agregada correctamente');
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error('❌ Error agregando categoría:', err);
      setError(err.message || 'Error al agregar la categoría');
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarCategoria = async (categoriaId) => {
    try {
      setProcesando(true);
      setError("");
      
      console.log(`➖ Eliminando categoría ${categoriaId} del comercio...`);
      
      await eliminarCategoriaDeComercio(comercioId, categoriaId);
      
      // Actualizar lista local
      setCategoriasDelComercio(prev => 
        prev.filter(c => c.idCategoria !== categoriaId)
      );
      
      setSuccess('Categoría eliminada correctamente');
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error('❌ Error eliminando categoría:', err);
      setError(err.message || 'Error al eliminar la categoría');
    } finally {
      setProcesando(false);
    }
  };

  const cerrarProductos = () => {
    setCategoriaSeleccionada(null);
  };

  const categoriasDisponibles = todasLasCategorias
    .filter(categoria => !categoriasDelComercio.some(c => c.idCategoria === categoria.idCategoria))
    .filter(categoria => categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="gestion-categorias-container">
      <Sidebar />
      
      <main className="gestion-categorias-main">
        <div className="gestion-categorias-wrapper">
          {/* Header */}
          <div className="gestion-categorias-header">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="gestion-categorias-title">
                    Gestión de Categorías
                  </h1>
                  <p className="text-gray-600 text-lg mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Administra las categorías de tu comercio y visualiza sus productos
                  </p>
                </div>
              </div>
              <button
                onClick={cargarDatos}
                disabled={loading || procesando}
                className="btn btn-ver"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="mensaje-alerta mensaje-error">
              <AlertCircle size={20} className="mensaje-error-icono" />
              <p className="mensaje-error-texto">{error}</p>
              <button 
                onClick={() => setError("")}
                className="mensaje-error-boton"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {success && (
            <div className="mensaje-alerta mensaje-exito">
              <CheckCircle size={20} className="mensaje-exito-icono" />
              <p className="mensaje-exito-texto">{success}</p>
              <button 
                onClick={() => setSuccess("")}
                className="mensaje-exito-boton"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Categorías del Comercio */}
          <div className="categorias-card">
            <div className="categorias-card-header">
              <div>
                <h3 className="categorias-card-titulo">
                  Categorías Asignadas
                </h3>
                <p className="categorias-card-descripcion">
                  {categoriasDelComercio.length} categorías en tu comercio
                </p>
              </div>
              <button
                onClick={() => setMostrarDisponibles(!mostrarDisponibles)}
                className="btn btn-agregar"
              >
                <Plus size={16} />
                <span>{mostrarDisponibles ? 'Ocultar' : 'Agregar Categorías'}</span>
              </button>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-texto">Cargando categorías...</p>
              </div>
            ) : categoriasDelComercio.length === 0 ? (
              <div className="empty-state">
                <Package size={64} className="empty-state-icono" />
                <h4 className="empty-state-titulo">
                  No hay categorías asignadas
                </h4>
                <p className="empty-state-descripcion">
                  Agrega categorías a tu comercio para empezar
                </p>
                <button
                  onClick={() => setMostrarDisponibles(true)}
                  className="btn btn-agregar"
                >
                  Agregar Categorías
                </button>
              </div>
            ) : (
              <div className="categorias-grid">
                {categoriasDelComercio.map((categoria) => (
                  <div
                    key={categoria.idCategoria}
                    className="categoria-item"
                  >
                    <div className="categoria-info">
                      <div className="categoria-header">
                        <div className="categoria-indicador categoria-indicador-activo"></div>
                        <div>
                          <h4 className="categoria-nombre">
                            {categoria.nombre}
                          </h4>
                          <div className="categoria-detalles">
                            <span className="categoria-productos">
                              <ShoppingBag size={14} />
                              {categoria.cantidadProductos} producto{categoria.cantidadProductos !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="categoria-acciones">
                      {categoria.cantidadProductos > 0 && (
                        <button
                          onClick={() => navigate("/productos")}
                          disabled={cargandoProductos}
                          className="btn btn-ver"
                        >
                          <Eye size={16} />
                          <span>Ver Productos</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleEliminarCategoria(categoria.idCategoria)}
                        disabled={procesando}
                        className="btn btn-eliminar"
                        title="Eliminar categoría"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel de Categorías Disponibles (colapsable) */}
          {mostrarDisponibles && (
            <div className="categorias-card">
              <div className="categorias-card-header">
                <div>
                  <h3 className="categorias-card-titulo">
                    Agregar Categorías
                  </h3>
                  <p className="categorias-card-descripcion">
                    {categoriasDisponibles.length} categorías disponibles
                  </p>
                </div>
                <button
                  onClick={() => setMostrarDisponibles(false)}
                  className="btn-icono"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Barra de búsqueda */}
              <div className="busqueda-container">
                <div className="busqueda-wrapper">
                  <Search size={16} className="busqueda-icono" />
                  <input
                    type="text"
                    placeholder="Buscar categorías..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="busqueda-input"
                  />
                </div>
              </div>

              {categoriasDisponibles.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle size={48} className="empty-state-icono" />
                  <p className="empty-state-descripcion">
                    {busqueda ? 'No se encontraron categorías' : 'Todas las categorías están asignadas'}
                  </p>
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda("")}
                      className="btn btn-ver"
                      style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              ) : (
                <div className="categorias-grid">
                  {categoriasDisponibles.map((categoria) => (
                    <div
                      key={categoria.idCategoria}
                      className="categoria-disponible-item"
                    >
                      <div className="categoria-disponible-info">
                        <div className="categoria-indicador categoria-indicador-disponible"></div>
                        <span className="categoria-disponible-nombre">
                          {categoria.nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAgregarCategoria(categoria.idCategoria)}
                        disabled={procesando}
                        className="btn-agregar-pequeno"
                      >
                        <Plus size={14} />
                        <span>Agregar</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modal de Productos por Categoría */}
          {categoriaSeleccionada && (
            <div className="modal-overlay">
              <div className="modal-contenido">
                <div className="modal-header">
                  <div>
                    <h3 className="modal-titulo">
                      Productos en {categoriasDelComercio.find(c => c.idCategoria === categoriaSeleccionada)?.nombre}
                    </h3>
                    <p className="modal-descripcion">
                      {productosPorCategoria[categoriaSeleccionada]?.length || 0} productos en esta categoría
                    </p>
                  </div>
                  <button
                    onClick={cerrarProductos}
                    className="btn-icono"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="modal-body">
                  {cargandoProductos ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p className="loading-texto">Cargando productos...</p>
                    </div>
                  ) : productosPorCategoria[categoriaSeleccionada] ? (
                    productosPorCategoria[categoriaSeleccionada].length > 0 ? (
                      <div className="categorias-grid">
                        {productosPorCategoria[categoriaSeleccionada].map((producto, index) => (
                          <div
                            key={producto.idProducto || producto.id || index}
                            className="producto-item"
                          >
                            <div className="producto-contenido">
                              <div className="producto-icono-wrapper">
                                <ShoppingBag size={20} className="producto-icono" />
                              </div>
                              <div>
                                <h4 className="producto-nombre">
                                  {producto.nombre || producto.Nombre || 'Sin nombre'}
                                </h4>
                                <p className="producto-precio">
                                  ${(producto.precio || producto.Precio || 0).toFixed(2)}
                                </p>
                                {producto.descripcion && (
                                  <p className="producto-descripcion">
                                    {producto.descripcion}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="producto-stock">
                              <div className={`producto-badge ${
                                (producto.stock || producto.Stock || 0) > 0 
                                  ? 'producto-badge-disponible' 
                                  : 'producto-badge-agotado'
                              }`}>
                                {(producto.stock || producto.Stock || 0) > 0 ? 'En stock' : 'Agotado'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <Package size={64} className="empty-state-icono" />
                        <p className="empty-state-descripcion" style={{ fontSize: '1.125rem' }}>No hay productos en esta categoría</p>
                      </div>
                    )
                  ) : (
                    <div className="loading-container">
                      <p className="loading-texto">No se pudieron cargar los productos</p>
                    </div>
                  )}
                </div>
                
                <div className="modal-footer">
                  <button
                    onClick={cerrarProductos}
                    className="btn btn-cerrar"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Información */}
          <div className="info-box">
            <div className="info-box-contenido">
              <div className="info-box-icono-wrapper">
                <Package size={18} className="info-box-icono" />
              </div>
              <div>
                <h4 className="info-box-titulo">Información</h4>
                <ul className="info-box-lista">
                  <li>Gestiona las categorías asignadas a tu comercio desde esta pantalla</li>
                  <li>Visualiza los productos de cada categoría haciendo clic en "Ver Productos"</li>
                  <li>Agrega nuevas categorías usando el botón "Agregar Categorías"</li>
                  <li>Los clientes podrán filtrar productos por estas categorías</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
