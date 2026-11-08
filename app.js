// App: une la ubicación, los eventos, el drag & drop y el canvas

const listaEventos = document.getElementById("eventos");
const listaInteresados = document.getElementById("interesados");

// Cuenta las tarjetas de cada lista, actualiza los contadores y redibuja el canvas
function actualizarContador() {
  const enEventos = listaEventos.children.length;
  const seleccionados = listaInteresados.children.length;

  document.getElementById("contadorEventos").textContent = enEventos;
  document.getElementById("contadorInteresados").textContent = seleccionados;

  dibujarSeleccionados(seleccionados, enEventos + seleccionados);
}

// Las dos listas usan las mismas opciones.
// Con el mismo group se pueden pasar tarjetas de una a otra (en los dos sentidos).
const opciones = {
  group: "eventos",
  animation: 200,
  ghostClass: "fantasma",
  chosenClass: "elegida",
  handle: ".asa",
  onEnd: actualizarContador // al soltar, recalcula
};

new Sortable(listaEventos, opciones);
new Sortable(listaInteresados, opciones);

// Buscador
// Se escucha el submit del formulario para que también funcione con Enter
document.getElementById("formBuscar").addEventListener("submit", async (e) => {
  e.preventDefault(); // que no recargue la página
  const palabra = document.getElementById("inputBuscar").value.trim();
  if (palabra === "") return; // solo espacios: no busca nada

  await mostrarEventos(palabra); // espera a que lleguen los eventos...
  actualizarContador();          // ...y después recalcula los números y el canvas
});

// Arranque 
dibujarSeleccionados(0, 0);
mostrarEventos().then(actualizarContador);  // primera búsqueda ("music") y actualiza los números
obtenerUbicacionActual((datos) => {
  console.log("Ubicación lista:", datos);
});