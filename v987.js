/* BİR.DUVARSESİ V9.8.7 – consolidated interaction director overlay. */
'use strict';
const BDS987_KEY='bds-v987-editorial';
let BDS987={main:true,poster:false,notes:{},posterAction:''};
try{const saved=JSON.parse(localStorage.getItem(BDS987_KEY)||'null');if(saved&&typeof saved==='object')BDS987={...BDS987,...saved,notes:saved.notes||{}}}catch(_){}
function BDS987save(){localStorage.setItem(BDS987_KEY,JSON.stringify(BDS987))}
const BDS987_GROUPS=[
 {id:'text',name:'01 TEXTE',tabs:[['text','Wandtext & Plakat']]},
 {id:'scene',name:'02 SZENE',tabs:[['scenes','Szenen'],['facade','Fassaden PRO']]},
 {id:'figures',name:'03 FIGUREN',tabs:[['cast','Figuren'],['poses','Posen'],['refs','Referenzfotos']]},
 {id:'direction',name:'04 BILDREGIE',tabs:[['camera','Kamera'],['studio','Studio PRO'],['series','Serien']]},
 {id:'check',name:'05 PRÜFEN & EXPORT',tabs:[['preview','Live-Vorschau'],['export','Master-Prompt']]},
 {id:'projects',name:'PROJEKTE',tabs:[['projects','Projekte & Favoriten']]}
];
BDS986_GROUPS.splice(0,BDS986_GROUPS.length,...BDS987_GROUPS);
for(const key of Object.keys(BDS986_GROUP_FOR))delete BDS986_GROUP_FOR[key];
for(const group of BDS987_GROUPS)for(const [id] of group.tabs)BDS986_GROUP_FOR[id]=group.id;
tab='text';BDS986_activeGroup='text';
function BDS987textUI(){
 const wall='<section class="panel"><h2>WANDTEXT</h2>'+V941check('Wandtext aktivieren','wallOn',V941.wallOn)+(V941.wallOn?'<label class="label">Wandtext – exakte Zeilen</label><textarea data-key="wall" rows="7">'+escapeHTML(state.wall)+'</textarea>'+V941select('Schriftart','fontChoice',V941fontOptions,V941.fontChoice)+V941select('Schriftstärke','fontWeight',['Maximal fett','Fett','Extra fett'],V941.fontWeight)+V941select('Buchstabenabstand','fontSpacing',['Sehr eng','Eng','Normal'],V941.fontSpacing)+V941select('Zeilenabstand','fontLineSpacing',['Sehr eng','Eng','Normal'],V941.fontLineSpacing)+V941select('Schriftwirkung','textEffect',['Mattrot','Leuchtrot ohne Leuchten oder Strahler'],V941.textEffect)+V941select('Textdominanz','textDominance',['XXL','XXXL','MAXIMUM'],V941.textDominance):'<p class="hint">Wandtext deaktiviert; Text bleibt gespeichert.</p>')+'</section>';
 const poster='<section class="panel"><h2>PLAKAT</h2>'+V941check('Plakattext aktivieren','signOn',V941.signOn)+(V941.signOn?'<label class="label">Plakattext – exakte Zeilen</label><textarea data-key="signText" rows="5">'+escapeHTML(state.signText)+'</textarea><details class="v94details"><summary>Plakatmaterial, Größe, Befestigung und weitere Einstellungen</summary>'+V941sign()+'</details>':'<p class="hint">Plakat deaktiviert; Text und Einstellungen bleiben gespeichert.</p>')+'</section>';
 const finder='<section class="panel"><h2>FASSADENFINDER</h2><p class="hint">Passende Fassaden zum aktuellen Wandtext. Empfehlungen nach Textänderungen erneut prüfen.</p>'+V94recommendations()+'<details class="v94details"><summary>Vollständiger Text-Checker und Fassadenanalyse</summary>'+V941oldTextTab()+'</details></section>';
 return wall+poster+finder;
}
function BDS987figures(){return [{id:'main',label:'Mann mit Zopf',enabled:V941.mainEnabled!==false},...V941.figures.map(f=>({id:String(f.id),label:String(f.type||'Figur')+' · '+String(f.id),enabled:f.enabled!==false}))]}
function BDS987editorUI(){
 const figures=BDS987figures();
 const rows=figures.map(f=>'<div class="bds987-figure"><label class="v941switch"><input type="checkbox" data-bds987-figure="'+escapeHTML(f.id)+'" '+(BDS987[f.id]===true||f.id==='main'&&BDS987.main!==false?'checked':'')+' '+(!f.enabled?'disabled':'')+'><span>'+escapeHTML(f.label)+(f.enabled?'':' (in Figurenbibliothek deaktiviert)')+'</span></label>'+((BDS987[f.id]===true||f.id==='main'&&BDS987.main!==false)&&f.enabled?'<label class="label">Pose, Handlung, Hände, Gegenstände und Interaktion</label><textarea rows="4" data-bds987-note="'+escapeHTML(f.id)+'" placeholder="Wer hält was? Welche Hand? Woran lehnt sich die Figur?">'+escapeHTML(BDS987.notes[f.id]||'')+'</textarea>':'')+'</div>').join('');
 return '<section class="panel" id="bds987Editorial"><h2>EDITORIAL IMPACT PRO</h2><p class="hint">Figuren aus der bestehenden Figurenbibliothek einbeziehen. Individuelle Regie ergänzt die gespeicherte Pose. Zentraler Blickrichtungs-Lock: Mitte der ersten roten Wandtextzeile.</p><details open><summary><b>Figuren aus Figurenbibliothek</b></summary>'+rows+'</details><details '+(BDS987.poster?'open':'')+'><summary><b>Plakat-Handlung</b></summary><label class="v941switch"><input type="checkbox" data-bds987-poster '+(BDS987.poster?'checked':'')+' '+(!V941.signOn?'disabled':'')+'><span>Plakat in Handlung einbeziehen'+(!V941.signOn?' (zuerst unter 01 TEXTE aktivieren)':'')+'</span></label>'+(BDS987.poster&&V941.signOn?'<label class="label">Wer hält das Plakat, woran ist es angelehnt?</label><textarea rows="5" data-bds987-poster-note placeholder="Plakat wird vom Mantelmann mit der rechten Hand gehalten …">'+escapeHTML(BDS987.posterAction||'')+'</textarea>':'')+'</details></section>';
}
const BDS987previousRender=render;
render=function(){
 BDS987previousRender();
 document.title='BİR.DUVARSESİ V9.8.7';
 const h=document.querySelector('header small');if(h)h.textContent='CLEAN STUDIO · V9.8.7';
 const root=document.getElementById('content');if(!root)return;
 if(tab==='text'){
  const sub=root.querySelector('.bds986-subnav');
  root.innerHTML=BDS987textUI();
  if(sub)root.prepend(sub);
 }
 if(tab==='studio')root.insertAdjacentHTML('beforeend',BDS987editorUI());
 const title=root.querySelector('#v979Export h2');if(title)title.textContent='MASTER-PROMPT · V9.8.7';
};
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.matches('[data-bds987-figure]')){BDS987[el.dataset.bds987Figure]=el.checked;BDS987save();render()}
 else if(el.matches('[data-bds987-poster]')){BDS987.poster=el.checked;BDS987save();render()}
});
document.addEventListener('input',e=>{
 const el=e.target;
 if(el.matches('[data-bds987-note]')){BDS987.notes[el.dataset.bds987Note]=el.value;BDS987save()}
 else if(el.matches('[data-bds987-poster-note]')){BDS987.posterAction=el.value;BDS987save()}
});
const BDS987previousPrompt=prompt;
prompt=function(){
 let result=BDS987previousPrompt();
 const active=BDS987figures().filter(f=>f.enabled&&(f.id==='main'?BDS987.main!==false:BDS987[f.id]===true));
 const instructions=active.map(f=>({label:f.label,note:String(BDS987.notes[f.id]||'').trim()})).filter(x=>x.note);
 if(instructions.length||BDS987.poster&&V941.signOn&&BDS987.posterAction.trim()){
  result+='\n\nEDITORIAL IMPACT PRO — CHARACTER ACTION DIRECTOR:\n';
  for(const item of instructions)result+=item.label+': '+item.note+'\n';
  if(BDS987.poster&&V941.signOn&&BDS987.posterAction.trim())result+='POSTER PHYSICAL INTERACTION: '+BDS987.posterAction.trim()+'\n';
  result+='GLOBAL GAZE LOCK: All active figures must direct head, neck and eyes to the center of the FIRST red wall-text line. Preserve physically plausible anatomy, object contact and unobstructed lettering.\n';
 }
 return result;
};
render();
