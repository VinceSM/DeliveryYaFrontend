import { useState, useEffect } from 'react';

export default function CategoriaForm({ categoria, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: ''
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || ''
      });
    } else {
      setFormData({
        nombre: ''
      });
    }
  }, [categoria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="form-container">
      <h3>{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
      
      <form onSubmit={handleSubmit} className="categoria-form">
        <div className="form-group">
          <label>Nombre de la categoría *</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Hamburguesa, Carne..."
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {categoria ? 'Actualizar' : 'Crear'} Categoría
          </button>
        </div>
      </form>
    </div>
  );
}