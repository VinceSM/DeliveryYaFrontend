// src/hooks/useAdminComercios.jsx
import { useState, useCallback } from 'react';
import { 
  getComerciosPendientes, 
  getComerciosActivos, 
  aprobarComercio, 
  destacarComercio,
  getDetalleComercio,
  getAllComercios
} from '../api/adminComercio';

export const useAdminComercios = () => {
  const [comercios, setComercios] = useState([]);
  const [comerciosPendientes, setComerciosPendientes] = useState([]);
  const [comerciosActivos, setComerciosActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comercioDetalle, setComercioDetalle] = useState(null); // ✅ AGREGAR ESTA LÍNEA

  // Cargar todos los comercios
  const cargarComercios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 === INICIANDO cargarComercios ===');
      
      const [pendientes, activos] = await Promise.all([
        getComerciosPendientes(),
        getComerciosActivos()
      ]);
      
      console.log('✅ Comercios cargados exitosamente');
      console.log('📊 Pendientes:', pendientes.length);
      console.log('📊 Activos:', activos.length);
      
      setComerciosPendientes(pendientes);
      setComerciosActivos(activos);
      setComercios([...pendientes, ...activos]);
      
    } catch (err) {
      console.error('❌ Error en cargarComercios:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Aprobar comercio
  const aprobar = async (idComercio) => {
    try {
      setError(null);
      console.log('✅ Aprobando comercio:', idComercio);
      
      const comercioAprobado = await aprobarComercio(idComercio);
      
      // Actualizar estados
      setComerciosPendientes(prev => 
        prev.filter(c => c.idComercio !== idComercio)
      );
      setComerciosActivos(prev => [...prev, comercioAprobado]);
      setComercios(prev => 
        prev.map(c => c.idComercio === idComercio ? comercioAprobado : c)
      );
      
      console.log('✅ Comercio aprobado exitosamente');
      return comercioAprobado;
      
    } catch (err) {
      console.error('❌ Error aprobando comercio:', err);
      setError(err.message);
      throw err;
    }
  };

  // Destacar comercio
  const destacar = async (idComercio, destacado) => {
    try {
      setError(null);
      console.log('⭐ Destacando comercio:', { idComercio, destacado });
      
      const comercioActualizado = await destacarComercio(idComercio, destacado);
      
      // Actualizar estados
      setComerciosActivos(prev => 
        prev.map(c => c.idComercio === idComercio ? comercioActualizado : c)
      );
      setComercios(prev => 
        prev.map(c => c.idComercio === idComercio ? comercioActualizado : c)
      );
      
      console.log('✅ Comercio destacado exitosamente');
      return comercioActualizado;
      
    } catch (err) {
      console.error('❌ Error destacando comercio:', err);
      setError(err.message);
      throw err;
    }
  };

  // Obtener detalle del comercio
  const cargarDetalle = async (idComercio) => {
    try {
      setError(null);
      console.log('🔍 Cargando detalle del comercio:', idComercio);
      
      const detalle = await getDetalleComercio(idComercio);
      setComercioDetalle(detalle);
      
      console.log('✅ Detalle del comercio cargado');
      return detalle;
      
    } catch (err) {
      console.error('❌ Error cargando detalle del comercio:', err);
      setError(err.message);
      throw err;
    }
  };

  // Limpiar detalle
  const limpiarDetalle = () => {
    setComercioDetalle(null);
  };

  // Estadísticas
  const estadisticas = {
    total: comercios.length,
    pendientes: comerciosPendientes.length,
    activos: comerciosActivos.length,
    destacados: comerciosActivos.filter(c => c.destacado).length
  };

  return {
    // Estados
    comercios,
    comerciosPendientes,
    comerciosActivos,
    comercioDetalle, // ✅ AGREGAR AL RETURN
    loading,
    error,
    estadisticas,
    
    // Acciones
    cargarComercios,
    aprobarComercio: aprobar,
    destacarComercio: destacar,
    cargarDetalleComercio: cargarDetalle,
    limpiarDetalleComercio: limpiarDetalle,
    
    // Utilidades
    recargarComercios: cargarComercios
  };
};