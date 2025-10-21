// src/screens/Categorias/GestionCategoriasScreen.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Package, ArrowLeft } from "lucide-react";
import { getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../../api/categorias";
import Sidebar from "../../components/screens/Sidebar";

export default function GestionCategoriasScreen() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: "" });

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCategorias();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      
      if (!formData.nombre.trim()) {
        throw new Error('El nombre de la categoría es requerido');
      }

      if (editando) {
        await actualizarCategoria(editando.idCategoria, formData);
      } else {
        await crearCategoria(formData);
      }
      
      setFormData({ nombre: "" });
      setEditando(null);
      setMostrarForm(false);
      await cargarCategorias();
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (categoria) => {
    setFormData({ nombre: categoria.nombre });
    setEditando(categoria);
    setMostrarForm(true);
  };

  const handleEliminar = async (categoria) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        await eliminarCategoria(categoria.idCategoria);
        await cargarCategorias();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const cancelarEdicion = () => {
    setFormData({ nombre: "" });
    setEditando(null);
    setMostrarForm(false);
  };

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
                  <h1 className="content-title">Gestión de Categorías</h1>
                  <p className="content-subtitle">Administra las categorías de productos</p>
                </div>
              </div>
              <button
                onClick={() => setMostrarForm(true)}
                className="btn-primary"
              >
                <Plus size={18} />
                Nueva Categoría
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Formulario */}
          {mostrarForm && (
            <div className="content-card mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editando ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Nombre de la Categoría *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ nombre: e.target.value })}
                    className="form-input"
                    placeholder="Ej: Hamburguesas, Pizzas, etc."
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editando ? "Actualizar" : "Crear"} Categoría
                  </button>
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Categorías */}
          <div className="content-card">
            <h3 className="text-lg font-semibold mb-4">Categorías Existentes</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando categorías...</p>
              </div>
            ) : categorias.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No hay categorías creadas</p>
                <p className="text-sm text-gray-500 mt-2">
                  Crea tu primera categoría para organizar tus productos
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                    {categorias.map((categoria) => (
                    <div
                        key={categoria.idCategoria} // ✅ AGREGAR ESTA KEY ÚNICA
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div>
                        <h4 className="font-semibold text-gray-800">{categoria.nombre}</h4>
                        <p className="text-sm text-gray-600">
                            {categoria.cantidadProductos || 0} productos
                        </p>
                        </div>
                        <div className="flex gap-2">
                        <button
                            onClick={() => handleEditar(categoria)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar categoría"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleEliminar(categoria)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
        </div>
      </main>
    </div>
  );
}