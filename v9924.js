/* V9.9.24 — one authoritative gaze command in exported master prompt */
(function(){
'use strict';
const prior=prompt;
function unifyGaze(source){
 let s=String(source);
 // Delete dedicated, competing gaze paragraphs and line-level instructions.
 s=s.replace(/^GAZE DIRECTOR — NON-NEGOTIABLE:[^\\n]*/gm,'');
 s=s.replace(/^DISTANCE PLANNING[^\n]*/gm,'');
 s=s.replace(/^GLOBAL GAZE(?: LOCK)?:[^\n]*/gm,'');
 s=s.replace(/^GAZE DIRECTOR[^\n]*/gm,'');
 s=s.replace(/^ELDER GAZE:[^\n]*/gm,'');
 s=s.replace(/^FIRST NONEMPTY TEXT LINE:[^\n]*/gm,'');
 // Remove gaze-only clauses embedded in longer pose / authority paragraphs, not the poses.
 const clauses=[
 /Alle Figuren drehen Kopf, Hals und Kinn zum ERSTEN WORT der ERSTEN roten Textzeile\.?\s*/gi,
 /Alle aktiven Figuren drehen Augen, Kopf und Hals zum ERSTEN WORT der ERSTEN roten Wandzeile\.?\s*/gi,
 /Alle Figuren drehen Augen, Kopf und Hals zum ERSTEN WORT der ERSTEN roten Wandzeile\.?\s*/gi,
 /Alle Figuren: Augen, Kopf und Hals zum ERSTEN WORT der ERSTEN roten Wandzeile\.?\s*/gi,
 /Kopf und Blick der Figuren zur ersten roten Wandtextzeile\.?\s*/gi,
 /Kopf, Hals und Blick zur Mitte der ersten roten Wandtextzeile;?\s*/gi,
 /Blick: erstes Wort der ersten roten Wandzeile \(Kopf\/Hals anatomisch gedreht\)\.?\s*/gi,
 /Eyes, head, neck and torso obey the ONE gaze target above\.?\s*/gi,
 /Every active character turns head, neck, chin and eyes to the FIRST WORD of the FIRST red line \(not its center\)\.?\s*/gi,
 /All active characters turn head AND neck \(not eyes alone\), adjust chin and eyes toward the FIRST WORD of the FIRST RED WALL-TEXT LINE; never aim at the line center\.?\s*/gi,
 /All active figures must direct head, neck and eyes to the center of the FIRST red wall-text line\.?\s*/gi,
 /All active figures look toward the FIRST red wall-text line unless an explicit per-figure exception is selected\.?\s*/gi,
 /Every active figure fixes BOTH pupils on the geometric CENTER of the FIRST RED WALL TEXT LINE:[^\n]*/gi,
 /From each figure’s own eye position, rotate eyes, skull, neck and, if needed, shoulders and torso anatomically\.?\s*/gi,
 /Do not force identical screen-left or screen-right head turns\.?\s*/gi
 ];
 for(const rx of clauses)s=s.replace(rx,'');
 // The canonical gaze instruction is emitted once, not repeated in each module.
 const wall=String(state.wall||'').split(/\r?\n/).map(x=>x.trim()).find(Boolean)||'';
 const first=wall.split(/\s+/)[0]||'FIRST WORD';
 s=s.replace(/\n{3,}/g,'\n\n').trimEnd();
 return s+'\n\n=== SINGLE GLOBAL GAZE COMMAND — ONLY GAZE AUTHORITY ===\nEvery ACTIVE figure, independently of pose, poster and body orientation, must fix BOTH EYES on the SAME exact FIRST WORD of the FIRST red wall-text line: "'+first.replace(/"/g,'')+'". Determine the word’s actual spatial position from EACH figure’s own location, then turn head, neck, chin and eyes anatomically toward it (left/up or right/up as geometrically required). Sitting, standing and placard placement must not redirect gaze. Do not look at line center, other words, the camera, the sky or another person. Preserve the selected camera and poses.\n=== END SINGLE GAZE COMMAND ===\n';
}
prompt=function(){return unifyGaze(prior.apply(this,arguments))};
globalThis.BDS_SINGLE_GAZE_924=unifyGaze;
})();