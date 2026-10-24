/* BİR.DUVARSESİ V9.6.2: spatial composition, individual anatomical wall-reading, stable scroll. */
'use strict';
const V962KEY='bds-v962-layout';
const V962choices=[
 ['auto','Automatisch passend zur Szene'],
 ['distributed','Automatisch – räumlich verteilt'],
 ['main-left','Hauptfigur links – Nebenfigur 1 rechts'],
 ['main-right','Hauptfigur rechts – Nebenfigur 1 links'],
 ['main-front','Hauptfigur vorne – Nebenfigur 1 hinten'],
 ['main-back','Hauptfigur hinten – Nebenfigur 1 vorne']
];
let V962layout='auto';try{V962layout=localStorage.getItem(V962KEY)||'auto'}catch(e){}
// Expand the EXISTING per-figure position selectors, without removing their original choices.
['Automatisch – räumlich verteilt','Links im Bild','Rechts im Bild','Vordergrund','Hintergrund'].forEach(p=>{if(!V941positions.includes(p))V941positions.push(p)});
function V962selector(){return `<div class="panel v962layout"><h2>Figurenverteilung · Hauptfigur & Nebenfiguren</h2><p class="hint">Gemeinsame Anordnung oder automatische räumliche Verteilung. Individuelle Positionen können anschließend weiterhin separat geändert werden. Die rote Wandbeschriftung bleibt frei.</p><label class="label" for="v962layout">Figuren räumlich anordnen</label><select id="v962layout" aria-label="Figurenverteilung">${V962choices.map(([v,t])=>`<option value="${v}" ${V962layout===v?'selected':''}>${t}</option>`).join('')}</select><p class="hint">Bei mehreren Nebenfiguren werden weitere Figuren ohne Überdeckung der Wand auf freie, glaubwürdige Positionen verteilt. Automatische Blickrichtung berücksichtigt Kopf UND Hals.</p></div>`}
const V962oldMain=V941main;
V941main=function(){return V962selector()+V962oldMain()};
const V962oldFigures=V941figures;
V941figures=function(){return V962selector()+V962oldFigures()};
function V962apply(mode){
 V962layout=mode;try{localStorage.setItem(V962KEY,mode)}catch(e){}
 const f=V941.figures;
 if(mode==='main-left'){V941.mainPosition='Links im Bild';if(f[0])f[0].position='Rechts im Bild'}
 else if(mode==='main-right'){V941.mainPosition='Rechts im Bild';if(f[0])f[0].position='Links im Bild'}
 else if(mode==='main-front'){V941.mainPosition='Vordergrund';if(f[0])f[0].position='Hintergrund'}
 else if(mode==='main-back'){V941.mainPosition='Hintergrund';if(f[0])f[0].position='Vordergrund'}
 else if(mode==='distributed'){V941.mainPosition='Automatisch – räumlich verteilt';f.forEach(x=>x.position='Automatisch – räumlich verteilt')}
 else {V941.mainPosition='Automatisch passend zur Szene';f.forEach(x=>x.position='Automatisch passend zur Szene')}
 V941save();render();
}
document.addEventListener('change',e=>{if(e.target.id==='v962layout')V962apply(e.target.value)});
// Keep the viewport stable even when legacy tabs reconstruct their DOM after a selection.
// Capture the last real user control before the synchronous rerender; use document coordinates
// rather than scrollTop alone because disclosure expansion changes the page height.
let V962anchor=null;
function V962capture(el){if(!el||!document.getElementById('content')?.contains(el))return;
 const r=el.getBoundingClientRect();
 const root=document.getElementById('content');
 const path=V961path(el,root);
 V962anchor={tab,path,top:r.top,scrollX:window.scrollX,scrollY:window.scrollY,tag:el.tagName,key:el.dataset?.v941Key||el.dataset?.key||'',figure:el.dataset?.v941Fig||'',at:Date.now()};
}
document.addEventListener('pointerdown',e=>V962capture(e.target.closest('select,button,input,summary,[data-set],[data-group]')),true);
document.addEventListener('focusin',e=>V962capture(e.target.closest('select,input,textarea')),true);
const V962render=render;
render=function(){
 const a=V962anchor,root=document.getElementById('content');
 // Preserve the current viewport only when rerendering the same tab due to a user edit.
 const valid=a&&a.tab===tab&&Date.now()-a.at<4000;
 const beforeY=window.scrollY;
 V962render();
 if(valid){
  const fresh=document.getElementById('content');
  let node=fresh?.querySelector(`[data-v941-key="${CSS.escape(a.key)}"]${a.figure?`[data-v941-fig="${CSS.escape(a.figure)}"]`:''}`);
  if(!a.key)node=null;
  if(!node&&fresh){node=[...fresh.querySelectorAll('select,input,button,summary,[data-set],[data-group]')].find(n=>V961path(n,fresh)===a.path)}
  if(node){const diff=node.getBoundingClientRect().top-a.top;window.scrollTo({top:Math.max(0,window.scrollY+diff),left:a.scrollX,behavior:'instant'})}
  else window.scrollTo({top:beforeY,left:a.scrollX,behavior:'instant'});
 }else if(a&&a.tab!==tab)V962anchor=null;
};
// Stable dropdowns: avoid rerender for simple select changes when no dependent UI needs rebuilding.
// The existing change listeners continue to persist every selection.
const V962previousPrompt=prompt;
prompt=function(){
 const first=(state.wall||'').split(/\r?\n/).find(s=>s.trim())?.trim()||'FIRST RED WALL LINE';
 const wall=(v)=>['Zur Wand','Automatisch','Automatisch passend zur Szene','Erste Textzeile','Erste rote Wandtextzeile'].includes(v);
 const persons=[{name:'MAIN CHARACTER',pos:V941.mainPosition,gaze:V941.mainGaze,orientation:V941.mainOrientation},...V941.figures.map((f,i)=>({name:`SUPPORTING FIGURE ${i+1} (${f.type}, ${f.id})`,pos:f.position,gaze:f.gaze,orientation:f.orientation}))];
 const layout=V962choices.find(x=>x[0]===V962layout)?.[1]||V962layout;
 const lines=[
 'BİR.DUVARSESİ V9.6.2 — HIGHEST PRIORITY SPATIAL PLACEMENT AND ANATOMICAL READING DIRECTOR',
 'These rules override any older conflicting pose, elder, head/gaze, automatic-position or scene-placement instructions later in the prompt.',
 `USER SELECTED JOINT FIGURE LAYOUT: ${layout}. Interpret LEFT and RIGHT as IMAGE-LEFT and IMAGE-RIGHT, never the character’s anatomical left/right. Explicit per-figure positions take priority where manually changed.`,
 'NON-OCCLUSION LOCK: Place ALL people, heads, arms, chairs, signs and accessories outside the complete red lettering bounding box, including every last letter. Wall text must remain 100% readable. Preserve selected scene and poses; vary horizontal position, depth, stance, railing placement and camera as needed.',
 'AUTOMATIC SPATIAL DISTRIBUTION: Do not habitually cluster all people side by side. When layout is automatic/distributed, prefer plausible left/right separation or different foreground/background depth, while preserving a natural scene. Distribute additional figures independently. Do not force an arrangement that obstructs text.',
 `REAL 3D WALL READING TARGET: Geometric center of the FIRST RED LINE on the ACTUAL wall: ${JSON.stringify(first)}. This target is physically located on the facade, not a point in the sky or the camera.`,
 'FOR EACH PERSON INDEPENDENTLY: First position the body where a direct line of sight to the first wall line exists. Then rotate the skull AND CERVICAL SPINE to face that actual wall target. Align the nose axis, chin, face plane and both eyes with the same physical target; add natural upward tilt if needed. If side-on, visibly turn the head and neck toward the wall as if ACTIVELY READING. Never rotate only pupils. Never twist the neck beyond human limits; adjust torso/shoulders or position instead.',
 ...persons.map(p=>`${p.name}: position=${p.pos}; selected gaze=${p.gaze}; body orientation=${p.orientation}. ${wall(p.gaze)?'MANDATORY ACTIVE WALL READING. Rotate HEAD and NECK physically toward the first red text line; face/nose/chin/eyes point at the wall. If this pose makes the line invisible, move the person or slightly reorient the shoulders while preserving the pose.':'EXPLICIT NON-WALL GAZE: respect the user-selected gaze target; do not force wall reading.'}`),
 'GEOMETRIC QUALITY GATE: Independently verify each person’s actual line of sight, head yaw, neck yaw and pitch to the first red line. Reject configurations where someone appears to stare into empty space, looks away from the wall, or merely tilts the eyes. If needed change camera position or the figure location, not the user-selected text.',
 'PLACEMENT QUALITY GATE: Verify main and supporting figures are distinct and spatially believable; all text and placard remain fully readable. Do not invent additional figures.',
 '--- ORIGINAL V9.6.1 FULL MASTER PROMPT (SUBORDINATE TO THE RULES ABOVE) ---',V962previousPrompt()
 ];return lines.join('\n');
};
