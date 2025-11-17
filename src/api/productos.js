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

// Función mapearProductoParaBackend 
const mapearProductoParaBackend = async (productoData, esEdicion = false) => {
  // Obtener el ID de la categoría seleccionada
  let categoriaId = 1;
  
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

  const comercioId = esEdicion ? null : await obtenerComercioIdAutenticado();

  const productoMapeado = {
    nombre: productoData.nombre,
    descripcion: productoData.descripcion || '',
    unidadMedida: productoData.unidadMedida || 'unidad',
    precioUnitario: parseFloat(productoData.precio),
    oferta: productoData.oferta || false,
    stock: productoData.stock !== undefined ? productoData.stock : true,
    fotoPortada: productoData.imagen || null,
    categoriaId: categoriaId,
    ...(comercioId && !esEdicion && { comercioId: comercioId })
  };

  console.log('📤 Producto mapeado para backend:', productoMapeado, `(esEdicion: ${esEdicion})`);
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
    // ✅ CORREGIDO: No usar imagen por defecto, usar null o string vacío
    imagen: productoData.fotoPortada || productoData.imagen || null,
    categoria: productoData.categoria?.nombre || productoData.categoriaNombre || 'General',
    stock: productoData.stock !== undefined ? productoData.stock : true,
    estado: productoData.stock ? 'activo' : 'agotado',
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

// Crear un nuevo producto
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

    // ✅ SOLUCIÓN: Pasar false como segundo parámetro (o omitir) para creación
    const requestBody = await mapearProductoParaBackend(productoData, false);
    
    // ✅ USAR ENDPOINT CORRECTO: /api/CategoriaProducto/{idCategoria}/crear
    const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.CREATE, { 
      idCategoria: categoriaId 
    });
    
    console.log('🔗 URL crear producto:', url);
    console.log('📤 Request body para creación:', requestBody);
    
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

