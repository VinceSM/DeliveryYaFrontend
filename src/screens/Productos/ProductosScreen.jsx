import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/screens/ProductosScreen.css";
import Sidebar from "../../components/screens/Sidebar";
import { Package, Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";

// Datos de ejemplo para productos
const productosEjemplo = [
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne 150g, lechuga, tomate, queso cheddar",
    precio: 12.50,
    categoria: "Hamburguesas",
    stock: 25,
    estado: "activo",
    imagen: "🍔"
  },
  {
    id: 2,
    nombre: "Pizza Margarita",
    descripcion: "Mozzarella, tomate, albahaca fresca",
    precio: 18.00,
    categoria: "Pizzas",
    stock: 15,
    estado: "activo",
    imagen: "🍕"
  },
  {
    id: 3,
    nombre: "Ensalada César",
    descripcion: "Lechuga romana, crutones, parmesano, aderezo césar",
    precio: 10.00,
    categoria: "Ensaladas",
    stock: 0,
    estado: "agotado",
    imagen: "🥗"
  },
  {
    id: 4,
    nombre: "Sushi Mixto",
    descripcion: "12 piezas variadas con salsa de soja",
    precio: 22.50,
    categoria: "Sushi",
    stock: 8,
    estado: "activo",
    imagen: "🍣"
  },
  {
    id: 5,
    nombre: "Café Americano",
    descripcion: "Café negro premium 12oz",
    precio: 4.50,
    categoria: "Bebidas",
    stock: 50,
    estado: "activo",
    imagen: "☕"
  },
  {
    id: 6,
    nombre: "Tacos al Pastor",
    descripcion: "3 tacos con piña, cebolla y cilantro",
    precio: 9.00,
    categoria: "Mexicana",
    stock: 12,
    estado: "activo",
    imagen: "🌮"
  }
];

export default function ProductosScreen() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Obtener categorías únicas
  const categorias = ["todos", ...new Set(productosEjemplo.map(p => p.categoria))];

  // Filtrar productos
  const productosFiltrados = productosEjemplo.filter(producto => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "todos" || producto.categoria === filtroCategoria;
    const coincideEstado = filtroEstado === "todos" || producto.estado === filtroEstado;
    
    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  // Estadísticas
  const totalProductos = productosEjemplo.length;
  const productosActivos = productosEjemplo.filter(p => p.estado === "activo").length;
  const productosAgotados = productosEjemplo.filter(p => p.estado === "agotado").length;
  const categoriasCount = new Set(productosEjemplo.map(p => p.categoria)).size;

  const handleEditarProducto = (id) => {
    navigate(`/productos/editar/${id}`);
  };

  const handleNuevoProducto = () => {
    navigate("/productos/nuevo");
  };

  const handleEliminarProducto = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      console.log(`Eliminando producto ${id}`);
      // Aquí iría la llamada a la API para eliminar
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "activo": return "estado-activo";
      case "inactivo": return "estado-inactivo";
      case "agotado": return "estado-agotado";
      default: return "estado-inactivo";
    }
  };

  return (
    <div className="dashboard-container flex h-screen">
      <Sidebar />
      
      <main className="main-content flex-1 overflow-y-auto">
        <div className="content-wrapper min-h-full p-8">
          {/* Header */}
          <div className="content-header">
            <div className="productos-header">
              <div>
                <h1 className="content-title">Gestión de Productos</h1>
                <p className="content-subtitle">Administra el inventario de tu comercio</p>
              </div>
              <button className="btn-primary" onClick={handleNuevoProducto}>
                <Plus size={18} />
                Nuevo Producto
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="stats-productos">
            <div className="stat-producto primary">
              <Package size={24} color="#FF4D4D" />
              <div className="stat-number">{totalProductos}</div>
              <div className="stat-label">Total Productos</div>
            </div>
            
            <div className="stat-producto success">
              <Package size={24} color="#28a745" />
              <div className="stat-number">{productosActivos}</div>
              <div className="stat-label">Productos Activos</div>
            </div>
            
            <div className="stat-producto secondary">
              <Package size={24} color="#FFC947" />
              <div className="stat-number">{productosAgotados}</div>
              <div className="stat-label">Productos Agotados</div>
            </div>
            
            <div className="stat-producto primary">
              <Package size={24} color="#FF4D4D" />
              <div className="stat-number">{categoriasCount}</div>
              <div className="stat-label">Categorías</div>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="header-actions">
            <div className="search-container">
              <Search size={20} color="#6c757d" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select 
              value={filtroCategoria} 
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todas las categorías</option>
              {categorias.filter(cat => cat !== "todos").map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="agotado">Agotados</option>
            </select>
          </div>

          {/* Grid de Productos */}
          <div className="productos-grid">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="producto-card">
                <div className="producto-header">
                  <div className="producto-image">
                    {producto.imagen}
                  </div>
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <div className="producto-precio">${producto.precio}</div>
                  </div>
                  <div className={`producto-estado ${getEstadoColor(producto.estado)}`}>
                    {producto.estado}
                  </div>
                </div>
                
                <div className="producto-detalles">
                  <div className="detalle-producto">
                    <span className="detalle-label">Categoría</span>
                    <span className="detalle-valor">{producto.categoria}</span>
                  </div>
                  <div className="detalle-producto">
                    <span className="detalle-label">Stock</span>
                    <span className="detalle-valor" style={{ 
                      color: producto.stock === 0 ? '#FF4D4D' : producto.stock < 10 ? '#FFC947' : '#28a745' 
                    }}>
                      {producto.stock}
                    </span>
                  </div>
                </div>
                
                <div className="producto-acciones">
                  <button 
                    className="btn-producto btn-editar"
                    onClick={() => handleEditarProducto(producto.id)}
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button 
                    className="btn-producto btn-eliminar"
                    onClick={() => handleEliminarProducto(producto.id, producto.nombre)}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensaje si no hay productos */}
          {productosFiltrados.length === 0 && (
            <div className="content-card text-center">
              <Package size={48} color="#6c757d" />
              <h3 style={{ color: '#333', margin: '1rem 0' }}>No se encontraron productos</h3>
              <p style={{ color: '#6c757d' }}>Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}