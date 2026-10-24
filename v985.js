/* BIR.DUVARSESI V9.8.5 - additive CLEAN STUDIO, no storage reset */
'use strict';
const BDS985_KEY='bds-v985';
// Apply defaults only to fresh configuration; never overwrite saved project choices.
if(!localStorage.getItem(V941KEY) && V941.fontChoice===V941default.fontChoice){V941.fontChoice='T705';V941save();try{localStorage.setItem('bds-v985-font-default-applied','1')}catch(_){}}
if(!localStorage.getItem(V963KEY)){if(V963.wallPreset===V963default.wallPreset)V963.wallPreset='DIN CONDENSED BLACK';if(V963.wallFinish===V963default.wallFinish)V963.wallFinish='BLACK INDUSTRIAL BRICK · soot-black matte brick with visible joints';V963.signAlign='Zentriert';V963save();try{localStorage.setItem('bds-v985-wall-default-applied','1')}catch(_){}}
let BDS985={idea:'',makeSign:true};
try{BDS985={...BDS985,...JSON.parse(localStorage.getItem(BDS985_KEY)||'{}')}}catch(_){}
function BDS985save(){try{localStorage.setItem(BDS985_KEY,JSON.stringify(BDS985))}catch(_){}}
function BDS985first(){return String(state.wall||'').split('\n').find(x=>x.trim())||''}
function BDS985geometry(){
 const first=BDS985first(),geo=V976geometry();
 const eye=Number(geo.eye)||1.6,wallHeight=Number(geo.h)||5; // scene estimates, not measured coordinates
 const current=Math.max(1,Number(geo.main?.distance)||Number(state.distance)||5);
 const safe=Math.max(current,Math.abs(wallHeight-eye)/Math.tan((Number(geo.tilt)||24)*Math.PI/180));
 return {first,geo,current,safe,angle:Math.atan2(wallHeight-eye,current)*180/Math.PI};
}
const BDS985previousRender=render;
render=function(){
 BDS985previousRender();
 document.title='BİR.DUVARSESİ V9.8.5';
 const h=document.querySelector('header small');if(h)h.textContent='CLEAN STUDIO · V9.8.5';
 const x=document.querySelector('#v979Export h2');if(x)x.textContent='MASTER-PROMPT · V9.8.5';
 const root=document.getElementById('content');if(!root)return;
 // Legacy gaze controls are intentionally hidden: gaze always targets the first red line.
 root.querySelectorAll('[data-bds-gaze],[data-v979-gaze],[data-v979-precision],[data-v941-key="mainGaze"],[data-v941-key="gaze"]').forEach(el=>{const label=el.previousElementSibling;if(label&&label.matches('label'))label.hidden=true;el.hidden=true});
 if(tab==='text'){
  const panel=document.createElement('section');panel.className='panel';panel.id='bds985Creator';
  panel.innerHTML='<h2>TEXT CREATOR · V9.8.5</h2><p class="hint">Geschichte auf Deutsch oder Türkisch eingeben. Wandtext und optional Plakattext separat erstellen und übernehmen.</p>'+
   '<label class="label" for="bds985Idea">Deine Geschichte / Beschreibung</label><textarea id="bds985Idea" rows="6" placeholder="Eine kurze Idee oder eine längere Geschichte ...">'+escapeHTML(BDS985.idea)+'</textarea>'+
   '<label class="check"><input id="bds985MakeSign" type="checkbox" '+(BDS985.makeSign?'checked':'')+'> Plakattext erzeugen</label>'+
   '<button type="button" class="btn" id="bds985Create">KI-Auftrag für ChatGPT kopieren</button>'+
   '<p class="hint">GitHub Pages hat keinen sicheren eigenen KI-Dienst. Der Auftrag wird kopiert; das Ergebnis kann in die vorhandenen Textfelder eingefügt werden. Bestehende Texte werden nicht überschrieben.</p>';
  root.insertBefore(panel,root.firstChild);
 }
 if(tab==='export'){
  const g=BDS985geometry(),p=document.createElement('section');p.className='panel';
  p.innerHTML='<h2>GAZE DIRECTOR · ERSTE ZEILE</h2><p class="hint">Alle aktiven Figuren fixieren ausschließlich die Mitte der ersten roten Wandtextzeile. Bei zu steilem Blickwinkel mehr Abstand erzeugen. Anatomie hat Vorrang vor der gewählten Distanz.</p>'+
   '<p class="hint">Orientierungsrechnung (keine Bildmessung): Augenhöhe '+g.geo.eye+' m; erste Zeile geschätzt '+g.geo.h+' m; Hauptfiguren-Abstand '+g.current.toFixed(1)+' m; Aufwärtswinkel '+g.angle.toFixed(1)+'°. Empfohlener Abstand für höchstens '+g.geo.tilt+'°: '+g.safe.toFixed(1)+' m.</p>'+
   (!g.first?'<p class="warn">Wandtext fehlt: Blickziel nicht bestimmbar.</p>':'')+
   (!V941.wallOn?'<p class="warn">Wandtext deaktiviert: Blickregel erfordert sichtbare erste Zeile.</p>':'');
  root.insertBefore(p,root.firstChild);
 }
};
document.addEventListener('input',e=>{if(e.target.id==='bds985Idea'){BDS985.idea=e.target.value;BDS985save()}});
document.addEventListener('change',e=>{if(e.target.id==='bds985MakeSign'){BDS985.makeSign=e.target.checked;BDS985save()}});
document.addEventListener('click',e=>{if(e.target.id!=='bds985Create')return;
 const idea=BDS985.idea.trim();if(!idea){toast('Bitte zuerst eine Beschreibung eingeben');return}
 const q='Erstelle für BİR.DUVARSESİ aus dieser Beschreibung einen originellen türkischen Wandtext'+(BDS985.makeSign?' und einen eigenständigen passenden türkischen Plakattext':' (ohne Plakattext)')+'. Die Beschreibung darf lang sein; bewahre konkrete Details und den Sinn. Standard: kompakt, bei Bedarf längere Zeilenanzahl. Natürliches Türkisch, spannender Einstieg, prägnante Pointe, keine recycelten Hooks. '+(BDS985.makeSign?'Plakattext separat mit genau vier Zeilen. ':'')+'BESCHREIBUNG:\n'+idea;
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(q).then(()=>toast('KI-Auftrag kopiert – in ChatGPT einfügen')).catch(()=>{window.prompt('KI-Auftrag kopieren',q)});
 else window.prompt('KI-Auftrag kopieren',q);
});
/* One canonical prompt: no legacy duplicate gaze overrides. Existing source data and pose selection remain intact. */
prompt=function(){
 const s=state,g=BDS985geometry(),figures=V982activeFigures();
 const profile=V982.profile||'Dokumentarisch';
 const scene=DATA.scenes[s.scene-1]||'',city=DATA.cities[s.scene-1]||'';
 const lines=['BİR.DUVARSESİ V9.8.5 — CLEAN MASTER','OUTPUT: Exactly ONE native '+s.format+' ultra-photorealistic documentary photograph; natural anatomy, real optics, never CGI.',
 'MODE: '+(s.mode==='Bild bearbeiten'?'Edit the supplied original photograph. Preserve all unrelated details.':'Create a new photograph.')+
 ' SCENE: '+scene+'; location '+city+'. Preserve real architecture, safe public access and genuine foreground-to-facade depth.',
 'WALL: '+(V941.wallOn?'ON':'OFF')+'. Selected finish: '+(V963.wallFinish||s.facadeTexture)+'. If BLACK INDUSTRIAL BRICK, use soot-black matte brick with visible joints. No lamps or floodlights. Wall typography selected font '+(V941.fontChoice==='T705'?'DIN CONDENSED BLACK':V941.fontChoice)+', bold matte red, left-aligned lines within a centered text block. Do not center individual wall lines.',
 'WALL FONT CONTROLS: '+(V941.fontChoice==='T705'?'DIN CONDENSED BLACK':(V963.wallPreset||V941.fontChoice||'DIN CONDENSED BLACK'))+'; '+V941.fontWeight+'; tracking '+V941.fontSpacing+'; line spacing '+V941.fontLineSpacing+'; selected finish '+(V963.wallFinish||s.facadeTexture)+'.',
 'BEGIN EXACT WALL TEXT',s.wall||'','END EXACT WALL TEXT',
 'COMPOSITION: '+profile+'. Real open-space separation; maintain plausible architectural scale and selected scene. Camera '+s.camera+'; '+g.geo.lens+' mm; camera distance '+s.distance+' m; '+s.time+'; '+s.weather+'. Honor explicit camera locks.',
 'GAZE DIRECTOR — NON-NEGOTIABLE: Every active figure fixes BOTH pupils on the geometric CENTER of the FIRST RED WALL TEXT LINE: '+(g.first||'[MISSING FIRST LINE]')+'. Never gaze vaguely at the wall, into empty space, toward the camera, or toward another line. From each figure’s own eye position, rotate eyes, skull, neck and, if needed, shoulders and torso anatomically. No extreme neck twist. If close proximity makes this impossible, MOVE THE FIGURE FARTHER AWAY from the facade on physically available safe public ground; preserve architecture and genuine depth. Reframe camera if necessary. Do not invent accessible ground, expand a narrow roof, or break original-photo locks. If no viable viewpoint exists, flag the conflict rather than force impossible anatomy.',
 'DISTANCE PLANNING (illustrative estimates, not measured coordinates): eye height '+g.geo.eye+' m, first-line center '+g.geo.h+' m; use enough distance for a comfortable elevation angle, at most '+g.geo.tilt+' degrees; estimated minimum '+g.safe.toFixed(1)+' m for main figure. Independently adjust each figure based on its own actual eye position.',
 'FIGURES:'];
 figures.forEach(f=>{
  const v=V979selected(f.id),meta=V941.figures.find(x=>x.id===f.id);
  const pose=v.active&&v.description?.trim()?((v.name||'Individual pose')+': '+v.description.trim()):V976pose(f.id,meta);
  lines.push('FIGURE '+f.id+' ('+f.name+'): '+(f.id==='main'?'Ponytail bearded man; preserve supplied face identity if reference is attached.':'Age '+(meta?.age||'selected')+'; clothing '+(meta?.clothes||'selected')+'; preserve supplied identity if available.')+' POSE: '+pose+'. Eyes, head, neck and torso obey the ONE gaze target above. Preserve own independent chair/bench and natural limb support; never merge furniture or hands.');
 });
 lines.push('REFERENCES: '+(s.personRef==='Ja'?'PERSON PHOTO identity lock; ':'')+(s.locationRef==='Ja'?'LOCATION PHOTO architecture lock; ':'')+(s.mode==='Bild bearbeiten'||s.originalRef==='Ja'?'ORIGINAL PHOTO must be attached and protected; ':'')+'Do not invent references.');
 if(V941.signOn)lines.push('PLACARD: one physical stable sign; '+(s.signMode==='Kein Plakat'?'active user-selected placard':s.signMode)+'; '+s.signMaterial+'; '+s.signColor+'; selected placement '+(V964.signPlacement||'foreground')+'; DIN CONDENSED BLACK default; center each line of placard text.','BEGIN EXACT PLACARD TEXT',s.signTextMode==='Ohne Text'?'':(s.signText||'').trim()|| (s.signTextMode==='Wandtext übernehmen'?s.wall:''),'END EXACT PLACARD TEXT');
 else lines.push('PLACARD: DISABLED. No placard.');
 lines.push('QUALITY GATE: Preserve exact Turkish letters and line breaks; physically separate foreground figures and facade; first-line gaze for every figure; natural neck/torso; individual pose and furniture; no streetlights, wall-mounted lamps, flags, religious buildings or symbols, extra signage, or merged anatomy. If the selected scene cannot support the geometry, do not silently invent a solution. This prompt cannot verify the generated image.');
 return lines.join('\n');
};
const BDS985oldSnapshot=V970snapshot;
V970snapshot=function(){return {...BDS985oldSnapshot(),v985:{...BDS985}}};
const BDS985oldExport=V970export;
V970export=async function(){const names=['index.html','styles.css','data.js','app.js','v94.js','v941.js','v942.js','v96scenes.js','v96.js','v961.js','v962.js','v963.js','v964.js','v965.js','v966.js','v967.js','v968.js','v969.js','v970.js','v972.js','v973.js','v974.js','v976.js','v977.js','v978.js','v979.js','v980.js','v981.js','v982.js','v9823.js','v985.js','sw.js','manifest.webmanifest','icon-192.png','icon-512.png'];const entries=[];for(const name of names){const r=await fetch('./'+name,{cache:'no-store'});if(!r.ok)throw Error('Datei fehlt: '+name);entries.push([name,new Uint8Array(await r.arrayBuffer())]);}entries.push(['PROJECT_SNAPSHOT_V9.8.5.json',JSON.stringify(V970snapshot(),null,2)]);const blob=V970zip(entries),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BDS 9.8.5.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),15000);};

render();
