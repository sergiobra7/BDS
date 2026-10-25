/* BIR.DUVARSESI V9.9.6 — non-destructive live poster text preview.
   Updates only the preview nodes while an iOS textarea is focused. */
(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function effective(){return state.signTextMode==='Ohne Text'?'':state.signTextMode==='Wandtext übernehmen'?String(state.wall||''):String(state.signText||'')}
function colorMap(){
 let c={white:{},red:{},autoWhite:false};
 try{const v=JSON.parse(localStorage.getItem('bds-v992-director')||'{}');c={...c,...v}}catch(_){}
 return c;
}
function coloredHtml(){
 const c=colorMap();let n=0;
 return (effective().match(/\S+|\s+/gu)||[]).map(t=>{
  if(/^\s+$/u.test(t))return esc(t);
  const k=n+++':'+t;
  const auto=c.autoWhite&&/^(?:BAHANE|ŞAHANE|YALAN|PARA|VİCDAN|KARAKTER|İHANET|DOST|DÜŞMAN|SEVGİ|HESAP|GERÇEK|YALNIZ|UNUTMA|YETER|ASLA|KALICI|GEÇİCİ)[\p{P}]*$/iu.test(t);
  const white=!!c.white[k]||(!c.red[k]&&auto);
  return '<span style="color:'+(white?'#fff':'#f04444')+'">'+esc(t)+'</span>';
 }).join('');
}
function sync(){
 if(typeof tab==='undefined'||tab!=='text')return;
 const preview=document.getElementById('v996PosterPreviewText');
 if(preview)preview.innerHTML=coloredHtml();
 const panel=document.getElementById('v992Colors');
 if(panel){
  const current=effective().match(/\S+|\s+/gu)||[],words=current.filter(x=>!/^\s+$/u.test(x));
  const buttons=panel.querySelectorAll('button[data-v992-word]');
  // Preserve existing word buttons and manual color selection. Update their contents only
  // when the word count and tokens still match; otherwise defer editor rebuilding to blur.
  if(buttons.length===words.length){
   let same=true;buttons.forEach((b,i)=>{if(b.textContent!==words[i])same=false});
   if(same){const colors=colorMap();buttons.forEach((b,i)=>{const k=i+':'+words[i];const auto=colors.autoWhite&&/^(?:BAHANE|ŞAHANE|YALAN|PARA|VİCDAN|KARAKTER|İHANET|DOST|DÜŞMAN|SEVGİ|HESAP|GERÇEK|YALNIZ|UNUTMA|YETER|ASLA|KALICI|GEÇİCİ)[\p{P}]*$/iu.test(words[i]);b.style.color=(colors.white[k]||(!colors.red[k]&&auto))?'#fff':'#f04444'})}
  }
 }
 const quick=document.getElementById('v989PromptText');
 if(quick&&document.activeElement!==quick){try{quick.value=prompt()}catch(_){}}
}
function mount(){
 if(typeof tab==='undefined'||tab!=='text')return;
 const root=document.getElementById('content');if(!root)return;
 const textarea=root.querySelector('textarea[data-key="signText"]');
 if(!textarea)return;
 let panel=document.getElementById('v996PosterLive');
 if(!panel){
  panel=document.createElement('section');panel.className='panel';panel.id='v996PosterLive';
  panel.innerHTML='<h2>PLAKAT · ECHTZEIT-VORSCHAU</h2><p class="hint">Aktualisiert jeden Buchstaben, jede Zeile und Rot/Weiß sofort – ohne das Textfeld oder die iPhone-Tastatur neu zu laden.</p><div id="v996PosterPreviewText" aria-live="off" style="background:#151515;border:1px solid #444;border-radius:10px;padding:18px;min-height:75px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:clamp(17px,5vw,28px);font-weight:900;line-height:1.22;text-align:center"></div>';
  const section=textarea.closest('section.panel');(section||textarea).insertAdjacentElement('afterend',panel);
 }
 sync();
}
const priorRender=render;
render=function(){
 const result=priorRender.apply(this,arguments);
 mount();
 return result;
};
document.addEventListener('input',function(e){
 const el=e.target;
 if(!(el instanceof HTMLTextAreaElement))return;
 if(el.dataset.key==='signText'||(el.dataset.key==='wall'&&state.signTextMode==='Wandtext übernehmen')){
  state[el.dataset.key]=el.value;
  sync();
 }
},true);
document.addEventListener('change',function(e){
 if(e.target.matches('[data-key="signTextMode"],[data-v992-auto-white]'))queueMicrotask(sync);
},true);
document.addEventListener('click',function(e){
 if(e.target.closest('[data-v992-white],[data-v992-red],[data-v992-word]'))queueMicrotask(sync);
},false);
mount();
})();