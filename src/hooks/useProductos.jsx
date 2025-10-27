// src/hooks/useProductos.jsx (VERSIÓN COMPLETA)
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

  // Estadísticas
  const estadisticas = {
    totalProductos: productos.length,
    productosActivos: productos.filter(p => p.estado === 'activo').length,
    productosAgotados: productos.filter(p => p.estado === 'agotado').length,
    categoriasCount: [...new Set(productos.map(p => p.categoria))].length
  };

  // Cargar productos y categorías
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando productos y categorías...');
      
      // Cargar productos y categorías en paralelo
      const [productosData, categoriasData] = await Promise.all([
        getProductosComercio(),
        getCategoriasComercio()
      ]);
      
      setProductos(productosData);
      setCategorias(categoriasData);
      
      console.log('✅ Datos cargados exitosamente');
      
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
      
      // Cargar categorías por defecto si hay error
      setCategorias(['Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 'Bebidas', 'Mexicana', 'Postres', 'Aperitivos']);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo producto
  const agregarProducto = async (productoData) => {
    try {
      setError(null);
      console.log('🆕 Creando producto:', productoData);
      
      const nuevoProducto = await crearProducto(productoData);
      
      // Actualizar lista local
      setProductos(prev => [...prev, nuevoProducto]);
      
      console.log('✅ Producto creado exitosamente');
      return nuevoProducto;
      
    } catch (err) {
      console.error('❌ Error creando producto:', err);
      setError(err.message);
      throw err;
    }
  };

  // Editar producto existente
  const editarProducto = async (id, productoData) => {
    try {
      setError(null);
      console.log('✏️ Editando producto:', id, productoData);
      
      const productoActualizado = await actualizarProducto(id, productoData);
      
      // Actualizar lista local
      setProductos(prev => 
        prev.map(p => p.idProducto === id ? productoActualizado : p)
      );
      
      console.log('✅ Producto actualizado exitosamente');
      return productoActualizado;
      
    } catch (err) {
      console.error('❌ Error editando producto:', err);
      setError(err.message);
      throw err;
    }
  };

  // Eliminar producto
  const borrarProducto = async (id) => {
    try {
      setError(null);
      console.log('🗑️ Eliminando producto:', id);
      
      await eliminarProducto(id);
      
      // Actualizar lista local
      setProductos(prev => prev.filter(p => p.idProducto !== id));
      
      console.log('✅ Producto eliminado exitosamente');
      
    } catch (err) {
      console.error('❌ Error eliminando producto:', err);
      setError(err.message);
      throw err;
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  return {
    productos,
    categorias,
    estadisticas,
    loading,
    error,
    agregarProducto,
    editarProducto,
    borrarProducto,
    recargarProductos: cargarProductos
  };
};