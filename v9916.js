/* BIR.DUVARSESI V9.9.16 — live figure-name and poster-action preview for all 130 Editorial presets */
(function(){
'use strict';
function people(){try{return BDS987figures().filter(f=>f.enabled&&(f.id==='main'?BDS987.main!==false:BDS987[f.id]===true))}catch(_){return []}}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function signOn(){return String(state.signMode||'Kein Plakat')!=='Kein Plakat'&&V941.signOn!==false}
function poseFor(r,i){return i===0?r.action:i===1?r.secondary:'Ruhig mit eigenem sicheren Abstand stehen oder sitzen, ohne Textüberdeckung'}
function posterInfo(r,figs){
 if(!signOn())return {label:'PLAKAT: DEAKTIVIERT',action:'Der Plakatmodus ist ausgeschaltet. Es wird kein Plakat erfunden.'};
 const owner=BDS987.posterOwner||'main';
 const fig=figs.find(f=>f.id===owner);
 const label=owner==='none'?'Freistehend / keiner Figur zugeordnet':owner==='custom'?(BDS987.posterWho||'Manuell zugeordnete Person'):(fig?.label||'Zuordnung prüfen: Plakatbesitzer nicht aktiv');
 const pos=BDS987.posterPosition||'auto',hand=BDS987.posterHand||'auto';
 const position={held:'in der Hand gehalten',floor:'freistehend bis zum Boden',bank:'sicher an der Bank angelehnt',chair:'sicher am Stuhl befestigt/angelehnt',free:'frei und stabil positioniert',auto:'automatisch passend zur ausgewählten Pose'}[pos]||pos;
 const grip={left:'linke Hand',right:'rechte Hand',both:'beide Hände',none:'kein Handkontakt',auto:'Handwahl automatisch passend zur Pose'}[hand]||hand;
 const ownerPose=fig?poseFor(r,figs.indexOf(fig)):'';
 const conflict=pos==='held'&&/hände (in|hinter)|beide hände|unterarme|verschränkt|gehstock|teeglas|tavla/i.test(ownerPose);
 return {label:'PLAKAT → '+label,action:(BDS987.posterManual?String(BDS987.posterAction||'Manuelle Plakathandlung bleibt gesperrt und unverändert'):'Position: '+position+' · Hand: '+grip)+'. '+(conflict?'⚠ Handkonflikt: Pose oder Plakathaltung manuell abstimmen; keine unnatürliche Handhaltung erzeugen.':'Gesicht und rote Wandzeilen frei halten.')};
}
function decorate(){
 const section=document.getElementById('v9915Editorial');if(!section)return;
 const figs=people(),data=globalThis.BDS_EDITORIAL_130||[];
 section.querySelectorAll('button[data-v9915="apply"][data-id]').forEach(button=>{
  const r=data.find(x=>x.id===Number(button.dataset.id));if(!r)return;
  const card=button.closest('.item');if(!card)return;
  card.querySelector('.v9916-preview')?.remove();
  const info=posterInfo(r,figs);
  const rows=figs.length?figs.map((f,i)=>'<p style="margin:8px 0"><strong>FIGUR '+(i+1)+' · '+esc(f.label)+'</strong><br>'+esc(poseFor(r,i))+'</p>').join(''):'<p class="hint">Keine Figur aktiviert – bitte zuerst eine Figur auswählen.</p>';
  const box=document.createElement('div');box.className='v9916-preview';box.style.cssText='margin:12px 0;padding:12px;border:1px solid #444650;border-radius:10px;background:#14151a';
  box.innerHTML='<strong>AKTIVE FIGUREN · KONKRETE HANDLUNGEN</strong>'+rows+'<p style="margin:10px 0 4px"><strong>🪧 '+esc(info.label)+'</strong></p><p class="hint">'+esc(info.action)+'</p>';
  button.before(box);
  const old=card.querySelector(':scope > p:not(.hint)');if(old)old.style.display='none';
  const hint=card.querySelector(':scope > p.hint');if(hint&&hint.textContent===r.secondary)hint.style.display='none';
  if(!figs.length)button.disabled=true;
 });
}
const previousRender=render;
render=function(){previousRender.apply(this,arguments);decorate()};
document.addEventListener('change',e=>{if(e.target.matches('[data-bds987-figure],[data-bds987-poster-select],[data-bds987-poster],[data-bds987-poster-manual]'))queueMicrotask(decorate)});
globalThis.BDS_EDITORIAL_FIGURE_PREVIEW=decorate;
})();