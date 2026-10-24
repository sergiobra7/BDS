/* BIR.DUVARSESI V9.8.8 — compact director and library integration */
'use strict';
const V988KEY='bds-v988';
let V988={facadePage:0,scenePage:0,focus:'main',facadeText:'',sceneText:''};
try{V988={...V988,...JSON.parse(localStorage.getItem(V988KEY)||'{}')}}catch(e){}
function V988save(){localStorage.setItem(V988KEY,JSON.stringify(V988))}
function V988facades(){
 const signature=state.wall+'|'+state.facadeShape+'|'+state.lineFilter;
 if(signature!==V988.facadeText){V988.facadeText=signature;V988.facadePage=0;V988save()}
 const all=V94matches().filter(x=>(state.facadeShape==='Auto'||x.shape===state.facadeShape)&&(state.lineFilter==='Auto'||x.lim[0]>=Number(state.lineFilter)));
 const pool=all.length?all:V94matches();
 const page=Array.from({length:Math.min(3,pool.length)},(_,i)=>pool[(V988.facadePage*3+i)%pool.length]);
 return '<section class="panel"><h2>FASSADENFINDER</h2><p class="hint">'+pool.length+' passende Fassaden · 3 je Durchlauf</p><button class="btn primary" data-v988="facades">3 NEUE FASSADEN ANZEIGEN</button>'+page.map(x=>'<div class="item"><strong>'+escapeHTML(x.name)+'</strong><p class="hint">'+escapeHTML(x.shape)+' • '+x.lim[0]+' Zeilen • bis '+x.lim[2]+' Zeichen/Zeile</p><p class=\"hint\">'+x.score+' Punkte</p><button class="btn" data-set="scene" data-val="'+(x.i+1)+'">Diese Fassade auswählen</button></div>').join('')+'</section>';
}
function V988scenes(){
 if(V988.sceneText!==state.wall){V988.sceneText=state.wall;V988.scenePage=0;V988save()}
 const a=V96analyse(state.wall);
 const pool=V96SCENES.map((s,i)=>({...s,idx:56+i,score:90,reason:'Architektur und Bildkomposition passend zum Wandtext',lens:'35',distance:50,angle:7,pose:a.action}));
 V96.proposals=Array.from({length:Math.min(3,pool.length)},(_,i)=>pool[(V988.scenePage*3+i)%pool.length]);
 return '<section class="panel"><h2>SMART SCENE DIRECTOR PRO</h2><p class="hint">'+escapeHTML(a.topic)+' · '+pool.length+' Szenenideen</p><button class="btn primary" data-v988="scenes">3 NEUE SZENENIDEEN</button>'+V96.proposals.map((s,i)=>'<div class="item"><strong>'+escapeHTML(s.name)+'</strong><p class="hint">'+escapeHTML(s.city)+' · '+escapeHTML(s.pose)+'</p><button class="btn" data-v96="apply" data-i="'+i+'">Szene + Kamera übernehmen</button><button class="small" data-v96="scene" data-i="'+i+'">Nur Szene</button></div>').join('')+'</section>';
}
function V988figurePicker(){
 return '<label class="label">Figur auswählen</label><select data-v988-figure>'+BDS987figures().map(f=>'<option value="'+escapeHTML(f.id)+'" '+(V988.focus===f.id?'selected':'')+'>'+escapeHTML(f.label)+'</option>').join('')+'</select>';
}
const V988previousRender=render;
render=function(){
 V988previousRender();
 const root=document.getElementById('content');if(!root)return;
 if(tab==='text'){const sub=root.querySelector('.bds986-subnav');root.innerHTML=BDS987textUI().split('<section class="panel"><h2>FASSADENFINDER')[0]+V988facades()+V988scenes()+BDS987editorUI();if(sub)root.prepend(sub)}
 if(tab==='cast'){const sub=root.querySelector('.bds986-subnav');root.innerHTML='<section class="panel"><h2>FIGURENBIBLIOTHEK</h2>'+V988figurePicker()+'</section>'+(V988.focus==='main'?V941main():V941figures())+(V988.focus==='main'?'<details class="v94details"><summary>Nebenfiguren hinzufügen und verwalten</summary>'+V941figures()+'</details>':'')+(state.opa==='Ja'?'<details class="v94details"><summary>Opa-Regie</summary>'+castTab()+'</details>':'');if(sub)root.prepend(sub)}
 if(tab==='poses'){const sub=root.querySelector('.bds986-subnav');root.innerHTML='<section class="panel"><h2>POSEN · KOMPAKT</h2>'+V988figurePicker()+V969figureControls(V988.focus)+'</section><details class="v94details"><summary>Weitere Posen und Gruppenoptionen</summary>'+poseTab()+'</details>';if(sub)root.prepend(sub)}
 if(tab==='studio')root.querySelector('#bds987Editorial')?.remove();
 document.title='BİR.DUVARSESİ V9.8.8';
 const h=document.querySelector('header small');if(h)h.textContent='CLEAN STUDIO · V9.8.8';
};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-v988]');if(!b)return;
 if(b.dataset.v988==='facades'){const n=V94matches().filter(x=>(state.facadeShape==='Auto'||x.shape===state.facadeShape)&&(state.lineFilter==='Auto'||x.lim[0]>=Number(state.lineFilter))).length||V94matches().length;V988.facadePage=(V988.facadePage+1)%Math.max(1,Math.ceil(n/3));V988save();render()}
 if(b.dataset.v988==='scenes'){V988.scenePage=(V988.scenePage+1)%Math.max(1,Math.ceil(V96SCENES.length/3));V988save();render()}
});
document.addEventListener('change',e=>{if(e.target.matches('[data-v988-figure]')){V988.focus=e.target.value;V988save();render()}});
const V988oldSnapshot=V970snapshot;
V970snapshot=function(){const s=V988oldSnapshot();s.storage=s.storage||{};s.storage[V988KEY]=JSON.stringify(V988);return s};

