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
 snapshots.set(k,{start:el.selectionStart,end:el.selectionEnd,direction:el.selectionDirection,top:prior?prior.top:el.scrollTop,left:prior?prior.left:el.scrollLeft,value:el.value,focused:true});
 activeKey=k;
 requestAnimationFrame(()=>{if(document.activeElement===el){const s=snapshots.get(k);if(s){el.scrollTop=s.top;el.scrollLeft=s.left}}});
},true);
document.addEventListener('keyup',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('pointerup',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('scroll',e=>{if(isEditor(e.target))capture(e.target)},true);
document.addEventListener('compositionend',e=>{if(isEditor(e.target))capture(e.target)},true);
// The app rebuilds the tab DOM on several actions. Preserve editor state across that rebuild.
if(typeof render==='function'){
 const oldRender=render;
 render=function(){
  const focused=document.activeElement;
  if(isEditor(focused))capture(focused);
  const result=oldRender.apply(this,arguments);
  requestAnimationFrame(()=>{restore();syncVersion();});
  syncVersion();
  return result;
 };
}
})();