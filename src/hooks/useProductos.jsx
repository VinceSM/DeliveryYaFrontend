// src/hooks/useProductos.jsx - VERSIÓN ACTUALIZADA
import { useState, useEffect, useCallback } from 'react';
import { 
  getProductosComercio, 
  crearProducto, 
  actualizarProducto, 
  eliminarProducto,
  getCategoriasDelComercio // ✅ NUEVA IMPORTACIÓN
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

  // Cargar categorías del comercio actual
  const cargarCategoriasDelComercio = useCallback(async () => {
    try {
      console.log('📂 Cargando categorías del COMERCIO ACTUAL...');
      const categoriasData = await getCategoriasDelComercio();
      
      console.log('✅ Categorías del comercio cargadas:', categoriasData);
      return categoriasData;
      
    } catch (err) {
      console.error('❌ Error cargando categorías del comercio:', err);
      
      // Categorías por defecto como fallback
      const categoriasPorDefecto = [
        'Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 
        'Bebidas', 'Mexicana', 'Postres', 'Aperitivos'
      ];
      
      console.log('🔄 Usando categorías por defecto por error');
      return categoriasPorDefecto;
    }
  }, []);

  // Cargar productos y categorías del comercio
  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando productos y categorías del COMERCIO...');
      
      // Cargar productos y categorías del comercio en paralelo
      const [productosData, categoriasData] = await Promise.all([
        getProductosComercio(),
        cargarCategoriasDelComercio()
      ]);
      
      console.log('📦 Productos recibidos en hook:', productosData);
      console.log('📂 Categorías del comercio recibidas:', categoriasData);
      
      setProductos(productosData);
      setCategorias(categoriasData);
      
      console.log('✅ Datos del comercio cargados exitosamente:', {
        productos: productosData.length,
        categorias: categoriasData.length
      });
      
    } catch (err) {
      console.error('❌ Error cargando datos del comercio:', err);
      setError(err.message);
      
      // Cargar categorías del comercio como fallback
      try {
        const categoriasData = await cargarCategoriasDelComercio();
        setCategorias(categoriasData);
      } catch (catError) {
        console.error('❌ Error incluso con fallback de categorías:', catError);
        setCategorias([]);
      }
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [cargarCategoriasDelComercio]);

  // Agregar producto
  const agregarProducto = async (productoData) => {
    try {
      setError(null);
      console.log('🆕 Creando producto:', productoData);
      
      // Validar que la categoría seleccionada esté en las categorías del comercio
      if (productoData.categoria && !categorias.includes(productoData.categoria)) {
        console.warn('⚠️ Categoría seleccionada no está en las categorías del comercio:', productoData.categoria);
        // Podrías mostrar una advertencia o simplemente permitirlo
      }
      
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
      
      // Validar que la categoría seleccionada esté en las categorías del comercio
      if (productoData.categoria && !categorias.includes(productoData.categoria)) {
        console.warn('⚠️ Categoría seleccionada no está en las categorías del comercio:', productoData.categoria);
      }
      
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
    console.log('🗑️ Eliminando producto desde hook:', id);
    
    await eliminarProducto(id);
    
    setProductos(prev => prev.filter(p => p.idProducto !== id));
    
    console.log('✅ Producto eliminado exitosamente desde hook');
    
  } catch (err) {
    console.error('❌ Error eliminando producto desde hook:', err);
    setError(err.message);
    throw err;
  }
};

  // Recargar categorías del comercio
  const recargarCategorias = async () => {
    try {
      console.log('🔄 Recargando categorías del COMERCIO...');
      const nuevasCategorias = await cargarCategoriasDelComercio();
      setCategorias(nuevasCategorias);
      console.log('✅ Categorías del comercio recargadas');
    } catch (err) {
      console.error('❌ Error recargando categorías del comercio:', err);
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