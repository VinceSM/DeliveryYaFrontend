// src/screens/Perfil/PerfilEstadisticas.jsx
import { 
  Store, 
  CreditCard, 
  Clock,
  Download,
  Upload
} from "lucide-react";

export default function PerfilEstadisticas() {
  const estadisticas = {
    pedidosMes: 156,
    ingresosMensuales: 3458,
    productosActivos: 42,
    calificacionPromedio: 4.7,
    pedidosCompletados: 128,
    pedidosCancelados: 4,
    tiempoPromedioEntrega: "32 min",
    clientesRecurrentes: 89
  };

  return (
    <div className="seccion-contenido">
      <div className="seccion-header">
        <h3 className="seccion-titulo">Estadísticas del Comercio</h3>
        <div className="acciones-exportar">
          <button className="btn-exportar">
            <Download size={16} />
            Exportar Reporte
          </button>
          <button className="btn-exportar">
            <Upload size={16} />
            Importar Datos
          </button>
        </div>
      </div>
      
      <div className="stats-perfil">
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }}>
            <Store size={24} color="#FF4D4D" />
          </div>
          <div className="stat-numero">{estadisticas.pedidosMes}</div>
          <div className="stat-descripcion">Pedidos este mes</div>
        </div>
        
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 201, 71, 0.1)' }}>
            <CreditCard size={24} color="#FFC947" />
          </div>
          <div className="stat-numero">${estadisticas.ingresosMensuales}</div>
          <div className="stat-descripcion">Ingresos mensuales</div>
        </div>
        
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)' }}>
            <Store size={24} color="#28a745" />
          </div>
          <div className="stat-numero">{estadisticas.productosActivos}</div>
          <div className="stat-descripcion">Productos activos</div>
        </div>
        
        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(108, 117, 125, 0.1)' }}>
            <Clock size={24} color="#6c757d" />
          </div>
          <div className="stat-numero">{estadisticas.calificacionPromedio}</div>
          <div className="stat-descripcion">Calificación promedio</div>
        </div>

        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
            <Store size={24} color="#007bff" />
          </div>
          <div className="stat-numero">{estadisticas.pedidosCompletados}</div>
          <div className="stat-descripcion">Pedidos completados</div>
        </div>

        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
            <Store size={24} color="#dc3545" />
          </div>
          <div className="stat-numero">{estadisticas.pedidosCancelados}</div>
          <div className="stat-descripcion">Pedidos cancelados</div>
        </div>

        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(253, 126, 20, 0.1)' }}>
            <Clock size={24} color="#fd7e14" />
          </div>
          <div className="stat-numero">{estadisticas.tiempoPromedioEntrega}</div>
          <div className="stat-descripcion">Tiempo promedio entrega</div>
        </div>

        <div className="stat-perfil">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(111, 66, 193, 0.1)' }}>
            <Store size={24} color="#6f42c1" />
          </div>
          <div className="stat-numero">{estadisticas.clientesRecurrentes}</div>
          <div className="stat-descripcion">Clientes recurrentes</div>
        </div>
      </div>

      <div className="graficos-seccion">
        <h4 className="seccion-subtitulo">Tendencias y Análisis</h4>
        <div className="grafico-placeholder">
          <p>📊 Gráficos de rendimiento y tendencias estarán disponibles próximamente</p>
          <small>Esta sección mostrará gráficos interactivos de ventas, pedidos y crecimiento</small>
        </div>
      </div>
    </div>
  );
}