const API_KEY = "6mq8s7MWBD4rGnA2LXipm3TGogTsFy6f";

async function buscarEventos(keyword, countryCode = "US") {
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("countryCode", countryCode);
  url.searchParams.set("size", 10);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return data._embedded?.events ?? [];
}

async function mostrarEventos() {
  const lista = document.getElementById("Eventos");
  
    const eventos = await buscarEventos("metal");
    console.log("Eventos recibidos:", eventos);
    if (eventos.length === 0) {
      lista.innerHTML = "<li>No se encontraron eventos</li>";
      return;
    }
    lista.innerHTML = "";
    eventos.forEach(e => {
        const li = document.createElement("li");
        
        const rango = e.priceRanges?.[0];
            const textoPrecio = rango
            ? `Desde ${rango.min} ${rango.currency}`
            : "No hay precio disponible";

        li.innerHTML = `<span class="asa">⠿</span><a>${e.name} |</a>  Fecha:  ${e.dates.start.localDate} | ${textoPrecio}`;
        lista.appendChild(li);

    });
  } 


mostrarEventos();