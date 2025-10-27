// src/screens/Productos/NuevoProductoScreen.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/screens/ProductosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { ArrowLeft, Save, Package, Plus } from "lucide-react";
import { useProductos } from "../../hooks/useProductos";

export default function NuevoProductoScreen() {
  const navigate = useNavigate();
  const { categorias, agregarProducto } = useProductos();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: '',
    unidadMedida: 'unidad',
    oferta: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

      await agregarProducto({
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0
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
                <div>
                  <label className="form-label">Categoría *</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((categoria, index) => (
                      <option key={index} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                  />
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