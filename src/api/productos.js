// src/api/productos.js
import { API_CONFIG } from '../config/config.js';
import { getToken } from './auth.js';
import { getCategorias } from './categorias.js';

// Función para construir URLs
const buildUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
  });
  return url;
};

// Función auxiliar para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorText;
    try {
      errorText = await response.text();
      console.error('❌ Error en respuesta:', errorText);
    } catch (e) {
      errorText = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorText);
  }
};

// Función mapearProductoParaBackend CORREGIDA
const mapearProductoParaBackend = async (productoData) => {
  // Obtener el ID de la categoría seleccionada
  let categoriaId = 1; // Valor por defecto seguro
  
  if (productoData.categoria) {
    try {
      console.log('🔍 Buscando categoría:', productoData.categoria);
      const categorias = await getCategorias();
      const categoriaSeleccionada = categorias.find(cat => 
        cat.nombre.toLowerCase() === productoData.categoria.toLowerCase()
      );
      
      if (categoriaSeleccionada) {
        categoriaId = categoriaSeleccionada.idCategoria;
        console.log('✅ Categoría encontrada, ID:', categoriaId);
      } else {
        console.warn('⚠️ Categoría no encontrada, usando ID por defecto (1)');
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron obtener las categorías, usando ID por defecto. Error:', error.message);
    }
  }

  // ✅ CORREGIDO: Incluir el campo stock
  const productoMapeado = {
    nombre: productoData.nombre,
    descripcion: productoData.descripcion || '',
    unidadMedida: productoData.unidadMedida || 'unidad',
    precioUnitario: parseFloat(productoData.precio),
    oferta: productoData.oferta || false,
    stock: productoData.stock !== undefined ? productoData.stock : true, // ✅ AGREGADO
    fotoPortada: productoData.imagen || 'default.jpg',
    StockIdStock: 1, // Valor por defecto temporal
    CategoriaId: categoriaId
  };

  console.log('📤 Producto mapeado para backend:', productoMapeado);
  return productoMapeado;
};

// Función para mapear datos del backend al frontend
const mapearProductoDesdeBackend = (productoData) => {
  // Asegurar que tenemos los datos básicos
  if (!productoData) {
    console.warn('⚠️ ProductoData es null o undefined');
    return null;
  }

  const productoMapeado = {
    idProducto: productoData.idProducto || productoData.idproducto || productoData.id,
    nombre: productoData.nombre || 'Sin nombre',
    descripcion: productoData.descripcion || '',
    precio: productoData.precioUnitario || productoData.precio || 0,
    imagen: productoData.fotoPortada || productoData.imagen || 'default.jpg',
    categoria: productoData.categoria?.nombre || productoData.categoriaNombre || 'General',
    stock: productoData.stock !== undefined ? productoData.stock : true, // ✅ AGREGADO
    estado: productoData.stock ? 'activo' : 'agotado', // ✅ CORREGIDO: usar booleano directamente
    unidadMedida: productoData.unidadMedida || 'unidad',
    oferta: productoData.oferta || false
  };

  console.log('📥 Producto mapeado desde backend:', productoMapeado);
  return productoMapeado;
};

// Obtener todos los productos del comercio
export const getProductosComercio = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📦 Obteniendo productos del comercio...');
    
    // Obtener categorías primero
    const categorias = await getCategorias();
    console.log('📂 Categorías obtenidas:', categorias);
    
    let todosLosProductos = [];
    
    // Obtener productos de cada categoría
    for (const categoria of categorias) {
      try {
        const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.BASE, { 
          idCategoria: categoria.idCategoria 
        });
        
        console.log(`🔗 Obteniendo productos de categoría ${categoria.nombre}:`, url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`📥 Respuesta completa de ${categoria.nombre}:`, result);
          
          // ✅ CORREGIDO: Extraer los productos de la propiedad "data"
          const productosCategoria = result.data || [];
          console.log(`📦 Productos extraídos de ${categoria.nombre}:`, productosCategoria);
          
          const productosMapeados = Array.isArray(productosCategoria) 
            ? productosCategoria.map(prod => ({
                ...mapearProductoDesdeBackend(prod),
                categoria: categoria.nombre // Asignar nombre de categoría
              }))
            : [];
          
          todosLosProductos = [...todosLosProductos, ...productosMapeados];
          console.log(`✅ ${productosMapeados.length} productos agregados de ${categoria.nombre}`);
        } else {
          console.warn(`⚠️ Error HTTP ${response.status} para categoría ${categoria.nombre}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error obteniendo productos de categoría ${categoria.nombre}:`, error.message);
      }
    }
    
    console.log(`🎉 ${todosLosProductos.length} productos obtenidos en total:`, todosLosProductos);
    return todosLosProductos;
    
  } catch (error) {
    console.error('💥 Error en getProductosComercio:', error);
    throw error;
  }
};

