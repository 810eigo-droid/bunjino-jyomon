(() => {
  const button = document.querySelector('.motion-control');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  try { paused = localStorage.getItem('korekara-motion-paused') === 'true'; } catch {}
  function render() {
    const stopped = paused || preference.matches;
    document.documentElement.dataset.motion = stopped ? 'paused' : 'running';
    button.hidden = preference.matches;
    button.setAttribute('aria-pressed', String(stopped));
    button.textContent = stopped ? '背景の動きを再開' : '背景の動きを止める';
  }
  button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('korekara-motion-paused', String(paused)); } catch {}
    render();
  });
  preference.addEventListener('change', render);
  render();
})();
