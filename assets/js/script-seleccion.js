document.addEventListener('DOMContentLoaded', () => {
  const proyectos = [
    {
      id: "bordergames",
      nombre: "Bordergames",
      autores: "La Fiambrera Obrera; taller en Medialab Madrid (2005)",
      descripcion: "Videojuego participativo en Lavapiés donde jóvenes migrantes se representan y organizan colectivamente, usando el juego como herramienta de inclusión y articulación comunitaria.",
      palabras: ["participación ciudadana","co-creación","inclusión","videojuego","comunidad","juventud","barrio","cultura digital","Justicia social","Igualdad de oportunidades","Pensamiento crítico"],
      imagen: "https://archivomedialabmadrid.org/wp-content/uploads/2024/04/MLM_Bordergames.jpg"
    },
    {
      id: "megafone",
      nombre: "Megafone",
      autores: "Antoni Abad (2004)",
      descripcion: "Plataforma web y móvil donde colectivos marginados publican audio, vídeo, texto e imagen en tiempo real para amplificar sus voces.",
      palabras: ["tecnologías cívicas","comunicación comunitaria","móviles","datos ciudadanos","derechos","visibilidad social","Transformación digital","Ciencia ciudadana","Datos urbanos"],
      imagen: "https://megafone.net/INFO/files/images/accessible_map.jpg"
    },
    {
      id: "wikimap",
      nombre: "Wikimap Madrid",
      autores: "Influenza (Raquel Rennó, Rafael Marchetti) con Ars Electronica FutureLab y MediaLabMadrid (2006)",
      descripcion: "Cartografía colaborativa que vincula relatos, imágenes y sonidos a lugares de Madrid para construir memoria colectiva urbana.",
      palabras: ["mapas participativos","datos urbanos","memoria colectiva","interfaz web","participación vecinal","Participación ciudadana","Laboratorio ciudadano"],
      imagen: "https://static.flickr.com/56/177844236_75e43126d8_o.jpg"
    },
    {
      id: "pigcity",
      nombre: "Pig City",
      autores: "MVRDV, con Stroom Den Haag (2000)",
      descripcion: "Visión especulativa de “Pig Towers” con bioenergía y automatización para mitigar impactos de la producción porcina en clave urbana.",
      palabras: ["urbanismo especulativo","energía renovable","eficiencia","economía circular","agrociudad","comunicación visual","Energías renovables","Eficiencia energética","Materiales sostenibles"],
      imagen: "https://www.mvrdv.com/media//scraped/7db71cfc-7f95-46d6-8e9d-fa7c5a86e403.jpg"
    },
    {
      id: "worldprocessor",
      nombre: "World Processor",
      autores: "Ingo Günther",
      descripcion: "Serie de globos-terraqueos-escultura que cartografían fenómenos globales (refugiados, energía, incendios) para concienciar ambientalmente.",
      palabras: ["visualización de datos","cartografía crítica","cambio climático","recursos","conciencia ambiental","Calidad del aire","Contaminación acústica","ODS 11","Agenda 2030"],
      imagen: "https://images.squarespace-cdn.com/content/v1/574abcd9d210b84cd9730450/1464896085308-J5BKI5M5P2HYGRAKIA7Y/worldprocessor.kah.jpeg"
    },
    {
      id: "balcanes",
      nombre: "La Guerra de los Balcanes (videojuego)",
      autores: "Personal Cinema",
      descripcion: "Videojuego-obra que convierte la exposición en un entorno inmersivo para reflexionar sobre geopolítica y vida cotidiana en conflicto.",
      palabras: ["videojuego crítico","participación","geopolítica","inmersión","educación crítica","cultura digital","Verificación de información","Transformación digital"],
      imagen: "https://archivomedialabmadrid.org/wp-content/uploads/2024/04/MLM_La_creacion_de_la_guerra_de_los_Balcanes-621x500.jpg"
    }
  ];

  const contenedor = document.getElementById('cardsContainer');
  const sendBtn = document.getElementById('sendSelectionBtn');

  let selected = [];
  try { selected = JSON.parse(localStorage.getItem('userKeywords') || '[]'); } catch { selected = []; }
  const selectedLower = selected.map(s => s.toLowerCase());

  let filtrados = selectedLower.length
    ? proyectos.filter(p => p.palabras.some(pal => selectedLower.some(sel => pal.toLowerCase().includes(sel))))
    : proyectos.slice();
  if (filtrados.length === 0) filtrados = proyectos.slice();

  const top3 = filtrados.slice(0, 3);
  renderCards(top3, contenedor);

  let activeId = null;
  contenedor.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    document.querySelectorAll('.card').forEach(el => el.classList.remove('active'));
    card.classList.add('active');
    activeId = card.dataset.id;
    sendBtn.disabled = false;
  });

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

    // Guardar imagen específica del proyecto
    localStorage.setItem('selectedProject', JSON.stringify({
      id: proyecto.id,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      palabras: proyecto.palabras,
      imagen: proyecto.imagen
    }));
    localStorage.setItem('finalKeywords', JSON.stringify(claves));

    window.location.href = '.././html/final.html';
  });
});

function renderCards(lista, contenedor) {
  contenedor.innerHTML = '';
  lista.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = p.id;
    card.innerHTML = `
      <img src="${p.imagen}" alt="${escapeHTML(p.nombre)}">
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

function escapeHTML(str) {
  return String(str)
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'","&#39;");
}

