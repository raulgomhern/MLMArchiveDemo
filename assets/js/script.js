// script.js
// Desplazamiento suave a la sección indicada por data-target
document.querySelector('.btn-experimenta').addEventListener('click', () => {
  window.location.href = '.././html/formulario.html';
});
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.scroll-down[data-target]');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSel = btn.getAttribute('data-target');
      const targetEl = document.querySelector(targetSel);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
