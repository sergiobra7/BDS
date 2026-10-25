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
 const box=section.querySelector('div[style*="background:#151515"]');if(!box)return;
 const text=currentText(),tokens=text.match(/\S+|\s+/gu)||[];
 const old=[...box.querySelectorAll('button[data-v992-word]')];
 const byKey=new Map(old.map(b=>[b.dataset.v992Word,b]));
 const byWord=new Map();
 for(const b of old){const word=b.textContent;if(!byWord.has(word))byWord.set(word,[]);byWord.get(word).push(b)}
 let i=0;const fragment=document.createDocumentFragment();
 for(const token of tokens){
  if(/^\s+$/u.test(token)){const span=document.createElement('span');span.style.whiteSpace='pre-wrap';span.textContent=token;fragment.append(span);continue}
  const key=i+++':'+token;
  const previous=byKey.get(key)||byWord.get(token)?.shift();
  const button=document.createElement('button');button.type='button';button.dataset.v992Word=key;
  button.textContent=token;
  button.style.cssText='border:1px solid #666;border-radius:5px;margin:2px;padding:5px 7px;background:#242424;color:#f04444;font-weight:800';
  if(previous){
   button.style.color=previous.style.color||'#f04444';
   button.style.borderColor=previous.style.borderColor||'#666';
   button.style.outline=previous.style.outline;
  }
  fragment.append(button);
 }
 box.replaceChildren(fragment);
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