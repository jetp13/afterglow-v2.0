(() => {
  const destinations = { '/risk-calculator.html': 'ChemAid 物質混合器' };
  const requested = new URLSearchParams(window.location.search).get('from');
  if (["/home.html","/menu.html","/breathing.html","/voice.html","/white-noise.html","/safety.html","/etomidate-safety.html","/first-aid.html","/help.html","/privacy.html","/terms.html","/legal.html","/about.html","/rights.html","/first-aid-details.html","/support-main.html","/memoir.html"].includes(requested)) {
    window.location.replace(requested);
    return;
  }
  const target = Object.hasOwn(destinations, requested) ? requested : '/home.html';
  const button = document.getElementById('enter-btn');
  const checkboxes = document.querySelectorAll('.ag-consent-checkbox');
  if (requested) document.getElementById('gate-destination').textContent = '完成入口確認後，前往：' + destinations[target];
  try {
    if (requested && sessionStorage.getItem('ag_consent') === 'true') window.location.replace(target);
  } catch { /* Public safety remains available when browser storage is blocked. */ }
  checkboxes.forEach(box => box.addEventListener('change', () => {
    button.disabled = !Array.from(checkboxes).every(box => box.checked);
    button.classList.toggle('active', !button.disabled);
  }));
  button.addEventListener('click', () => {
    if (button.disabled) return;
    try {
      sessionStorage.setItem('ag_consent', 'true');
      window.location.assign(target);
    } catch {
      const error = document.getElementById('gate-error');
      error.hidden = false;
      error.textContent = '瀏覽器目前無法保存入口確認。你仍可直接閱讀上方的安全資訊。';
    }
  });
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
})();
