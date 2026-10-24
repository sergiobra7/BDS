/* BIR.DUVARSESI V9.8.8 — compact director and library integration */
'use strict';
const V988KEY='bds-v988';
let V988={facadePage:0,scenePage:0,focus:'main',facadeText:'',sceneText:''};
try{V988={...V988,...JSON.parse(localStorage.getItem(V988KEY)||'{}')}}catch(e){}
function V988save(){localStorage.setItem(V988KEY,JSON.stringify(V988))}
function V988facades(){
 const signature=state.wall+'|'+state.facadeShape+'|'+state.lineFilter;
 if(signature!==V988.facadeText){V988.facadeText=signature;V988.facadePage=0;V988save()}
 const all=V94matches().filter(x=>state.facadeShape==='Auto'||x.shape===state.facadeShape);
 const pool=all.length?all:V94matches();
 const page=pool.slice((V988.facadePage%Math.max(1,Math.ceil(pool.length/3)))*3,(V988.facadePage%Math.max(1,Math.ceil(pool.length/3)))*3+3);
 return '<section class="panel"><h2>FASSADENFINDER</h2><p class="hint">'+pool.length+' passende Fassaden · 3 je Durchlauf</p><button class="btn primary" data-v988="facades">3 NEUE FASSADEN ANZEIGEN</button>'+page.map(x=>'<div class="item"><strong>'+escapeHTML(x.name)+'</strong><p class="hint">'+x.score+' Punkte</p><button class="btn" data-set="scene" data-val="'+(x.i+1)+'">Diese Fassade auswählen</button></div>').join('')+'</section>';
}
function V988scenes(){
 if(V988.sceneText!==state.wall){V988.sceneText=state.wall;V988.scenePage=0;V988save()}
 const a=V96analyse(state.wall);
 const pool=V96SCENES.map((s,i)=>({...s,idx:56+i,score:90,reason:'Architektur und Bildkomposition passend zum Wandtext',lens:'35',distance:50,angle:7,pose:a.action}));
 V96.proposals=pool.slice(V988.scenePage*3,V988.scenePage*3+3);
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
 if(b.dataset.v988==='facades'){const n=V94matches().filter(x=>state.facadeShape==='Auto'||x.shape===state.facadeShape).length||V94matches().length;V988.facadePage=(V988.facadePage+1)%Math.max(1,Math.ceil(n/3));V988save();render()}
 if(b.dataset.v988==='scenes'){V988.scenePage=(V988.scenePage+1)%Math.max(1,Math.ceil(V96SCENES.length/3));V988save();render()}
});
document.addEventListener('change',e=>{if(e.target.matches('[data-v988-figure]')){V988.focus=e.target.value;V988save();render()}});
const V988oldSnapshot=V970snapshot;
V970snapshot=function(){const s=V988oldSnapshot();s.storage=s.storage||{};s.storage[V988KEY]=JSON.stringify(V988);return s};
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

render();
