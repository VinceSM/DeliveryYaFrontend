import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../../styles/screens/Admin/AdminDashboard.css'; // Ruta corregida

export default function AdminLayout({ children, activeSection, onSectionChange }) {
  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={onSectionChange} 
      />
      <div className="admin-main">
        <AdminHeader activeSection={activeSection} />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}