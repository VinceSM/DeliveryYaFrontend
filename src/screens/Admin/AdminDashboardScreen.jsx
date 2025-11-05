import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import DashboardOverview from '../../components/Admin/Dashboard/DashboardOverview';
import GestionPedidos from '../../components/Admin/Pedidos/GestionPedidos';
import GestionClientes from '../../components/Admin/Clientes/GestionClientes';
import GestionComercios from '../../components/Admin/Comercios/GestionComercios';
import GestionRepartidores from '../../components/Admin/Repartidores/GestionRepartidores';
import GestionCategorias from '../../components/Admin/Categorias/GestionCategorias';
import Reportes from '../../components/Admin/Reportes/Reportes';
import '../../styles/screens/Admin/AdminDashboard.css';

export default function AdminDashboardScreen() {
  const { admin } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosHoy: 0,
    totalClientes: 0,
    totalComercios: 0,
    totalRepartidores: 0,
    totalCategorias: 0,
    ingresosHoy: 0
  });

  useEffect(() => {
    // Simular carga de datos
    setStats({
      totalPedidos: 1250,
      pedidosHoy: 45,
      totalClientes: 890,
      totalComercios: 67,
      totalRepartidores: 32,
      totalCategorias: 8,
      ingresosHoy: 12500.50
    });
  }, []);

  const renderSection = () => {
    const sections = {
      dashboard: <DashboardOverview stats={stats} />,
      pedidos: <GestionPedidos />,
      clientes: <GestionClientes />,
      comercios: <GestionComercios />,
      repartidores: <GestionRepartidores />,
      categorias: <GestionCategorias />,
      reportes: <Reportes />
    };

    return sections[activeSection] || sections.dashboard;
  };

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      {renderSection()}
    </AdminLayout>
  );
}