// src/api/auth.js
// export async function registerComercio(data) {
//   const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/comercio/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(data)
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText || "Error en el registro");
//   }

//   return response.json();
// }

// Sin backend real, simulamos la función:
export async function registerComercio(data) {
  // Simulamos un delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulamos éxito o error
  if (!data.nombreComercio || !data.email || !data.password) {
    throw new Error("Faltan campos obligatorios");
  }

  return { Message: "Comercio registrado exitosamente (simulado)" };
}

export async function loginComercio(data) {
  // Simulamos un delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulamos éxito o error
  if (!data.email || !data.password) {
    throw new Error("Email y contraseña son requeridos");
  }

  // Simulamos credenciales incorrectas
  if (data.password.length < 6) {
    throw new Error("Credenciales inválidas");
  }

  return { 
    Message: "Inicio de sesión exitoso (simulado)",
    Token: "simulated-jwt-token",
    Comercio: {
      id: 1,
      nombre: "Mi Comercio Ejemplo",
      email: data.email
    }
  };
}