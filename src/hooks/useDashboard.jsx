import { useState, useEffect } from 'react';
import { getEstadisticasDashboard, getPedidosHoy, getProductosComercio } from '../api/dashboard';

export const useDashboard = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [pedidosHoy, setPedidosHoy] = useState(null);
  const [productos, setProductos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [estadisticasData, pedidosData, productosData] = await Promise.all([
        getEstadisticasDashboard(),
        getPedidosHoy(),
        getProductosComercio()
      ]);

      setEstadisticas(estadisticasData);
      setPedidosHoy(pedidosData);
      setProductos(productosData);
      
      console.log('✅ Todos los datos del dashboard cargados');
    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const recargarDatos = () => {
    cargarDatos();
  };

  return {
    estadisticas,
    pedidosHoy,
    productos,
    loading,
    error,
    recargarDatos
  };
};