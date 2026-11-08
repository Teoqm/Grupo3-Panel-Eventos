// Eventos desde la API de Ticketmaster 
const API_KEY = "6mq8s7MWBD4rGnA2LXipm3TGogTsFy6f";

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

// Busca los eventos de la palabra que se le pase y los muestra como tarjetas.
// Si no se le pasa nada, busca "music" (es lo que sale al abrir la página).
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

    // Por cada evento se crea una tarjeta con título y descripción.
    // Se usa textContent (no innerHTML) porque los datos vienen de afuera (evita XSS).
    eventos.forEach((e) => {
      if (yaElegidos.includes(e.id)) return; // ya está en Interesados: se salta

      const li = document.createElement("li");
      li.className = "tarjeta";
      li.dataset.id = e.id;

      // Agarradera: solo se arrastra desde aquí
      const asa = document.createElement("span");
      asa.className = "asa";
      asa.textContent = "⠿";

      const titulo = document.createElement("h3");
      titulo.textContent = e.name;

      // Descripción: fecha, lugar y precio (si existen)
      const lugar = e._embedded?.venues?.[0]?.name ?? "Lugar por confirmar";
      const rango = e.priceRanges?.[0];
      const textoPrecio = rango ? `Desde ${rango.min} ${rango.currency}` : "Sin precio disponible";

      const descripcion = document.createElement("p");
      descripcion.textContent = `${e.dates.start.localDate} · ${lugar} · ${textoPrecio}`;

      const contenido = document.createElement("div");
      contenido.append(titulo, descripcion);

      // Enlace al evento en Ticketmaster (se abre en otra pestaña)
      if (e.url) {
        const enlace = document.createElement("a");
        enlace.href = e.url;
        enlace.target = "_blank";
        enlace.rel = "noopener";
        enlace.textContent = "Ver evento";
        contenido.append(enlace);
      }

      li.append(asa, contenido);
      lista.appendChild(li);   // se agrega la tarjeta a la lista "Eventos"
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