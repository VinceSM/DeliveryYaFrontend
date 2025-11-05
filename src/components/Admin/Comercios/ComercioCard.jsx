export default function ComercioCard({ comercio }) {
  return (
    <div className="comercio-card">
      <h4>{comercio.nombreComercio}</h4>
      <p>{comercio.tipoComercio}</p>
      <p>{comercio.ciudad}</p>
      <div className="card-actions">
        <button className="btn-action">Editar</button>
        <button className="btn-action">Ver Detalles</button>
      </div>
    </div>
  );
}