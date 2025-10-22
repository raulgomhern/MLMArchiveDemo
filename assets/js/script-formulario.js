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
    localStorage.setItem('userInfo', info);
    localStorage.setItem('userKeywords', JSON.stringify(selected));
    window.location.href = '.././html/seleccion.html';
  });

  function escapeHTML(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
});
