(() => {
  const destinations = {
    '/first-aid-details.html': '詳細減害資訊', '/home.html': 'Afterglow 首頁', '/risk-calculator.html': 'ChemAid 混用風險工具',
    '/rights.html': 'Rights 完整權利資訊', '/support-main.html': '18+ 支援工具',
    '/breathing.html': '呼吸練習', '/voice.html': '聲音陪伴',
    '/white-noise.html': '白噪音', '/menu.html': '工具選單', '/memoir.html': 'Memoir'
  };
  const requested = new URLSearchParams(window.location.search).get('from');
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
