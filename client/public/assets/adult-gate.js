(() => {
  let confirmed = false;
  try { confirmed = sessionStorage.getItem('ag_consent') === 'true'; } catch {}
  if (confirmed) document.documentElement.removeAttribute('data-age-pending');
  if (!confirmed) {
    document.documentElement.style.visibility = 'hidden';
    window.location.replace('/index.html?from=' + encodeURIComponent(window.location.pathname));
    window.addEventListener('pageshow', () => window.location.replace('/index.html?from=' + encodeURIComponent(window.location.pathname)));
  }
})();
