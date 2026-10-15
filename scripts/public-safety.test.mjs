import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const read = file => readFileSync(new URL('../'+file,import.meta.url),'utf8');
const baseline = file => execFileSync('git',['show','41c2445:'+file],{encoding:'utf8',maxBuffer:5e6});
let checks=0;
const check = (result,message) => { assert.ok(result,message); checks++; };
const adult = ['home','risk-calculator','rights','support-main','first-aid-details','breathing','voice','white-noise','menu','memoir'];
const publics = ['safety','etomidate-safety','first-aid','help','privacy','terms','legal','about'];
const guard = read('client/public/assets/adult-gate.js');
const gate = read('client/public/assets/entry-gate.js');

function simulateAdult(path,consent,blocked=false) {
  const navigations=[]; const events={};
  const context={document:{documentElement:{style:{},removeAttribute(){}}},sessionStorage:{getItem(){if(blocked)throw Error('blocked');return consent;}},window:{location:{pathname:path,replace:v=>navigations.push(v)},addEventListener:(key,fn)=>events[key]=fn}};
  vm.runInNewContext(guard,context);
  return {context,navigations,events};
}
for(const name of adult) {
  const html=read('client/public/'+name+'.html');
  check(html.includes('<script src="/assets/adult-gate.js"></script>'), name+' protected');
  check(!html.includes("window.location.href = '/index.html'"),name+' no destination loss');
  check(html.includes('<noscript>'),name+' no-script fallback');
  check(html.includes('data-age-pending')&&html.includes('html[data-age-pending] body'),name+' guarded even if external gate script fails to load');
  for(const state of [null,'false','true']) {
    const result=simulateAdult('/'+name+'.html',state);
    check(state==='true'?result.navigations.length===0:result.navigations[0]==='/index.html?from='+encodeURIComponent('/'+name+'.html'),name+' consent state '+state);
  }
  check(simulateAdult('/'+name+'.html',null,true).navigations.length===1,name+' storage failure fails closed');
}
for(const name of publics) {
  const html=read('client/public/'+name+'.html');
  check(!html.includes('adult-gate.js')&&!html.includes("getItem('ag_consent')"),name+' publicly readable');
}

function simulateEntry(from,consent,{readBlocked=false,writeBlocked=false}={}) {
  const events={};const nav=[];const checkbox={checked:false,addEventListener:(_,fn)=>events.change=fn};
  const button={disabled:true,classList:{toggle(){}},addEventListener:(_,fn)=>events.click=fn};
  const error={hidden:true};const destination={};let stored;
  const context={URLSearchParams,document:{getElementById:id=>({'enter-btn':button,'gate-destination':destination,'gate-error':error}[id]),querySelectorAll:()=>[checkbox]},sessionStorage:{getItem(){if(readBlocked)throw Error('blocked');return consent;},setItem(k,v){if(writeBlocked)throw Error('blocked');stored=v;}},navigator:{},window:{location:{search:from===null?'':'?from='+encodeURIComponent(from),replace:v=>nav.push(v),assign:v=>nav.push(v)},addEventListener(){}}};
  vm.runInNewContext(gate,context);
  return {events,nav,checkbox,button,error,getStored:()=>stored};
}
for(const name of adult) {
  const path='/'+name+'.html';const result=simulateEntry(path,null);
  check(result.nav.length===0,'unconfirmed gate stays '+name);
  result.events.click();check(result.nav.length===0,'disabled button cannot navigate');
  result.checkbox.checked=true;result.events.change();result.events.click();
  check(result.nav[0]===path&&result.getStored()==='true','gate roundtrip '+name);
  check(simulateEntry(path,'true').nav[0]===path,'confirmed direct gate '+name);
}
for(const value of ['//evil.example','/\\evil.example','https://evil.example','/index.html','/safety.html','/risk-calculator.html?next=bad','/__proto__','/not-found.html']) {
  const result=simulateEntry(value,null);result.checkbox.checked=true;result.events.change();result.events.click();
  check(result.nav[0]==='/home.html','unsafe or unknown return rejected '+value);
}
check(simulateEntry(null,'true').nav.length===0,'landing remains accessible after adult confirmation');
const blocked=simulateEntry('/risk-calculator.html',null,{readBlocked:true,writeBlocked:true});
blocked.checkbox.checked=true;blocked.events.change();blocked.events.click();
check(!blocked.error.hidden&&blocked.nav.length===0,'blocked storage shows recoverable explanation');

const entry=read('client/index.html');
check(entry===read('client/public/index.html'),'both existing entry implementations aligned');
check((entry.match(/href="\/safety.html"/g)||[]).length===1,'one safety CTA on landing');
const originalFirstAid=baseline('client/public/first-aid.html');
const detail=originalFirstAid.slice(originalFirstAid.indexOf('    <!-- GHB/GBL Accordion -->'),originalFirstAid.indexOf('    <!-- Footer Note -->'));
check(read('client/public/first-aid-details.html').includes(detail),'existing detailed First Aid text relocated intact');
check(!read('client/public/first-aid.html').includes('GHB / GBL'),'public First Aid excludes detailed substance section');
const calculator=read('client/public/risk-calculator.html');
const oldCalculator=baseline('client/public/risk-calculator.html');
check(calculator.slice(calculator.lastIndexOf('<script>'))===oldCalculator.slice(oldCalculator.lastIndexOf('<script>')),'ChemAid interaction data and calculation behavior unchanged');
const rights=read('client/public/rights.html');
check(rights.slice(rights.indexOf('<header class="ag-inner-header">'),rights.lastIndexOf('</body>')).replace(/\s*$/,'')===baseline('client/public/rights.html').slice(baseline('client/public/rights.html').indexOf('<header class="ag-inner-header">'),baseline('client/public/rights.html').lastIndexOf('</body>')).replace(/\s*$/,''),'Rights body remains unchanged');

const sw=read('client/public/sw.js');let cached;const handlers={};
vm.runInNewContext(sw,{URL,Response,self:{location:{origin:'https://example.test'},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:()=>{},clients:{claim:()=>{}}},caches:{open:async()=>({addAll:async list=>{cached=Array.from(list);}})}});
let install;handlers.install({waitUntil:p=>install=p});await install;
for(const name of adult)check(!cached.includes('/'+name+'.html'),'no adult precache '+name);
for(const name of ['safety','first-aid','help','etomidate-safety'])check(cached.includes('/'+name+'.html'),'public offline precache '+name);
let intercepted=false;handlers.fetch({request:{url:'https://example.test/risk-calculator.html',method:'GET'},respondWith(){intercepted=true;}});
check(!intercepted,'adult response never cached by new worker');
for(const file of cached)check(file==='/'||existsSync(new URL('../client/public'+file,import.meta.url)),'precache asset exists '+file);

// Local link existence, not network availability or a browser E2E claim.
const changed=[...publics,...adult,'index'];
for(const name of changed) {
  const html=read('client/public/'+name+'.html');
  for(const [,href] of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
    const pathname=href.split('?')[0];
    check(pathname==='/'||existsSync(new URL('../client/public'+pathname,import.meta.url)),name+' internal file '+href);
  }
}
console.log('PASS: '+checks+' assertions (gate transitions, hostile targets, failure fallback, content invariants, SW boundary, internal files).');
console.log('NOT COVERED: browser visual state, screen reader, mobile timed usability, actual SW lifecycle, external URLs or legal compliance.');
