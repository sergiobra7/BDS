/* BIR.DUVARSESI V9.9.2 — Editorial Impact Pro + poster live word color + scene summary */
(function(){
'use strict';
const KEY='bds-v992-director';
const initial={mode:'suggest',round:0,selected:-1,autoWhite:false,white:{},red:{},signSnapshot:'',posterInitialized:false};
let S={...initial};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object')S={...S,...saved}}catch(_){}
const save=()=>{localStorage.setItem(KEY,JSON.stringify(S));V988.v992Revision=(V988.v992Revision||0)+1;};
const safe=x=>escapeHTML(String(x==null?'':x));
const active=()=>BDS987figures().filter(x=>x.enabled);
const place=()=>{const n=String(state.scene??'');const index=Number(state.scene)-1;const direct=Array.isArray(DATA.scenes)?DATA.scenes[index]:null;const numbered=typeof V96SCENES!=='undefined'&&Array.isArray(V96SCENES)?V96SCENES.find(x=>String(x.number)===n):null;const name=direct||numbered?.name||'';return n+(name?' · '+name:' · Szenenname nicht im Katalog');};
const figures=()=>active().map(x=>x.label);
const note=f=>{try{return BDS987effectiveFigureNote(f)||''}catch(_){return ''}};
const allNotes=()=>active().map(f=>note(f)).filter(Boolean).join(' ');
const presets=[
 ['THE MONOLITH','Stehend, feste vertikale Silhouette','held','Senkrechtes XXL-Plakat seitlich, eine Hand stabilisiert den Rand','monumental industriell kraft'],
 ['THE REVERSE THRONE','Rückwärts auf Stuhl, Unterarme auf Lehne','floor','Plakat auf stabilem eigenem Fuß neben dem Stuhl','verrat vertrauen schweigen'],
 ['THE VERDICT','Sitzend auf niedriger Treppe, Hände an den oberen Plakatecken','held','Plakat senkrecht vor den Knien gehalten','urteil ungerecht arbeit fabrik'],
 ['THE SILENT PROTEST','Statischer Dreiviertelstand, freie Hand in Manteltasche','held','Schmales hohes Plakat seitlich in einer Hand','heuchelei protest geld'],
 ['EMPTY SEAT','Am äußersten Bankende sitzen, Sitzplatz daneben leer','floor','Plakat auf Ständer neben der Bank','familie einsam verlassen warten'],
 ['BACK TO BACK','Zwei Personen Rücken an Rücken, ohne Berührung','floor','Plakat auf eigenem Ständer seitlich der Figuren','streit enttäuschung falsch'],
 ['THE HEAVY SILENCE','Auf niedrigem Betonblock, Ellbogen auf Oberschenkeln','floor','Gerades Plakat auf eigenem Standfuß neben dem Bein','schmerz traurig vertrauen'],
 ['THE HUMAN BILLBOARD','Aufrechter Stand hinter frontalem Plakat, Kopf frei','floor','Breites Plakat auf stabiler eigenständiger Halterung','öffentlich statement groß'],
 ['SIDEWAYS AUTHORITY','Seitlich auf Stuhl, Arm locker auf Rückenlehne','floor','Plakat auf Ständer parallel zur Kamera','macht direktor chef fabrik'],
 ['THREE GENERATIONS','Drei Figuren statisch gestaffelt, Opa vorne sitzend','floor','Plakat einer eindeutig bestimmten Figur zugeordnet','generation familie dede baba']
];
const stances=['Frontal mit leicht versetztem Stand','Dreiviertel mit ruhiger Gewichtsverlagerung','Körper leicht zur Wand gedreht','Mit größerem Abstand zur Kamera','Mit deutlichem seitlichem Freiraum','Kopf zur ersten Wandzeile'];
function score(p){const text=(state.wall+' '+place()+' '+state.facadeTexture).toLocaleLowerCase('tr');return p[4].split(' ').reduce((n,w)=>n+(text.includes(w)?5:0),0)}
function proposals(){
 const candidates=[];
 for(let j=0;j<stances.length;j++)for(let i=0;i<presets.length;i++){
  const p=presets[i],idx=j*presets.length+i;
  const rank=score(p)*10+((idx*17+11)%13);
  candidates.push({id:idx,p,stance:stances[j],rank});
 }
 candidates.sort((a,b)=>b.rank-a.rank||a.id-b.id);
 // Walk the entire sixty-combination pool in ten-item pages before repeating.
 const page=((S.round%6)+6)%6;
 return candidates.slice(page*10,page*10+10);
}
function chosen(){
 if(S.mode==='manual')return null;
 const list=proposals();
 return S.mode==='auto'?list[0]:(list.find(x=>x.id===S.selected)||null);
}
function signText(){return state.signTextMode==='Ohne Text'?'':state.signTextMode==='Wandtext übernehmen'?state.wall:state.signText}
function tokens(){return signText().match(/\S+|\s+/gu)||[]}
function keyFor(i,t){return i+':'+t}
function colorTokens(){
 let wi=0;return tokens().map(t=>{
  if(/^\s+$/u.test(t))return {t,space:true};
  const k=keyFor(wi++,t);
  const selected=!!S.white[k];
  const forceRed=!!S.red[k];
  const auto=S.autoWhite&&/^(?:BAHANE|ŞAHANE|YALAN|PARA|VİCDAN|KARAKTER|İHANET|DOST|DÜŞMAN|SEVGİ|HESAP|GERÇEK|YALNIZ|UNUTMA|YETER|ASLA|KALICI|GEÇİCİ)[\p{P}]*$/iu.test(t);
  return {t,k,white:selected||(!forceRed&&auto),space:false};
 });
}
function colorsUI(){
 const chunks=colorTokens().map(v=>v.space?safe(v.t).replace(/\n/g,'<br>'):('<button type="button" data-v992-word="'+safe(v.k)+'" style="border:1px solid '+(S.white[v.k]?'#ffffff':'#666')+';border-radius:5px;margin:2px;padding:5px 7px;background:#242424;color:'+(v.white?'#fff':'#f04444')+';font-weight:800">'+safe(v.t)+'</button>')).join('');
 return '<section class="panel" id="v992Colors"><h2>PLAKAT · LIVE WORTFARBEN</h2><p class="hint">Standard Rot. Wörter einzeln antippen, mehrere auswählen und anschließend Weiß oder Rot setzen. Manuelle Wahl hat Vorrang.</p><div style="background:#151515;padding:12px;border-radius:10px;line-height:2.5;white-space:normal">'+chunks+'</div><label class="v941switch"><input type="checkbox" data-v992-auto-white '+(S.autoWhite?'checked':'')+'><span>Schlüsselwörter automatisch weiß markieren</span></label><button type="button" class="btn" data-v992-white>MARKIERTE WÖRTER WEISS</button> <button type="button" class="btn" data-v992-red>MARKIERTE WÖRTER ROT</button><p class="hint">Die manuell weißen Wörter haben einen hellen Rahmen. Zum erneuten Auswählen einfach antippen.</p></section>';
}
let pending=new Set();
function snapshot(){
 const f=figures();
 return [['Ort / Szene',place()],['Fassade',state.facadeTexture||state.facadeContext||'Auto'],['Kamera',state.camera+' · '+state.lens+' mm'],['Abstand',state.distance+' m'],['Figuren',f.join(', ')||'Keine'],['Posen',active().map(x=>note(x)).filter(Boolean).join(' · ').slice(0,155)||state.pose||'Auto'],['Gesten',String(state.opaGesture||'Automatisch')],['Plakat',V941.signOn?'Aktiv · Rot/Weiß':'Aus']];
}
function summary(){
 return '<section class="panel" id="v992Summary"><h2>AKTUELLE SZENE · LIVE</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+snapshot().map(([k,v])=>'<div style="min-width:0"><small style="opacity:.7">'+safe(k)+'</small><div style="font-size:12px;overflow-wrap:anywhere">'+safe(v)+'</div></div>').join('')+'</div></section>';
}
function editorialUI(){
 const list=proposals(),selected=chosen();
 return '<section class="panel" id="v992Editorial"><h2>EDITORIAL IMPACT PRO · 10 EMPFEHLUNGEN</h2><p class="hint">Statische Posen und zur Szene passende Plakathaltungen. Auswahl manuell oder automatisch.</p><label class="label">Betriebsart</label><select data-v992-mode><option value="auto" '+(S.mode==='auto'?'selected':'')+'>AUTO · beste Kombination übernehmen</option><option value="suggest" '+(S.mode==='suggest'?'selected':'')+'>VORSCHLÄGE · selbst wählen</option><option value="manual" '+(S.mode==='manual'?'selected':'')+'>MANUELL · bestehende Pose beibehalten</option></select><button type="button" class="btn primary" data-v992-next>10 NEUE VORSCHLÄGE</button><p class="hint">Runde '+(S.round+1)+' · 60 variierte Kombinationen im Pool, danach erneute Durchmischung.</p>'+list.map((x,i)=>'<div class="item" style="margin:8px 0;padding:9px;border:1px solid '+(selected?.id===x.id?'#d44':'#444')+';border-radius:8px"><b>'+(i+1)+'. '+safe(x.p[0])+'</b><p class="hint">'+safe(x.p[1])+' · '+safe(x.stance)+'</p><p class="hint">Plakat: '+safe(x.p[3])+'</p><p class="hint">Bezug: '+safe(x.p[4])+'</p><button type="button" class="btn" data-v992-pick="'+x.id+'">DIESE KOMBINATION ÜBERNEHMEN</button></div>').join('')+'</section>';
}
if(V941.signOn&&!S.posterInitialized){BDS987.poster=true;S.posterInitialized=true;BDS987save();save()}
V988.v992Revision=(V988.v992Revision||0)+1;
const previousPrompt=prompt;
prompt=function(){
 const c=chosen();
 const header=['=== ACTIVE SCENE / CAMERA — V9.9.2 ===',
 'LOCATION / SCENE: '+place(),
 'FACADE: '+(state.facadeTexture||state.facadeContext||'Auto'),
 'CAMERA PERSPECTIVE: '+state.camera,
 'FOCAL LENGTH: '+state.lens+' mm',
 'CAMERA DISTANCE: '+state.distance+' m',
 'FORMAT: '+state.format,
 'TIME: '+state.time,
 'CHARACTERS: '+(figures().join(', ')||'None'),
 'POSES / ACTIONS: '+(allNotes()||state.pose||'Auto'),
 'GESTURES: '+(state.opaGesture||'Auto'),
 'POSTER: '+(V941.signOn?'ON':'OFF'),'=== END ACTIVE CONFIGURATION ===',''];
 let out=header.join('\n')+previousPrompt();
 if(V941.signOn){
  const annotated=colorTokens().filter(x=>!x.space).map(x=>x.t+' ['+(x.white?'WHITE':'RED')+']').join(' ');
  out+='\n\n=== V9.9.2 POSTER WORD COLOR LOCK ===\nDefault poster text color is MATTE RED. Exact word-by-word color assignments in reading order: '+annotated+'. Render every word exactly once with its assigned color. Keep the original poster line breaks from the exact poster text above. Manual assignments override automatic keyword highlighting. Do not alternate whole lines unless specified by word colors.';
  if(BDS987.poster)out+='\nPOSTER INCLUDED IN CHARACTER ACTION: YES. Owner: '+(BDS987figures().find(f=>f.id===BDS987.posterOwner)?.label||'selected character')+'.';
 }
 if(c){
  out+='\n\n=== V9.9.2 EDITORIAL IMPACT PRO — ACTIVE DIRECTOR ===\n';
  out+='SELECTED EDITORIAL PRESET: '+c.p[0]+'. STATIC POSE: '+c.p[1]+'. COMPOSITION: '+c.stance+'. POSTER: '+c.p[3]+'.';
  out+='\nSelected pose must fit architecture and wall message; no running, pointing fingers or unnatural limbs. Head and eyes toward FIRST red wall line.';
  out+='\nPOSTER MODE LOCK: '+(BDS987.posterPosition==='auto'?'Automatically choose the proposed physical poster mode.':'Respect explicitly selected poster placement: '+BDS987.posterPosition)+'. Never change held sign into leaning floor sign or vice versa to resolve collisions. Reposition within the same mounting/holding mode.';
 }else{
  out+='\n\nV9.9.2 MANUAL EDITORIAL MODE: Preserve all manually selected character poses, sign holding mode and sign owner without substitution.';
 }
 return out;
};
const previousRender=render;
render=function(){
 previousRender();
 const root=document.getElementById('content');if(!root)return;
 if(tab==='text'){
  const promptPanel=document.getElementById('v989PromptPanel');
  if(promptPanel)promptPanel.insertAdjacentHTML('beforebegin',summary());
  else root.insertAdjacentHTML('beforeend',summary());
  const posterArea=root.querySelector('textarea[data-key="signText"]');
  if(posterArea&&V941.signOn){const section=posterArea.closest('section.panel');if(section)section.insertAdjacentHTML('afterend',colorsUI())}
 }
 if(tab==='studio')root.insertAdjacentHTML('beforeend',editorialUI());
 const h=document.querySelector('header small');if(h)h.textContent='PREMIUM STUDIO · V9.9.2';
 document.title='BİR.DUVARSESİ V9.9.2';
};
document.addEventListener('click',function(e){
 const b=e.target.closest('[data-v992-next],[data-v992-pick],[data-v992-word],[data-v992-white],[data-v992-red]');
 if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(b.hasAttribute('data-v992-next')){S.round++;S.selected=-1}
 else if(b.hasAttribute('data-v992-pick')){S.selected=Number(b.dataset.v992Pick);S.mode='suggest';if(V941.signOn){BDS987.poster=true;BDS987save()}}
 else if(b.hasAttribute('data-v992-word')){const k=b.dataset.v992Word;if(pending.has(k))pending.delete(k);else pending.add(k);b.style.outline=pending.has(k)?'2px solid #fff':'none';return}
 else if(b.hasAttribute('data-v992-white')||b.hasAttribute('data-v992-red')){
  for(const k of pending){if(b.hasAttribute('data-v992-white')){S.white[k]=true;delete S.red[k]}else{S.red[k]=true;delete S.white[k]}}
  pending.clear();
 }
 save();render();
},true);
document.addEventListener('change',function(e){
 if(e.target.matches('[data-v992-mode]')){S.mode=e.target.value;S.selected=-1;save();render()}
 if(e.target.matches('[data-v992-auto-white]')){S.autoWhite=e.target.checked;save();render()}
 if(e.target.matches('[data-v941-key="signOn"]')&&e.target.checked){BDS987.poster=true;BDS987save()}
},true);
/* Native live word-color refresh: update only chips, preserve editor focus. */
let wordColorFrame=0;
function refreshWordColorChips(){
 wordColorFrame=0;
 const panel=document.getElementById('v992Colors');
 if(!panel)return;
 const old=panel.querySelector('div[style*="background"]');
 if(!old)return;
 const fresh=document.createElement('div');
 fresh.innerHTML=colorsUI();
 const next=fresh.querySelector('#v992Colors div[style*="background"]');
 if(!next)return;
 old.replaceChildren(...Array.from(next.childNodes));
}
function requestWordColorRefresh(){
 if(wordColorFrame)return;
 wordColorFrame=requestAnimationFrame(refreshWordColorChips);
}
document.addEventListener('input',function(event){
 const el=event.target;
 if(!el||!el.matches)return;
 if(el.matches('textarea[data-key="signText"],textarea[data-key="wall"],input[data-key="signText"],[data-v941-key="signText"]')){
  if(el.dataset.key==='signText'||el.dataset.v941Key==='signText')state.signText=el.value;
  if(el.dataset.key==='wall')state.wall=el.value;
  requestWordColorRefresh();
 }
},true);
document.addEventListener('change',function(event){
 if(event.target?.matches?.('[data-key="signTextMode"],[data-v992-auto-white]'))requestWordColorRefresh();
},true);
globalThis.BDS992_refreshWordColors=requestWordColorRefresh;
globalThis.BDS992_liveColorsHTML=colorsUI;
render();
})();