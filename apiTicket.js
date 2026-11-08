// Eventos desde la API de Ticketmaster 
// La API_KEY viene de config.js (que se carga antes en el index.html y no se sube a GitHub)

// Pide los eventos a la API y devuelve un arreglo (vacío si no hay)
async function buscarEventos(keyword, countryCode = "US") {
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("countryCode", countryCode);
  url.searchParams.set("size", 15);

  const res = await fetch(url);
  // fetch solo falla si no hay red; un 401 o 404 hay que revisarlo con res.ok
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  // Si no hay resultados, Ticketmaster no manda _embedded: ?. y ?? evitan que se rompa
  return data._embedded?.events ?? [];
}

// Convierte un evento de Ticketmaster en un objeto sencillo con solo lo que usamos.
// Así la tarjeta se puede crear igual con datos de la API o con datos guardados en localStorage.
function datosDelEvento(e) {
  const lugar = e._embedded?.venues?.[0]?.name ?? "Lugar por confirmar";
  const rango = e.priceRanges?.[0];
  const textoPrecio = rango ? `Desde ${rango.min} ${rango.currency}` : "Sin precio disponible";

  return {
    id: e.id,
    titulo: e.name,
    fecha: e.dates.start.localDate,
    descripcion: `${e.dates.start.localDate} · ${lugar} · ${textoPrecio}`,
    url: e.url ?? ""
  };
}

// Crea la tarjeta (el <li>) a partir de ese objeto sencillo.
// Se usa textContent (no innerHTML) porque los datos vienen de afuera (evita XSS).
function crearTarjeta(datos) {
  const li = document.createElement("li");
  li.className = "tarjeta";
  li.dataset.id = datos.id;
  li.dataset.fecha = datos.fecha; // se usa para la regla del choque de fechas

  // Agarradera: solo se arrastra desde aquí
  const asa = document.createElement("span");
  asa.className = "asa";
  asa.textContent = "⠿";

  const titulo = document.createElement("h3");
  titulo.textContent = datos.titulo;

  const descripcion = document.createElement("p");
  descripcion.textContent = datos.descripcion;

  const contenido = document.createElement("div");
  contenido.append(titulo, descripcion);

  // Enlace al evento en Ticketmaster (se abre en otra pestaña)
  if (datos.url) {
    const enlace = document.createElement("a");
    enlace.href = datos.url;
    enlace.target = "_blank";
    enlace.rel = "noopener";
    enlace.textContent = "Ver evento";
    contenido.append(enlace);
  }

  li.append(asa, contenido);
  return li;
}

// Busca los eventos de la palabra que se le pase y los muestra como tarjetas.
async function mostrarEventos(palabra = "music") {
  const lista = document.getElementById("eventos");
  const estado = document.getElementById("estadoEventos");

  lista.textContent = "";               // borra los resultados de la búsqueda anterior
  estado.classList.remove("error");     // por si la búsqueda anterior falló
  estado.textContent = `Buscando "${palabra}"...`;

  try {
    const eventos = await buscarEventos(palabra);

    // Los id de los eventos que ya están en Interesados, para no repetirlos
    const yaElegidos = [...document.querySelectorAll("#interesados .tarjeta")]
      .map((t) => t.dataset.id);

    let agregados = 0;

    eventos.forEach((e) => {
      if (yaElegidos.includes(e.id)) return; // ya está en Interesados: se salta
      lista.appendChild(crearTarjeta(datosDelEvento(e)));
      agregados++;
    });

    if (agregados === 0) {
      estado.textContent = `No se encontraron eventos nuevos de "${palabra}".`;
    } else {
      estado.textContent = `${agregados} eventos de "${palabra}" en Ticketmaster.`;
    }
  } catch (err) {
    // Sin internet o con la clave mala llegamos aquí
    console.error(err);
    estado.textContent = "No se pudieron cargar los eventos. Revisa tu conexión.";
    estado.classList.add("error");
  }
}