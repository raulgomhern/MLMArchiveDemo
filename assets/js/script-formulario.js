document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('keywordSelect');
  const chips = document.getElementById('selectedChips');
  const submitBtn = document.getElementById('submitBtn');
  const clearBtn = document.getElementById('clearBtn');
  const infoEl = document.getElementById('infoInput');
  const counter = document.getElementById('infoCount');

  // Configuración opcional
  const MAX_INFO_LEN = 1000;      // límite de caracteres del textarea (ajusta si quieres)
  const MAX_KEYWORDS = 12;        // límite de palabras clave seleccionables (null para sin límite)

  // Restaurar estado previo
  try {
    const prev = JSON.parse(localStorage.getItem('userKeywords') || '[]');
    Array.from(sel.options).forEach(opt => { opt.selected = prev.includes(opt.value); });
    if (prev.length) renderChips(getSelectedValues(sel));
    const prevInfo = localStorage.getItem('userInfo') || '';
    if (prevInfo) infoEl.value = prevInfo;
  } catch {}

  // Placeholder dinámico según selección
  updatePlaceholder();

  // Contador de caracteres
  updateCounter();
  infoEl.addEventListener('input', () => {
    if (MAX_INFO_LEN && infoEl.value.length > MAX_INFO_LEN) {
      infoEl.value = infoEl.value.slice(0, MAX_INFO_LEN);
    }
    updateCounter();
  });

  // Permitir selección múltiple solo clicando: alternar el estado sin teclas modificadoras
  sel.addEventListener('mousedown', (e) => {
    // Evitar el comportamiento por defecto que limpia/selecciona rangos
    e.preventDefault();
    const option = e.target;
    if (option.tagName !== 'OPTION') return;

    // Si hay límite y ya está lleno, impedir añadir más
    const current = getSelectedValues(sel);
    const willSelect = !option.selected;
    if (MAX_KEYWORDS && willSelect && current.length >= MAX_KEYWORDS) {
      alert(`Puedes seleccionar hasta ${MAX_KEYWORDS} palabras clave.`);
      return;
    }

    option.selected = !option.selected;
    renderChips(getSelectedValues(sel));
    updatePlaceholder();
  });

  // Cambio por teclado (accesibilidad)
  sel.addEventListener('change', () => {
    const current = getSelectedValues(sel);
    if (MAX_KEYWORDS && current.length > MAX_KEYWORDS) {
      // Si se supera por teclado, recorta a los primeros N
      const set = new Set(current.slice(0, MAX_KEYWORDS));
      Array.from(sel.options).forEach(opt => { opt.selected = set.has(opt.value); });
    }
    renderChips(getSelectedValues(sel));
    updatePlaceholder();
  });

  // Limpiar selección
  clearBtn.addEventListener('click', () => {
    Array.from(sel.options).forEach(opt => { opt.selected = false; });
    renderChips([]);
    updatePlaceholder();
  });

  // Enviar
  submitBtn.addEventListener('click', () => {
    const info = infoEl.value || '';
    const selected = getSelectedValues(sel);
    if (selected.length === 0) {
      alert('Selecciona al menos una palabra clave');
      return;
    }
    localStorage.setItem('userInfo', info);
    localStorage.setItem('userKeywords', JSON.stringify(selected));
    window.location.href = '../html/seleccion.html';
  });

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
        updatePlaceholder();
      });
      chips.appendChild(span);
    });
    // Desactivar/activar el botón enviar según haya selección
    submitBtn.classList.toggle('disabled', values.length === 0);
  }

  function updatePlaceholder() {
    const count = getSelectedValues(sel).length;
    if (count === 0) {
      sel.setAttribute('aria-label', 'Sin selección');
    } else {
      sel.setAttribute('aria-label', `Seleccionadas ${count}`);
    }
  }

  function updateCounter() {
    if (!counter) return;
    const len = infoEl.value.length;
    counter.textContent = `${len}/${MAX_INFO_LEN}`;
  }

  function escapeHTML(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
});


