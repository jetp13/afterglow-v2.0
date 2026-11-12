import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync('client/public/risk-calculator.html','utf8');
const palette=fs.readFileSync('client/public/assets/semantic-colors.css','utf8');
const extract=name=>html.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n    \\}`))[0];
const title={style:{}},circle={},desc={};
const classes=new Set();
const context={resultTitle:title,resultCircle:circle,resultDesc:desc,resultContainer:{classList:{remove(...names){names.forEach(n=>classes.delete(n));},add(n){classes.add(n);}}}};
vm.createContext(context);
vm.runInContext(extract('riskLevelColor')+'\n'+extract('updateResultUI'),context);
for(const [level,orbClass] of [['low','risk-low'],['caution','risk-medium'],['unsafe','risk-high'],['deadly','risk-deadly'],['unknown',null]]) {
  context.updateResultUI(level,['test description']);
  assert.equal(title.style.color,context.riskLevelColor(level),`${level}: title and pair badge must use one color`);
  assert.equal(title.style.color,`var(--ag-risk-${level})`);
  assert(title.textContent.length>0,'color never replaces the text label');
  assert(palette.includes(`--ag-risk-${level}:`),'result token exists');
  assert.equal(classes.size,orbClass?1:0,'old risk state is cleared');
  if(orbClass) {
    assert(classes.has(orbClass));
    assert(html.includes(`.${orbClass} .ag-result-text-layer { color: var(--ag-risk-${level})`),'orb text matches title and badge');
    assert(html.includes(`rgba(var(--ag-risk-${level}-rgb),`),'orb light uses the same risk hue');
  }
}
context.updateResultUI('unknown',[]);
assert(desc.innerHTML.includes('資料不足不能推定安全'),'unknown state retains its warning');
assert(fs.readFileSync('client/public/sw.js','utf8').includes("'/assets/semantic-colors.css'"),'palette included in public offline assets');
console.log('PASS: all 5 risk states share title/badge/orb colors, retain labels and unknown warning, reset old state; palette is cached.');
