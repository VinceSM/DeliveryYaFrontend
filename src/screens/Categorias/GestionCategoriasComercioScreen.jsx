// src/screens/Categorias/GestionCategoriasComercioScreen.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { getTodasLasCategorias } from "../../api/categorias";
import { 
  getCategoriasPorComercio, 
  agregarCategoriaAComercio, 
  eliminarCategoriaDeComercio 
} from "../../api/comercioCategorias";
import Sidebar from "../../components/screens/Sidebar";

export default function GestionCategoriasComercioScreen() {
  const navigate = useNavigate();
  const [comercioId] = useState(1); 
  
  // Estados
  const [todasLasCategorias, setTodasLasCategorias] = useState([]);
  const [categoriasDelComercio, setCategoriasDelComercio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [procesando, setProcesando] = useState(false);

  // Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log(`🔄 Cargando categorías para comercio ${comercioId}...`);
      
      // Cargar todas las categorías disponibles
      const [todasCategorias, categoriasComercio] = await Promise.all([
        getTodasLasCategorias(),
        getCategoriasPorComercio(comercioId)
      ]);
      
      console.log('✅ Todas las categorías:', todasCategorias);
      console.log('✅ Categorías del comercio:', categoriasComercio);
      
      setTodasLasCategorias(todasCategorias);
      setCategoriasDelComercio(categoriasComercio);
      
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  // Agregar categoría al comercio
  const handleAgregarCategoria = async (categoriaId) => {
    try {
      setProcesando(true);
      setError("");
      
      console.log(`➕ Agregando categoría ${categoriaId} al comercio...`);
      
      await agregarCategoriaAComercio(comercioId, categoriaId);
      
      // Actualizar lista local
      const categoriaAgregada = todasLasCategorias.find(c => c.idCategoria === categoriaId);
      if (categoriaAgregada) {
        setCategoriasDelComercio(prev => [...prev, categoriaAgregada]);
      }
      
      setSuccess('Categoría agregada correctamente al comercio');
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error('❌ Error agregando categoría:', err);
      setError(err.message || 'Error al agregar la categoría');
    } finally {
      setProcesando(false);
    }
  };

  // Eliminar categoría del comercio
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
      
      setSuccess('Categoría eliminada correctamente del comercio');
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error('❌ Error eliminando categoría:', err);
      setError(err.message || 'Error al eliminar la categoría');
    } finally {
      setProcesando(false);
    }
  };

  // Filtrar categorías
  const categoriasFiltradas = todasLasCategorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Categorías disponibles para agregar (las que no están en el comercio)
  const categoriasDisponibles = categoriasFiltradas.filter(
    categoria => !categoriasDelComercio.some(c => c.idCategoria === categoria.idCategoria)
  );

  useEffect(() => {
    cargarDatos();
  }, [comercioId]);

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
                  <h1 className="content-title">Gestión de Categorías del Comercio</h1>
                  <p className="content-subtitle">
                    Agrega o elimina categorías para tu comercio
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {categoriasDelComercio.length} categoría{categoriasDelComercio.length !== 1 ? 's' : ''} asignada{categoriasDelComercio.length !== 1 ? 's' : ''}
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
                <X size={16} />
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
                <X size={16} />
              </button>
            </div>
          )}

          {/* Controles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Categorías del Comercio */}
            <div className="content-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Categorías Asignadas
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {categoriasDelComercio.length} de {todasLasCategorias.length}
                  </span>
                  <button
                    onClick={cargarDatos}
                    disabled={loading || procesando}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Cargando categorías...</p>
                </div>
              ) : categoriasDelComercio.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={48} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">No hay categorías asignadas</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Agrega categorías desde la lista de disponibles
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categoriasDelComercio.map((categoria) => (
                    <div
                      key={categoria.idCategoria}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-800">
                          {categoria.nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEliminarCategoria(categoria.idCategoria)}
                        disabled={procesando}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                        title="Eliminar categoría del comercio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Categorías Disponibles */}
            <div className="content-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Categorías Disponibles
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Filter size={16} />
                  <span>{categoriasDisponibles.length} disponibles</span>
                </div>
              </div>

              {/* Barra de búsqueda */}
              <div className="mb-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar categorías..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Cargando categorías...</p>
                </div>
              ) : categoriasDisponibles.length === 0 ? (
                <div className="text-center py-8">
                  <Check size={48} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600">
                    {busqueda ? 'No se encontraron categorías' : 'Todas las categorías están asignadas'}
                  </p>
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda("")}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {categoriasDisponibles.map((categoria) => (
                    <div
                      key={categoria.idCategoria}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-800">
                          {categoria.nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAgregarCategoria(categoria.idCategoria)}
                        disabled={procesando}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={14} />
                        <span>Agregar</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Package size={18} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">Cómo funciona</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>Las categorías asignadas aparecerán en tu comercio</li>
                  <li>Los clientes podrán filtrar productos por estas categorías</li>
                  <li>Puedes agregar o eliminar categorías en cualquier momento</li>
                  <li>Los cambios se reflejan inmediatamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}