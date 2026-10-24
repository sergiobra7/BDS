/* BIR.DUVARSESI V9.8.6 — CLEAN STUDIO navigation, no AI creator. Non-destructive overlay. */
'use strict';
const BDS986_GROUPS=[
 {id:'scene',name:'01 SZENE',tabs:[['scenes','Szenen'],['facade','Fassaden PRO']]},
 {id:'text',name:'02 TEXTE',tabs:[['text','Wand & Plakat']]},
 {id:'figures',name:'03 FIGUREN',tabs:[['poses','Posen'],['cast','Figuren'],['refs','Referenzfotos']]},
 {id:'direction',name:'04 BILDREGIE',tabs:[['camera','Kamera'],['studio','Studio PRO'],['series','Serien']]},
 {id:'check',name:'05 PRÜFEN & EXPORT',tabs:[['preview','Live-Vorschau'],['export','Master-Prompt']]},
 {id:'projects',name:'PROJEKTE',tabs:[['projects','Projekte & Favoriten']]}
];
const BDS986_GROUP_FOR=Object.fromEntries(BDS986_GROUPS.flatMap(g=>g.tabs.map(t=>[t[0],g.id])));
let BDS986_activeGroup=BDS986_GROUP_FOR[tab]||'text';
const BDS986_previousRender=render;
render=function(){
 BDS986_previousRender();
 document.title='BİR.DUVARSESİ V9.8.6';
 const h=document.querySelector('header small');if(h)h.textContent='CLEAN STUDIO · V9.8.6';
 const metrics=document.querySelector('.metrics');if(metrics){const n=metrics.querySelector('div:first-child b');if(n&&Array.isArray(DATA.scenes))n.textContent=DATA.scenes.length;}
 const root=document.getElementById('content'),nav=document.getElementById('tabs');if(!root||!nav)return;
 // The V9.8.5 creator was a prompt copier, not a working generator: remove it entirely.
 // No AI creator is mounted in the current release.
 BDS986_activeGroup=BDS986_GROUP_FOR[tab]||BDS986_activeGroup;
 nav.classList.add('bds986-mainnav');
 nav.innerHTML=BDS986_GROUPS.map(g=>'<button type="button" data-bds986-group="'+g.id+'" class="'+(g.id===BDS986_activeGroup?'active':'')+'">'+g.name+'</button>').join('');
 const group=BDS986_GROUPS.find(g=>g.id===BDS986_activeGroup)||BDS986_GROUPS[1];
 const sub=document.createElement('div');sub.className='bds986-subnav';sub.setAttribute('aria-label','Unterbereiche');
 sub.innerHTML=group.tabs.map(([id,name])=>'<button type="button" data-tab="'+id+'" class="'+(id===tab?'active':'')+'">'+name+'</button>').join('');
 root.prepend(sub);
 if(tab==='text'){
  const hint=document.createElement('div');hint.className='bds986-note';
  hint.textContent='Wand- und Plakattexte hier direkt eingeben und bearbeiten. Keine API, kein KI-Textgenerator und keine zusätzlichen Kosten.';
  sub.after(hint);
 }
 const title=root.querySelector('#v979Export h2');if(title)title.textContent='MASTER-PROMPT · V9.8.6';
};
document.addEventListener('click',e=>{
 const btn=e.target.closest('button[data-bds986-group]');if(!btn)return;
 const group=BDS986_GROUPS.find(g=>g.id===btn.dataset.bds986Group);if(!group)return;
 BDS986_activeGroup=group.id;tab=group.tabs[0][0];render();
});
const BDS986_oldValidate=V972validate;
V972validate=function(s){if(s?.version==='9.8.6'){if(!s.settings||typeof s.settings!=='object'||!s.v941||!Array.isArray(s.v941.figures)||JSON.stringify(s).length>12000000)throw Error('Ungültiger V9.8.6 Projektstand');return s;}return BDS986_oldValidate(s);};
const BDS986_oldReadZip=V972readZip;
V972readZip=function(buffer){
 const entries=BDS986_oldReadZip(buffer);
 for(const v of ['9.8.6','9.8.5']){
  const key='PROJECT_SNAPSHOT_V'+v+'.json';
  if(entries[key]&&!entries['PROJECT_SNAPSHOT_V9.7.3.json'])entries['PROJECT_SNAPSHOT_V9.7.3.json']=entries[key];
 }
 return entries;
};
V970export=async function(){
 const names=['index.html','styles.css','data.js','app.js','v94.js','v941.js','v942.js','v96scenes.js','v96.js','v961.js','v962.js','v963.js','v964.js','v965.js','v966.js','v967.js','v968.js','v969.js','v970.js','v972.js','v973.js','v974.js','v976.js','v977.js','v978.js','v979.js','v980.js','v981.js','v982.js','v9823.js','v985.js','v986.js','sw.js','manifest.webmanifest','icon-192.png','icon-512.png'];
 const entries=[];
 for(const name of names){const response=await fetch('./'+name,{cache:'no-store'});if(!response.ok)throw Error('Datei fehlt: '+name);entries.push([name,new Uint8Array(await response.arrayBuffer())]);}
 const snapshot=V970snapshot(); // retain legacy state for lossless migration of older backups
 snapshot.version='9.8.6';
 entries.push(['PROJECT_SNAPSHOT_V9.8.6.json',JSON.stringify(snapshot,null,2)]);
 entries.push(['PROJECT_SNAPSHOT_V9.7.3.json',JSON.stringify(snapshot,null,2)]);
 const blob=V970zip(entries),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BDS 9.8.6.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),15000);
};
render();