const V988oldRestore=V972restore;
V972restore=function(s){V988oldRestore(s);try{const saved=JSON.parse(localStorage.getItem(V988KEY)||'null');if(saved&&typeof saved==='object')V988={...V988,...saved}}catch(_){}render()};
const V988oldValidate=V972validate;
V972validate=function(s){if(s?.version==='9.8.8'){if(!s.settings||!s.v941||!Array.isArray(s.v941.figures))throw Error('Ungültiger Projektstand');return s}return V988oldValidate(s)};
const V988oldPrompt=prompt;
prompt=function(){const p=V988oldPrompt();return p+(V941.wallOn?'\nGLOBAL GAZE: All active figures look toward the FIRST red wall-text line unless an explicit per-figure exception is selected.\n':'')};

/* Preserve scroll and open accordions after the final V9.8.8 content replacement. */
const V988rawRender=render;
render=function(){
 const root=document.getElementById('content'),open=[];
 root?.querySelectorAll('details').forEach((d,i)=>{if(d.open)open.push(i)});
 const y=window.scrollY,x=window.scrollX;
 V988rawRender();
 const next=document.getElementById('content');
 next?.querySelectorAll('details').forEach((d,i)=>{if(open.includes(i))d.open=true});
 window.scrollTo(x,y);
 requestAnimationFrame(()=>window.scrollTo(x,y));
};


