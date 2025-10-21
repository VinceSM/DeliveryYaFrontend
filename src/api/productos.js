// src/api/productos.js (versión completa)
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';
import { getCategorias } from './categorias.js';

// Función para mapear datos del frontend al formato del backend
const mapearProductoParaBackend = async (productoData) => {
  // Obtener el ID de la categoría seleccionada
  let categoriaId = 1; // Por defecto
  
  if (productoData.categoria) {
    try {
      const categorias = await getCategorias();
      const categoriaSeleccionada = categorias.find(cat => 
        cat.nombre === productoData.categoria
      );
      if (categoriaSeleccionada) {
        categoriaId = categoriaSeleccionada.idCategoria;
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron obtener las categorías, usando ID por defecto');
    }
  }

  return {
    Nombre: productoData.nombre,
    FotoPortada: productoData.imagen || 'default.jpg',
    Descripcion: productoData.descripcion,
    UnidadMedida: productoData.unidadMedida || 'unidad',
    PrecioUnitario: parseFloat(productoData.precio),
    Oferta: productoData.oferta || false,
    Stock: productoData.stock || 0,
    StockIlimitado: false,
    StockMedida: productoData.unidadMedida || 'unidades',
    CategoriaIds: [categoriaId]
  };
};

// Función para mapear datos del backend al frontend
const mapearProductoDesdeBackend = (productoData) => {
  return {
    idProducto: productoData.idproducto,
    nombre: productoData.nombre,
    descripcion: productoData.descripcion,
    precio: productoData.precioUnitario,
    imagen: productoData.fotoPortada,
    categoria: 'General', // Por defecto hasta que el backend incluya el nombre
    stock: productoData.stock || 0,
    estado: (productoData.stock || 0) > 0 ? 'activo' : 'agotado',
    unidadMedida: productoData.unidadMedida,
    oferta: productoData.oferta
  };
};

// Obtener todos los productos
export const getProductosComercio = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📦 Obteniendo productos desde backend...');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTOS.BASE}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta productos:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error obteniendo productos:', errorText);
      throw new Error(errorText || 'Error al obtener productos');
    }

    const data = await response.json();
    console.log('✅ Productos obtenidos del backend:', data);
    
    // Mapear los datos al formato del frontend
    const productosMapeados = Array.isArray(data) 
      ? data.map(mapearProductoDesdeBackend)
      : [];
    
    return productosMapeados;
    
  } catch (error) {
    console.error('💥 Error en getProductosComercio:', error);
    throw error;
  }
};

// Crear un nuevo producto
export const crearProducto = async (productoData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🆕 Creando nuevo producto en backend...', productoData);
    
    const requestBody = await mapearProductoParaBackend(productoData);
    console.log('📤 Request body mapeado:', requestBody);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTOS.BASE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Status de respuesta crear producto:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error creando producto:', errorText);
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Error al crear producto');
    }

    const data = await response.json();
    console.log('✅ Producto creado en backend:', data);
    
    return mapearProductoDesdeBackend(data);
    
  } catch (error) {
    console.error('💥 Error en crearProducto:', error);
    throw error;
  }
};

// Actualizar un producto
export const actualizarProducto = async (idProducto, productoData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('✏️ Actualizando producto en backend...', { idProducto, productoData });
    
    const requestBody = {
      Id: idProducto,
      Nombre: productoData.nombre,
      FotoPortada: productoData.imagen || 'default.jpg',
      Descripcion: productoData.descripcion,
      UnidadMedida: productoData.unidadMedida || 'unidad',
      PrecioUnitario: parseFloat(productoData.precio),
      Oferta: productoData.oferta || false,
      Stock: productoData.stock || 0,
      StockMedida: productoData.unidadMedida || 'unidades'
    };
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTOS.BASE}/${idProducto}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Status de respuesta actualizar producto:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error actualizando producto:', errorText);
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Error al actualizar producto');
    }

    // Obtener el producto actualizado
    const productoActualizado = await getProductoById(idProducto);
    return productoActualizado;
    
  } catch (error) {
    console.error('💥 Error en actualizarProducto:', error);
    throw error;
  }
};

// Función auxiliar para obtener producto por ID
const getProductoById = async (idProducto) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTOS.BASE}/${idProducto}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener producto actualizado');
    }

    const data = await response.json();
    return mapearProductoDesdeBackend(data);
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error);
    throw error;
  }
};

// Eliminar un producto
export const eliminarProducto = async (idProducto) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🗑️ Eliminando producto del backend...', { idProducto });
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTOS.BASE}/${idProducto}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta eliminar producto:', response.status);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('❌ Error eliminando producto:', errorText);
      } catch (e) {
        errorText = `Error ${response.status}: ${response.statusText}`;
      }
      
      throw new Error(errorText || 'Error al eliminar producto');
    }

    console.log('✅ Producto eliminado del backend');
    return true;
    
  } catch (error) {
    console.error('💥 Error en eliminarProducto:', error);
    throw error;
  }
};

// Obtener categorías para productos
export const getCategoriasComercio = async () => {
  try {
    const categorias = await getCategorias();
    return categorias.map(cat => cat.nombre);
  } catch (error) {
    console.error('💥 Error en getCategoriasComercio:', error);
    // Retornar categorías por defecto si hay error
    return ['Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 'Bebidas', 'Mexicana', 'Postres', 'Aperitivos'];
  }
};