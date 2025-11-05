export default function PedidosTable({ pedidos }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Comercio</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.cliente}</td>
              <td>{pedido.comercio}</td>
              <td>${pedido.total}</td>
              <td>
                <span className={`status-badge status-${pedido.estado}`}>
                  {pedido.estado}
                </span>
              </td>
              <td>{pedido.fecha}</td>
              <td>
                <button className="btn-action">Ver</button>
                <button className="btn-action">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}