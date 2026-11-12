(() => {
  const group = document.querySelector('.ag-capsule-list');
  if (!group) return;
  const pills = [...group.querySelectorAll('a.ag-menu-button')];
  let inView = true;
  const syncRest = () => {
    if (document.hidden || !inView) group.classList.add('is-resting');
    else group.classList.remove('is-resting');
  };
  document.addEventListener('visibilitychange', syncRest);
  if ('IntersectionObserver' in window) {
    new window.IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false;
      syncRest();
    }).observe(group);
  }
  syncRest();
  let timer;
  const clear = () => {
    window.clearTimeout(timer);
    group.classList.remove('is-selecting');
    pills.forEach(pill => pill.classList.remove('is-active'));
  };
  pills.forEach(pill => pill.addEventListener('click', event => {
    if (event.defaultPrevented || event.detail === 0 || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    clear();
    group.classList.add('is-selecting');
    pill.classList.add('is-active');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer = window.setTimeout(() => window.location.assign(pill.href), reduced ? 0 : 220);
  }));
  window.addEventListener('pagehide', clear);
  window.addEventListener('pageshow', clear);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') clear(); });
})();
