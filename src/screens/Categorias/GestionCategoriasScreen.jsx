// src/screens/Categorias/GestionCategoriasScreen.jsx - VERSIÓN ACTUALIZADA
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  ArrowLeft, 
  Eye, 
  ShoppingBag, 
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { getCategoriasConProductos, getProductosPorCategoria } from "../../api/categorias";
import { getCategoriasPorComercio } from "../../api/comercioCategorias";
import Sidebar from "../../components/screens/Sidebar";

export default function GestionCategoriasScreen() {
  const navigate = useNavigate();
  const [comercioId] = useState(1); 
  
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [cargandoProductos, setCargandoProductos] = useState(false);

const cargarCategoriasDelComercio = async () => {
  try {
    setLoading(true);
    setError("");
    setSuccess("");
    console.log('🔄 Cargando categorías del comercio...');
    
    let categoriasAsignadas = [];
    let usandoFallback = false;
    
    // 1. Intentar con el API real
    try {
      categoriasAsignadas = await getCategoriasPorComercio(comercioId);
      console.log('✅ Categorías del API:', categoriasAsignadas);
    } catch (apiError) {
      console.warn('⚠️ Error con API principal:', apiError.message);
      
      // Si el endpoint no existe, usar datos de fallback
      if (apiError.message.includes('404') || apiError.message.includes('Not Found')) {
        console.log('🔄 Usando datos de fallback para desarrollo');
        categoriasAsignadas = await getCategoriasPorComercioFallback(comercioId);
        usandoFallback = true;
        setSuccess('Modo desarrollo: usando datos de ejemplo. El endpoint del backend no está disponible.');
      } else {
        throw apiError;
      }
    }
    
    if (!categoriasAsignadas || categoriasAsignadas.length === 0) {
      setCategorias([]);
      if (!usandoFallback) {
        setSuccess('No tienes categorías asignadas a tu comercio. Usa "Gestionar Categorías" para agregar algunas.');
      }
      return;
    }
    
    // 2. Obtener información detallada de cada categoría
    const categoriasConDetalles = await Promise.all(
      categoriasAsignadas.map(async (categoria) => {
        try {
          // Si estamos en modo fallback, usar datos simulados
          if (usandoFallback) {
            return {
              idCategoria: categoria.id,
              nombre: categoria.nombre,
              cantidadProductos: categoria.cantidadProductos,
              productos: [] // No cargamos productos reales en fallback
            };
          }
          
          // Cargar productos reales
          const productos = await getProductosPorCategoria(categoria.id || categoria.idCategoria);
          return {
            idCategoria: categoria.id || categoria.idCategoria,
            nombre: categoria.nombre,
            cantidadProductos: productos.length,
            productos: productos
          };
        } catch (error) {
          console.warn(`⚠️ Error obteniendo productos para categoría ${categoria.nombre}:`, error.message);
          return {
            idCategoria: categoria.id || categoria.idCategoria,
            nombre: categoria.nombre,
            cantidadProductos: 0,
            productos: []
          };
        }
      })
    );
    
    // 3. Filtrar solo categorías que tienen productos (excepto en fallback)
    const categoriasConProductos = usandoFallback 
      ? categoriasConDetalles // En fallback, mostrar todas
      : categoriasConDetalles.filter(categoria => categoria.cantidadProductos > 0);
    
    console.log('✅ Categorías del comercio con productos:', categoriasConProductos);
    setCategorias(categoriasConProductos);
    
    if (categoriasConProductos.length === 0 && !usandoFallback) {
      setSuccess('Tienes categorías asignadas pero ninguna tiene productos. Ve a "Productos" para agregar productos a tus categorías.');
    }
    
  } catch (err) {
    console.error('❌ Error cargando categorías del comercio:', err);
    
    // Mensajes de error específicos
    if (err.message.includes('404') || err.message.includes('Not Found')) {
      setError('El endpoint de categorías del comercio no está disponible en el backend. Contacta al administrador.');
    } else if (err.message.includes('HTML') || err.message.includes('doctype')) {
      setError('Error de conexión: El servidor está devolviendo HTML en lugar de JSON. Verifica la URL del backend.');
    } else {
      setError(err.message || 'Error al cargar las categorías de tu comercio');
    }
  } finally {
    setLoading(false);
  }
};

  const cargarProductosDeCategoria = async (categoriaId) => {
    try {
      setCargandoProductos(true);
      setError("");
      console.log(`📦 Cargando productos para categoría ${categoriaId}...`);
      
      const productos = await getProductosPorCategoria(categoriaId);
      console.log(`✅ Productos cargados para categoría ${categoriaId}:`, productos);
      
      setProductosPorCategoria(prev => ({
        ...prev,
        [categoriaId]: productos
      }));
      
      setCategoriaSeleccionada(categoriaId);
    } catch (err) {
      console.error('❌ Error cargando productos:', err);
      setError(`Error cargando productos: ${err.message}`);
    } finally {
      setCargandoProductos(false);
    }
  };

  const cerrarProductos = () => {
    setCategoriaSeleccionada(null);
  };

  const gestionarCategoriasComercio = () => {
    navigate('/categorias-comercio');
  };

  useEffect(() => {
    cargarCategoriasDelComercio();
  }, []);

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
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Volver a Productos</span>
                </button>
                <div>
                  <h1 className="content-title">Mis Categorías</h1>
                  <p className="content-subtitle">
                    Categorías de tu comercio que contienen productos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} con productos
                </div>
                <button
                  onClick={gestionarCategoriasComercio}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Settings size={16} />
                  <span>Gestionar Categorías</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <p className="text-red-800">{error}</p>
              <button 
                onClick={() => setError("")}
                className="ml-auto text-red-700 hover:text-red-800"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-green-800">{success}</p>
              <button 
                onClick={() => setSuccess("")}
                className="ml-auto text-green-700 hover:text-green-800"
              >
                ×
              </button>
            </div>
          )}

          {/* Lista de Categorías del Comercio */}
          <div className="content-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Categorías de Mi Comercio
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Estas son las categorías asignadas a tu comercio que contienen productos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={cargarCategoriasDelComercio}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                  {loading ? 'Cargando...' : 'Actualizar'}
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando categorías de tu comercio...</p>
              </div>
            ) : categorias.length === 0 ? (
              <div className="text-center py-12">
                <Package size={64} className="mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  No hay categorías con productos
                </h4>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {success 
                    ? success 
                    : 'No tienes categorías asignadas a tu comercio o no contienen productos.'
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={gestionarCategoriasComercio}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Gestionar Categorías
                  </button>
                  <button
                    onClick={() => navigate('/productos')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Ir a Productos
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {categorias.map((categoria) => (
                  <div
                    key={categoria.idCategoria}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">
                            {categoria.nombre}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <ShoppingBag size={14} />
                              {categoria.cantidadProductos} producto{categoria.cantidadProductos !== 1 ? 's' : ''}
                            </span>
                            <span>•</span>
                            <span>ID: {categoria.idCategoria}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => cargarProductosDeCategoria(categoria.idCategoria)}
                        disabled={cargandoProductos}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Eye size={16} />
                        <span>Ver Productos</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal de Productos por Categoría */}
          {categoriaSeleccionada && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Productos en {categorias.find(c => c.idCategoria === categoriaSeleccionada)?.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {productosPorCategoria[categoriaSeleccionada]?.length || 0} productos en esta categoría
                    </p>
                  </div>
                  <button
                    onClick={cerrarProductos}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={cargandoProductos}
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {cargandoProductos ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando productos...</p>
                    </div>
                  ) : productosPorCategoria[categoriaSeleccionada] ? (
                    productosPorCategoria[categoriaSeleccionada].length > 0 ? (
                      <div className="grid gap-4">
                        {productosPorCategoria[categoriaSeleccionada].map((producto, index) => (
                          <div
                            key={producto.idProducto || producto.id || index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <ShoppingBag size={20} className="text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {producto.nombre || producto.Nombre || 'Sin nombre'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  ${(producto.precio || producto.Precio || 0).toFixed(2)}
                                </p>
                                {producto.descripcion && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    {producto.descripcion}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                (producto.stock || producto.Stock || 0) > 0 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {(producto.stock || producto.Stock || 0) > 0 ? 'En stock' : 'Agotado'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Package size={64} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 text-lg">No hay productos en esta categoría</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No se pudieron cargar los productos</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end p-6 border-t">
                  <button
                    onClick={cerrarProductos}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Información para el usuario */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Eye size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Información sobre Categorías</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>Solo ves las categorías asignadas a tu comercio</li>
                  <li>Los clientes podrán filtrar productos por estas categorías</li>
                  <li>Para agregar más categorías, usa "Gestionar Categorías"</li>
                  <li>Los productos se asignan a categorías en la gestión de productos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}