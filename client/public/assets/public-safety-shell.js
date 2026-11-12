// Keep policy links available at the end of the content, rather than taking up every screen.
const safetyScroll = document.querySelector('.safety-page .ag-main-scroll');
const safetyFooter = document.querySelector('.safety-page > .ag-footer-standard');
if (safetyScroll && safetyFooter) {
  safetyFooter.classList.add('safety-meta');
  safetyScroll.append(safetyFooter);
}
