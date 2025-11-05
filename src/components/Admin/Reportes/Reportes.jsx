export default function Reportes() {
  return (
    <div className="section-container">
      <h2>Reportes y Estadísticas</h2>
      <div className="reports-grid">
        <div className="report-card">
          <h3>Ventas por Período</h3>
          {/* Gráfico de ventas */}
        </div>
        <div className="report-card">
          <h3>Comercios Más Populares</h3>
          {/* Ranking de comercios */}
        </div>
        <div className="report-card">
          <h3>Métodos de Pago</h3>
          {/* Gráfico de métodos de pago */}
        </div>
      </div>
    </div>
  );
}