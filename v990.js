/* V9.9.0: one shared live master prompt, manual refresh and copy */
(function(){
'use strict';
const basePrompt=prompt;
prompt=function(){
 const oldMode=V970.cameraMode;
 // Explicit user-selected lens is authoritative in all modes.
 let result;
 try{V970.cameraMode='manual';result=basePrompt();}
 finally{V970.cameraMode=oldMode;}
 return result+'\n\n=== V9.9.0 FINAL CAMERA SELECTION ===\n'+
 'The user-selected camera settings are FINAL and override all earlier suggestions.\n'+
 'FINAL FOCAL LENGTH: '+state.lens+' mm.\n'+
 'FINAL CAMERA DISTANCE: '+state.distance+' m.\n'+
 'FINAL TIME OF DAY: '+state.time+'.\n'+
 'FINAL IMAGE FORMAT: '+state.format+'.\n'+
 'FINAL CAMERA PERSPECTIVE: '+state.camera+'.\n'+
 'Do not use a different lens, distance, time or format from an earlier recommendation.';
};
let current='',signature='',rendering=false;
function makeSignature(){
 return JSON.stringify({settings:state,v941:V941,v970:V970,v988:V988,v987:BDS987});
}
function update(force){
 const next=makeSignature();
 if(force||next!==signature||!current){current=prompt();signature=next;}
 const a=document.getElementById('v989PromptText');
 if(a&&a.value!==current)a.value=current;
 const b=document.getElementById('v990PromptText');
 if(b&&b.value!==current)b.value=current;
 const status=document.getElementById('v990Status');
 if(status)status.textContent='Aktuell · '+state.lens+' mm · '+state.distance+' m · '+state.time;
 return current;
}
const oldRender=render;
render=function(){
 if(rendering)return;
 rendering=true;
 try{
  oldRender();
  const root=document.getElementById('content');
  if(root&&tab==='text'){
   const panel=document.getElementById('v989PromptPanel');
   if(panel){
    panel.querySelector('h2').textContent='MASTER-PROMPT · LIVE';
    const oldCopy=panel.querySelector('#v989Copy');
    if(oldCopy)oldCopy.remove();
    const actions=document.createElement('div');
    actions.innerHTML='<p class="hint" id="v990Status"></p><button type="button" class="btn primary" data-v990-refresh>MASTER-PROMPT AKTUALISIEREN</button><button type="button" class="btn" data-v990-copy>MASTER-PROMPT KOPIEREN</button>';
    panel.append(actions);
   }
  }
  if(root&&tab==='export'){
   const panel=document.createElement('section');panel.className='panel';panel.id='v990Shared';
   panel.innerHTML='<h2>MASTER-PROMPT · LIVE-ABGLEICH</h2><p class="hint">Dieselbe Prompt-Funktion wie unter 01 TEXTE.</p><button type="button" class="btn" data-v990-refresh>MASTER-PROMPT AKTUALISIEREN</button><button type="button" class="btn" data-v990-copy>MASTER-PROMPT KOPIEREN</button>';
   root.append(panel);
  }
  update(false);
 }finally{rendering=false;}
};
document.addEventListener('click',function(e){
 const btn=e.target.closest('[data-v990-refresh],[data-v990-copy]');
 if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(btn.hasAttribute('data-v990-refresh')){update(true);toast('Master-Prompt vollständig aktualisiert');}
 else copyPrompt(update(true));
},true);
document.addEventListener('input',()=>queueMicrotask(()=>update(false)),false);
document.addEventListener('change',()=>queueMicrotask(()=>update(false)),false);
document.addEventListener('click',()=>queueMicrotask(()=>update(false)),false);
const oldCopy=copyPrompt;
copyPrompt=async function(t){return oldCopy(t===undefined?update(true):t);};
const label=document.querySelector('header small');
if(label)label.textContent='PREMIUM STUDIO · V9.9.0';
document.title='BİR.DUVARSESİ V9.9.0';
render();
})();