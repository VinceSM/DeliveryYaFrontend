// src/screens/Productos/EditarProductoScreen.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/screens/CrearProductoScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { ArrowLeft, Save, Package, X } from 'lucide-react';
import { useProductos } from "../../hooks/useProductos";

export default function EditarProductoScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { productos, categorias, editarProducto } = useProductos();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: true,
    imagen: '',
    imagenFile: null,
    unidadMedida: 'unidad',
    oferta: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del producto al montar el componente
  useEffect(() => {
    if (id && productos.length > 0) {
      const producto = productos.find(p => p.idProducto === parseInt(id));
      if (producto) {
        const precioFormateado = producto.precio 
          ? formatearPrecio(producto.precio.toString())
          : '';
        
        setFormData({
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          precio: precioFormateado,
          categoria: producto.categoria || '',
          stock: producto.stock !== undefined ? producto.stock > 0 : true,
          imagen: producto.imagen || '',
          imagenFile: null,
          unidadMedida: producto.unidadMedida || 'unidad',
          oferta: producto.oferta || false
        });
      } else {
        setError('Producto no encontrado');
      }
    }
  }, [id, productos]);

  const formatearPrecio = (value) => {
    // Eliminar todo excepto números y coma
    let cleaned = value.replace(/[^\d,]/g, '');
    
    // Permitir solo una coma
    const partes = cleaned.split(',');
    if (partes.length > 2) {
      cleaned = partes[0] + ',' + partes.slice(1).join('');
    }
    
    // Limitar a 2 decimales después de la coma
    if (partes.length === 2 && partes[1].length > 2) {
      cleaned = partes[0] + ',' + partes[1].substring(0, 2);
    }
    
    // Separar parte entera y decimal
    const [entero, decimal] = cleaned.split(',');
    
    // Agregar separadores de miles (puntos)
    const enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Construir el resultado
    let resultado = enteroFormateado;
    if (decimal !== undefined) {
      resultado += ',' + decimal;
    }
    
    return resultado ? '$' + resultado : '';
  };

  const handlePrecioChange = (e) => {
    const value = e.target.value;
    
    // Si está vacío, permitir
    if (value === '' || value === '$') {
      setFormData(prev => ({ ...prev, precio: '' }));
      return;
    }
    
    // Formatear el precio
    const precioFormateado = formatearPrecio(value);
    setFormData(prev => ({ ...prev, precio: precioFormateado }));
  };

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
      
      const precioLimpio = formData.precio.replace(/[$.,]/g, '').replace(',', '.');
      const precioNumerico = parseFloat(precioLimpio) / 100; // Dividir por 100 porque contamos los centavos
      
      if (!precioLimpio || precioNumerico <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }
      if (!formData.categoria) {
        throw new Error('La categoría es requerida');
      }

      // Crear FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precio', precioNumerico);
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('unidadMedida', formData.unidadMedida);
      formDataToSend.append('oferta', formData.oferta);
      
      if (formData.imagenFile) {
        formDataToSend.append('imagen', formData.imagenFile);
      }

      await editarProducto(parseInt(id), formDataToSend);

      navigate('/productos');
      
    } catch (error) {
      console.error('❌ Error editando producto:', error);
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
          <div className="productos-header">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/productos')}
                className="btn-volver"
              >
                <ArrowLeft size={18} /> Volver
              </button>
              <div>
                <h1 className="content-title">Editar Producto</h1>
                <p className="text-gray-600 text-lg mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Modifica la información del producto
                </p>
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
            
            {/* Mensaje de campos requeridos */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Nota:</strong> Todos los campos marcados con <span className="text-red-500">*</span> son requeridos
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-grid">
                {/* Nombre */}
                <div>
                  <label className="form-label">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
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
                  <label className="form-label">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="precio"
                    value={formData.precio}
                    onChange={handlePrecioChange}
                    className="form-input"
                    placeholder="$0,00"
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="form-label">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="form-select"
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
                  <label className="form-label">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        value="true"
                        checked={formData.stock === true}
                        onChange={() => setFormData(prev => ({ ...prev, stock: true }))}
                        className="text-green-500 focus:ring-green-500"
                      />
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Disponible
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stock"
                        value="false"
                        checked={formData.stock === false}
                        onChange={() => setFormData(prev => ({ ...prev, stock: false }))}
                        className="text-red-500 focus:ring-red-500"
                      />
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Sin stock
                      </span>
                    </label>
                  </div>
                </div>

                {/* Unidad de Medida */}
                <div>
                  <label className="form-label">Unidad de Medida</label>
                  <select
                    name="unidadMedida"
                    value={formData.unidadMedida}
                    onChange={handleChange}
                    className="form-select"
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
                  <label className="form-label">Imagen del Producto</label>
                  
                  {/* Input de archivo oculto */}
                  <input
                    type="file"
                    id="imagen-upload"
                    name="imagen"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Crear URL local para la vista previa
                        const imageUrl = URL.createObjectURL(file);
                        setFormData(prev => ({
                          ...prev,
                          imagen: imageUrl,
                          imagenFile: file // Guardar el archivo para enviarlo
                        }));
                      }
                    }}
                    className="hidden"
                  />
                  
                  {/* Área de carga personalizada */}
                  <div className="flex flex-col gap-3">
                    {!formData.imagen ? (
                      <div 
                        className="upload-area upload-area-small"
                        onClick={() => document.getElementById('imagen-upload').click()}
                      >
                        <div className="text-center">
                          <p className="text-gray-600 font-medium text-sm">Haz clic para subir una imagen</p>
                          <p className="text-gray-500 text-xs mt-1">
                            PNG, JPG, WEBP hasta 5MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-2">
                        <div className="relative inline-block">
                          <div 
                            className="cursor-pointer"
                            onClick={() => document.getElementById('imagen-upload').click()}
                          >
                            <img 
                              src={formData.imagen || "/placeholder.svg"} 
                              alt="Vista previa" 
                              className="h-20 w-20 object-cover rounded-lg border border-gray-300 shadow-sm hover:opacity-80 transition-opacity"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, imagen: '', imagenFile: null }));
                              // Limpiar el input file
                              document.getElementById('imagen-upload').value = '';
                            }}
                            className="btn-eliminar-imagen"
                            title="Eliminar imagen"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe el producto, ingredientes, características especiales..."
                  rows="4"
                />
              </div>

              {/* Oferta */}
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-orange-50">
                <input
                  type="checkbox"
                  name="oferta"
                  checked={formData.oferta}
                  onChange={handleChange}
                  className="rounded border-orange-300 text-orange-500 focus:ring-orange-500"
                />
                <label className="form-label mb-0 flex items-center gap-2">
                  <span className="text-orange-600">🏷️ ¿Producto en oferta?</span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/productos')}
                  className="btn-cancelar"
                >
                  <ArrowLeft size={18} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-guardar"
                >
                  {loading ? (
                    <>
                      <Package className="animate-spin" size={20} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Guardar Cambios
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
