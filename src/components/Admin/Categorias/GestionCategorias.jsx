// src/components/Admin/Categorias/GestionCategorias.jsx - VERSIÓN SIMPLIFICADA
import { useState, useEffect } from 'react';
import CategoriasList from './CategoriasList';
import CategoriaForm from './CategoriaForm';
import { categoriaAdminService } from '../../../api/categoriaAdminService';

export default function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoriasData = await categoriaAdminService.getAll();
      
      const categoriasAdaptadas = categoriasData.map(cat => ({
        idcategoria: cat.idCategoria,
        nombre: cat.nombre,
        cantidadProductos: cat.cantidadProductos || 0
      }));
      
      setCategorias(categoriasAdaptadas);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      setError('Error al cargar las categorías');
      setCategorias([
        { idcategoria: 1, nombre: 'Hamburguesa', cantidadProductos: 0 },
        { idcategoria: 2, nombre: 'Pizza', cantidadProductos: 0 },
        { idcategoria: 3, nombre: 'Carne', cantidadProductos: 0 }
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
      // Editar categoría existente - SOLO NOMBRE
      await categoriaAdminService.update(categoriaEdit.idcategoria, {
        nombre: categoriaData.nombre
      });
      
      // Actualizar estado local
      setCategorias(prev => prev.map(cat => 
        cat.idcategoria === categoriaEdit.idcategoria 
          ? { ...cat, nombre: categoriaData.nombre }
          : cat
      ));
    } else {
      // Crear nueva categoría - SOLO NOMBRE
      const nuevaCategoria = await categoriaAdminService.create({
        nombre: categoriaData.nombre
      });
      
      // Agregar al estado local
      const categoriaConId = {
        idcategoria: nuevaCategoria.idCategoria || Date.now(),
        nombre: categoriaData.nombre,
        estado: 'activo',
        cantidadProductos: 0
      };
      
      setCategorias(prev => [...prev, categoriaConId]);
      
      // 🔥 MOSTRAR MENSAJE INFORMATIVO SI HUBO ERROR DE ROUTING
      if (!nuevaCategoria.idCategoria || nuevaCategoria.idCategoria === Date.now()) {
        console.log('ℹ️ Categoría creada con ID temporal debido a error de backend');
      }
    }
    
    setShowForm(false);
    setCategoriaEdit(null);
    
    // Recargar categorías para obtener datos actualizados del backend
    cargarCategorias();
    
  } catch (err) {
    console.error('Error guardando categoría:', err);
    
    // 🔥 MANEJO ESPECÍFICO PARA ERROR DE ROUTING
    if (err.message.includes('No route matches') || 
        err.message.includes('CreatedAtActionResult')) {
      setError('La categoría se creó correctamente, pero hubo un error técnico en el servidor. La categoría debería estar disponible.');
      
      // Cerrar el formulario de todas formas
      setTimeout(() => {
        setShowForm(false);
        setCategoriaEdit(null);
        cargarCategorias(); // Recargar para ver si la categoría se creó
      }, 3000);
    } else {
      setError('Error al guardar la categoría: ' + (err.message || 'Error desconocido'));
    }
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
      
      setCategorias(prev => prev.map(cat => 
        cat.idcategoria === idcategoria 
          ? { ...cat, estado: nuevoEstado }
          : cat
      ));
      
    } catch (err) {
      console.error('Error cambiando estado:', err);
      setError('Error al cambiar el estado');
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