(() => {
  const panel = document.getElementById('entry-confirmation-content');
  if (!panel) return;
  const requested = new URLSearchParams(window.location.search).get('from');
  if (requested !== '/risk-calculator.html') return;
  let confirmed = false;
  try { confirmed = sessionStorage.getItem('ag_consent') === 'true'; } catch {}
  if (!confirmed) panel.showModal();
})();
