(() => {
  const link = document.querySelector('.back-to-top');
  if (!link) return;
  const update = () => { link.hidden = window.scrollY < 350; };
  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('pageshow', update);
  update();
})();