import { API_CONFIG } from '../config/config.js';

export async function registerComercio(data) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en el registro");
  }

  return response.json();
}

export async function loginComercio(data) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en el inicio de sesión");
  }

  return response.json();
}

// Función para cerrar sesión
export function logoutComercio() {
  localStorage.removeItem("token");
  localStorage.removeItem("comercio");
}

// Función para verificar si está autenticado
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token && token !== "simulated-jwt-token";
}

// Función para obtener el token
export function getToken() {
  return localStorage.getItem("token");
}

// Función para obtener los datos del comercio
export function getComercio() {
  const comercio = localStorage.getItem("comercio");
  return comercio ? JSON.parse(comercio) : null;
}