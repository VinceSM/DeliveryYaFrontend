import "../../styles/screens/HorariosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { Clock } from "lucide-react";

export default function HorariosScreen() {
  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          <div className="content-header">
            <h1 className="content-title">Configuración de Horarios</h1>
            <p className="content-subtitle">Gestiona los horarios de atención de tu comercio</p>
          </div>
          
          <div className="content-card">
            <p>Contenido de configuración de horarios...</p>
          </div>
        </div>
      </main>
    </div>
  );
}