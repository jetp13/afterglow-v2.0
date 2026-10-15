document.querySelectorAll('.ag-accordion-header').forEach((header,index)=>{
  const content=header.nextElementSibling;
  if(!content)return;
  content.id=content.id||'safety-panel-'+index;
  header.setAttribute('role','button');header.tabIndex=0;
  header.setAttribute('aria-controls',content.id);header.setAttribute('aria-expanded','false');
  const sync=()=>document.querySelectorAll('.ag-accordion-header').forEach(item=>item.setAttribute('aria-expanded',String(item.parentElement.classList.contains('active'))));
  header.addEventListener('click',sync);
  header.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();header.click();}});
});
