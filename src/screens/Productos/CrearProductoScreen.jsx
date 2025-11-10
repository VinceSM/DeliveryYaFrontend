// src/screens/Productos/CrearProductoScreen.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Plus, Search, X } from "lucide-react";
import { useProductos } from "../../hooks/useProductos";
import Sidebar from "../../components/screens/Sidebar";
import { obtenerComercioIdAutenticado } from "../../api/productos";

export default function CrearProductoScreen() {
  const navigate = useNavigate();
  const { categorias, agregarProducto } = useProductos();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: true, 
    imagen: '',
    unidadMedida: 'unidad',
    oferta: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busquedaCategoria, setBusquedaCategoria] = useState('');
  const [mostrarSelectorCategorias, setMostrarSelectorCategorias] = useState(false);

  // Filtrar categorías basado en la búsqueda
  const categoriasFiltradas = useMemo(() => {
    if (!busquedaCategoria.trim()) {
      return categorias;
    }
    
    const busqueda = busquedaCategoria.toLowerCase();
    return categorias.filter(categoria => 
      categoria.toLowerCase().includes(busqueda)
    );
  }, [categorias, busquedaCategoria]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const seleccionarCategoria = (categoria) => {
    setFormData(prev => ({
      ...prev,
      categoria
    }));
    setMostrarSelectorCategorias(false);
    setBusquedaCategoria('');
  };

  const abrirSelectorCategorias = () => {
    setMostrarSelectorCategorias(true);
    setBusquedaCategoria('');
  };

  const cerrarSelectorCategorias = () => {
    setMostrarSelectorCategorias(false);
    setBusquedaCategoria('');
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }
      if (!formData.categoria) {
        throw new Error('La categoría es requerida');
      }

      console.log('📤 Enviando datos del producto:', formData);

      // ✅ AHORA la función está disponible
      const comercioId = await obtenerComercioIdAutenticado();
      console.log('🏪 ComercioId que se enviará:', comercioId);

      await agregarProducto({
        ...formData,
        precio: parseFloat(formData.precio),
      });

      // Redirigir a la lista de productos
      navigate('/productos');
      
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {/* Header */}
          <div className="content-header">
            <div className="productos-header">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/productos')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="content-title">Nuevo Producto</h1>
                  <p className="content-subtitle">Agrega un nuevo producto a tu inventario</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="content-card">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ... (el mismo formulario que tenías antes) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label className="form-label">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Ej: Hamburguesa Especial"
                    required
                  />
                </div>

                {/* Precio */}
                <div>
                  <label className="form-label">Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                {/* Categoría */}
                <div className="relative">
                  <label className="form-label">Categoría *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.categoria}
                      readOnly
                      className="form-input cursor-pointer bg-gray-50"
                      placeholder="Seleccionar categoría"
                      onClick={abrirSelectorCategorias}
                      required
                    />
                    <div 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={abrirSelectorCategorias}
                    >
                      <Search size={16} className="text-gray-400" />
                    </div>
                  </div>

                  {mostrarSelectorCategorias && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                      <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            value={busquedaCategoria}
                            onChange={(e) => setBusquedaCategoria(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Buscar categoría..."
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={cerrarSelectorCategorias}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-48 overflow-y-auto">
                        {categoriasFiltradas.length > 0 ? (
                          categoriasFiltradas.map((categoria, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => seleccionarCategoria(categoria)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-800">{categoria}</span>
                                {formData.categoria === categoria && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            {busquedaCategoria ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
                          </div>
                        )}
                      </div>

                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{categoriasFiltradas.length} categorías</span>
                          <button
                            type="button"
                            onClick={cerrarSelectorCategorias}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    name="stock"
                    checked={formData.stock}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <label className="form-label mb-0">
                    {formData.stock ? "✅ Disponible" : "❌ Sin stock"}
                  </label>
                </div>

                {/* Unidad de Medida */}
                <div>
                  <label className="form-label">Unidad de Medida</label>
                  <select
                    name="unidadMedida"
                    value={formData.unidadMedida}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="unidad">Unidad</option>
                    <option value="kg">Kilogramo</option>
                    <option value="gr">Gramo</option>
                    <option value="lt">Litro</option>
                    <option value="ml">Mililitro</option>
                    <option value="porcion">Porción</option>
                  </select>
                </div>

                {/* Imagen */}
                <div>
                  <label className="form-label">URL de Imagen</label>
                  <input
                    type="text"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {formData.imagen && (
                    <div className="mt-2">
                      <img 
                        src={formData.imagen} 
                        alt="Vista previa" 
                        className="h-20 w-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-input min-h-[100px]"
                  placeholder="Describe el producto..."
                  rows="4"
                />
              </div>

              {/* Oferta */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="oferta"
                  checked={formData.oferta}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className="form-label mb-0">¿Producto en oferta?</label>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/productos')}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Package className="animate-spin" size={20} />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Crear Producto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}