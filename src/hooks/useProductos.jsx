// src/hooks/useProductos.jsx (NOMBRE CORREGIDO)
import { useState, useEffect, useCallback } from 'react';
import { 
  getProductosComercio, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto
} from '../api/productos';
import { getTodasLasCategorias } from '../api/categorias';

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

  // Cargar categorías desde el backend
  const cargarCategorias = useCallback(async () => {
    try {
      console.log('📂 Cargando TODAS las categorías desde el backend...');
      const categoriasData = await getTodasLasCategorias();
      
      // Mapear las categorías para obtener solo los nombres
      const nombresCategorias = categoriasData.map(cat => cat.nombre);
      
      console.log('✅ Todas las categorías cargadas:', nombresCategorias);
      return nombresCategorias;
      
    } catch (err) {
      console.error('❌ Error cargando todas las categorías:', err);
      
      // Categorías por defecto como fallback
      const categoriasPorDefecto = [
        'Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 
        'Bebidas', 'Mexicana', 'Postres', 'Aperitivos',
        'Sandwiches', 'Pastas', 'Asados', 'Vegetariano',
        'Mariscos', 'Sopas', 'Entradas', 'Especialidades'
      ];
      
      console.log('🔄 Usando categorías por defecto');
      return categoriasPorDefecto;
    }
  }, []);

  // Cargar productos y categorías
  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando productos y TODAS las categorías...');
      
      // Cargar productos y categorías en paralelo
      const [productosData, categoriasData] = await Promise.all([
        getProductosComercio(),
        cargarCategorias()
      ]);
      
      console.log('📦 Productos recibidos en hook:', productosData);
      console.log('📂 Categorías recibidas en hook:', categoriasData);
      
      setProductos(productosData);
      setCategorias(categoriasData);
      
      console.log('✅ Datos cargados exitosamente:', {
        productos: productosData.length,
        categorias: categoriasData.length
      });
      
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
      
      // Cargar categorías por defecto si hay error general
      const categoriasPorDefecto = await cargarCategorias();
      setCategorias(categoriasPorDefecto);
      setProductos([]); // Asegurar que productos sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  }, [cargarCategorias]);

  // Agregar producto
  const agregarProducto = async (productoData) => {
    try {
      setError(null);
      console.log('🆕 Creando producto:', productoData);
      
      const nuevoProducto = await crearProducto(productoData);
      
      setProductos(prev => [...prev, nuevoProducto]);
      
      console.log('✅ Producto creado exitosamente');
      return nuevoProducto;
      
    } catch (err) {
      console.error('❌ Error creando producto:', err);
      setError(err.message);
      throw err;
    }
  };

  // Editar producto
  const editarProducto = async (id, productoData) => {
    try {
      setError(null);
      console.log('✏️ Editando producto:', id, productoData);
      
      const productoActualizado = await actualizarProducto(id, productoData);
      
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
      
      setProductos(prev => prev.filter(p => p.idProducto !== id));
      
      console.log('✅ Producto eliminado exitosamente');
      
    } catch (err) {
      console.error('❌ Error eliminando producto:', err);
      setError(err.message);
      throw err;
    }
  };

  // Recargar categorías
  const recargarCategorias = async () => {
    try {
      console.log('🔄 Recargando TODAS las categorías...');
      const nuevasCategorias = await cargarCategorias();
      setCategorias(nuevasCategorias);
      console.log('✅ Todas las categorías recargadas');
    } catch (err) {
      console.error('❌ Error recargando categorías:', err);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  return {
    productos,
    categorias,
    estadisticas,
    loading,
    error,
    agregarProducto,
    editarProducto,
    borrarProducto,
    recargarProductos: cargarProductos,
    recargarCategorias
  };
};