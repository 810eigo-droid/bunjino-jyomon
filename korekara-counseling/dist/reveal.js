/* One-time entrances; content stays visible without JavaScript. */
(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  const stopped = () => reduced.matches || document.documentElement.dataset.motion === 'paused';
  const frames = {
    rise: [{opacity: 0, translate: '0 22px'}, {opacity: 1, translate: '0 0'}],
    left: [{opacity: 0, translate: '-18px 0'}, {opacity: 1, translate: '0 0'}],
    right: [{opacity: 0, translate: '18px 0'}, {opacity: 1, translate: '0 0'}],
    pop: [{opacity: 0, scale: '.97'}, {opacity: 1, scale: '1'}],
    wipe: [{opacity: .2, clipPath: 'inset(0 12% 0 0 round 12px)'}, {opacity: 1, clipPath: 'inset(0 0 0 0 round 12px)'}]
  };
  const targets = new Map();
  document.querySelectorAll('h2').forEach((el, i) => targets.set(el, i % 2 ? 'right' : 'left'));
  document.querySelectorAll('h3').forEach(el => targets.set(el, 'rise'));
  document.querySelectorAll('.worries-banner picture,.profile-banner picture,.invitation-banner img,.farewell-banner picture').forEach(el => targets.set(el, 'rise'));
  document.querySelectorAll('.story-photo,.tea-photo').forEach((el, i) => targets.set(el, i ? 'right' : 'left'));
  document.querySelectorAll('.benefit-art,.voice-avatar').forEach(el => targets.set(el, 'pop'));
  // The first-view banner contains lettering, so reveal it without cropping.
  const hero = document.querySelector('.fv-frame picture');
  if (hero) targets.set(hero, 'rise');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      observer.unobserve(el);
      if (stopped() || el.getBoundingClientRect().width < 5) return;
      const animation = el.animate(frames[targets.get(el)] || frames.rise, {
        duration: el.matches('h2,h3') ? 650 : 850,
        easing: 'cubic-bezier(.22,.61,.36,1)',
        iterations: 1
      });
      active.add(animation);
      animation.finished.catch(() => {}).finally(() => active.delete(animation));
    });
  }, {threshold: .12});
  targets.forEach((_, el) => observer.observe(el));
  const cancelMotion = () => { if (stopped()) active.forEach(animation => animation.cancel()); };
  reduced.addEventListener('change', cancelMotion);
  new MutationObserver(cancelMotion).observe(document.documentElement, {attributes: true, attributeFilter: ['data-motion']});
})();