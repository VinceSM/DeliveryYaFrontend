// src/hooks/useProductos.jsx
import { useState, useEffect } from 'react';
import { 
  getProductosComercio, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto,
  getCategoriasComercio 
} from '../api/productos';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Cargando productos y categorías...');

      // Cargar productos y categorías
      const productosData = await getProductosComercio();
      
      // Cargar categorías por separado
      let categoriasData = [];
      try {
        categoriasData = await getCategoriasComercio();
      } catch (catError) {
        console.warn('⚠️ Error cargando categorías:', catError);
        // Si hay error, usar categorías por defecto
        categoriasData = ['Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 'Bebidas', 'Mexicana', 'Postres', 'Aperitivos'];
      }

      setProductos(productosData || []);
      setCategorias(categoriasData || []);
      
      console.log('✅ Datos cargados:', {
        productos: productosData?.length || 0,
        categorias: categoriasData?.length || 0
      });

    } catch (error) {
      console.error('❌ Error general cargando datos:', error);
      setError(error.message);
      setProductos([]);
      setCategorias(['Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 'Bebidas', 'Mexicana', 'Postres', 'Aperitivos']);
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async (productoData) => {
    try {
      setError(null);
      const nuevoProducto = await crearProducto(productoData);
      setProductos(prev => [...prev, nuevoProducto]);
      return nuevoProducto;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const editarProducto = async (idProducto, productoData) => {
    try {
      setError(null);
      const productoActualizado = await actualizarProducto(idProducto, productoData);
      setProductos(prev => 
        prev.map(producto => 
          producto.idProducto === idProducto ? productoActualizado : producto
        )
      );
      return productoActualizado;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const borrarProducto = async (idProducto) => {
    try {
      setError(null);
      await eliminarProducto(idProducto);
      setProductos(prev => prev.filter(producto => producto.idProducto !== idProducto));
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const recargarProductos = () => {
    cargarProductos();
  };

  // Calcular estadísticas
  const estadisticas = {
    totalProductos: productos.length,
    productosActivos: productos.filter(p => p.estado === "activo" || p.stock > 0).length,
    productosAgotados: productos.filter(p => p.estado === "agotado" || p.stock === 0).length,
    categoriasCount: new Set(productos.map(p => p.categoria)).size
  };

  return {
    productos,
    categorias,
    estadisticas,
    loading,
    error,
    agregarProducto,
    editarProducto,
    borrarProducto,
    recargarProductos
  };
};