import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';

export default function DashboardOverview({ stats }) {
  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <StatsCard title="Total Pedidos" value={stats.totalPedidos} />
        <StatsCard title="Pedidos Hoy" value={stats.pedidosHoy} />
        <StatsCard title="Total Clientes" value={stats.totalClientes} />
        <StatsCard title="Total Comercios" value={stats.totalComercios} />
        <StatsCard title="Repartidores" value={stats.totalRepartidores} />
        <StatsCard title="Categorías" value={stats.totalCategorias} />
        <StatsCard 
          title="Ingresos Hoy" 
          value={`$${stats.ingresosHoy.toLocaleString()}`} 
        />
      </div>
      <RecentActivity />
    </div>
  );
}