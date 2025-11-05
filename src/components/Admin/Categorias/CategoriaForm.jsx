import { useState, useEffect } from 'react';

export default function CategoriaForm({ categoria, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: ''
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || '',
        icono: categoria.icono || ''
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

  const iconosDisponibles = ['🍽️', '💊', '🛒', '🏪', '☕', '🍕', '🍦', '📚', '🎁', '👕'];

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
            placeholder="Ej: Restaurante, Farmacia..."
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Describe esta categoría..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Icono</label>
          <div className="iconos-grid">
            {iconosDisponibles.map(icono => (
              <button
                key={icono}
                type="button"
                className={`icono-option ${formData.icono === icono ? 'selected' : ''}`}
                onClick={() => handleChange('icono', icono)}
              >
                {icono}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={formData.icono}
            onChange={(e) => handleChange('icono', e.target.value)}
            placeholder="O escribe un emoji manualmente"
            maxLength="2"
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