/* Functional fixes: actionable editorial suggestions and topic-scored scene options. */
V988.editorPage=Number(V988.editorPage)||0;
function V988active(){return BDS987figures().filter(f=>f.enabled&&(f.id==='main'?BDS987.main!==false:BDS987[f.id]===true))}
const V988ACTIONS=[
 ['Stille Erkenntnis','Rückwärts auf einem Stuhl sitzen, Unterarme getrennt auf der Lehne','Seitlich auf einer Bank sitzen, Hände auf den Knien'],
 ['Öffentliche Spannung','Aufrecht auf dem gegenüberliegenden Gehweg stehen, offene Hand seitlich','Mit Abstand stehen, eine Hand am Mantel'],
 ['Enttäuschtes Vertrauen','Auf einer Bank sitzen, leicht vorgebeugt, Hände locker verschränkt','Auf einer separaten Sitzfläche nachdenklich sitzen'],
 ['Schweigende Begegnung','Langsam gehen und vor der Wand in der Ferne innehalten','An einem sicheren Geländer lehnen'],
 ['Distanz und Würde','Aufrecht stehen, Arme locker seitlich','Auf einem Stuhl rückwärts sitzen, Hände getrennt'],
 ['Nachdenkliche Pause','Mit einer Tasse auf einer öffentlichen Bank sitzen','Neben einer Bank stehen, Hände ruhig'],
 ['Generationen','An einem öffentlichen Geländer stehen, Oberkörper leicht vorgeneigt','Auf einer Bank sitzen, Blick zur Wand'],
 ['Widerspruch','Vor einem Café auf einem Stuhl sitzen, kein Zeigefinger','Einige Meter entfernt stehen, offene Hand seitlich'],
 ['Ungesagte Worte','Auf Treppenstufen sitzen, Ellbogen getrennt auf den Oberschenkeln','An einer niedrigen Mauer lehnen'],
 ['Selbstachtung','Aufrecht stehen, Schultern entspannt','Seitlich auf einem Stuhl sitzen, Hände sichtbar'],
 ['Letzter Blick','Im Gehen anhalten, Kopf zur Wand drehen','Mit Abstand auf dem gegenüberliegenden Gehweg stehen'],
 ['Gemeinsame Stille','Mit Abstand auf einer Bank sitzen, Hände sichtbar','Auf derselben Bank mit Abstand sitzen, Arme locker']
];
function V988editorIdeas(){
 const topic=V96analyse(state.wall).topic,scene=DATA.scenes[state.scene-1]||'öffentlicher Raum';
 return Array.from({length:3},(_,i)=>{
  const p=V988ACTIONS[(V988.editorPage*3+i)%V988ACTIONS.length];
  const notes=V988active().map((f,j)=>({id:f.id,label:f.label,action:j===0?p[1]:p[2]}));
  return {title:p[0],notes,context:'Thema: '+topic+'. Szene: '+scene+'. Sicherer öffentlicher Standort mit Abstand zur Textfassade. Kopf und Augen zur Mitte der ersten roten Textzeile. Keine Wandlampen, Flaggen oder religiösen Gebäude.'};
 });
}
function V988editorUI(){
 return '<section class="panel" id="v988EditorialSuggestions"><h2>EDITORIAL IMPACT PRO · 3 HANDLUNGSVORSCHLÄGE</h2><p class="hint">Figuren und Wandtext berücksichtigt. Erst „Übernehmen“ ändert deine Regie.</p><button class="btn primary" data-v988="editor">3 NEUE HANDLUNGSVORSCHLÄGE</button>'+
 V988editorIdeas().map((v,i)=>'<div class="item"><strong>'+escapeHTML(v.title)+'</strong><p>'+escapeHTML(v.notes.map(n=>n.label+': '+n.action).join('; '))+'</p><p class="hint">'+escapeHTML(v.context)+'</p><button class="btn" data-v988-apply="'+i+'">DIESE HANDLUNG ÜBERNEHMEN</button></div>').join('')+'</section>'+BDS987editorUI();
}
V988scenes=function(){
 if(V988.sceneText!==state.wall){V988.sceneText=state.wall;V988.scenePage=0;V988save()}
 const a=V96analyse(state.wall);
 const pool=V96SCENES.map((s,i)=>({...s,idx:56+i,score:Math.max(1,94-(a.kinds.includes(s.kind)?a.kinds.indexOf(s.kind)*6:21)),reason:s.kind==='hafen'?'Monumentale Fassade und Hafen-Tiefenstaffelung':s.kind==='dach'?'Sichere Dachterrasse gegenüber der Wand':'Öffentlicher Vordergrund mit freiem Blick auf die Textfassade',lens:a.longest>30?'50':s.kind==='hafen'?'28':s.kind==='stadt'?'40':'35',distance:s.kind==='stadt'?65:s.kind==='hafen'?55:s.kind==='dach'?35:45,angle:s.kind==='hafen'?7:10,pose:a.action})).sort((x,y)=>y.score-x.score||x.idx-y.idx);
 V96.proposals=Array.from({length:Math.min(3,pool.length)},(_,i)=>pool[(V988.scenePage*3+i)%pool.length]);
 return '<section class="panel"><h2>SMART SCENE DIRECTOR PRO</h2><p class="hint">'+escapeHTML(a.topic)+' · '+pool.length+' Szenenideen</p><button class="btn primary" data-v988="scenes">3 NEUE SZENENIDEEN</button>'+
 V96.proposals.map((s,i)=>'<div class="item"><strong>'+escapeHTML(s.name)+'</strong><p class="hint">'+escapeHTML(s.city)+' · '+s.score+' Punkte · '+escapeHTML(s.reason)+'</p><p class="hint">Kamera '+s.lens+' mm · '+s.distance+' m · '+s.angle+'° · '+escapeHTML(s.pose)+'</p><button class="btn" data-v96="apply" data-i="'+i+'">Szene + Kamera übernehmen</button><button class="small" data-v96="scene" data-i="'+i+'">Nur Szene</button></div>').join('')+'</section>';
};
const V988renderBeforeFix=render;
render=function(){
 V988renderBeforeFix();
 const root=document.getElementById('content');if(!root)return;
 if(tab==='text'){const sub=root.querySelector('.bds986-subnav');root.innerHTML=BDS987textUI().split('<section class="panel"><h2>FASSADENFINDER')[0]+V988facades()+V988scenes()+V988editorUI();if(sub)root.prepend(sub)}
 if(tab==='cast'&&V988.focus!=='main'){
  const f=V941.figures.find(x=>String(x.id)===V988.focus);
  if(f){const sub=root.querySelector('.bds986-subnav');root.innerHTML='<section class="panel"><h2>FIGURENBIBLIOTHEK</h2>'+V988figurePicker()+'</section>'+V941figHTML(f)+'<details class="v94details"><summary>Weitere Nebenfiguren hinzufügen</summary>'+V941figures()+'</details>';if(sub)root.prepend(sub)}
 }
};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-v988="editor"],[data-v988-apply]');if(!b)return;
 if(b.dataset.v988==='editor'){V988.editorPage=(V988.editorPage+1)%4;V988save();render();return}
 if(b.hasAttribute('data-v988-apply')){
  const idea=V988editorIdeas()[Number(b.dataset.v988Apply)];if(!idea)return;
  for(const n of idea.notes)BDS987.notes[n.id]=n.action+'. '+idea.context;
  BDS987save();render();toast('Handlungsvorschlag übernommen');
 }
});


