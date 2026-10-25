/* BIR.DUVARSESI V9.9.1 — Global wall geometry and collision director.
   Additive final prompt authority; no project or settings migration. */
(function(){
'use strict';
const previousPrompt=prompt;
prompt=function(){
 const base=previousPrompt();
 const rules=[
  '',
  '=== V9.9.1 GLOBAL WALL TYPOGRAPHY AND COLLISION AUTHORITY ===',
  'APPLIES TO EVERY SCENE, EVERY FACADE, EVERY ACTIVE CHARACTER AND EVERY SIGN.',
  'PRIORITY 1 — WALL TEXT GEOMETRY: Treat ALL original red wall text lines as ONE rigid typographic composition fixed to ONE physically plausible planar facade surface. Use ONE consistent projective mapping and the same architectural vanishing points for every line. Baselines must be mutually parallel in facade-local coordinates, with consistent leading and a common left alignment axis. Never independently rotate, tilt, warp, bend, raise, lower, skew or reflow the last line or any other line. Preserve ALL Turkish glyphs, punctuation and original line breaks.',
  'PRIORITY 2 — CLEARANCE: Reserve a continuous unobstructed visibility zone around the complete wall text block, including the lowest and longest line. Heads, hair, hands, shoulders, bodies, props, chairs and placards must neither overlap nor touch the lettering. Keep a clearly visible natural gap in the final camera projection, not just in world-space geometry.',
  'PRIORITY 3 — REPOSITION FIGURES, NEVER WORDS: If an overlap is predicted, adjust the positions of people, furniture and placard within their selected left/right foreground or middle-ground region. Respect the requested identity, pose, orientation and physically plausible public-space depth. Move the figure away from the text projection; do not distort any text line to dodge the figure.',
  'PRIORITY 4 — PLAQUE AND PLACARD: The physical sign must remain stable and readable, but subordinate to the facade lettering. Do not allow a sign to obscure a face or any wall text. Preserve exact sign text, alignment and selected owner. Shift sign placement only as needed to avoid collision while retaining its selected holding/mounting mode.',
  'PRIORITY 5 — FIT: If XXL wall text does not fit its reserved facade area, scale the WHOLE wall text block uniformly, or choose a larger unobstructed portion of the SAME selected facade. Do not resize individual lines, split words, alter text or replace the chosen architecture.',
  'PRIORITY 6 — CAMERA LOCK: Preserve the explicitly selected focal length '+state.lens+' mm, camera-to-facade distance '+state.distance+' m, camera viewpoint '+state.camera+', time '+state.time+' and image format '+state.format+'. Earlier auto camera suggestions are informational only and must not override these values. Recompose figures and text within this camera, never silently change lens or distance.',
  'PRIORITY 7 — FINAL CHECK: Before producing the ONE requested photograph, check every wall baseline for shared facade perspective, every figure/placard boundary for clear wall-text separation, the selected camera settings, and exact Turkish lettering. If conflict remains, reduce the entire wall text block uniformly or adjust figure placement, never tilt the final line.',
  'FINAL AUTHORITY: These global geometry and collision rules override any earlier conflicting composition or automatic camera recommendation; all unrelated scene, character, styling and reference instructions remain unchanged.'
 ];
 return base+'\n'+rules.join('\n');
};
const version=document.querySelector('header small');
if(version)version.textContent='PREMIUM STUDIO · V9.9.1';
document.title='BİR.DUVARSESİ V9.9.1';
render();
})();