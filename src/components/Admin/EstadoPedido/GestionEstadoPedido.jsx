import React, { useState, useEffect } from 'react';
import { adminEstadoPedidoAPI } from '../../../api/adminEstadoPedido';
import './GestionEstadoPedido.css';

const GestionEstadoPedido = () => {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEstado, setEditingEstado] = useState(null);
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: ''
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  // Cargar estados
  const fetchEstados = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminEstadoPedidoAPI.getAllEstados(currentPage, pageSize, searchTerm);
      setEstados(response.data || response);
      setTotalItems(response.totalCount || response.length || 0);
    } catch (err) {
      setError('Error al cargar los estados de pedido');
      console.error('Error fetching estados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstados();
  }, [currentPage, pageSize, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setEditingEstado(null);
    setFormData({ tipo: '', descripcion: '' });
    setShowModal(true);
  };

  const handleEdit = (estado) => {
    setEditingEstado(estado);
    setFormData({
      tipo: estado.tipo,
      descripcion: estado.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estado?')) {
      try {
        await adminEstadoPedidoAPI.deleteEstado(id);
        fetchEstados();
      } catch (err) {
        setError('Error al eliminar el estado');
        console.error('Error deleting estado:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEstado) {
        await adminEstadoPedidoAPI.updateEstado(editingEstado.idestado, formData);
      } else {
        await adminEstadoPedidoAPI.createEstado(formData);
      }
      setShowModal(false);
      fetchEstados();
    } catch (err) {
      setError(`Error al ${editingEstado ? 'actualizar' : 'crear'} el estado`);
      console.error('Error submitting estado:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="gestion-estado-pedido">
      <div className="section-header">
        <h2>Gestión de Estados de Pedido</h2>
        <button className="btn-primary" onClick={handleCreate}>
          + Nuevo Estado
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por tipo"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Tabla de Estados */}
      <div className="table-container">
        {loading ? (
          <div className="loading">Cargando estados...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estados.length > 0 ? (
                estados.map((estado) => (
                  <tr key={estado.idestado}>
                    <td>{estado.idestado}</td>
                    <td>
                      <span className={`estado-badge estado-${estado.tipo.toLowerCase()}`}>
                        {estado.tipo}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(estado)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(estado.idestado)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No se encontraron estados de pedido
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para Crear/Editar */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingEstado ? 'Editar Estado' : 'Nuevo Estado'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tipo">Tipo *</label>
                <input
                  type="text"
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: PENDIENTE, CONFIRMADO, etc."
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingEstado ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEstadoPedido;