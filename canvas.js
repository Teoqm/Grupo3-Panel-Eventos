// Canvas: dibuja cuántos eventos se seleccionaron 

const lienzo = document.getElementById("grafica");
const ctx = lienzo.getContext("2d");

/**
 * Dibuja un aro de progreso con la cantidad de eventos en "Interesados"
 * y debajo un circulito por cada evento seleccionado.
 * @param {number} cantidad - eventos que están en Interesados
 * @param {number} total - todos los eventos (Eventos + Interesados)
 */
function dibujarSeleccionados(cantidad, total) {
  const ancho = lienzo.width;
  const alto = lienzo.height;

  // Borrar todo lo anterior, si no los dibujos se montan unos sobre otros
  ctx.clearRect(0, 0, ancho, alto);

  // Centro y tamaño del aro
  const cx = ancho / 2;
  const cy = 100;
  const radio = 70;

  // Aro gris de fondo (círculo completo = 2 * Math.PI)
  ctx.beginPath();
  ctx.arc(cx, cy, radio, 0, Math.PI * 2);
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#e6e6f5"; // un tono muy claro de la paleta
  ctx.stroke();

  // Aro lavanda: se llena según la proporción cantidad / total
  if (cantidad > 0 && total > 0) {
    const inicio = -Math.PI / 2; // empieza arriba (las 12 del reloj), no a la derecha
    const fin = inicio + (cantidad / total) * Math.PI * 2;

    ctx.beginPath();
    ctx.arc(cx, cy, radio, inicio, fin);
    ctx.strokeStyle = "#AEA1E8";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt"; // lo dejamos como estaba
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
  ctx.fillText(`de ${total} eventos`, cx, cy + 26);

  // Un circulito por cada evento seleccionado
  const puntos = Math.min(cantidad, 15);
  const separacion = 18;
  const xInicial = cx - ((puntos - 1) * separacion) / 2; // para que queden centrados

  for (let i = 0; i < puntos; i++) {
    ctx.beginPath();
    ctx.arc(xInicial + i * separacion, 210, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#B9BCFC";
    ctx.fill();
  }

  // Si no hay ninguno, un mensaje en vez de los circulitos
  if (cantidad === 0) {
    ctx.fillStyle = "#5b567d";
    ctx.font = "13px system-ui, sans-serif";
    ctx.fillText("Aún no hay eventos seleccionados", cx, 210);
  }
}
