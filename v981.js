/* BİR.DUVARSESİ V9.8.1 — transactional modern project import */
'use strict';
const V981_VERSION='9.8.1';
const V981_previousSnapshot=V970snapshot;
V970snapshot=function(){const s=V981_previousSnapshot();s.version=V981_VERSION;s.v979=structuredClone(V979);return s;};
const V981_previousValidate=V972validate;
V972validate=function(s){if(s&&s.version===V981_VERSION){if(!s.settings||typeof s.settings!=='object'||!s.v941||!Array.isArray(s.v941.figures)||JSON.stringify(s).length>12000000)throw Error('Ungültiger V9.8.1 Projektstand');return s;}return V981_previousValidate(s);};
// Atomic rollback includes every bds-* storage key, all runtime states and current tab.
const V981_previousRestore=V972restore;
V972restore=function(s){
 V972validate(s);
 const runtime={state:structuredClone(state),V941:structuredClone(V941),V964:structuredClone(V964),V965:structuredClone(V965),V967:structuredClone(V967),V969:structuredClone(V969),V970:structuredClone(V970),V972:structuredClone(V972),V979:structuredClone(V979),tab};
 const storage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('bds-'))storage[k]=localStorage.getItem(k);}
 try{
  V981_previousRestore(s);
  if(s.v979&&typeof s.v979==='object')V979={...V979_DEFAULT,...s.v979};else V979=runtime.V979;
  V979save();render();
 }catch(err){
  state=runtime.state;V941=runtime.V941;V964=runtime.V964;V965=runtime.V965;V967=runtime.V967;V969=runtime.V969;V970=runtime.V970;V972=runtime.V972;V979=runtime.V979;tab=runtime.tab;
  const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('bds-'))keys.push(k);}
  for(const k of keys)localStorage.removeItem(k);
  for(const [k,v] of Object.entries(storage))localStorage.setItem(k,v);
  localStorage.setItem(KEY,JSON.stringify(state));
  try{render();}catch(_){}throw err;
 }
};
// The original capture listener only searches snapshots through 9.7.3.
// Intercept earlier in capture phase and handle modern JSON/ZIP without legacy import races.
document.addEventListener('change',function(e){
 const input=e.target;if(input?.id!=='v969BackupImport'||!input.files?.length)return;
 e.stopImmediatePropagation();e.preventDefault();const file=input.files[0];
 (async()=>{try{
  let snapshot;
  if(/\.zip$/i.test(file.name)){
   const entries=V972readZip(await file.arrayBuffer());
   const names=Object.keys(entries).filter(n=>/^PROJECT_SNAPSHOT_V9\.(?:6\.9|7\.\d+|8\.\d+)\.json$/i.test(n));
   if(!names.length)throw Error('Kein unterstützter Projekt-Snapshot im ZIP');
   names.sort((a,b)=>{const ver=n=>n.match(/V(\d+)\.(\d+)\.(\d+)/i).slice(1).map(Number);const x=ver(a),y=ver(b);return x[0]-y[0]||x[1]-y[1]||x[2]-y[2];});
   snapshot=JSON.parse(new TextDecoder().decode(entries[names[names.length-1]]));
  }else snapshot=JSON.parse(await file.text());
  V972validate(snapshot);
  if(!confirm('Projektstand '+snapshot.version+' laden? Vorher aktuellen Stand sichern.'))return;
  V972restore(snapshot);toast('Projektstand erfolgreich wiederhergestellt');
 }catch(err){toast('Import fehlgeschlagen: '+String(err.message||err));}finally{input.value='';}})();
},true);
const V981_prevPrompt=prompt;prompt=function(){return V981_prevPrompt().replace(/BİR\.DUVARSESİ V9\.8\.0/g,'BİR.DUVARSESİ V9.8.1');};
V970export=async function(){
 const assets=['index.html','styles.css','data.js','app.js','v94.js','v941.js','v942.js','v96scenes.js','v96.js','v961.js','v962.js','v963.js','v964.js','v965.js','v966.js','v967.js','v968.js','v969.js','v970.js','v972.js','v973.js','v974.js','v976.js','v977.js','v978.js','v979.js','v980.js','v981.js','sw.js','manifest.webmanifest','icon-192.png','icon-512.png'];
 const entries=[];for(const name of assets){const r=await fetch('./'+name,{cache:'no-store'});if(!r.ok)throw Error('Datei fehlt: '+name);entries.push([name,new Uint8Array(await r.arrayBuffer())]);}
 entries.push(['PROJECT_SNAPSHOT_V9.8.1.json',JSON.stringify(V970snapshot(),null,2)]);
 entries.push(['README_V981.txt','BIR.DUVARSESI V9.8.1. Photo references must be attached separately.']);
 const blob=V970zip(entries),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BIR_DUVARSESI_V9.8.1_FULL_BACKUP.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),15000);
};
const V981_oldRender=render;render=function(){V981_oldRender();const el=document.querySelector('#v979Export h2');if(el)el.textContent='6 · MASTER-PROMPT · SOFORT-EXPORT · V9.8.1';};render();
