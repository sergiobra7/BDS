/* BIR.DUVARSESI V9.9.20 — non-destructive real-time placard preview */
(function(){
'use strict';
let scheduled=false;
function refreshSignPreview(){
 const mode=state.signTextMode;
 const value=mode==='Ohne Text'?'':mode==='Wandtext übernehmen'?state.wall:state.signText;
 document.querySelectorAll('.signPreview').forEach(preview=>{
  const title=preview.querySelector('small');
  if(title)title.textContent='Plakat-Vorschau · '+mode;
  const text=preview.querySelector('.darkSign, .lightSign');
  if(!text)return;
  text.textContent=value||'';
  text.style.whiteSpace='pre-line';
  const dark=state.signColor==='Matt schwarz';
  text.classList.toggle('darkSign',dark);
  text.classList.toggle('lightSign',!dark);
  text.style.color=state.signTextColor==='Rot wie Wandtext'?'#ec2828':state.signTextColor==='Weiß'?'#fff':'#111';
 });
 if(tab==='preview'&&document.getElementById('hybridCanvas')&&typeof drawPreview==='function')drawPreview();
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;refreshSignPreview()})}
document.addEventListener('input',event=>{
 const el=event.target;
 if(!el?.matches?.('[data-key="signText"],[data-key="wall"],[data-key="signTextMode"],[data-key="signTextColor"],[data-key="signColor"]'))return;
 // The core input handler saves state without rerendering, preserving the caret and keyboard.
 schedule();
});
document.addEventListener('change',event=>{
 if(event.target?.matches?.('[data-key="signTextMode"],[data-key="signTextColor"],[data-key="signColor"]'))schedule();
});
const originalRender=render;
render=function(){const result=originalRender.apply(this,arguments);schedule();return result};
})();