document.addEventListener('DOMContentLoaded', () => {
  const proyectos = [
    { id:"bordergames", nombre:"Bordergames",
      autores:"La Fiambrera Obrera; taller en Medialab Madrid (2005)",
      descripcion:"Videojuego participativo en Lavapiés donde jóvenes migrantes se representan y organizan colectivamente, usando el juego como herramienta de inclusión y articulación comunitaria.",
      palabras:["participación ciudadana","co-creación","inclusión","videojuego","comunidad","juventud","barrio","cultura digital","Justicia social","Igualdad de oportunidades","Pensamiento crítico"] },
    { id:"megafone", nombre:"Megafone",
      autores:"Antoni Abad (2004)",
      descripcion:"Plataforma web y móvil donde colectivos marginados publican audio, vídeo, texto e imagen en tiempo real para amplificar sus voces.",
      palabras:["tecnologías cívicas","comunicación comunitaria","móviles","datos ciudadanos","derechos","visibilidad social","Transformación digital","Ciencia ciudadana","Datos urbanos"] },
    { id:"wikimap", nombre:"Wikimap Madrid",
      autores:"Influenza (Raquel Rennó, Rafael Marchetti) con Ars Electronica FutureLab y MediaLabMadrid (2006)",
      descripcion:"Cartografía colaborativa que vincula relatos, imágenes y sonidos a lugares de Madrid para construir memoria colectiva urbana.",
      palabras:["mapas participativos","datos urbanos","memoria colectiva","interfaz web","participación vecinal","Participación ciudadana","Laboratorio ciudadano"] },
    { id:"pigcity", nombre:"Pig City",
      autores:"MVRDV, con Stroom Den Haag (2000)",
      descripcion:"Visión especulativa de “Pig Towers” con bioenergía y automatización para mitigar impactos de la producción porcina en clave urbana.",
      palabras:["urbanismo especulativo","energía renovable","eficiencia","economía circular","agrociudad","comunicación visual","Energías renovables","Eficiencia energética","Materiales sostenibles"] },
    { id:"worldprocessor", nombre:"World Processor",
      autores:"Ingo Günther",
      descripcion:"Serie de globos-terraqueos-escultura que cartografían fenómenos globales (refugiados, energía, incendios) para concienciar ambientalmente.",
      palabras:["visualización de datos","cartografía crítica","cambio climático","recursos","conciencia ambiental","Calidad del aire","Contaminación acústica","ODS 11","Agenda 2030"] },
    { id:"balcanes", nombre:"La Guerra de los Balcanes (videojuego)",
      autores:"Personal Cinema",
      descripcion:"Videojuego-obra que convierte la exposición en un entorno inmersivo para reflexionar sobre geopolítica y vida cotidiana en conflicto.",
      palabras:["videojuego crítico","participación","geopolítica","inmersión","educación crítica","cultura digital","Verificación de información","Transformación digital"] }
  ];

  const imagen = "https://static.flickr.com/56/177844236_75e43126d8_o.jpg";
  const contenedor = document.getElementById('cardsContainer');
  const sendBtn = document.getElementById('sendSelectionBtn');

  // Selección múltiple venida de la página 1
  let selected = [];
  try { selected = JSON.parse(localStorage.getItem('userKeywords') || '[]'); } catch { selected = []; }
  const selectedLower = selected.map(s => s.toLowerCase());

  // Filtrar por coincidencia (o mostrar todos si no hay)
  let filtrados = selectedLower.length
    ? proyectos.filter(p => p.palabras.some(pal => selectedLower.some(sel => pal.toLowerCase().includes(sel))))
    : proyectos.slice();
  if (filtrados.length === 0) filtrados = proyectos.slice();

  // Mostrar solo 3 para poder elegir una
  const top3 = filtrados.slice(0, 3);

  renderCards(top3, contenedor, imagen);

  // Selección de card
  let activeId = null;
  contenedor.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    document.querySelectorAll('.card').forEach(el => el.classList.remove('active'));
    card.classList.add('active');
    activeId = card.dataset.id;
    sendBtn.disabled = false;
  });

  // Enviar selección a la tercera pantalla
  sendBtn.addEventListener('click', () => {
    if (!activeId) return;
    const proyecto = top3.find(p => p.id === activeId);
    if (!proyecto) return;

    const seleccionadasEnProyecto = selected.filter(s =>
      proyecto.palabras.map(x => x.toLowerCase()).includes(s.toLowerCase())
    );
    const unicas = [...new Set(proyecto.palabras)];
    const claves = [
      ...seleccionadasEnProyecto.slice(0, 2),
      ...unicas.filter(k => !seleccionadasEnProyecto.some(s => s.toLowerCase() === k.toLowerCase())).slice(0, 3)
    ].slice(0, 3);

    localStorage.setItem('selectedProject', JSON.stringify({
      id: proyecto.id, nombre: proyecto.nombre, descripcion: proyecto.descripcion, palabras: proyecto.palabras
    }));
    localStorage.setItem('finalKeywords', JSON.stringify(claves));

    // Redirección a tu tercera pantalla (ajusta si usas local o CodePen)
    window.location.href = '.././html/final.html';
  });
});

function renderCards(lista, contenedor, imagen) {
  contenedor.innerHTML = '';
  lista.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = p.id;
    card.innerHTML = `
      <img src="${imagen}" alt="${escapeHTML(p.nombre)}">
      <h3>${escapeHTML(p.nombre)}</h3>
      <p><strong>Autores:</strong> ${escapeHTML(p.autores)}</p>
      <p>${escapeHTML(p.descripcion)}</p>
      <div class="taglist">
        ${p.palabras.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join('')}
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function sanitize(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;'); // corregido
}
function escapeHTML(str) { return sanitize(str); }

