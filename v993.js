/* BIR.DUVARSESI V9.9.3 — iOS textarea caret and scroll stability */
(function(){
'use strict';
const snapshots=new Map();
function syncVersion(){const v=globalThis.BDS_VERSION||'9.9.4';const h=document.querySelector('header small');if(h&&h.textContent!=='PREMIUM STUDIO · V'+v)h.textContent='PREMIUM STUDIO · V'+v;if(document.title!=='BİR.DUVARSESİ V'+v)document.title='BİR.DUVARSESİ V'+v;}
syncVersion();
// Legacy modules can rewrite the header during rerender; correct it without changing their behavior.
const versionObserver=new MutationObserver(syncVersion);
const badge=document.querySelector('header small');if(badge)versionObserver.observe(badge,{childList:true,characterData:true,subtree:true});
const titleNode=document.querySelector('head title');if(titleNode)versionObserver.observe(titleNode,{childList:true,characterData:true,subtree:true});
let activeKey=null;
const isEditor=el=>el instanceof HTMLTextAreaElement;
function key(el){return el.dataset.key||el.dataset.v941Key||el.id||el.name||('textarea:'+Array.from(document.querySelectorAll('textarea')).indexOf(el))}
function capture(el){
 if(!isEditor(el))return;
 const k=key(el);activeKey=k;
 snapshots.set(k,{start:el.selectionStart,end:el.selectionEnd,direction:el.selectionDirection,top:el.scrollTop,left:el.scrollLeft,value:el.value,focused:document.activeElement===el});
}
function restore(){
 if(!activeKey)return;
 const el=Array.from(document.querySelectorAll('textarea')).find(x=>key(x)===activeKey);
 const s=snapshots.get(activeKey);
 if(!el||!s)return;
 // Never overwrite text: restore only the visual caret/viewport.
 const start=Math.min(s.start,el.value.length),end=Math.min(s.end,el.value.length);
 try{
  if(document.activeElement===el || s.focused){
   if(document.activeElement!==el)el.focus({preventScroll:true});
   el.setSelectionRange(start,end,s.direction||'none');
  }
  el.scrollTop=s.top;el.scrollLeft=s.left;
 }catch(_){}
}
document.addEventListener('focusin',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('beforeinput',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('input',e=>{
 if(!isEditor(e.target))return;
 const el=e.target,k=key(el),prior=snapshots.get(k);
 snapshots.set(k,{start:el.selectionStart,end:el.selectionEnd,direction:el.selectionDirection,top:el.scrollTop,left:prior?prior.left:el.scrollLeft,value:el.value,focused:true});
 activeKey=k;
 // Native Safari caret and viewport remain untouched after text input or paste.
},true);
document.addEventListener('keyup',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('pointerup',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('scroll',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('compositionend',e=>{if(isEditor(e.target))capture(e.target)},true);


// Consistent placard activation and shared lettering style.
(function(){
 const styleKey='bds-shared-letter-style';
 const stored=localStorage.getItem(styleKey);
 if(stored){state.wallLetterStyle=stored;state.signLetterStyle=stored;}
 else if(state.wallLetterStyle==='XXL Blockschrift' && state.signLetterStyle==='XXL Blockschrift'){
  state.wallLetterStyle='Condensed Bold';state.signLetterStyle='Condensed Bold';
 }
 if(V941.signOn && state.signMode==='Kein Plakat')state.signMode='Seitlich gehalten';
 function saveShared(){
  try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
 }
 saveShared();
 document.addEventListener('change',function(e){
  const el=e.target,k=el.dataset?.key;
  if(k==='wallLetterStyle'||k==='signLetterStyle'){
   state.wallLetterStyle=el.value;
   state.signLetterStyle=el.value;
   try{localStorage.setItem(styleKey,el.value);}catch(_){}
   saveShared();
  }
  if(k==='signMode' && V941.signOn && el.value==='Kein Plakat'){
   state.signMode='Seitlich gehalten';
   el.value='Seitlich gehalten';
   saveShared();
  }
  if(el.dataset?.v941Key==='signOn' && el.checked){
   if(state.signMode==='Kein Plakat')state.signMode='Seitlich gehalten';
   saveShared();
  }
 },true);
})();

// Shared editor guard for all writable state-bound textareas.
// Preserve the proven wall fix: persist values without invoking legacy
// delegated handlers that can replace a focused editor during paste.
function persistNativeEditor(e){
 const el=e.target;
 if(!(el instanceof HTMLTextAreaElement)||el.readOnly||el.disabled)return;
 const k=el.dataset.key;
 if(!k)return;
 e.stopImmediatePropagation();
 state[k]=el.value;
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
}
document.addEventListener('input',persistNativeEditor,true);
document.addEventListener('change',persistNativeEditor,true);

// Keep the native iOS textarea mounted while the user edits or pastes.
// Other modules call render() on input; replacing #content destroys the selection.
if(typeof render==='function'){
 const previousRender=render;
 let pending=false;
 render=function(){
  const editor=document.activeElement;
  if(editor instanceof HTMLTextAreaElement && editor.isConnected && document.getElementById('content')?.contains(editor)){
   pending=true;
   syncVersion();
   return;
  }
  pending=false;
  const result=previousRender.apply(this,arguments);
  syncVersion();
  return result;
 };
 document.addEventListener('focusout',e=>{
  if(e.target instanceof HTMLTextAreaElement && pending){
   queueMicrotask(()=>{if(!(document.activeElement instanceof HTMLTextAreaElement))render();});
  }
 },true);
}
})();
