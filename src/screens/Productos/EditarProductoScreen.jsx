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
        console.log('📥 Producto encontrado para editar:', producto);
        
        // Formatear el precio correctamente
        const precioNumerico = producto.precio || 0;
        const precioFormateado = formatearPrecioParaInput(precioNumerico.toString());
        
        setFormData({
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          precio: precioFormateado,
          categoria: producto.categoria || '',
          stock: producto.stock !== undefined ? producto.stock : true,
          imagen: producto.imagen || '',
          unidadMedida: producto.unidadMedida || 'unidad',
          oferta: producto.oferta || false
        });
        
        console.log('📝 FormData inicializado:', {
          nombre: producto.nombre,
          precio: precioFormateado,
          categoria: producto.categoria,
          stock: producto.stock
        });
      } else {
        setError('Producto no encontrado');
        console.error('❌ Producto no encontrado con ID:', id);
      }
    }
  }, [id, productos]);

  // Función para formatear precio para el input (desde número a string formateado)
  const formatearPrecioParaInput = (valorNumerico) => {
    if (!valorNumerico) return "$0,00";
    
    // Convertir a número
    const numero = parseFloat(valorNumerico);
    if (isNaN(numero)) return "$0,00";
    
    // Formatear con separadores
    const partes = numero.toFixed(2).split('.');
    const entero = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimal = partes[1] || '00';
    
    return `$${entero},${decimal}`;
  };

  // Función para formatear mientras se escribe
const formatearPrecio = (value) => {
  if (value === '' || value === '$') {
    return '';
  }
  
  // Eliminar todo excepto números
  let cleaned = value.replace(/[^\d]/g, '');
  
  // Si no hay números, retornar vacío
  if (cleaned === '') {
    return '';
  }
  
  // ✅ CORREGIDO: NO dividir por 100, mantener el valor real
  // Convertir a número (ya está en centavos desde el input)
  const numero = parseInt(cleaned, 10);
  
  // Formatear con separadores (parte entera y decimal)
  const parteEntera = Math.floor(numero / 100);
  const parteDecimal = numero % 100;
  
  const enteroFormateado = parteEntera.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decimalFormateado = parteDecimal.toString().padStart(2, '0');
  
  return `$${enteroFormateado},${decimalFormateado}`;
};

  const handlePrecioChange = (e) => {
    const value = e.target.value;
    
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
    console.log('🔄 Iniciando edición del producto...', { id, formData });

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      throw new Error('El nombre es requerido');
    }
    
    // ✅ CORREGIDO: Procesar el precio CORRECTAMENTE
    let precioNumerico = 0;
    if (formData.precio) {
      // Eliminar símbolos y mantener el valor real
      // Ejemplo: "$11.000,00" -> "11000.00"
      const precioLimpio = formData.precio
        .replace('$', '')           // Quitar $
        .replace(/\./g, '')         // Quitar puntos (separadores de miles)
        .replace(',', '.');         // Convertir coma decimal a punto
      
      precioNumerico = parseFloat(precioLimpio);
      
      if (isNaN(precioNumerico) || precioNumerico <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }
      
      console.log('💰 Precio procesado:', {
        original: formData.precio,
        limpio: precioLimpio,
        numerico: precioNumerico
      });
    }
    
    if (!formData.categoria) {
      throw new Error('La categoría es requerida');
    }

    console.log('📤 Datos preparados para edición:', {
      nombre: formData.nombre,
      precio: precioNumerico,
      categoria: formData.categoria,
      stock: formData.stock,
      descripcion: formData.descripcion,
      unidadMedida: formData.unidadMedida,
      oferta: formData.oferta,
      imagen: formData.imagen
    });

    // ✅ CORRECTO: Enviar como objeto normal, no como FormData
    const productoData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: precioNumerico,
      categoria: formData.categoria,
      stock: formData.stock,
      imagen: formData.imagen,
      unidadMedida: formData.unidadMedida,
      oferta: formData.oferta
    };

    await editarProducto(parseInt(id), productoData);

    console.log('✅ Producto editado exitosamente');
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
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: $1.000,00
                  </p>
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
                  
                  <input
                    type="file"
                    id="imagen-upload"
                    name="imagen"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setFormData(prev => ({
                            ...prev,
                            imagen: e.target.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  
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
                              setFormData(prev => ({ ...prev, imagen: '' }));
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