// Actualizar un producto
export const actualizarProducto = async (idProducto, productoData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('✏️ Actualizando producto:', idProducto);
    
    // ✅ SOLUCIÓN: Pasar true como segundo parámetro para indicar que es edición
    const requestBody = await mapearProductoParaBackend(productoData, true);
    
    // ✅ AGREGAR EL ID DEL PRODUCTO AL REQUEST BODY (según tu DTO UpdateProductoRequest)
    requestBody.idProducto = idProducto;
    
    // ✅ USAR ENDPOINT CORREGIDO: /api/categorias/productos/{idProducto}
    const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.UPDATE, { 
      idProducto: idProducto 
    });
    
    console.log('🔗 URL actualizar producto:', url);
    console.log('📤 Request body para edición:', requestBody);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Status de respuesta actualizar producto:', response.status);
    
    // ✅ CORREGIR: Manejar la respuesta sin leerla múltiples veces
    if (!response.ok) {
      // Leer el error una sola vez
      const errorText = await response.text();
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        // Intentar parsear como JSON si es posible
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.mensaje || errorData.message || errorMessage;
      } catch (e) {
        // Si no es JSON, usar el texto plano
        errorMessage = errorText || errorMessage;
      }
      
      console.error('❌ Detalles del error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Leer la respuesta exitosa
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.warn('⚠️ La respuesta no es JSON, usando texto plano');
      data = { mensaje: responseText };
    }
    
    console.log('✅ Producto actualizado exitosamente:', data);
    
    return mapearProductoDesdeBackend(data.data || data);
    
  } catch (error) {
    console.error('💥 Error en actualizarProducto:', error);
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

    console.log('🗑️ Eliminando producto...', { idProducto });
    
    // ✅ CORREGIDO: Usar el endpoint correcto con idProducto
    const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.DELETE, { 
      idProducto: idProducto 
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
    
    // ✅ MEJORAR: Manejar mejor la respuesta
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.mensaje || errorData.message || errorMessage;
      } catch (e) {
        // Si no se puede parsear como JSON, usar el texto plano
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // ✅ El backend retorna un mensaje de éxito
    const result = await response.json();
    console.log('✅ Producto eliminado del backend:', result);
    
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

export const obtenerComercioIdAutenticado = async () => {
  try {
    const token = getToken();
    if (!token) {
      console.warn('⚠️ No hay token de autenticación');
      return 1;
    }

    console.log('🔍 Obteniendo comercioId del token...');

    // Opción 1: Intentar obtener del endpoint mi-comercio
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/comercios/mi-comercio`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ ComercioId obtenido de mi-comercio:', data.idcomercio);
        
        // Guardar en localStorage para futuras peticiones
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const user = JSON.parse(userData);
            user.comercioId = data.idcomercio;
            localStorage.setItem('userData', JSON.stringify(user));
          } else {
            // Si no existe userData, crearlo
            localStorage.setItem('userData', JSON.stringify({
              comercioId: data.idcomercio,
              nombreComercio: data.nombreComercio
            }));
          }
        } catch (e) {
          console.warn('⚠️ No se pudo guardar comercioId en localStorage');
        }
        
        return data.idcomercio;
      } else {
        console.warn(`⚠️ Error ${response.status} al obtener mi-comercio`);
      }
    } catch (error) {
      console.warn('⚠️ Error en endpoint mi-comercio:', error.message);
    }

    // Opción 2: Intentar obtener directamente del token
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Payload del token:', payload);
      
      // El NameIdentifier debería ser el idcomercio
      if (payload.nameid) {
        console.log('✅ ComercioId obtenido del token (nameid):', payload.nameid);
        return parseInt(payload.nameid);
      }
      
      // Buscar en otros claims comunes
      if (payload.sub) {
        console.log('✅ ComercioId obtenido del token (sub):', payload.sub);
        return parseInt(payload.sub);
      }
      
      if (payload.comercioId) {
        console.log('✅ ComercioId obtenido del token (comercioId):', payload.comercioId);
        return payload.comercioId;
      }
      
    } catch (e) {
      console.warn('⚠️ No se pudo decodificar el token:', e.message);
    }

    // Opción 3: Intentar del localStorage
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.comercioId) {
          console.log('✅ ComercioId obtenido del localStorage:', user.comercioId);
          return user.comercioId;
        }
      }
    } catch (e) {
      console.warn('⚠️ Error al parsear userData:', e.message);
    }

    console.warn('⚠️ No se pudo obtener el ComercioId, usando valor por defecto 1');
    return 1;
    
  } catch (error) {
    console.error('❌ Error crítico al obtener ComercioId:', error);
    return 1;
  }
};

export const getCategoriasDelComercio = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    console.log('📂 Obteniendo categorías del comercio actual...');
    
    const comercioId = await obtenerComercioIdAutenticado();
    console.log('🏪 Comercio ID para categorías:', comercioId);
    
    // Intentar obtener categorías del comercio específico
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/comercios/${comercioId}/categorias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('📥 Status de respuesta categorías del comercio:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Categorías del comercio obtenidas:', data);
        
        // Manejar diferentes formatos de respuesta
        let categoriasData = [];
        if (Array.isArray(data)) {
          categoriasData = data;
        } else if (data.data && Array.isArray(data.data)) {
          categoriasData = data.data;
        } else if (data.categorias && Array.isArray(data.categorias)) {
          categoriasData = data.categorias;
        }
        
        const nombresCategorias = categoriasData.map(cat => cat.nombre);
        console.log('📝 Nombres de categorías del comercio:', nombresCategorias);
        return nombresCategorias;
      } else {
        console.warn(`⚠️ Error ${response.status} obteniendo categorías del comercio`);
      }
    } catch (apiError) {
      console.warn('⚠️ Error con endpoint específico de comercio:', apiError.message);
    }

    // Fallback: obtener todas las categorías del sistema
    console.log('🔄 Usando todas las categorías como fallback');
    const todasLasCategorias = await getTodasLasCategorias();
    const nombresTodasCategorias = todasLasCategorias.map(cat => cat.nombre);
    
    console.log('📝 Todas las categorías disponibles:', nombresTodasCategorias);
    return nombresTodasCategorias;
    
  } catch (error) {
    console.error('💥 Error en getCategoriasDelComercio:', error);
    
    // Último fallback: categorías por defecto
    const categoriasPorDefecto = [
      'Hamburguesas', 'Pizzas', 'Ensaladas', 'Sushi', 
      'Bebidas', 'Mexicana', 'Postres', 'Aperitivos'
    ];
    
    console.log('🔄 Usando categorías por defecto por error:', categoriasPorDefecto);
    return categoriasPorDefecto;
  }
};