// Crear un nuevo producto - CORREGIDO
export const crearProducto = async (productoData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🆕 Creando nuevo producto...', productoData);
    
    // Obtener el ID de la categoría seleccionada
    const categorias = await getCategorias();
    const categoriaSeleccionada = categorias.find(cat => 
      cat.nombre.toLowerCase() === productoData.categoria.toLowerCase()
    );
    
    if (!categoriaSeleccionada) {
      throw new Error('Categoría no encontrada');
    }

    const categoriaId = categoriaSeleccionada.idCategoria;
    console.log('✅ Usando categoría ID:', categoriaId);

    const requestBody = await mapearProductoParaBackend(productoData);
    
    // ✅ USAR ENDPOINT CORRECTO: /api/CategoriaProducto/{idCategoria}/crear
    const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.CREATE, { 
      idCategoria: categoriaId 
    });
    
    console.log('🔗 URL crear producto:', url);
    console.log('📤 Request body:', requestBody);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Status de respuesta crear producto:', response.status);
    
    await handleResponse(response);

    const data = await response.json();
    console.log('✅ Respuesta del backend:', data);
    
    // El backend retorna { mensaje: "...", data: producto }
    return mapearProductoDesdeBackend(data.data || data);
    
  } catch (error) {
    console.error('💥 Error en crearProducto:', error);
    throw error;
  }
};

// Actualizar un producto - CORREGIDO
export const actualizarProducto = async (idProducto, productoData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('✏️ Actualizando producto:', idProducto);
    
    const requestBody = await mapearProductoParaBackend(productoData);
    
    // ✅ USAR ENDPOINT CORRECTO: /api/CategoriaProducto/producto/{id}/editar
    const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.UPDATE, { 
      id: idProducto 
    });
    
    console.log('🔗 URL actualizar producto:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    await handleResponse(response);
    
    const data = await response.json();
    console.log('✅ Producto actualizado:', data);
    
    return mapearProductoDesdeBackend(data.data || data);
    
  } catch (error) {
    console.error('💥 Error en actualizarProducto:', error);
    throw error;
  }
};

// Eliminar un producto - CORREGIDO
export const eliminarProducto = async (idProducto) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('🗑️ Eliminando producto...', { idProducto });
    
    // ✅ USAR ENDPOINT CORRECTO: /api/CategoriaProducto/producto/{id}/eliminar
    const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.DELETE, { 
      id: idProducto 
    });
    
    console.log('🔗 URL eliminar producto:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('📥 Status de respuesta eliminar producto:', response.status);
    
    await handleResponse(response);

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
    console.log('📂 Obteniendo categorías para productos...');
    const categorias = await getCategorias();
    const nombresCategorias = categorias.map(cat => cat.nombre);
    
    console.log('✅ Categorías obtenidas:', nombresCategorias);
    return nombresCategorias;
    
  } catch (error) {
    console.error('💥 Error en getCategoriasComercio:', error);
    const categoriasPorDefecto = [
      'Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 
      'Bebidas', 'Mexicana', 'Postres', 'Aperitivos'
    ];
    console.log('🔄 Usando categorías por defecto:', categoriasPorDefecto);
    return categoriasPorDefecto;
  }
};