/* V9.6.1 stability fixes: persistent disclosure state, reversible pose filters, anatomical wall gaze. */
const V961disclosures = new Map();
// Initial default group remains available; a second tap clears the active filter.
const V961render = render;
function V961path(node,root){const out=[];for(let p=node;p&&p!==root;p=p.parentElement){const i=Array.prototype.indexOf.call(p.parentElement?.children||[],p);out.unshift(i)}return out.join('.');}
render=function(){
 const root=document.getElementById('content');
 if(root){root.querySelectorAll('details').forEach(d=>V961disclosures.set(tab+'|'+V961path(d,root),d.open));}
 V961render();
 const fresh=document.getElementById('content');
 if(fresh)fresh.querySelectorAll('details').forEach(d=>{const k=tab+'|'+V961path(d,fresh);if(V961disclosures.has(k))d.open=V961disclosures.get(k)});
};
document.addEventListener('toggle',e=>{if(e.target.matches?.('#content details')){const root=document.getElementById('content');V961disclosures.set(tab+'|'+V961path(e.target,root),e.target.open)}},true);
// A selected filter is a toggle: tapping it again returns to the complete pose list.
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-group="pose"]');if(!b)return;if(poseGroup===b.dataset.val){e.stopImmediatePropagation();poseGroup='';render();}},true);
const V961prompt=prompt;
prompt=function(){
 const first=(state.wall||'').split(/\r?\n/).find(x=>x.trim())||'FIRST RED WALL TEXT LINE';
 const target=JSON.stringify(first.trim());
 const mainWall=V941.mainGaze==='Zur Wand'||V941.mainGaze==='Automatisch'||V941.mainGaze==='Automatisch passend zur Szene'||V941.mainGaze==='Erste Textzeile';
 const parts=[
 'BİR.DUVARSESİ V9.6.1 — ANATOMICAL HEAD AND NECK DIRECTION OVERRIDE',
 'This instruction has the highest priority for head orientation; do not confuse eye gaze with head orientation.',
 `FIRST LINE TARGET: ${target}. This is the physical target on the wall, not the camera or an imaginary point.`,
 mainWall?'MAIN CHARACTER MANDATORY WALL GAZE: Rotate the entire HEAD and NECK physically and visibly toward the FIRST RED LINE. Eyes, nose axis, chin, head yaw and cervical spine must all point toward the real wall target. Body and shoulders may remain side-on or seated, but the head must visibly turn independently of the torso.':'MAIN CHARACTER: Respect the explicitly chosen non-wall gaze direction; do not override it with a wall gaze.',
 'AUTOMATIC MEANS WALL READING: If main gaze is Automatisch passend zur Szene, default to actively reading the first red wall text line, not looking into the camera or straight ahead. This automatic wall target is mandatory unless the user explicitly selected a different non-wall target.',
 'AUTOMATIC HEAD DIRECTOR: For every character with gaze set to Automatic, Wall, Zur Wand or First text line, compute the physically correct left/right head rotation from the character position to the first wall line. If lettering is high above eye level, include a realistic upward neck tilt. If wall is to the left, turn head left; if to the right, turn head right.',
 'SIDE-ON POSE ANATOMY: A side-facing body must keep its body direction and naturally turn the cervical spine and skull toward the wall. The ear, nose bridge, chin and eyes should visibly reorient together; do not turn only the pupils. If a character is facing away from the wall, rotate head and upper neck within natural human limits and adjust shoulder angle only as needed. Never force a 180-degree neck twist.',
 'NO FALSE GAZE: No camera-facing face, no staring straight ahead, no eyes-only sideways glance, no face turned away from the facade when wall gaze is selected. No unnatural twisted neck, reversed anatomy or dislocated shoulders.',
 'POSE COMPATIBILITY: Enforce the same rule for backward-chair sitting, relaxed bench poses, standing, walking, rooftop terraces, profile and three-quarter viewpoints. Preserve the selected pose while anatomically rotating head and neck toward the text.',
 'COMPOSITION CHECK: Position the camera and character so that the actual head/neck turn toward the first wall line is visually unmistakable, without obscuring the face or red lettering. If physically impossible, adjust character placement or camera angle instead of breaking the gaze rule.',
 'Apply this gaze override to all independently controlled supporting figures ONLY when their individual gaze setting targets the wall; preserve explicit non-wall gaze choices.',
 '--- ORIGINAL V9.6 PROMPT BELOW ---',V961prompt()
 ];return parts.join('\n');
};
