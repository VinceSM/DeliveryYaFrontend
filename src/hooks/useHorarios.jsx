// src/hooks/useHorarios.js
import { useState, useEffect } from 'react';
import { getHorariosByComercio, calcularComercioAbierto } from '../api/horarios';

export const useHorarios = (comercioId) => {
  const [horarios, setHorarios] = useState([]);
  const [comercioAbierto, setComercioAbierto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Días de la semana
  const diasSemana = [
    { id: 0, nombre: 'Domingo', corto: 'DOM' },
    { id: 1, nombre: 'Lunes', corto: 'LUN' },
    { id: 2, nombre: 'Martes', corto: 'MAR' },
    { id: 3, nombre: 'Miércoles', corto: 'MIE' },
    { id: 4, nombre: 'Jueves', corto: 'JUE' },
    { id: 5, nombre: 'Viernes', corto: 'VIE' },
    { id: 6, nombre: 'Sábado', corto: 'SAB' }
  ];

  // Formatear hora de TimeSpan a HH:MM
  const formatearHora = (timeSpan) => {
    if (!timeSpan) return '09:00';
    
    if (typeof timeSpan === 'string') {
      // Si ya viene en formato HH:MM
      if (timeSpan.length === 5 && timeSpan.includes(':')) {
        return timeSpan;
      }
      
      // Si viene como "08:30:00"
      const parts = timeSpan.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1]}`;
      }
    }
    
    return '09:00';
  };

  // Cargar horarios del comercio
  const cargarHorarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Solo cargamos los horarios, no verificamos el estado de apertura
      const horariosData = await getHorariosByComercio(comercioId);
      
      setHorarios(horariosData);
      
      // Calculamos si está abierto basado en los horarios
      const estaAbierto = calcularComercioAbierto(horariosData);
      setComercioAbierto(estaAbierto);
      
    } catch (err) {
      console.error('Error cargando horarios:', err);
      setError(err.message);
      setHorarios([]);
      setComercioAbierto(false);
    } finally {
      setLoading(false);
    }
  };

  // Recargar horarios
  const recargarHorarios = async () => {
    await cargarHorarios();
  };

  useEffect(() => {
    if (comercioId) {
      cargarHorarios();
    }
  }, [comercioId]);

  return {
    horarios,
    comercioAbierto,
    diasSemana,
    loading,
    error,
    formatearHora,
    recargarHorarios,
    cargarHorarios
  };
};