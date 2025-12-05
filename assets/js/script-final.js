document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('textoFinal');
  const img = document.getElementById('projectImage');
  const caption = document.getElementById('imageCaption');

  const userInfo = localStorage.getItem('userInfo') || '';
  const proyecto = safeParse(localStorage.getItem('selectedProject')) || null;
  const claves = safeParse(localStorage.getItem('finalKeywords')) || [];

  if (!proyecto) {
    ta.value = "No hay proyecto seleccionado. Vuelve a la pantalla anterior.";
    // Ocultar el bloque de imagen si no hay proyecto
    if (img) img.style.display = 'none';
    if (caption) caption.style.display = 'none';
    return;
  }

  // Construir el texto final
  const titulo = proyecto.nombre;
  const descripcion = proyecto.descripcion;
  const tresClaves = (claves && claves.length) ? claves : (proyecto.palabras || []).slice(0, 3);

  const textoUsuario = userInfo ? `${userInfo}\n\n` : '';
  const cuerpo = `En relación con este caso, en el programa Medialab Madrid (2002-2006) cuyo archivo se encuentra en el Archivo General de la Universidad Complutense de Madrid, se realizó el proyecto ${titulo}, ${descripcion} y se relaciona con los temas de ${tresClaves.join(', ')}.`;

  ta.value = textoUsuario + cuerpo;

  // Imagen del proyecto: usa la guardada en selectedProject o la predeterminada
  const imagenUrl = (proyecto && proyecto.imagen)
    ? proyecto.imagen
    : "https://static.flickr.com/56/177844236_75e43126d8_o.jpg";
  img.src = imagenUrl;
  img.alt = `Imagen de ${titulo}`;
  caption.textContent = titulo;

  // El formulario no envía a servidor, solo evita recarga.
  document.getElementById('finalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Texto final preparado y copiable.');
  });
});

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}
