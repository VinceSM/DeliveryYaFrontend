import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/screens/EditarProductoScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { Package, ArrowLeft, Save, Upload } from "lucide-react";

// Datos de ejemplo (en una app real esto vendría de una API)
const productoEjemplo = {
  id: 1,
  nombre: "Hamburguesa Clásica",
  descripcion: "Carne 150g, lechuga, tomate, queso cheddar",
  precio: 12.50,
  categoria: "Hamburguesas",
  stock: 25,
  estado: "activo",
  imagen: "🍔",
  ingredientes: "Carne, lechuga, tomate, queso, pan",
  tiempoPreparacion: 15,
  destacado: true
};

const categorias = [
  "Hamburguesas",
  "Pizzas",
  "Ensaladas",
  "Sushi",
  "Bebidas",
  "Mexicana",
  "Postres",
  "Entradas"
];

export default function EditarProductoScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const esNuevo = !id;

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    estado: "activo",
    ingredientes: "",
    tiempoPreparacion: "",
    destacado: false
  });

  const [imagenPreview, setImagenPreview] = useState("🍔");
  const [guardando, setGuardando] = useState(false);

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (!esNuevo) {
      // Simular carga de datos desde API
      setTimeout(() => {
        setProducto({
          nombre: productoEjemplo.nombre,
          descripcion: productoEjemplo.descripcion,
          precio: productoEjemplo.precio.toString(),
          categoria: productoEjemplo.categoria,
          stock: productoEjemplo.stock.toString(),
          estado: productoEjemplo.estado,
          ingredientes: productoEjemplo.ingredientes,
          tiempoPreparacion: productoEjemplo.tiempoPreparacion.toString(),
          destacado: productoEjemplo.destacado
        });
        setImagenPreview(productoEjemplo.imagen);
      }, 500);
    }
  }, [id, esNuevo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // En una app real, aquí subirías la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    // Simular guardado
    setTimeout(() => {
      console.log("Producto guardado:", producto);
      setGuardando(false);
      navigate("/productos");
    }, 1500);
  };

  const handleCancelar = () => {
    navigate("/productos");
  };

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {/* Header */}
          <div className="content-header">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleCancelar}
                  className="btn-secundario flex items-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Volver
                </button>
                <div>
                  <h1 className="content-title">
                    {esNuevo ? "Nuevo Producto" : "Editar Producto"}
                  </h1>
                  <p className="content-subtitle">
                    {esNuevo ? "Agrega un nuevo producto a tu menú" : "Modifica la información del producto"}
                  </p>
                </div>
              </div>
              
              <button 
                type="submit"
                form="form-producto"
                className="btn-primary flex items-center gap-2"
                disabled={guardando}
              >
                <Save size={18} />
                {guardando ? "Guardando..." : "Guardar Producto"}
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="form-container">
            <form id="form-producto" onSubmit={handleSubmit} className="producto-form">
              <div className="form-grid">
                {/* Columna izquierda - Información básica */}
                <div className="form-column">
                  <div className="form-section">
                    <h3 className="section-title">Información Básica</h3>
                    
                    <div className="form-group">
                      <label className="form-label">Nombre del Producto *</label>
                      <input
                        type="text"
                        name="nombre"
                        value={producto.nombre}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Ej: Hamburguesa Clásica"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Descripción *</label>
                      <textarea
                        name="descripcion"
                        value={producto.descripcion}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Describe el producto..."
                        rows="3"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Categoría *</label>
                      <select
                        name="categoria"
                        value={producto.categoria}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Precio ($) *</label>
                        <input
                          type="number"
                          name="precio"
                          value={producto.precio}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Stock *</label>
                        <input
                          type="number"
                          name="stock"
                          value={producto.stock}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="section-title">Configuración</h3>
                    
                    <div className="form-group">
                      <label className="form-label">Estado</label>
                      <select
                        name="estado"
                        value={producto.estado}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="agotado">Agotado</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tiempo de Preparación (minutos)</label>
                      <input
                        type="number"
                        name="tiempoPreparacion"
                        value={producto.tiempoPreparacion}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="15"
                        min="0"
                      />
                    </div>

                    <div className="form-checkbox">
                      <input
                        type="checkbox"
                        name="destacado"
                        checked={producto.destacado}
                        onChange={handleChange}
                        id="destacado"
                      />
                      <label htmlFor="destacado" className="checkbox-label">
                        Producto destacado
                      </label>
                    </div>
                  </div>
                </div>

                {/* Columna derecha - Imagen e ingredientes */}
                <div className="form-column">
                  <div className="form-section">
                    <h3 className="section-title">Imagen del Producto</h3>
                    
                    <div className="imagen-upload">
                      <div className="imagen-preview">
                        {imagenPreview}
                      </div>
                      
                      <div className="upload-actions">
                        <input
                          type="file"
                          id="imagen"
                          accept="image/*"
                          onChange={handleImagenChange}
                          className="file-input"
                        />
                        <label htmlFor="imagen" className="btn-upload">
                          <Upload size={16} />
                          Cambiar Imagen
                        </label>
                        <p className="upload-hint">Formatos: JPG, PNG, GIF. Máx: 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="section-title">Ingredientes</h3>
                    
                    <div className="form-group">
                      <label className="form-label">Lista de Ingredientes</label>
                      <textarea
                        name="ingredientes"
                        value={producto.ingredientes}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Separa los ingredientes con comas..."
                        rows="4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}