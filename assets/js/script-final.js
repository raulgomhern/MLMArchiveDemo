document.addEventListener('DOMContentLoaded', () => {
  const ta = document.getElementById('textoFinal');

  const userInfo = localStorage.getItem('userInfo') || '';
  const proyecto = safeParse(localStorage.getItem('selectedProject')) || null;
  const claves = safeParse(localStorage.getItem('finalKeywords')) || [];

  // Si faltara algo crítico, regresar
  if (!proyecto) {
    ta.value = "No hay proyecto seleccionado. Vuelve a la pantalla anterior.";
    return;
  }

  // Construir el texto final:
  // “... se realizó el proyecto (insertar título de proyecto) en el que (insertar descripción) y se relación con estos temas (tres palabras clave...)”
  const titulo = proyecto.nombre;
  const descripcion = proyecto.descripcion;
  const tresClaves = (claves && claves.length) ? claves : (proyecto.palabras || []).slice(0, 3);

  const textoUsuario = userInfo ? `${userInfo}\n\n` : '';
  const cuerpo = `En relación con este caso, en el programa Medialab Madrid (2002-2006) cuyo archivo se encuentra en el Archivo General de la Universidad Complutense de Madrid, se realizó el proyecto ${titulo}, ${descripcion} y se relación con estos temas ${tresClaves.join(', ')}.`;

  ta.value = textoUsuario + cuerpo; // readonly pero copiable [web:63][web:69]

  // El formulario no envía a servidor, solo evita recarga.
  document.getElementById('finalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Texto final preparado y copiable.');
  });
});

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}
