// src/screens/Categorias/GestionCategoriasScreen.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ArrowLeft, Eye, ShoppingBag } from "lucide-react";
import { getCategorias, getProductosPorCategoria } from "../../api/categorias";
import Sidebar from "../../components/screens/Sidebar";

export default function GestionCategoriasScreen() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productosPorCategoria, setProductosPorCategoria] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategorias();
      
      // Filtrar solo categorías que tienen productos
      const categoriasConProductos = data.filter(categoria => 
        categoria.cantidadProductos > 0
      );
      
      setCategorias(categoriasConProductos);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductosDeCategoria = async (categoriaId) => {
    try {
      setError("");
      const productos = await getProductosPorCategoria(categoriaId);
      
      setProductosPorCategoria(prev => ({
        ...prev,
        [categoriaId]: productos
      }));
      
      setCategoriaSeleccionada(categoriaId);
    } catch (err) {
      setError(`Error cargando productos: ${err.message}`);
      console.error('Error cargando productos:', err);
    }
  };

  const cerrarProductos = () => {
    setCategoriaSeleccionada(null);
  };

  useEffect(() => {
    cargarCategorias();
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
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="content-title">Categorías con Productos</h1>
                  <p className="content-subtitle">
                    Visualiza las categorías que contienen productos en tu comercio
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Modo de solo lectura
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Lista de Categorías */}
          <div className="content-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Categorías con Productos</h3>
              <span className="text-sm text-gray-500">
                {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} encontrada{categorias.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando categorías...</p>
              </div>
            ) : categorias.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No hay categorías con productos</p>
                <p className="text-sm text-gray-500 mt-2">
                  Las categorías aparecerán aquí cuando tengan productos asociados
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {categorias.map((categoria) => (
                  <div
                    key={categoria.idCategoria}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{categoria.nombre}</h4>
                      <p className="text-sm text-gray-600">
                        {categoria.cantidadProductos || 0} producto{categoria.cantidadProductos !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => cargarProductosDeCategoria(categoria.idCategoria)}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Ver productos de esta categoría"
                      >
                        <Eye size={16} />
                        <span className="text-sm">Ver Productos</span>
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
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="text-lg font-semibold">
                    Productos en {categorias.find(c => c.idCategoria === categoriaSeleccionada)?.nombre}
                  </h3>
                  <button
                    onClick={cerrarProductos}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {productosPorCategoria[categoriaSeleccionada] ? (
                    productosPorCategoria[categoriaSeleccionada].length > 0 ? (
                      <div className="grid gap-3">
                        {productosPorCategoria[categoriaSeleccionada].map((producto) => (
                          <div
                            key={producto.idProducto || producto.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <ShoppingBag size={20} className="text-green-600" />
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {producto.nombre || producto.Nombre}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  ${producto.precio || producto.Precio || '0.00'}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {producto.stock || producto.Stock || 0} en stock
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">No hay productos en esta categoría</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Cargando productos...</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end p-6 border-t">
                  <button
                    onClick={cerrarProductos}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
                <h4 className="font-medium text-blue-800">Modo de solo lectura</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Solo puedes visualizar las categorías que tienen productos asociados. 
                  Para agregar o modificar categorías, contacta al administrador del sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}