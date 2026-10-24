/* BİR.DUVARSESİ V9.7.3 — safe restore and camera framing guard */
'use strict';
const V973_PREVIOUS_SNAPSHOT=V970snapshot;
V970snapshot=function(){const s=V973_PREVIOUS_SNAPSHOT();s.version='9.7.3';s.projects=savedProjects();s.v970={...V970,versions:[]};return s};
// Store new snapshots using the same schema; retain named versions locally.
const V973_previousRender=render;
render=function(){V973_previousRender();if(tab==='export'){const t=document.querySelector('#v970VersionName');if(t)t.value=t.value.replace(/V9\.7\.[0-2]/g,'V9.7.3');const b=document.querySelector('#v969Backup h2');if(b)b.textContent='Projekt-Backup · V9.7.3';const h=document.querySelector('#v970Spatial h2');if(h)h.textContent='V9.7.3 · SMART WALL DISTANCE DIRECTOR';const label=document.querySelector('#v970VersionList');if(label)label.setAttribute('aria-label','Gespeicherte Projektversionen');}}
// Camera framing is a planning estimate only, never a physical measurement.
const V973_previousPrompt=prompt;
prompt=function(){const original=V973_previousPrompt();const g=V972geometry(),lens=Number(V970.cameraMode==='auto'?g.p.suggestedLens:state.lens)||28;
const height=Number(g.h)||11,view=9/16,coverage=2*Math.atan(36/(2*lens)),distance=height/(2*Math.tan(coverage/2));
const notes=['','=== V9.7.3 FINAL COMPOSITION SAFETY CHECK ===',
'Lens '+lens+'mm full-frame equivalent. Current user camera distance '+state.distance+'m remains authoritative. Never silently alter manually selected values.',
'Approximate camera framing only: a '+height+'m tall facade target would require about '+distance.toFixed(1)+'m camera distance for full horizontal-frame coverage at this focal length; actual portrait framing, tilt, crop, sensor and wall width must be assessed separately. This estimate is not a 3D measurement.',
'Place the main figure and each wall-reading supporting figure at independently computed distances BEFORE determining eye/head direction. For any figure with a wall gaze, aim both eyes, head and neck at the physical FIRST RED TEXT LINE, with safe ground and no impossible placement.',
'If the scene cannot accommodate the figure distance, choose a plausible alternative vantage point or framing. Do not force an extreme neck angle, invent walkways, or override the selected location.',
'Preserve all exact Turkish lettering, selected poses, original identity, clothing, sign, scene, no visible lamps and no flags or religious symbols.'];return original+'\n'+notes.join('\n')};
// Full app backup includes the deployed sources and the current snapshot; photographs are still not embedded.
const V973_ASSETS=[...V972assets,'v973.js'];
V970export=async function(){const entries=[];for(const name of V973_ASSETS){const r=await fetch('./'+name,{cache:'no-store'});if(!r.ok)throw Error(name+' fehlt');entries.push([name,new Uint8Array(await r.arrayBuffer())])}entries.push(['PROJECT_SNAPSHOT_V9.7.3.json',JSON.stringify(V970snapshot(),null,2)]);entries.push(['README_V973.txt','BIR.DUVARSESI V9.7.3. Upload ZIP contents to hosting. Restore with the embedded PROJECT_SNAPSHOT_V9.7.3.json via Import. Uploaded reference images are not included. Always keep a separate photo backup.']);const blob=V970zip(entries),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BIR_DUVARSESI_V9.7.3_FULL_BACKUP.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),15000)};
// Validate current version before delegating to the single v972 importer.
const V973validate=V972validate;
V972validate=function(b){if(b?.version==='9.7.3'){const copy={...b,version:'9.7.2'};V973validate(copy);return b}return V973validate(b)};
// Legacy backup button is handled by the updated v972 handler; header remains navigation.
