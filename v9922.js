/* V9.9.22 — capture-phase live sync for poster word-color editor */
(function(){
'use strict';
let pending=false;
function update(){
 pending=false;
 const panel=document.getElementById('v992Colors');
 if(!panel||typeof globalThis.BDS992_liveColorsHTML!=='function')return;
 const editor=document.querySelector('textarea[data-key="signText"]');
 const wall=document.querySelector('textarea[data-key="wall"]');
 // Read the live field directly, not a stale value awaiting a change event.
 if(editor&&state.signText!==editor.value)state.signText=editor.value;
 if(wall&&state.wall!==wall.value)state.wall=wall.value;
 const markup=globalThis.BDS992_liveColorsHTML();
 const holder=document.createElement('div');holder.innerHTML=markup;
 const updated=holder.querySelector('#v992Colors div[style*="background:#151515"]');
 const existing=panel.querySelector('div[style*="background:#151515"]');
 if(!updated||!existing)return;
 // Only replace word chips. Do not recreate the textarea, switches, or controls.
 existing.replaceChildren(...updated.childNodes);
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(update)}
document.addEventListener('input',function(event){
 const el=event.target;
 if(el?.matches?.('textarea[data-key="signText"],textarea[data-key="wall"],[data-key="signTextMode"]')){
  if(el.dataset.key==='signText')state.signText=el.value;
  if(el.dataset.key==='wall')state.wall=el.value;
  schedule();
 }
},true);
document.addEventListener('change',function(event){
 if(event.target?.matches?.('[data-key="signTextMode"],[data-v992-auto-white]'))schedule();
},true);
const originalRender=render;
render=function(){const out=originalRender.apply(this,arguments);schedule();return out};
})();