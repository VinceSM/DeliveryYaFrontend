// src/hooks/usePedidos.jsx - VERSIÓN DEBUG
import { useState, useEffect } from 'react';
import { pedidoAPI } from '../api/pedido';
import { useAuth } from './useAuth';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const cargarPedidos = async () => {
    console.log('👤 USUARIO COMPLETO:', user);
    console.log('🔑 PROPIEDADES DEL USUARIO:', user ? Object.keys(user) : 'No user');
    
    if (user) {
      console.log('📋 DETALLE DE CADA PROPIEDAD:');
      Object.keys(user).forEach(key => {
        console.log(`   ${key}:`, user[key]);
      });
    }
    
    if (!user) {
      console.log('❌ No hay usuario autenticado');
      setError('Usuario no autenticado');
      return;
    }

    // Buscar el ID en diferentes propiedades posibles
    const posiblesIds = [
      user.id,
      user.Id,
      user.ID,
      user.idComercio,
      user.IdComercio,
      user.IDComercio,
      user.comercioId,
      user.ComercioId,
      user.COMERCIOID,
      user.idComercios,
      user.codigo,
      user.Codigo
    ].filter(Boolean); // Filtrar valores null/undefined

    console.log('🎯 Posibles IDs encontrados:', posiblesIds);

    const comercioId = posiblesIds[0]; // Tomar el primer ID que encuentre

    if (!comercioId) {
      console.log('❌ No se pudo encontrar ningún ID en el usuario');
      console.log('🔄 Usando ID temporal para desarrollo: 1');
      // Usar ID temporal para desarrollo
      await cargarConIdTemporal(1);
      return;
    }

    console.log('🔄 Iniciando carga de pedidos para comercio ID:', comercioId);
    await cargarConIdReal(comercioId);
  };

  const cargarConIdReal = async (comercioId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await pedidoAPI.getByComercio(comercioId);
      console.log('✅ Pedidos cargados exitosamente:', data);
      setPedidos(data);
    } catch (err) {
      console.error('❌ Error cargando pedidos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarConIdTemporal = async (comercioId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await pedidoAPI.getByComercio(comercioId);
      console.log('✅ Pedidos cargados con ID temporal:', data);
      setPedidos(data);
    } catch (err) {
      console.error('❌ Error cargando pedidos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    console.log(`🔄 Actualizando estado del pedido ${pedidoId} a: ${nuevoEstado}`);
    
    try {
      const resultado = await pedidoAPI.updateEstado(pedidoId, nuevoEstado);
      console.log('✅ Estado actualizado:', resultado);
      
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.idpedido === pedidoId 
            ? { ...pedido, EstadoPedidoIdEstado: mapearEstadoANumero(nuevoEstado) }
            : pedido
        )
      );
      
      return true;
    } catch (err) {
      console.error('❌ Error actualizando estado:', err);
      setError(err.message);
      return false;
    }
  };

  const mapearEstadoANumero = (estado) => {
    const estados = {
      'pendiente': 1,
      'preparando': 3,
      'entregado': 5,
      'cancelado': 6
    };
    return estados[estado] || 1;
  };

  const actualizarPago = async (pedidoId, pagado) => {
    try {
      console.log(`💰 Actualizando pago del pedido ${pedidoId} a: ${pagado}`);
      
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.idpedido === pedidoId 
            ? { ...pedido, pagado }
            : pedido
        )
      );
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      cargarPedidos();
    }
  }, [user]);

  return {
    pedidos,
    loading,
    error,
    cargarPedidos,
    actualizarEstado,
    actualizarPago,
    aceptarPedido: (pedidoId) => actualizarEstado(pedidoId, 'preparando'),
    rechazarPedido: (pedidoId) => actualizarEstado(pedidoId, 'cancelado'),
    completarPedido: (pedidoId) => actualizarEstado(pedidoId, 'entregado'),
    marcarComoPagado: (pedidoId) => actualizarPago(pedidoId, true),
    marcarComoNoPagado: (pedidoId) => actualizarPago(pedidoId, false)
  };
};