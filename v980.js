/* BİR.DUVARSESİ V9.8.0 — post-build corrections and self-check */
'use strict';
const V980_VERSION='9.8.0';
// Restore newest project snapshots without replacing the user's pose library on older imports.
const V980previousValidate=V972validate;
V972validate=function(b){if(b?.version===V980_VERSION){if(!b.settings||!b.v941||!Array.isArray(b.v941.figures)||JSON.stringify(b).length>12000000)throw Error('Ungültiger Projektstand');return b;}return V980previousValidate(b);};
const V980previousSnapshot=V970snapshot;
V970snapshot=function(){const b=V980previousSnapshot();b.version=V980_VERSION;b.v979=structuredClone(V979);return b;};
const V980previousReadZip=V972readZip;
V972readZip=function(buffer){const entries=V980previousReadZip(buffer);const name='PROJECT_SNAPSHOT_V9.8.0.json';if(entries[name])entries['PROJECT_SNAPSHOT_V9.7.3.json']=entries[name];return entries;};
const V980previousRestore=V972restore;
V972restore=function(b){const previous=structuredClone(V979);try{V980previousRestore(b);if(b.v979){V979={...V979_DEFAULT,...b.v979};V979save();}else{V979=previous;V979save();}render();}catch(err){V979=previous;V979save();throw err;}};
// A single final export adapter is shared by both the Hauptwriter and Export tab.
const V980previousPrompt=prompt;
prompt=function(){let p=V980previousPrompt().replace(/BİR\.DUVARSESİ V9\.7\.9/g,'BİR.DUVARSESİ V9.8.0');
 // User-enabled sign takes priority over a stale "Kein Plakat" selection.
 if(V941.signOn)p=p.replace(/(PLACARD: ENABLED;[^\n]*?mode )Kein Plakat(?=;)/,'$1Aktives Plakat (manuell aktiviert)');
 // The chosen pose has sole authority over posture for every custom-pose figure.
 const figures=V979figures();p=p.split('\n').map(line=>{let id=line.startsWith('MAIN FIGURE:')?'main':null;if(!id){const m=line.match(/^SUPPORTING FIGURE (\d+)/);if(m)id=figures[Number(m[1])]?.id;}if(!id)return line;const v=V979selected(id);if(!v.active||!v.description?.trim())return line;
 line=line.replace(/; posture [^;]*;/,'; posture follows custom pose description;');
 return line;}).join('\n');
 return p;
};
// Keep the full backup self-contained and consistent with the current release.
V970export=async function(){const assets=['index.html','styles.css','data.js','app.js','v94.js','v941.js','v942.js','v96scenes.js','v96.js','v961.js','v962.js','v963.js','v964.js','v965.js','v966.js','v967.js','v968.js','v969.js','v970.js','v972.js','v973.js','v974.js','v976.js','v977.js','v978.js','v979.js','v980.js','sw.js','manifest.webmanifest','icon-192.png','icon-512.png'];const entries=[];for(const name of assets){const r=await fetch('./'+name,{cache:'no-store'});if(!r.ok)throw Error('Datei fehlt: '+name);entries.push([name,new Uint8Array(await r.arrayBuffer())]);}entries.push(['PROJECT_SNAPSHOT_V9.8.0.json',JSON.stringify(V970snapshot(),null,2)]);entries.push(['README_V980.txt','BIR.DUVARSESI V9.8.0. Reference photos are not embedded; attach separately.']);const blob=V970zip(entries),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BIR_DUVARSESI_V9.8.0_FULL_BACKUP.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),15000);};
// Verify the actual active settings before copying; never mutate manual settings.
function V980diagnostics(){const issues=[];if(V970.cameraMode==='manual'&&(!Number.isFinite(Number(state.distance))||Number(state.distance)<=0))issues.push('Ungültige manuelle Kameraentfernung');if(V970.wallDistanceMode==='manual'&&(!Number.isFinite(Number(V970.manualMain))||Number(V970.manualMain)<=0))issues.push('Ungültiger manueller Hauptfigurenabstand');for(const f of V979figures()){const v=V979selected(f.id);if(v.active&&!v.description?.trim())issues.push('Eigene Pose ohne Beschreibung: '+f.name);}return issues;}
document.addEventListener('click',e=>{if(e.target.closest('#v979Copy')){const issues=V980diagnostics();if(issues.length){e.preventDefault();e.stopImmediatePropagation();toast('Export prüfen: '+issues.join('; '));}}},true);
// Show current version on screen without touching existing saved projects.
const V980render=render;render=function(){V980render();const root=document.getElementById('content');if(root&&tab==='text'){const e=root.querySelector('#v979Export h2');if(e)e.textContent='6 · MASTER-PROMPT · SOFORT-EXPORT · V9.8.0';}};
render();
