/* V9.9.30 — correct wall first-word parsing, per-figure gaze, poster conflicts */
(function(){
'use strict';
const prior=prompt;
function unifyGaze(source){
 let s=String(source);
 // Delete dedicated, competing gaze paragraphs and line-level instructions.
 s=s.split('\n').filter(line=>!line.startsWith('GAZE DIRECTOR — NON-NEGOTIABLE:')).join('\n');
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
 // Resolve one gaze target per active figure, respecting the selected mix mode.
 const wall=String(state.wall||'').split(/\r?\n/).map(x=>x.trim()).find(Boolean)||'';
 const first=wall.split(/\s+/)[0]||'FIRST WORD';
 const wallOn=typeof V941==='undefined'||V941.wallOn!==false;
 const active=[];
 const enabledMain=typeof V941==='undefined'||V941.mainEnabled!==false;
 if(enabledMain)active.push({id:'main',name:'Hauptfigur',gaze:typeof V941!=='undefined'?V941.mainGaze:'Zur Wand'});
 if(typeof V941!=='undefined'&&Array.isArray(V941.figures))V941.figures.filter(f=>f.enabled!==false).forEach(f=>active.push({id:String(f.id),name:f.type+' ('+f.id+')',gaze:f.gaze||'Zur Wand'}));
 const mix=typeof V942!=='undefined'&&V942.mix===true;
 function target(f){
   let v=f.gaze||'Zur Wand';
   if(mix&&V942.gazes&&V942.gazes[f.id])v=V942.gazes[f.id];
   const raw=String(v).toLowerCase();
   if(raw==='camera'||raw.includes('kamera'))return 'camera lens';
   if(raw==='street'||raw.includes('straße'))return 'street';
   if(raw==='sign'||raw.includes('plakat'))return typeof V941!=='undefined'&&V941.signOn?'physical placard':'the selected scene';
   if(raw.includes('hauptfigur'))return enabledMain?'main character':'the selected scene';
   if(raw.includes('nebenfigur'))return active.find(x=>x.id!==f.id&&x.id!=='main')?.name||'the selected scene';
   const match=active.find(x=>x.id===v);
   if(match)return match.name;
   if(raw.includes('auto'))return wallOn?'first word of the first red wall line':'natural scene-specific gaze';
   if(raw==='wall'||raw.includes('wand')||raw.includes('textzeile'))return wallOn?'first word of the first red wall line':'natural scene-specific gaze';
   return wallOn?'first word of the first red wall line':'natural scene-specific gaze';
 }
 const rules=active.map(f=>f.name+': '+target(f)+'.').join('\\n');
 s=s.split('\\n').filter(x=>!x.startsWith('n the geometric CENTER of the FIRST RED WALL TEXT LINE:')).join('\\n');
 // Remove incompatible legacy poster-action prescriptions when they demand opposite hands.
 // Keep actual selected owner, physical sign placement, pose and text from the base prompt.
 const hasLeft=/PLAKAT[^\\n]*LINKEN Hand/i.test(s);
 const hasRight=/FINAL SMART POSTER DIRECTOR[^\\n]*rechten freien Hand/i.test(s);
 if(hasLeft&&hasRight){
   s=s.split('\\n').filter(line=>!line.startsWith('FINAL SMART POSTER DIRECTOR (takes precedence')).join('\\n');
 }
 s=s.replace(/\\n{3,}/g,'\\n\\n').trimEnd();
 return s+'\\n\\n=== INDIVIDUAL GAZE AUTHORITY V9.9.30 — OVERRIDES CONFLICTING GAZE DIRECTIVES ONLY ===\\n'+
 'Apply these per-character gaze targets to ACTIVE figures only. Wall target means the exact FIRST WORD of the FIRST red wall line'+(wallOn?' ("'+first.replace(/"/g,'')+'")':' (wall lettering disabled)')+'.\\n'+rules+'\\n'+
 'From each figure actual eye position and selected camera perspective, establish a plausible eye-to-target vector. Turn eyes, entire head and neck naturally; adjust torso only when anatomically necessary and allowed by the chosen pose. Do not force all figures to share one target or screen direction. Preserve independent pose, furniture, placard ownership, manual position, architecture and camera settings. For wall gaze, the line begins at the first red word on the facade, not in the skyline, the sky, or another building. Each figure must turn its chin, nose bridge and pupils toward that physically located word; looking roughly in the direction of the facade while eyes point elsewhere is incorrect. Only reposition a figure if its positioning is explicitly AUTO and required for plausible anatomy. POSE MIX OFF retains original individual poses and gaze selections. POSE MIX ON respects each explicitly chosen mix gaze. No extra figures.\\n=== END INDIVIDUAL GAZE AUTHORITY ===\\n';

}
prompt=function(){return unifyGaze(prior.apply(this,arguments))};
globalThis.BDS_SINGLE_GAZE_924=unifyGaze;
})();