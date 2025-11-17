import { useState } from "react";
import { Send, Package } from 'lucide-react';

export default function PerfilSoporte() {
  const [formulario, setFormulario] = useState({
    asunto: "",
    mensaje: ""
  });
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    
    // Aquí enviarías el email a tu API
    setTimeout(() => {
      alert("Email enviado correctamente al soporte");
      setFormulario({ asunto: "", mensaje: "" });
      setEnviando(false);
    }, 1500);
  };

  return (
    <div className="seccion-contenido">
      {/* Header */}
      <div className="seccion-header">
        <h3 className="seccion-titulo">Contacto Soporte</h3>
      </div>

      <div className="soporte-grid">
        {/* Formulario de envío */}
        <div className="soporte-formulario">
          <div className="soporte-card">
            <form onSubmit={handleSubmit} className="form-soporte">
              <div className="form-group-perfil">
                <label className="form-label-perfil">
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="asunto"
                  value={formulario.asunto}
                  onChange={handleChange}
                  className="form-input-perfil"
                  placeholder="¿En qué podemos ayudarte?"
                  required
                />
              </div>

              <div className="form-group-perfil">
                <label className="form-label-perfil">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="mensaje"
                  value={formulario.mensaje}
                  onChange={handleChange}
                  className="form-textarea-perfil"
                  rows="6"
                  placeholder="Describe tu consulta o problema con el mayor detalle posible..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-enviar-soporte"
                disabled={enviando}
              >
                <Send size={16} />
                {enviando ? "Enviando..." : "Enviar Consulta"}
              </button>
            </form>
          </div>
        </div>
        
        {/* Información */}
          <div className="info-box">
            <div className="info-box-contenido">
              <div className="info-box-icono-wrapper">
                <Package size={18} className="info-box-icono" />
              </div>
              <div>
                <h4 className="info-box-titulo">Información</h4>
                <ul className="info-box-lista">
                  <li>Esta consulta al soporte se hara a través de email, asi que la respuesta llegara a la direccion de email asociada a tu cuenta.</li> 
                  <li>Por favor, proporciona la mayor cantidad de detalles posibles en tu mensaje para que podamos asistirte de manera efectiva.</li>
                  <li>Recuerda revisar tu carpeta de spam o correo no deseado si no ves nuestra respuesta en tu bandeja de entrada.</li>
                </ul>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
