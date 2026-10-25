/* BIR.DUVARSESI V9.9.13 — automatic placard lettering dominance */
(function(){
'use strict';
const oldPrompt=prompt;
function placardText(){
 if(state.signTextMode==='Ohne Text')return '';
 return String(state.signTextMode==='Wandtext übernehmen'?state.wall:state.signText||'');
}
function placardAuthority(){
 const mode=String(state.signMode||'Kein Plakat');
 const active=mode!=='Kein Plakat';
 const ls=placardText().split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 if(!active||!ls.length)return '\n=== V9.9.13 PLAKAT TEXT FIT ===\nPlacard is disabled or contains no lettering: do not invent placard text or a placard.\n';
 const longest=ls.reduce((a,b)=>[...a].length>=[...b].length?a:b,'');
 const target=ls.length<=4?94:90;
 const margin=((100-target)/2).toFixed(1);
 return '\n=== V9.9.13 MAXIMUM PLAKAT TEXT DOMINANCE — MANDATORY ===\n'+
 'This rule applies only INSIDE the user-selected physical placard. The giant RED WALL TEXT remains the absolute primary visual focus of the full photograph.\n'+
 'PLAKAT TEXT FIT: '+ls.length+' original nonempty lines; longest line '+JSON.stringify(longest)+' ('+[...longest].length+' characters). Target '+target+'% of usable placard face width for the longest line, with narrow positive safety margins of approximately '+margin+'% at left and right and appropriate top/bottom margins. Targets are composition guidance, not pixel-measured guarantees.\n'+
 'MAXIMIZE READABILITY: Use the largest uniform extra-bold condensed editorial block-letter size that fits the ENTIRE original multi-line placard message on its selected placard. Make lettering immediately readable on a smartphone-sized 9:16 Instagram display. Use close compact line spacing without glyph collisions; maximize apparent letter height and usable placard face occupancy. A large blank placard with tiny letters FAILS.\n'+
 'FOUR SHORT LINES: exceptionally monumental letters, occupying as much of the placard as possible. If lines vary in length, fit the longest and keep one consistent font size; do not stretch individual lines or characters. Center text unless the user explicitly selected another alignment.\n'+
 'ABSOLUTE SAFETY: Every original Turkish glyph, punctuation mark, diacritic and original line break must remain intact and fully visible. No clipped characters, cropped words, overlapping rows, poster frame crossing letters, hands or props covering text. Keep slight physical clearance from placard edges.\n'+
 'PRESERVE USER DESIGN: Never alter placard text, per-word or per-line red/white color assignments, placard material, selected size, owner, mount, tilt, pose or position. Do not introduce extra lines, change wording, or replace the poster. If selected size is too small for readability, optimize typography and its safe visible orientation first; never silently override user-selected physical size.\n'+
 'COMPOSITION PRIORITY: The placard must be clearly visible and its lettering legible, but must NOT compete with or occlude the monumental wall text. Keep physical placard and people in the foreground below/outside the facade lettering; retain believable camera depth and existing lens/distance locks.\n'+
 'FINAL QUALITY CHECK: Wall text must dominate the photograph; within the placard, placard text must dominate the placard. If the sign is mostly empty while lettering is small, it fails this instruction.\n'+
 '=== END V9.9.13 PLAKAT DOMINANCE ===\n';
}
prompt=function(){return String(oldPrompt.apply(this,arguments))+placardAuthority()};
})();