/* Final UI continuity: stable section identity, not the position of a triangle menu. */
const V988finalRender=render;
render=function(){
 const root=document.getElementById('content');
 const prevTab=tab,opened=new Map();
 root?.querySelectorAll('details').forEach(d=>{if(d.open){const title=d.querySelector(':scope > summary')?.textContent?.trim();if(title)opened.set(title,true)}});
 const x=window.scrollX,y=window.scrollY;
 V988finalRender();
 if(tab===prevTab)document.getElementById('content')?.querySelectorAll('details').forEach(d=>{
  const title=d.querySelector(':scope > summary')?.textContent?.trim();
  if(title&&opened.has(title))d.open=true;
 });
 window.scrollTo(x,y);requestAnimationFrame(()=>window.scrollTo(x,y));
};


/* A recommendation is not active until its select/apply button is clicked. */
V988.activeDirector=['facade','smart','manual'].includes(V988.activeDirector)?V988.activeDirector:null;
function V988activateDirector(which){V988.activeDirector=which;V988save()}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.matches('[data-set="scene"]')){
  if(b.closest('#v988FacadeSection'))V988activateDirector('facade');
  else V988activateDirector('manual');
 }
 if(['apply','scene'].includes(b.dataset.v96))V988activateDirector('smart');
},true);
const V988directorPreviousRender=render;
render=function(){
 V988directorPreviousRender();
 if(tab!=='text')return;
 const root=document.getElementById('content');if(!root)return;
 for(const [heading,id,mode] of [['FASSADENFINDER','v988FacadeSection','facade'],['SMART SCENE DIRECTOR PRO','v988SmartSection','smart']]){
  const h=[...root.querySelectorAll('h2')].find(x=>x.textContent.trim()===heading);
  const section=h?.closest('section');if(!section)continue;
  section.id=id;section.dataset.directorActive=String(V988.activeDirector===mode);
  section.style.opacity=V988.activeDirector&&V988.activeDirector!==mode?'0.65':'1';
  h.textContent=heading+(V988.activeDirector===mode?' · AKTIV':V988.activeDirector?' · INAKTIV':'');
 }
};

/* Manual selection has priority over both automatic directors. */
const V988manualPreviousRender=render;
render=function(){
 V988manualPreviousRender();
 const root=document.getElementById('content');if(!root)return;
 if(tab==='scenes'){
  const heading=root.querySelector('h2');
  if(heading)heading.textContent=heading.textContent.replace(/ · AKTIV| · INAKTIV/g,'')+(V988.activeDirector==='manual'?' · AKTIV':'');
 }
 if(tab==='text'&&V988.activeDirector==='manual'){
  for(const id of ['v988FacadeSection','v988SmartSection']){
   const section=document.getElementById(id);if(!section)continue;
   section.style.opacity='0.65';
   const h=section.querySelector('h2');
   if(h&&!h.textContent.includes('INAKTIV'))h.textContent+=' · INAKTIV';
  }
 }
};


