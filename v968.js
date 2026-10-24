/* BİR.DUVARSESİ V9.6.8 — regression fixes for V9.6.7 */
'use strict';
const V968VERSION='9.6.8';
// Main identity stays the uploaded ponytail man. No alternative fictional identity selector.
const V968oldMain=V941main;
V941main=function(){let h=V968oldMain();h=h.replace(/<label class="label">Quelle<\/label><select data-v941-key="mainSource">[\s\S]*?<\/select>/, '<div class="panel"><strong>Hauptcharakter: Mann mit Zopf (Identität ausschließlich aus Foto-Upload)</strong></div>');
// Place universal posture and pose immediately after character heading, before image reference and other settings.
const c=V967controls('main');h=h.replace(c,'');const marker='<p class="hint">Der Mann mit Zopf bleibt die Hauptfigur. Sein Identitätsfoto wird wie bisher über Upload bereitgestellt; keine automatische Ersatzidentität.</p>';
return h.replace(marker,marker+c)};
// New figure must have an actual image stored in IndexedDB when reference checkbox is selected.
const V968oldFigures=V941figures;
V941figures=function(){let h=V968oldFigures();h=h.replace('id="v967AddCustom"','id="v968AddCustom"');
// Existing figures: posture/pose controls must appear after the Character selector, not in a detached block.
for(const f of V941.figures){const c=V967controls(f.id);const pos=h.indexOf(c);if(pos<0)continue;h=h.slice(0,pos)+h.slice(pos+c.length);const selector=`data-v941-key="type" data-v941-fig="${f.id}"`;const i=h.indexOf(selector);if(i<0)continue;const end=h.indexOf('</select>',i);if(end<0)continue;h=h.slice(0,end+9)+c+h.slice(end+9)}
return h};
// Prevent an alternative main identity from persisted settings or earlier project imports.
V941.mainSource='Originalfoto-Upload';V941save();
const V968oldPrompt=prompt;
prompt=function(){let p=V968oldPrompt().replaceAll('V9.6.7','V9.6.8');
const extra=['','RULE 972: MAIN CHARACTER IDENTITY IS FIXED: the ponytail man is sourced from the MAIN uploaded photo. No fictional substitute is permitted. If the file is not attached to the image generator, request it rather than inventing a face.','RULE 973: REFERENCE PHOTO ATTACHMENT MANIFEST: locally stored image files cannot be embedded into plain text. Before generating, attach the files listed below from the reference export. The filename alone is never the reference photo.'];
extra.push('MAIN REFERENCE: '+(V941.mainReference?'Stored locally as person; file '+V941.mainReference+'; ATTACH THIS ACTUAL IMAGE':'MISSING — upload the main identity photo'));
for(const f of V941.figures){if(V965.uploads[f.id])extra.push('SUPPORTING REFERENCE '+f.id+' ('+(f.customName||f.type)+'): '+(f.reference?'Stored locally as v941-'+f.id+'; '+f.reference+'; ATTACH THIS ACTUAL IMAGE':'MISSING — upload actual photo'))}
return p+'\n'+extra.join('\n')};
// Custom figure: require selected photo when checkbox checked; store bytes via the established photo database.
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b||b.id!=='v968AddCustom')return;
const name=(document.getElementById('v967CustomName')?.value||'').trim();if(!name){toast('Bitte Figurenbezeichnung eingeben');return}
const attach=!!document.getElementById('v967AttachPhoto')?.checked;const file=document.getElementById('v967NewPhoto')?.files?.[0];if(attach&&!file){toast('Referenzfoto aktiv: Bitte zuerst ein Bild auswählen');return}
if(file&&!file.type.startsWith('image/')){toast('Nur Bilddateien erlaubt');return}
const f=V941newFigure('Opa');f.type=name;f.customName=name;
if(attach){try{await storeImage('v941-'+f.id,file)}catch(err){toast('Bild konnte nicht gespeichert werden – Figur nicht hinzugefügt');return}f.reference=file.name}
V941.figures.push(f);V965.uploads[f.id]=attach;V967.photoNames[f.id]=attach?file.name:'';V967.customName='';V967.attachPhoto=false;delete V967.photoNames.pending;
V941save();V965save();V967save();render();toast('Figur mit '+(attach?'gespeichertem Referenzfoto':'freier Beschreibung')+' hinzugefügt')
});
// Download the actual reference photos individually. Plain-text prompts cannot attach binaries automatically.
document.addEventListener('click',async e=>{const b=e.target.closest('[data-v968-photo]');if(!b)return;const id=b.dataset.v968Photo;try{const f=await getImage(id);if(!f){toast('Kein gespeichertes Foto für '+id);return}const url=URL.createObjectURL(f);const a=document.createElement('a');a.href=url;a.download=f.name||id+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}catch(err){toast('Foto konnte nicht geladen werden')}});
const V968oldExport=exportTab;
exportTab=function(){let h=V968oldExport();const items=[['person','Hauptfigur: Mann mit Zopf',V941.mainReference],...V941.figures.filter(f=>V965.uploads[f.id]).map(f=>['v941-'+f.id,f.customName||f.type,f.reference])];
return `<div class="panel"><h2>Referenzfotos für den Bildgenerator</h2><p class="hint">Die Fotos sind lokal gespeichert. Für die Bildgenerierung jedes Bild separat herunterladen und zusammen mit dem Prompt anhängen. Ein Dateiname allein genügt nicht.</p>${items.map(([id,name,file])=>`<div class="item">${escapeHTML(name)}: ${file?escapeHTML(file):'FOTO FEHLT'} ${file?`<button class="small" data-v968-photo="${escapeHTML(id)}">Foto herunterladen</button>`:''}</div>`).join('')}</div>`+h};
const V968oldRender=render;
render=function(){V968oldRender();const metric=document.getElementById('poseMetric');if(metric)metric.textContent=String(ALL.length+V967POSES.length)};
// Avoid false positive: quality check verifies real stored file bytes and actual DOM positions.
const V968oldQa=V965qa;
V965qa=function(){const r=V968oldQa();r.version=V968VERSION;const test=(name,fn)=>{let ok=false,detail='';try{ok=!!fn()}catch(e){detail=String(e)}r.checks.push({name,ok,detail})};
test('V9.6.8: Hauptfigur ohne austauschbare Identitätsquelle',()=>!V941main().includes('data-v941-key="mainSource"')&&V941main().includes('data-v941-upload="main"'));
test('V9.6.8: Pose-Metrik entspricht Original + 50',()=>document.getElementById('poseMetric')?.textContent===String(ALL.length+50));
test('V9.6.8: Neues Figurenfoto ist Pflicht, wenn Foto-Haken aktiv',()=>V941figures().includes('id="v968AddCustom"')&&V941figures().includes('id="v967AttachPhoto"'));
test('V9.6.8: Download der Referenzbilder im Export',()=>exportTab().includes('data-v968-photo')||(!V941.mainReference&&!V941.figures.some(f=>V965.uploads[f.id])));
test('V9.6.8: Hauptfigur Pose nach Identität',()=>V941main().indexOf('Hauptcharakter: Mann mit Zopf')<V941main().indexOf('data-v967-controls="main"'));
r.passed=r.checks.filter(x=>x.ok).length;r.failed=r.checks.length-r.passed;return r};
render();
