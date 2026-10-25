/* BDS V9.9.25: global opposite-side staging for every editorial action. */
(function(){
'use strict';
const previous=prompt;
function addStaging(p){
 let s=String(p);
 const wall=String(state.wall||'').split(/\r?\n/).map(v=>v.trim()).find(Boolean)||'';
 const first=(wall.split(/\s+/)[0]||'FIRST WORD').replace(/"/g,'');
 const directive=[
 '=== GLOBAL OPPOSITE-SIDE SCENE DIRECTOR V9.9.25 ===',
 'APPLIES TO ALL SCENES, ALL ACTIVE CHARACTERS AND ALL EDITORIAL ACTIONS, INCLUDING ALL PRESETS AND FUTURE PRESETS.',
 'DETERMINE THE ACTUAL SCREEN-SIDE OF THE RED TEXT-BEARING FACADE IN THE FINAL SELECTED CAMERA COMPOSITION. DO NOT GUESS THE SIDE FROM THE CITY OR SCENE NAME.',
 'FACADE ON SCREEN-RIGHT: place ALL active characters in distinct safe public foreground positions toward SCREEN-LEFT / LOWER-LEFT, opposite the facade.',
 'FACADE ON SCREEN-LEFT: place ALL active characters in distinct safe public foreground positions toward SCREEN-RIGHT / LOWER-RIGHT, opposite the facade.',
 'FACADE CENTERED: choose whichever lower foreground side offers real safe ground and clear visibility, then place characters separately there.',
 'Separate characters by plausible lateral and depth offsets. Do not line them up, overlap them, or force matching positions. Preserve each character’s selected individual sitting, standing or leaning pose, action, body orientation, clothing, props, furniture and hand placement. Do not turn a seated character into a standing one.',
 'ALL characters fix BOTH EYES on the FIRST WORD of the FIRST red wall-text line: "'+first+'". Determine the actual direction independently from EACH character’s position. Rotate head, neck and chin naturally; allow ONLY the minimum shoulder and upper-body adjustment needed for plausible gaze. Do not synchronize body poses.',
 'Preserve manually selected focal length, camera distance, camera perspective, aspect ratio, wall typography and placard settings. Never silently move the camera or change lens to solve staging.',
 'Only use existing physically accessible safe foreground. If a locked original photo, fixed placement, narrow street or inaccessible rooftop makes opposite-side placement impossible, preserve those constraints and report the conflict in the exported prompt; never invent ground or overwrite manual locks.',
 'Do not let characters or placards overlap the wall text.',
 '=== END GLOBAL OPPOSITE-SIDE DIRECTOR ==='
 ].join('\n');
 // Replace the prior canonical gaze block rather than add a second gaze authority.
 const start=s.indexOf('=== SINGLE GLOBAL GAZE COMMAND — ONLY GAZE AUTHORITY ===');
 const end=s.indexOf('=== END SINGLE GAZE COMMAND ===');
 if(start>=0&&end>start)s=s.slice(0,start)+s.slice(end+'=== END SINGLE GAZE COMMAND ==='.length);
 return s.trimEnd()+'\n\n'+directive+'\n';
}
prompt=function(){return addStaging(previous.apply(this,arguments))};
globalThis.BDS_OPPOSITE_SIDE_925=addStaging;
})();