// src/hooks/useHorarios.jsx - VERSIÓN CORREGIDA SIN CICLOS
import { useState, useEffect, useCallback } from 'react';
import { 
  getHorariosByComercio, 
  checkComercioAbierto
} from '../api/horarios';

export const useHorarios = (comercioId = 1) => { // Valor por defecto
  const [horariosComercio, setHorariosComercio] = useState([]);
  const [comercioAbierto, setComercioAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Días de la semana - constante fuera del efecto
  const diasSemana = [
    { id: 'Lunes', nombre: 'Lunes' },
    { id: 'Martes', nombre: 'Martes' },
    { id: 'Miércoles', nombre: 'Miércoles' },
    { id: 'Jueves', nombre: 'Jueves' },
    { id: 'Viernes', nombre: 'Viernes' },
    { id: 'Sábado', nombre: 'Sábado' },
    { id: 'Domingo', nombre: 'Domingo' }
  ];

  // ✅ CORREGIDO: Una sola función de carga
  const cargarDatos = useCallback(async () => {
    if (!comercioId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Cargando datos del comercio ${comercioId}...`);
      
      // Cargar ambos datos en paralelo
      const [horariosData, estadoAbierto] = await Promise.all([
        getHorariosByComercio(comercioId),
        checkComercioAbierto(comercioId)
      ]);
      
      setHorariosComercio(horariosData);
      setComercioAbierto(estadoAbierto);
      
      console.log('✅ Datos cargados exitosamente');
      
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
      
      // Datos de ejemplo en caso de error
      const horariosEjemplo = [
        {
          idhorarios: 1,
          dias: 'Lunes,Martes,Miércoles,Jueves,Viernes',
          apertura: '09:00:00',
          cierre: '18:00:00',
          abierto: true
        },
        {
          idhorarios: 2,
          dias: 'Sábado',
          apertura: '10:00:00',
          cierre: '14:00:00',
          abierto: true
        }
      ];
      
      setHorariosComercio(horariosEjemplo);
      setComercioAbierto(true);
    } finally {
      setLoading(false);
    }
  }, [comercioId]); // ✅ Solo depende de comercioId

  // ✅ CORREGIDO: Un solo useEffect
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    // Datos
    horariosComercio,
    comercioAbierto,
    diasSemana,
    
    // Estados
    loading,
    error,
    
    // Acciones
    recargarHorariosComercio: cargarDatos,
    
    // Utilidades
    formatearHora: (timeString) => {
      if (!timeString) return '';
      try {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
      } catch {
        return timeString;
      }
    }
  };
};