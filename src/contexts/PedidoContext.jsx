// src/contexts/PedidoContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { pedidoAPI } from '../api/pedido';
import { useAuth } from '../hooks/useAuth'; // ✅ Importar useAuth

const PedidoContext = createContext();

export const usePedidos = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedidos debe ser usado dentro de un PedidoProvider');
  }
  return context;
};

export const PedidoProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // ✅ Usar useAuth hook

  // Cargar pedidos
  const cargarPedidos = async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await pedidoAPI.getByComercio(user.id);
      setPedidos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estado de pedido
  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      await pedidoAPI.updateEstado(pedidoId, nuevoEstado);
      
      // Actualizar estado localmente
      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.idpedido === pedidoId
            ? { ...pedido, estado: nuevoEstado }
            : pedido
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error actualizando estado del pedido:', err);
      return false;
    }
  };

  // Aceptar pedido
  const aceptarPedido = async (pedidoId) => {
    return await actualizarEstadoPedido(pedidoId, 'preparando');
  };

  // Rechazar pedido
  const rechazarPedido = async (pedidoId) => {
    return await actualizarEstadoPedido(pedidoId, 'cancelado');
  };

  // Completar pedido
  const completarPedido = async (pedidoId) => {
    return await actualizarEstadoPedido(pedidoId, 'entregado');
  };

  // Cargar pedidos al inicializar o cuando cambie el usuario
  useEffect(() => {
    if (user?.id) {
      cargarPedidos();
    }
  }, [user?.id]);

  const value = {
    pedidos,
    loading,
    error,
    cargarPedidos,
    actualizarEstadoPedido,
    aceptarPedido,
    rechazarPedido,
    completarPedido
  };

  return (
    <PedidoContext.Provider value={value}>
      {children}
    </PedidoContext.Provider>
  );
};