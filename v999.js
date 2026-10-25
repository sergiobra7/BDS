/* BIR.DUVARSESI V9.9.9: synchronized camera recommendations and exclusive red selection */
(function(){
'use strict';
const KEY999='bds-v999-camera';
let C={manualLens:false,manualDistance:false,source:'',scene:null,selection:null};
try{C={...C,...JSON.parse(localStorage.getItem(KEY999)||'{}')}}catch(_){}
const save=()=>localStorage.setItem(KEY999,JSON.stringify(C));
const number=(x,f)=>Number.isFinite(Number(x))&&Number(x)>0?Number(x):f;
function recommendation(index){
 const name=String(DATA.scenes[index]||'').toLowerCase();
 const city=String(DATA.cities[index]||'').toLowerCase();
 const limits=DATA.limits[index]||[4,8,40];
 const tall=/hochhaus|wolkenkratzer|turm|tower|skyscraper|stadion|arena|gigant|mega|monument|silo|terminal|speicher|fabrik|industrie|werft|hafen|logistik|block/.test(name);
 const roof=/dach|roof|terrasse|skyline|vogel|drohne|luftaufnahme/.test(name);
 const narrow=/gasse|tunnel|metro|unterführung|passage|schlucht/.test(name);
 const wide=DATA.wide?.includes(index+1)||/breit|front|fassade|mauer|stadion|halle/.test(name);
 let lens=35,distance=40;
 if(roof){lens=50;distance=70}
 else if(tall&&wide){lens=35;distance=85}
 else if(tall){lens=35;distance=65}
 else if(narrow){lens=24;distance=18}
 else if(wide){lens=35;distance=55}
 else if(/dorf|café|straße|platz|promenade|markt/.test(name)){lens=50;distance=30}
 if(limits[2]>65&&distance<55)distance=55;
 return {lens,distance,category:distance<25?'NAH':distance<50?'MITTEL':distance<80?'WEIT':'SEHR WEIT'};
}
function applyScene(index,source,forced){
 const rec=forced||recommendation(index);
 if(!C.manualLens)state.lens=String(number(rec.lens,35));
 if(!C.manualDistance)state.distance=String(number(rec.distance,50));
 C.source=source;C.scene=index+1;C.selection=source+':'+(index+1);
 save();localStorage.setItem(KEY,JSON.stringify(state));
}
function decorate(){
 const root=document.getElementById('content');if(!root)return;
 const quick=root.querySelector('#v989Quick');
 if(quick){
  const old=quick.querySelector('.seg');
  if(old&&old.previousElementSibling?.textContent?.includes('Brennweite'))old.remove();
  const labels=[...quick.querySelectorAll('label')];
  const lensLabel=labels.find(x=>x.textContent.includes('Brennweite'));
  if(lensLabel){
   let input=quick.querySelector('#v999Lens');
   if(!input){input=document.createElement('input');input.id='v999Lens';input.type='number';input.min='10';input.max='400';input.step='1';lensLabel.insertAdjacentElement('afterend',input)}
   input.value=state.lens;
  }
  const distance=quick.querySelector('[data-key="distance"]');if(distance)distance.value=state.distance;
  if(!quick.querySelector('#v999Refresh')){
   const b=document.createElement('button');b.id='v999Refresh';b.type='button';b.className='btn primary';b.textContent='AKTUALISIEREN';quick.appendChild(b);
  }
 }
 const groups=[['#v988FacadeSection','facade'],['#v988SmartSection','smart'],['#v988ManualFinder','manual']];
 for(const [selector,source] of groups){
  const section=root.querySelector(selector);if(!section)continue;
  section.querySelectorAll('[data-set="scene"],[data-v96="apply"],[data-v96="scene"]').forEach(b=>{
   const card=b.closest('.item');if(!card)return;
   const index=b.dataset.set==='scene'?Number(b.dataset.val)-1:(V96.proposals?.[Number(b.dataset.i)]?.idx-1);
   if(!Number.isInteger(index)||index<0)return;
   const rec=b.dataset.v96==='apply'&&V96.proposals?.[Number(b.dataset.i)]?V96.proposals[Number(b.dataset.i)]:recommendation(index);
   let line=card.querySelector('.v999-camera');
   if(!line){line=document.createElement('p');line.className='hint v999-camera';card.insertBefore(line,b)}
   const lens=number(rec.lens,35),distance=number(rec.distance,50);
   line.textContent='KAMERA · '+lens+' mm · '+distance+' m · '+(distance<25?'NAH':distance<50?'MITTEL':distance<80?'WEIT':'SEHR WEIT');
   const selected=C.selection===source+':'+(index+1);
   card.style.background=selected?'#671b22':'';
   card.style.border=selected?'2px solid #ef4444':'';
   card.style.borderRadius=selected?'10px':'';
   b.setAttribute('aria-pressed',selected?'true':'false');
  });
 }
}
const prior=render;
render=function(){const x=prior.apply(this,arguments);decorate();return x};
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='v999Refresh'){e.stopImmediatePropagation();const l=document.getElementById('v999Lens');const d=document.querySelector('#v989Quick [data-key="distance"]');if(l){state.lens=String(number(l.value,35));C.manualLens=true}if(d){state.distance=String(number(d.value,50));C.manualDistance=true}save();localStorage.setItem(KEY,JSON.stringify(state));decorate();return}
 const source=b.closest('#v988ManualFinder')?'manual':b.closest('#v988FacadeSection')?'facade':b.closest('#v988SmartSection')?'smart':null;
 if(!source)return;
 if(b.dataset.set!=='scene'&&b.dataset.v96!=='apply'&&b.dataset.v96!=='scene')return;
 const index=b.dataset.set==='scene'?Number(b.dataset.val)-1:Number(V96.proposals?.[Number(b.dataset.i)]?.idx)-1;
 if(!Number.isInteger(index)||index<0)return;
 if(C.selection===source+':'+(index+1)){
  e.stopImmediatePropagation();C.selection=null;C.source='';save();if(typeof V988!=='undefined'){V988.activeDirector='manual';V988save()}queueMicrotask(decorate);return;
 }
 const p=source==='smart'?V96.proposals?.[Number(b.dataset.i)]:null;
 applyScene(index,source,p?{lens:p.lens,distance:p.distance}:null);
 queueMicrotask(()=>{localStorage.setItem(KEY,JSON.stringify(state));decorate()});
},true);
document.addEventListener('input',e=>{
 const el=e.target;
 if(el.id==='v999Lens'){const n=Number(el.value);if(n>0){state.lens=String(n);C.manualLens=true;save();localStorage.setItem(KEY,JSON.stringify(state))}}
 if(el.matches('#v989Quick [data-key="distance"]')){const n=Number(el.value);if(n>0){state.distance=String(n);C.manualDistance=true;save();localStorage.setItem(KEY,JSON.stringify(state))}}
},true);
decorate();
})();