// src/App.jsx
import AppRouter from './navigation/AppRouter';
import { PedidoProvider } from './contexts/PedidoContext'; // Opcional, si usas el contexto
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Si usas el contexto */}
      <PedidoProvider>
        <AppRouter />
      </PedidoProvider>
      
      {/* Si solo usas el hook */}
      {/* <AppRouter /> */}
    </div>
  );
}

export default App;