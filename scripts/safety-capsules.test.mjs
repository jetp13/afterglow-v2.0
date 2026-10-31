import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync('client/public/assets/safety-capsules.js','utf8');
function setup(reduced=false, observe=false) {
 const events={},docEvents={},timers=new Map(),nav=[];
 const classes=()=>({values:new Set(),add(x){this.values.add(x)},remove(x){this.values.delete(x)},has(x){return this.values.has(x)}});
 const pills=['/first-aid.html','/index.html?from=/risk-calculator.html','/index.html?from=/rights.html','/help.html'].map(href=>({href,classList:classes(),addEventListener(type,fn){this[type]=fn}}));
 const group={classList:classes(),querySelectorAll:()=>pills};
 let id=0;
 const window={clearTimeout:n=>timers.delete(n),setTimeout(fn,ms){timers.set(++id,{fn,ms});return id},matchMedia:()=>({matches:reduced}),location:{assign:p=>nav.push(p)},addEventListener:(type,fn)=>events[type]=fn};
 let onView;
 if(observe) window.IntersectionObserver=class { constructor(fn){onView=fn} observe(target){assert.equal(target,group)} };
 const document={hidden:false,querySelector:()=>group,addEventListener:(type,fn)=>docEvents[type]=fn};
 vm.runInNewContext(code,{window,document});
 const click=(n,extra={})=>{let prevented=false;pills[n].click({button:0,preventDefault(){prevented=true},...extra});return prevented};
 return {pills,group,timers,nav,events,docEvents,click,document,view:visible=>onView([{isIntersecting:visible}])};
}
for(let selected=0;selected<4;selected++){
 const s=setup();assert.equal(s.click(selected),true);assert(s.group.classList.has('is-selecting'));
 assert.deepEqual(s.pills.map(p=>p.classList.has('is-active')),s.pills.map((_,n)=>n===selected));
 assert.equal(s.nav.length,0);assert.equal([...s.timers.values()][0].ms,220);
 [...s.timers.values()][0].fn();assert.equal(s.nav[0],s.pills[selected].href);
 s.events.pageshow();assert(!s.group.classList.has('is-selecting'));assert(s.pills.every(p=>!p.classList.has('is-active')));
}
for(const extra of [{detail:0},{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1},{defaultPrevented:true}]){
 const s=setup();assert.equal(s.click(0,extra),false);assert.equal(s.timers.size,0);
}
const rapid=setup();rapid.click(0);rapid.click(3);assert.equal(rapid.timers.size,1);[...rapid.timers.values()][0].fn();assert.equal(rapid.nav[0],'/help.html');
const escape=setup();escape.click(0);escape.docEvents.keydown({key:'Escape'});assert.equal(escape.timers.size,0);assert(!escape.group.classList.has('is-selecting'));
const leaving=setup();leaving.click(0);leaving.events.pagehide();assert.equal(leaving.timers.size,0);
const reduced=setup(true);reduced.click(0);assert.equal([...reduced.timers.values()][0].ms,0);
const rest=setup(false,true);assert(!rest.group.classList.has('is-resting'));
rest.document.hidden=true;rest.docEvents.visibilitychange();assert(rest.group.classList.has('is-resting'));
rest.view(false);rest.document.hidden=false;rest.docEvents.visibilitychange();assert(rest.group.classList.has('is-resting'));
rest.view(true);assert(!rest.group.classList.has('is-resting'));
rest.view(false);assert(rest.group.classList.has('is-resting'));
console.log('PASS: four destinations, activation depth state, modified clicks, rapid selection, Escape, bfcache reset and reduced-motion navigation.');
console.log('PASS: idle drift pauses while hidden/offscreen and resumes only when both visible.');
