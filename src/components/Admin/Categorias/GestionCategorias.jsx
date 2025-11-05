// src/components/Admin/Categorias/GestionCategorias.jsx
import { useState, useEffect } from 'react';
import CategoriasList from './CategoriasList';
import CategoriaForm from './CategoriaForm';
import { categoriaAdminService } from '../../../api/categoriaAdminService'; // Ruta corregida

export default function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriasData = await categoriaAdminService.getAll();
      
      // Adaptar los datos al formato que espera tu componente
      const categoriasAdaptadas = categoriasData.map(cat => ({
        idcategoria: cat.idCategoria,
        nombre: cat.nombre,
        descripcion: cat.descripcion || `Categoría ${cat.nombre}`,
        estado: 'activo', // Por defecto activo
        icono: cat.icono || '📁',
        cantidadProductos: cat.cantidadProductos || 0
      }));
      
      setCategorias(categoriasAdaptadas);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar las categorías');
      // Datos de ejemplo como fallback
      setCategorias([
        { idcategoria: 1, nombre: 'Restaurante', descripcion: 'Comida y restaurantes', estado: 'activo', icono: '🍽️', cantidadProductos: 0 },
        { idcategoria: 2, nombre: 'Farmacia', descripcion: 'Medicamentos y productos de salud', estado: 'activo', icono: '💊', cantidadProductos: 0 },
        { idcategoria: 3, nombre: 'Supermercado', descripcion: 'Productos de supermercado', estado: 'activo', icono: '🛒', cantidadProductos: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategoria = () => {
    setCategoriaEdit(null);
    setShowForm(true);
  };

  const handleEditCategoria = (categoria) => {
    setCategoriaEdit(categoria);
    setShowForm(true);
  };

  const handleSaveCategoria = async (categoriaData) => {
    try {
      setError(null);
      
      if (categoriaEdit) {
        // Editar categoría existente
        await categoriaAdminService.update(categoriaEdit.idcategoria, categoriaData);
        
        // Actualizar estado local
        setCategorias(prev => prev.map(cat => 
          cat.idcategoria === categoriaEdit.idcategoria 
            ? { ...cat, ...categoriaData }
            : cat
        ));
      } else {
        // Crear nueva categoría
        const nuevaCategoria = await categoriaAdminService.create(categoriaData);
        
        // Agregar al estado local con ID generado (si el backend no lo devuelve)
        const categoriaConId = {
          idcategoria: Date.now(), // Temporal, hasta que el backend devuelva el ID real
          ...categoriaData,
          estado: 'activo',
          cantidadProductos: 0
        };
        
        setCategorias(prev => [...prev, categoriaConId]);
      }
      
      setShowForm(false);
      setCategoriaEdit(null);
      
      // Recargar categorías para obtener datos actualizados del backend
      cargarCategorias();
      
    } catch (err) {
      console.error('Error guardando categoría:', err);
      setError('Error al guardar la categoría: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleDeleteCategoria = async (idcategoria) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        setError(null);
        await categoriaAdminService.delete(idcategoria);
        setCategorias(prev => prev.filter(cat => cat.idcategoria !== idcategoria));
      } catch (err) {
        console.error('Error eliminando categoría:', err);
        setError('Error al eliminar la categoría: ' + (err.message || 'Error desconocido'));
      }
    }
  };

  const handleToggleEstado = async (idcategoria) => {
    try {
      setError(null);
      const categoria = categorias.find(cat => cat.idcategoria === idcategoria);
      const nuevoEstado = categoria.estado === 'activo' ? 'inactivo' : 'activo';
      
      // Actualizar estado localmente primero para mejor UX
      setCategorias(prev => prev.map(cat => 
        cat.idcategoria === idcategoria 
          ? { ...cat, estado: nuevoEstado }
          : cat
      ));
      
      // Si quieres persistir el estado en el backend, necesitarías una función adicional
      // await categoriaAdminService.updateEstado(idcategoria, nuevoEstado);
      
    } catch (err) {
      console.error('Error cambiando estado:', err);
      setError('Error al cambiar el estado');
      // Revertir cambio en caso de error
      cargarCategorias();
    }
  };

  if (loading) {
    return (
      <div className="section-container">
        <div className="loading-state">
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h2>Gestión de Categorías</h2>
        <button className="btn-primary" onClick={handleCreateCategoria}>
          + Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {showForm ? (
        <CategoriaForm 
          categoria={categoriaEdit}
          onSave={handleSaveCategoria}
          onCancel={() => {
            setShowForm(false);
            setCategoriaEdit(null);
          }}
        />
      ) : (
        <CategoriasList 
          categorias={categorias}
          onEdit={handleEditCategoria}
          onDelete={handleDeleteCategoria}
          onToggleEstado={handleToggleEstado}
        />
      )}
    </div>
  );
}