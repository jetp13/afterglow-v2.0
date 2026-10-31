(() => {
  const panel = document.getElementById('entry-confirmation-content');
  if (!panel) return;
  const requested = new URLSearchParams(window.location.search).get('from');
  if (!requested || ['/menu.html','/breathing.html','/voice.html','/white-noise.html'].includes(requested)) return;
  let confirmed = false;
  try { confirmed = sessionStorage.getItem('ag_consent') === 'true'; } catch {}
  if (!confirmed) panel.showModal();
})();
