// src/screens/Perfil/PerfilInformacion.jsx
import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Save,
  Edit3
} from "lucide-react";
import { getComercioData } from "../../api/auth";
import { comerciosService } from "../../api/comercio";

export default function PerfilInformacion({ comercio, onActualizarComercio, onRecargarDatos }) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [datosLocales, setDatosLocales] = useState({ ...comercio });

  // Sincronizar datos locales cuando cambia el prop
  useState(() => {
    setDatosLocales({ ...comercio });
  }, [comercio]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDatosLocales(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const obtenerDireccionCompleta = () => {
    return `${datosLocales.calle || ""} ${datosLocales.numero || ""}, ${datosLocales.ciudad || ""}`.trim();
  };

  const handleGuardar = async () => {
    setGuardando(true);
    
    try {
      console.log("💾 Guardando datos:", datosLocales);
      
      const datosReales = getComercioData();
      let comercioId = datosLocales.idcomercio;

      if (!comercioId) {
        console.log("🔍 Buscando ID en la API...");
        const todosComercios = await comerciosService.getAll();
        const comercioEncontrado = todosComercios.find(c => 
          c.email === datosLocales.email || c.Email === datosLocales.email
        );
        
        if (comercioEncontrado) {
          comercioId = comercioEncontrado.idcomercio;
        } else {
          throw new Error("No se pudo encontrar el comercio en la API");
        }
      }

      // Preparar datos para la API
      const datosParaAPI = {
        Id: comercioId,
        NombreComercio: datosLocales.nombreComercio,
        Email: datosLocales.email,
        TipoComercio: datosLocales.tipoComercio,
        Eslogan: datosLocales.eslogan,
        Celular: datosLocales.celular,
        Ciudad: datosLocales.ciudad,
        Calle: datosLocales.calle,
        Numero: Number(datosLocales.numero) || 0,
        Encargado: datosLocales.encargado,
        Cvu: datosLocales.cvu,
        Alias: datosLocales.alias,
        Destacado: datosLocales.destacado,
        DeliveryPropio: datosLocales.deliveryPropio,
        Envio: Number(datosLocales.envio) || 0,
        Sucursales: Number(datosLocales.sucursales) || 1,
        Latitud: datosLocales.latitud,
        Longitud: datosLocales.longitud
      };

      console.log("📤 Enviando datos a la API:", datosParaAPI);

      // Llamar a la API
      const resultado = await comerciosService.update(comercioId, datosParaAPI);
      
      console.log("✅ Datos guardados exitosamente:", resultado);
      
      // Actualizar estado padre
      onActualizarComercio(datosLocales);
      
      // Actualizar localStorage
      const datosActualizados = {
        ...datosReales,
        ...datosParaAPI,
        idcomercio: comercioId
      };
      
      localStorage.setItem('comercioData', JSON.stringify(datosActualizados));
      
      alert("✅ Perfil actualizado correctamente");
      
    } catch (error) {
      console.error("❌ Error guardando datos:", error);
      alert("❌ Error al guardar los cambios: " + error.message);
    } finally {
      setGuardando(false);
      setEditando(false);
    }
  };

  const handleCancelar = () => {
    setEditando(false);
    setDatosLocales({ ...comercio });
    onRecargarDatos();
  };

  // Sección de información bancaria y delivery
  const renderInformacionBancaria = () => (
    <div className="form-seccion-bancaria">
      <h4 className="seccion-subtitulo">Información Bancaria y Delivery</h4>
      <div className="form-grid">
        <div className="form-group-perfil">
          <label className="form-label-perfil">CVU</label>
          <input
            type="text"
            name="cvu"
            value={datosLocales.cvu}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            placeholder="Sin CVU"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Alias</label>
          <input
            type="text"
            name="alias"
            value={datosLocales.alias}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            placeholder="mi.comercio.mp"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Encargado</label>
          <input
            type="text"
            name="encargado"
            value={datosLocales.encargado}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            placeholder="Nombre del encargado"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Costo de Envío ($)</label>
          <input
            type="number"
            name="envio"
            value={datosLocales.envio}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Número de Sucursales</label>
          <input
            type="number"
            name="sucursales"
            value={datosLocales.sucursales}
            onChange={handleInputChange}
            className="form-input-perfil"
            disabled={!editando}
            min="1"
            placeholder="1"
          />
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Delivery Propio</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="deliveryPropio"
              checked={datosLocales.deliveryPropio}
              onChange={handleInputChange}
              className="form-checkbox-perfil"
              disabled={!editando}
            />
            <span className="checkbox-label">Tengo delivery propio</span>
          </div>
        </div>

        <div className="form-group-perfil">
          <label className="form-label-perfil">Destacado</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="destacado"
              checked={datosLocales.destacado}
              onChange={handleInputChange}
              className="form-checkbox-perfil"
              disabled={!editando}
            />
            <span className="checkbox-label">Marcar como comercio destacado</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="seccion-contenido">
      <div className="seccion-header">
        <h3 className="seccion-titulo">Información del Comercio</h3>
        {!editando && (
          <button 
            className="btn-editar"
            onClick={() => setEditando(true)}
          >
            <Edit3 size={16} />
            Editar Información
          </button>
        )}
      </div>

      <form className="form-perfil">
        <div className="form-grid">
          <div className="form-group-perfil">
            <label className="form-label-perfil">Nombre del Comercio</label>
            <input
              type="text"
              name="nombreComercio"
              value={datosLocales.nombreComercio}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
              placeholder="Ingresa el nombre de tu comercio"
            />
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Tipo de Comercio</label>
            <select
              name="tipoComercio"
              value={datosLocales.tipoComercio}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
            >
              <option value="Restaurante">Restaurante</option>
              <option value="Cafetería">Cafetería</option>
              <option value="Supermercado">Supermercado</option>
              <option value="Almacén">Almacén</option>
              <option value="Kiosco">Kiosco</option>
              <option value="Farmacia">Farmacia</option>
              <option value="Verdulería">Verdulería</option>
              <option value="Carnicería">Carnicería</option>
              <option value="Panadería">Panadería</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-group-perfil full-width">
            <label className="form-label-perfil">Eslogan</label>
            <textarea
              name="eslogan"
              value={datosLocales.eslogan}
              onChange={handleInputChange}
              className="form-textarea-perfil"
              disabled={!editando}
              rows="3"
              placeholder="Tu eslogan comercial..."
            />
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Email</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={datosLocales.email}
                onChange={handleInputChange}
                className="form-input-perfil"
                disabled={!editando}
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Teléfono</label>
            <div className="input-with-icon">
              <Phone size={18} />
              <input
                type="tel"
                name="celular"
                value={datosLocales.celular}
                onChange={handleInputChange}
                className="form-input-perfil"
                disabled={!editando}
                placeholder="+54 11 1234-5678"
              />
            </div>
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={datosLocales.ciudad}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
              placeholder="Ciudad"
            />
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Calle</label>
            <input
              type="text"
              name="calle"
              value={datosLocales.calle}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
              placeholder="Nombre de la calle"
            />
          </div>

          <div className="form-group-perfil">
            <label className="form-label-perfil">Número</label>
            <input
              type="number"
              name="numero"
              value={datosLocales.numero}
              onChange={handleInputChange}
              className="form-input-perfil"
              disabled={!editando}
              placeholder="123"
            />
          </div>

          <div className="form-group-perfil full-width">
            <label className="form-label-perfil">Dirección Completa</label>
            <div className="input-with-icon">
              <MapPin size={18} />
              <input
                type="text"
                value={obtenerDireccionCompleta()}
                className="form-input-perfil"
                disabled
                placeholder="Se genera automáticamente"
              />
            </div>
          </div>
        </div>

        {/* Sección de información bancaria y delivery */}
        {renderInformacionBancaria()}

        {editando && (
          <div className="acciones-perfil">
            <button 
              type="button"
              className="btn-secundario"
              onClick={handleCancelar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button 
              type="button"
              className="btn-guardar-perfil"
              onClick={handleGuardar}
              disabled={guardando}
            >
              <Save size={16} />
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}