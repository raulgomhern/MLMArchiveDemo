document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('keywordSelect');
  const chips = document.getElementById('selectedChips');
  const submitBtn = document.getElementById('submitBtn');

  function getSelectedValues(selectEl) {
    return Array.from(selectEl.selectedOptions).map(o => o.value);
  }

  function renderChips(values) {
    chips.innerHTML = '';
    values.forEach(v => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.innerHTML = `${escapeHTML(v)} <button type="button" aria-label="Quitar">×</button>`;
      span.querySelector('button').addEventListener('click', () => {
        // Des-seleccionar en el <select>
        Array.from(sel.options).forEach(opt => {
          if (opt.value === v) opt.selected = false;
        });
        renderChips(getSelectedValues(sel));
      });
      chips.appendChild(span);
    });
  }

  sel.addEventListener('change', () => {
    renderChips(getSelectedValues(sel));
  });

  submitBtn.addEventListener('click', () => {
    const info = document.getElementById('infoInput').value || '';
    const selected = getSelectedValues(sel);
    if (selected.length === 0) {
      alert('Selecciona al menos una palabra clave');
      return;
    }
    // Guardar datos para pantallas siguientes
    localStorage.setItem('userInfo', info);
    localStorage.setItem('userKeywords', JSON.stringify(selected));

    // Redirigir a la segunda pantalla
    window.location.href = '.././html/seleccion.html'; // ajusta la ruta si procede
    // Alternativa (misma ventana) con assign():
    // window.location.assign('../html/seleccion.html'); // [MDN: Location.assign]
  });

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;'); // corregido: escapado de comilla simple
  }
});