/* Last explicit scene selection wins across manual, facade finder and Smart Director. */
V988.manualLines=Number(V988.manualLines)||4;
V988.manualChars=Number(V988.manualChars)||0;
V988.manualShape=V988.manualShape||'Auto';
V988.manualSearch=V988.manualSearch||'';
function V988manualResults(){
 const lines=Math.max(1,Math.min(20,Number(V988.manualLines)||1));
 const chars=Math.max(0,Math.min(300,Number(V988.manualChars)||0));
 const term=V988.manualSearch.trim().toLocaleLowerCase('de');
 return V94matches().filter(x=>x.lim[0]>=lines&&x.lim[2]>=chars&&(V988.manualShape==='Auto'||x.shape===V988.manualShape)&&(!term||x.name.toLocaleLowerCase('de').includes(term)||String(DATA.cities[x.i]||'').toLocaleLowerCase('de').includes(term)));
}
function V988manualFinder(){
 const items=V988manualResults();
 return '<section class="panel" id="v988ManualFinder"><h2>MANUELLER FASSADENFINDER</h2><p class="hint">Nach Zeilenzahl, längster Textzeile und Fassadenform filtern. Nur Fassaden mit ausreichender hinterlegter Kapazität erscheinen. Die Auswahl aktiviert MANUELL und deaktiviert die beiden Directors.</p>'+
 '<label class="label">Benötigte Textzeilen</label><input type="number" min="1" max="20" data-v988-manual="lines" value="'+V988.manualLines+'">'+
 '<label class="label">Zeichen in der längsten Zeile (optional)</label><input type="number" min="0" max="300" data-v988-manual="chars" value="'+V988.manualChars+'">'+
 '<label class="label">Fassadenformat</label><select data-v988-manual="shape">'+['Auto','WIDE XXL','MEGA XXL','BALANCED XXL','VERTICAL XXL'].map(x=>'<option '+(V988.manualShape===x?'selected':'')+'>'+x+'</option>').join('')+'</select>'+
 '<label class="label">Ort / Fassade suchen (optional)</label><input data-v988-manual="search" value="'+escapeHTML(V988.manualSearch)+'" placeholder="Ort oder Fassadenname">'+
 '<p class="hint">'+items.length+' passende Fassaden / Orte · nach Eignung sortiert</p>'+
 (items.length?items.map(x=>'<div class="item"><strong>'+escapeHTML(x.name)+'</strong><p class="hint">'+escapeHTML(String(DATA.cities[x.i]||''))+' · '+escapeHTML(x.shape)+' • '+x.lim[0]+' Zeilen • bis '+x.lim[2]+' Zeichen/Zeile</p><p class="hint">'+x.score+' Punkte</p><button class="btn" data-set="scene" data-val="'+(x.i+1)+'">Diesen Ort manuell auswählen</button></div>').join(''):'<p class="warn">Keine Fassade erfüllt diese Anforderungen. Filter anpassen.</p>')+'</section>';
}
function V988manualStatus(){
 return '<div class="panel"><strong>AKTIVE SZENENQUELLE: '+(V988.activeDirector==='facade'?'FASSADENFINDER':V988.activeDirector==='smart'?'SMART SCENE DIRECTOR PRO':'MANUELL')+'</strong><p class="hint">Immer die letzte ausdrücklich gewählte Szene zählt. Die anderen Quellen sind inaktiv; ihre Vorschläge bleiben weiterhin sichtbar.</p></div>';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-set="scene"],[data-v96="apply"],[data-v96="scene"]');
 if(!b)return;
 if(b.matches('[data-set="scene"]')){
  V988activateDirector(b.closest('#v988FacadeSection')?'facade':'manual');
 }else if(b.dataset.v96==='apply'||b.dataset.v96==='scene'){
  V988activateDirector('smart');
 }
},true);
document.addEventListener('change',e=>{
 const el=e.target;if(!el.matches('[data-v988-manual]'))return;
 const k=el.dataset.v988Manual;
 if(k==='lines')V988.manualLines=Math.max(1,Math.min(20,Number(el.value)||1));
 if(k==='chars')V988.manualChars=Math.max(0,Math.min(300,Number(el.value)||0));
 if(k==='shape')V988.manualShape=el.value;
 if(k==='search')V988.manualSearch=el.value;
 V988save();render();
});
const V988manualRender=render;
render=function(){
 V988manualRender();
 const root=document.getElementById('content');if(!root)return;
 if(tab==='text'){
  const first=root.querySelector('#v988FacadeSection');
  if(first)first.insertAdjacentHTML('beforebegin',V988manualStatus()+V988manualFinder());
 }
 if(tab==='scenes'){
  const sub=root.querySelector('.bds986-subnav');
  root.insertAdjacentHTML('afterbegin',V988manualStatus());
  if(sub&&sub.parentElement===root)root.prepend(sub);
 }
};

render();
