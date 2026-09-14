(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const render = () => {
    document.documentElement.dataset.motion = preference.matches ? 'paused' : 'running';
  };
  preference.addEventListener('change', render);
  render();
})();