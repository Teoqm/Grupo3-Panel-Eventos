// Canvas: dibuja cuántos cupos de Interesados se han usado

// Buscamos el canvas y sacamos el contexto 2D
const lienzo = document.getElementById("grafica");
const ctx = lienzo.getContext("2d");

/**
 * Dibuja un aro que se llena según los eventos seleccionados
 * y debajo un circulito por cada cupo (lleno = ocupado, vacío = libre).
 * @param {number} cantidad - eventos que están en Interesados
 * @param {number} maximo - cupos permitidos (MAX_INTERESADOS en app.js)
 */
function dibujarSeleccionados(cantidad, maximo) {
  const ancho = lienzo.width;
  const alto = lienzo.height;

  // Borrar todo lo anterior, si no los dibujos se montan unos sobre otros
  ctx.clearRect(0, 0, ancho, alto);

  // Centro y tamaño del aro
  const cx = ancho / 2;
  const cy = 95;
  const radio = 70;

  // Aro claro de fondo (círculo completo = 2 * Math.PI)
  ctx.beginPath();
  ctx.arc(cx, cy, radio, 0, Math.PI * 2);
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#e6e6f5";
  ctx.stroke();

  // Aro lavanda: se llena según la proporción cantidad / maximo
  if (cantidad > 0) {
    const inicio = -Math.PI / 2;
    const fin = inicio + (cantidad / maximo) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(cx, cy, radio, inicio, fin);
    ctx.strokeStyle = "#AEA1E8";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt";
  }

  // Número grande en el centro
  ctx.fillStyle = "#2b2650";
  ctx.font = "bold 42px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(cantidad, cx, cy - 8);

  // Texto pequeño debajo del número
  ctx.fillStyle = "#5b567d";
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillText(`de ${maximo} cupos`, cx, cy + 26);

  // Un circulito por cada cupo: lleno si está ocupado, solo el borde si está libre
  const separacion = 24;
  const xInicial = cx - ((maximo - 1) * separacion) / 2;

  for (let i = 0; i < maximo; i++) {
    ctx.beginPath();
    ctx.arc(xInicial + i * separacion, 200, 8, 0, Math.PI * 2);

    if (i < cantidad) {
      ctx.fillStyle = "#AEA1E8"; // ocupado
      ctx.fill();
    } else {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#B9BEC5"; // libre
      ctx.stroke();
    }
  }

  // Mensaje según cuántos cupos quedan
  ctx.font = "13px system-ui, sans-serif";
  if (cantidad === maximo) {
    ctx.fillStyle = "#9f1239";
    ctx.fillText("¡Agenda llena!", cx, 228);
  } else {
    ctx.fillStyle = "#5b567d";
    ctx.fillText(`Te quedan ${maximo - cantidad} cupos`, cx, 228);
  }
}