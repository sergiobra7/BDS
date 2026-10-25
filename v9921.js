/* BIR.DUVARSESI V9.9.21 — live poster word-color chips without full UI rerender */
(function(){
'use strict';
let queued=false;
function currentText(){
 const mode=state.signTextMode;
 return String(mode==='Ohne Text'?'':mode==='Wandtext übernehmen'?state.wall:state.signText||'');
}
function refresh(){
 const section=document.getElementById('v992Colors');if(!section)return;
 const html=globalThis.BDS992_liveColorsHTML?.();
 if(!html)return;
 const temp=document.createElement('div');temp.innerHTML=html;
 const newBox=temp.querySelector('#v992Colors div[style*="background:#151515"]');
 const oldBox=section.querySelector('div[style*="background:#151515"]');
 if(newBox&&oldBox)oldBox.replaceChildren(...newBox.childNodes);
}
function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})}
document.addEventListener('input',e=>{
 if(e.target?.matches?.('[data-key="signText"],[data-key="wall"],[data-key="signTextMode"]'))queue();
});
document.addEventListener('change',e=>{
 if(e.target?.matches?.('[data-key="signText"],[data-key="wall"],[data-key="signTextMode"]'))queue();
});
const previousRender=render;
render=function(){const result=previousRender.apply(this,arguments);queue();return result};
})();