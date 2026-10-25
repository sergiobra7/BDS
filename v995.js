/* BIR.DUVARSESI V9.9.5 — additive first-line gaze geometry lock.
   Does not alter figure settings, poses, projects or stored user data. */
(function(){
'use strict';
const priorPrompt=prompt;
prompt=function(){
 const original=priorPrompt.apply(this,arguments);
 if(!globalThis.V941 || V941.wallOn===false || !String(state.wall||'').trim())return original;
 const firstLine=String(state.wall).split(/\r?\n/).map(s=>s.trim()).find(Boolean)||'';
 const active=[];
 if(V941.mainEnabled!==false)active.push('MAIN CHARACTER (Mann mit Zopf)');
 if(Array.isArray(V941.figures))for(const f of V941.figures){
  if(f&&f.enabled!==false)active.push(String(f.type||'Supporting character')+' ('+String(f.id||'')+')');
 }
 if(state.opa==='Ja'&&!active.some(x=>/opa|dorf|großvater/i.test(x)))active.push('ELDER / OPA (when visible)');
 if(!active.length)return original;
 return original+'\n\n=== V9.9.5 GLOBAL FIRST-LINE GAZE / HEAD-NECK ANATOMY LOCK — FINAL OVERRIDE ===\n'+
 'VISIBLE WALL TEXT FIRST LINE (EXACT TARGET): '+firstLine+'\n'+
 'TARGET: the geometric center of the FIRST VISIBLE RED TEXT LINE on the distant facade, NOT the wall center, NOT the middle of the whole text block, NOT the lower lines.\n'+
 'ACTIVE FIGURES: '+active.join('; ')+'. Each visible person gets a separate sightline calculated from their own eye position to that same elevated target.\n'+
 'MANDATORY HEAD-NECK-EYE CHAIN FOR EACH FIGURE: rotate the cervical spine and neck toward the facade (yaw); incline the neck and head upward to the actual elevation of the first line (pitch); tilt or raise the chin naturally as required; rotate the skull relative to the shoulders; align BOTH pupils and eye gaze along the identical upward sightline. Head turn, neck turn, neck bend, chin elevation and eyes must agree anatomically.\n'+
 'SEATED OR SIDE-ON FIGURES: retain the exact selected seated pose, bench/chair contact, hands, cup and poster contact, body position, costume and character identity. Rotate neck and head independently of the torso, within comfortable anatomical range; if the required turn exceeds natural neck range, subtly rotate shoulders/upper torso while preserving the pose and support. No extreme twisting, dislocated neck, broken posture or staring straight ahead.\n'+
 'PERSPECTIVE: use the actual relative positions of each person, camera and text facade; compensate for low-angle camera, oblique view, height difference and distant wall. A face may be seen in profile or three-quarter rear view if that is necessary for the true sightline. Never turn faces toward the camera merely to show facial features.\n'+
 'PRIORITY: This precise FIRST-LINE gaze instruction supersedes older generic phrases such as "look at wall", "zur Wand", "toward facade" and any automatically generated generic gaze note. It does not override explicit manual pose, figure, poster, camera, scene or wall-text selections.\n'+
 'VISUAL QA BEFORE OUTPUT: for EVERY visible person, trace an imaginary ray from pupils through face orientation toward the center of line 1; verify raised chin and plausible head/neck pitch. Reject/recompose any result where a person looks horizontally, at lower text lines, into empty space, at the camera or toward the ground instead of line 1. No pointing fingers.\n'+
 '=== END V9.9.5 FIRST-LINE GAZE LOCK ===\n';
};
})();