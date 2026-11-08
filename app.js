// App: une la ubicación, los eventos, el drag & drop y el canvas 

const listaEventos = document.getElementById("eventos");
const listaInteresados = document.getElementById("interesados");
const panelInteresados = document.querySelector(".panel-interesados");
const formBuscar = document.getElementById("formBuscar");
const inputBuscar = document.getElementById("inputBuscar");
const errorBusqueda = document.getElementById("errorBusqueda");

// Reglas  
const MAX_INTERESADOS = 7;
const CLAVE_INTERESADOS = "grupo3-interesados";
const CLAVE_BUSQUEDA = "grupo3-busqueda";

// Guardar para futuras sesiones (localStorage

// Guarda los datos de cada tarjeta de Interesados.
function guardarInteresados() {
  const datos = [...listaInteresados.children].map((t) => ({
    id: t.dataset.id,
    fecha: t.dataset.fecha,
    titulo: t.querySelector("h3").textContent,
    descripcion: t.querySelector("p").textContent,
    url: t.querySelector("a")?.href ?? ""
  }));

  try {
    localStorage.setItem(CLAVE_INTERESADOS, JSON.stringify(datos));
  } catch (err) {
    console.warn("No se pudo guardar en localStorage", err);
  }
}

// Al abrir la página, vuelve a crear las tarjetas que estaban guardadas
function cargarInteresados() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_INTERESADOS)) ?? [];
    datos.forEach((d) => listaInteresados.appendChild(crearTarjeta(d)));
  } catch (err) {
    console.warn("No se pudo leer localStorage", err);
  }
}

// Choque de fechas
// Si dos eventos de Interesados son el mismo día, se marcan con la clase "choque"
function revisarChoques() {
  // Primero se le quita la marca a todas (por si una se devolvió a Eventos)
  document.querySelectorAll(".tarjeta").forEach((t) => t.classList.remove("choque"));

  // Contar cuántos eventos hay por cada fecha
  const conteo = {};
  for (const t of listaInteresados.children) {
    conteo[t.dataset.fecha] = (conteo[t.dataset.fecha] || 0) + 1;
  }

  // Marcar las que tienen la fecha repetida
  for (const t of listaInteresados.children) {
    if (conteo[t.dataset.fecha] > 1) t.classList.add("choque");
  }
}

// Contadores, canvas y guardado: se llama cada vez que algo cambia
function actualizarContador() {
  const enEventos = listaEventos.children.length;
  const seleccionados = listaInteresados.children.length;

  document.getElementById("contadorEventos").textContent = enEventos;
  document.getElementById("contadorInteresados").textContent = `${seleccionados}/${MAX_INTERESADOS}`;

  dibujarSeleccionados(seleccionados, MAX_INTERESADOS);
  revisarChoques();
  guardarInteresados();
}


// Límite de interesados
// Si la lista está llena, el panel se pone rojo un momento
function avisarLleno() {
  if (panelInteresados.classList.contains("lleno")) return;
  panelInteresados.classList.add("lleno");
  setTimeout(() => panelInteresados.classList.remove("lleno"), 1000);
}

// Drag & drop
const opcionesComunes = {
  animation: 200,
  ghostClass: "fantasma",
  chosenClass: "elegida",
  handle: ".asa",
  onEnd: actualizarContador
};

new Sortable(listaEventos, {
  ...opcionesComunes,
  group: "eventos"
});

new Sortable(listaInteresados, {
  ...opcionesComunes,
  group: {
    name: "eventos",
    put: (to) => {
      if (to.el.children.length < MAX_INTERESADOS) return true;
      avisarLleno();
      return false;
    }
  }
});

// Botón para vaciar Interesados (devuelve las tarjetas a Eventos)
document.getElementById("btnVaciar").addEventListener("click", () => {
  [...listaInteresados.children].forEach((t) => listaEventos.appendChild(t));
  actualizarContador();
});


// Validación del buscador
function mensajeBusqueda(input) {
  const v = input.validity;
  if (v.valueMissing) return "Escribe qué tipo de evento quieres buscar.";
  if (v.tooShort) return `Usa al menos ${input.minLength} letras.`;
  if (v.patternMismatch) return "Solo letras y espacios (sin números ni símbolos).";
  if (v.customError) return input.validationMessage;
  return "";
}

// Regla propia: no puede ser solo espacios (el pattern sí los deja pasar)
inputBuscar.addEventListener("input", () => {
  inputBuscar.setCustomValidity(
    inputBuscar.value !== "" && inputBuscar.value.trim() === "" ? "No puede ser solo espacios." : ""
  );
  errorBusqueda.textContent = ""; // mientras escribe, se borra el error anterior
});

// Se escucha el submit del formulario para que también funcione con Enter
formBuscar.addEventListener("submit", async (e) => {
  e.preventDefault(); // que no recargue la página

  if (!formBuscar.checkValidity()) {
    errorBusqueda.textContent = mensajeBusqueda(inputBuscar);
    inputBuscar.focus();
    return;
  }

  const palabra = inputBuscar.value.trim();
  try {
    localStorage.setItem(CLAVE_BUSQUEDA, palabra);
  } catch (err) {
    console.warn("No se pudo guardar la búsqueda", err);
  }

  await mostrarEventos(palabra);
  actualizarContador(); 
});

// Arranque
cargarInteresados();
actualizarContador();

let ultimaBusqueda = "music";
try {
  ultimaBusqueda = localStorage.getItem(CLAVE_BUSQUEDA) ?? "music";
} catch (err) {
  console.warn("No se pudo leer la última búsqueda", err);
}
inputBuscar.value = ultimaBusqueda;
mostrarEventos(ultimaBusqueda).then(actualizarContador);

obtenerUbicacionActual((datos) => {
  console.log("Ubicación lista:", datos);
});