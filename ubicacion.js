/**
 * Ubicacion
 * Obtener la posicion del usuario y renderizarla en la interfaz.
 */

// Objeto para almacenar las coordenadas obtenidas 
const ubicacionUsuario = {
  latitud: null,
  longitud: null,
  precision: null,
  cargada: false
};

/**
 * Funcion principal para obtener la ubicacion actual
 * @param {Function} callbackExito - Funcion opcional que se ejecuta al obtener la ubicacion
 */
function obtenerUbicacionActual(callbackExito = null) {
  const btnUbicacion = document.getElementById('btnUbicacion');

  if (!('geolocation' in navigator)) {
    actualizarMensajeUbicacion('La geolocalizacion no esta soportada por tu navegador.', true);
    return;
  }

  actualizarMensajeUbicacion('Solicitando ubicacion actual...');
  if (btnUbicacion) btnUbicacion.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (posicion) => {
      const { latitude, longitude, accuracy } = posicion.coords;

      // Guardar en la estructura global del modulo
      ubicacionUsuario.latitud = latitude;
      ubicacionUsuario.longitud = longitude;
      ubicacionUsuario.precision = Math.round(accuracy);
      ubicacionUsuario.cargada = true;

      // Mostrar en la pantalla
      const textoFormateado = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)} (Precision: ${ubicacionUsuario.precision}m)`;
      actualizarMensajeUbicacion(textoFormateado, false);

      if (btnUbicacion) btnUbicacion.disabled = false;

      // Ejecutar callback si otro compañero necesita usar las coordenadas
      if (typeof callbackExito === 'function') {
        callbackExito(ubicacionUsuario);
      }
    },
    (error) => {
      const mensajesError = {
        1: 'Permiso de ubicacion denegado por el usuario.',
        2: 'No se pudo determinar la ubicacion actual.',
        3: 'Se agoto el tiempo de espera para obtener la ubicacion.'
      };

      const mensaje = mensajesError[error.code] || 'Error desconocido al obtener la ubicacion.';
      actualizarMensajeUbicacion(`Error: ${mensaje}`, true);
      
      if (btnUbicacion) btnUbicacion.disabled = false;
    },
    {
      enableHighAccuracy: true, // Solicita la maxima precision posible (GPS/Wi-Fi)
      timeout: 10000,           // Tiempo limite de 10 segundos
      maximumAge: 0             // No usar ubicaciones en cache
    }
  );
}



/**
 * Funcion auxiliar para actualizar el texto en el DOM
 */
function actualizarMensajeUbicacion(mensaje, esError = false) {
  const contenedor = document.getElementById('textoUbicacion');
  if (contenedor) {
    contenedor.textContent = mensaje;
    contenedor.style.color = esError ? '#7f1d1d' : '#1e3a8a';
  }
}

// Escuchador de evento si el boton existe al cargar
document.addEventListener('DOMContentLoaded', () => {
  const btnUbicacion = document.getElementById('btnUbicacion');
  if (btnUbicacion) {
    btnUbicacion.addEventListener('click', () => obtenerUbicacionActual());
  }
});
