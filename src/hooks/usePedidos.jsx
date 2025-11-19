// src/hooks/usePedidos.jsx - VERSIÓN MEJORADA
import { useState, useEffect, useCallback } from 'react';
import { pedidoAPI } from '../api/pedido';
import { useAuth } from './useAuth';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Función mejorada para encontrar el ID del comercio
  const obtenerComercioId = useCallback(() => {
    console.log('🔍 BUSCANDO ID DEL COMERCIO EN USER:', user);
    
    if (!user) {
      console.log('❌ No hay usuario autenticado');
      return null;
    }

    // Buscar en diferentes propiedades posibles
    const propiedadesPosibles = [
      'idcomercio', 'idComercio', 'comercioId', 'comercioID',
      'id', 'Id', 'ID',
      'codigo', 'Codigo',
      'usuario', 'Usuario'
    ];

    let comercioId = null;

    // Buscar en propiedades directas
    for (const prop of propiedadesPosibles) {
      if (user[prop] !== undefined && user[prop] !== null) {
        console.log(`✅ Encontrado en propiedad "${prop}":`, user[prop]);
        comercioId = user[prop];
        break;
      }
    }

    // Si no se encontró, buscar en propiedades anidadas
    if (!comercioId && user.comercio) {
      console.log('🔍 Buscando en objeto comercio:', user.comercio);
      for (const prop of propiedadesPosibles) {
        if (user.comercio[prop] !== undefined && user.comercio[prop] !== null) {
          console.log(`✅ Encontrado en comercio.${prop}:`, user.comercio[prop]);
          comercioId = user.comercio[prop];
          break;
        }
      }
    }

    // Si aún no se encuentra, mostrar todas las propiedades para debug
    if (!comercioId) {
      console.log('🔍 TODAS LAS PROPIEDADES DEL USER:', Object.keys(user));
      console.log('🔍 VALORES COMPLETOS DEL USER:', user);
    }

    return comercioId;
  }, [user]);

  // Función principal para cargar pedidos
  const cargarPedidos = useCallback(async () => {
    const comercioId = obtenerComercioId();
    
    if (!comercioId) {
      console.log('❌ No se pudo determinar el ID del comercio');
      setError('No se pudo identificar el comercio. Por favor, cierra sesión y vuelve a ingresar.');
      return;
    }

    console.log('🔄 Cargando pedidos para comercio ID:', comercioId);
    setLoading(true);
    setError(null);

    try {
      // Intentar cargar pedidos del comercio
      const data = await pedidoAPI.getByComercio(comercioId);
      console.log('✅ Pedidos cargados exitosamente:', data);
      
      if (data && data.length > 0) {
        setPedidos(data);
      } else {
        console.log('ℹ️ No se encontraron pedidos para este comercio');
        setPedidos([]);
      }
    } catch (err) {
      console.error('❌ Error cargando pedidos:', err);
      
      // Intentar cargar todos los pedidos como fallback
      try {
        console.log('🔄 Intentando cargar todos los pedidos como fallback...');
        const todosPedidos = await pedidoAPI.getAll();
        console.log('✅ Todos los pedidos cargados:', todosPedidos);
        
        // Filtrar manualmente por comercioId
        const pedidosFiltrados = todosPedidos.filter(pedido => {
          const tieneItemsDelComercio = pedido.ItemsPedido?.some(item => 
            item.ComercioIdComercio == comercioId
          );
          return tieneItemsDelComercio;
        });
        
        console.log('✅ Pedidos filtrados manualmente:', pedidosFiltrados);
        setPedidos(pedidosFiltrados);
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
        setError('No se pudieron cargar los pedidos. Verifica tu conexión.');
      }
    } finally {
      setLoading(false);
    }
  }, [obtenerComercioId]);

  // Función para actualizar estado del pedido
  const actualizarEstado = async (pedidoId, nuevoEstado) => {
    console.log(`🔄 Actualizando estado del pedido ${pedidoId} a:`, nuevoEstado);
    
    try {
      // Mapear estado textual a ID numérico
      const estadoId = mapearEstadoANumero(nuevoEstado);
      console.log(`📊 Estado mapeado: ${nuevoEstado} -> ${estadoId}`);
      
      const resultado = await pedidoAPI.updateEstado(pedidoId, { estadoPedidoId: estadoId });
      console.log('✅ Estado actualizado:', resultado);
      
      // Actualizar estado local inmediatamente
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.idpedido === pedidoId 
            ? { ...pedido, EstadoPedidoIdEstado: estadoId }
            : pedido
        )
      );
      
      return true;
    } catch (err) {
      console.error('❌ Error actualizando estado:', err);
      setError(err.message || 'Error al actualizar el estado del pedido');
      return false;
    }
  };

  // Función para actualizar estado de pago
  const actualizarPago = async (pedidoId, pagado) => {
    console.log(`💰 Actualizando pago del pedido ${pedidoId} a:`, pagado);
    
    try {
      const resultado = await pedidoAPI.updatePago(pedidoId, pagado);
      console.log('✅ Pago actualizado:', resultado);
      
      // Actualizar estado local inmediatamente
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.idpedido === pedidoId 
            ? { ...pedido, pagado }
            : pedido
        )
      );
      
      return true;
    } catch (err) {
      console.error('❌ Error actualizando pago:', err);
      setError(err.message || 'Error al actualizar el estado de pago');
      return false;
    }
  };

  // Mapear estados textuales a IDs numéricos
  const mapearEstadoANumero = (estado) => {
    const estados = {
      'pendiente': 1,
      'confirmado': 2,
      'preparando': 3,
      'en camino': 4,
      'entregado': 5,
      'cancelado': 6
    };
    
    const estadoId = estados[estado];
    console.log(`📋 Mapeo de estado: "${estado}" -> ${estadoId}`);
    return estadoId || 1; // Default a pendiente
  };

  // Cargar pedidos cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      console.log('👤 Usuario disponible, cargando pedidos...');
      cargarPedidos();
    } else {
      console.log('⏳ Esperando usuario...');
    }
  }, [user, cargarPedidos]);

  // Funciones específicas para acciones comunes
  const aceptarPedido = (pedidoId) => actualizarEstado(pedidoId, 'preparando');
  const rechazarPedido = (pedidoId) => actualizarEstado(pedidoId, 'cancelado');
  const completarPedido = (pedidoId) => actualizarEstado(pedidoId, 'entregado');
  const marcarComoPagado = (pedidoId) => actualizarPago(pedidoId, true);
  const marcarComoNoPagado = (pedidoId) => actualizarPago(pedidoId, false);

  return {
    pedidos,
    loading,
    error,
    cargarPedidos,
    aceptarPedido,
    rechazarPedido,
    completarPedido,
    marcarComoPagado,
    marcarComoNoPagado,
    actualizarEstado,
    actualizarPago
  };
};