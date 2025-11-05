import ComercioCard from './ComercioCard';

export default function ComerciosGrid({ comercios }) {
  return (
    <div className="cards-grid">
      {comercios.length === 0 ? (
        <div className="empty-state">
          <p>No hay comercios registrados</p>
        </div>
      ) : (
        comercios.map(comercio => (
          <ComercioCard key={comercio.idcomercio} comercio={comercio} />
        ))
      )}
    </div>
  );
}