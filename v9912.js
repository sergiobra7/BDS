/* BIR.DUVARSESI V9.9.12 — text utilization & dominance authority */
(function(){
'use strict';
const STORE='bds-v9912-text-utilization';
let util=90;
try{const saved=Number(localStorage.getItem(STORE));if(saved>=75&&saved<=95)util=saved}catch(_){}
function lines(){return String(state.wall||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean)}
function metrics(){
 const ls=lines(),longest=ls.reduce((a,b)=>[...b].length>[...a].length?b:a,'');
 const chars=[...longest].length;
 const shape=String((typeof V988!=='undefined'&&V988.manualShape)||state.layout||'Auto');
 const margin=((100-util)/2).toFixed(1);
 return {ls,longest,chars,shape,margin};
}
function controls(){
 const root=document.getElementById('content');if(!root||!['text','studio','facade','scenes'].includes(tab))return;
 const anchor=root.querySelector('.panel');if(!anchor)return;
 let panel=root.querySelector('#v9912Dominance');
 if(!panel){
 panel=document.createElement('div');panel.className='panel';panel.id='v9912Dominance';
 panel.innerHTML='<h2>MAXIMUM TEXT DOMINANCE · PRIORITÄT 1</h2><label class="label" for="v9912Util">Textausnutzung: <strong id="v9912Value"></strong></label><input id="v9912Util" type="range" min="75" max="95" step="1" style="width:100%;accent-color:#e33244"><p class="hint">90 % Standard · Text so groß wie geometrisch möglich. Gilt für Smart Director, Fassadenfinder und manuelle Szenen. Keine Änderung deiner Kamera- oder Figurenwerte.</p><p id="v9912Detail" class="hint"></p>';
 anchor.insertAdjacentElement('afterend',panel);
 }
 const m=metrics();panel.querySelector('#v9912Util').value=util;panel.querySelector('#v9912Value').textContent=util+' %';
 panel.querySelector('#v9912Detail').textContent=m.ls.length+' Textzeilen · längste Zeile '+m.chars+' Zeichen · seitlicher Sicherheitsrand als Ziel ca. '+m.margin+' % je Seite. Original-Zeilenumbrüche bleiben erhalten.';
}
const oldRender=render;
render=function(){const result=oldRender.apply(this,arguments);controls();return result};
document.addEventListener('input',e=>{
 if(e.target.id!=='v9912Util')return;
 util=Math.min(95,Math.max(75,Number(e.target.value)||90));
 try{localStorage.setItem(STORE,String(util))}catch(_){}
 const value=document.getElementById('v9912Value');if(value)value.textContent=util+' %';
 const m=metrics(),detail=document.getElementById('v9912Detail');
 if(detail)detail.textContent=m.ls.length+' Textzeilen · längste Zeile '+m.chars+' Zeichen · seitlicher Sicherheitsrand als Ziel ca. '+m.margin+' % je Seite.';
},true);
function authority(){
 const m=metrics();
 return '\n=== V9.9.12 FINAL MAXIMUM TEXT DOMINANCE AUTHORITY — HIGHEST VISUAL PRIORITY ===\n'+
 'APPLIES TO EVERY SELECTED SCENE, FACADE, SMART DIRECTOR PROPOSAL, MANUAL FACADE, AND EVERY WALL TEXT FORMAT.\n'+
 'TARGET TEXT UTILIZATION: '+util+'% OF USABLE FACADE WIDTH (longest original red line); reserve approximately '+m.margin+'% on each side of the usable planar text area, and narrow safe clearances at top and bottom. These are image composition targets, not measured guarantees.\n'+
 'EXACT NONEMPTY RED TEXT LINES: '+m.ls.length+'. LONGEST ORIGINAL LINE: '+JSON.stringify(m.longest)+' ('+m.chars+' characters). SELECTED WALL SHAPE: '+m.shape+'.\n'+
 'PRIORITY 1 — RED LETTERING DOMINANCE: Make the red lettering the FIRST and LARGEST visual reading target. Maximize the actual apparent size of all letters in the final 9:16 frame, not merely the physical size of a distant wall. Do NOT treat a giant empty black facade with small red text as maximum dominance.\n'+
 'PRIORITY 2 — ARCHITECTURAL TEXT FIT: On the SAME selected plausible facade, identify the largest continuous planar unobstructed text rectangle. Reserve only slim legible margins. Set the longest line to occupy the target '+util+'% of its usable width, then enlarge the ENTIRE multiline block uniformly as much as both available width and height permit. Preserve one font scale, consistent leading, left alignment, exact words, Turkish diacritics, punctuation, and all original line breaks. Never stretch letters independently, truncate, reflow, or split words.\n'+
 'FOUR-LINE WIDE XXL: Four short lines MUST have visually monumental letter height and strong horizontal occupation; fewer lines mean LARGER letters, not smaller typography. Long multi-line blocks still use the largest physically fitting consistent lettering.\n'+
 'PRIORITY 3 — CAMERA COMPOSITION: Compose and aim the selected viewpoint so the text-bearing facade dominates the image and competing skyline, sky, decorative empty brick, and foreground do not steal visual attention. Reframe and aim within the user-selected camera lens, distance, perspective and photo reference locks. MANUAL CAMERA VALUES ARE IMMUTABLE. If impossible, preserve them and flag the composition conflict rather than silently change them.\n'+
 'PRIORITY 4 — ABSOLUTE COLLISION PROTECTION: Keep every red glyph fully visible with narrow positive margins; no figure, head, hand, placard, prop, roofline or other object may touch or cover any letter. Reposition figures within safe physically accessible areas, not text. Maintain credible depth and perspective.\n'+
 'PRIORITY 5 — FIGURES: People and placards remain visually subordinate and physically separated from the wall. Preserve all user-selected identities, static poses, props, camera settings and poster wording. Every active character turns head, neck, chin and eyes to the FIRST WORD of the FIRST red line (not its center).\n'+
 'FINAL CHECK: If lettering looks small relative to the wall or overall image, the composition has FAILED MAXIMUM TEXT DOMINANCE even if the facade is large. Prefer maximizing facade and red-lettering framing over adding sky or adjacent buildings. Never solve a collision by shrinking text before exhausting valid reframe/figure-placement options.\n'+
 '=== END V9.9.12 TEXT DOMINANCE AUTHORITY ===\n';
}
const oldPrompt=prompt;
prompt=function(){const original=oldPrompt.apply(this,arguments);return String(original)+authority()};
controls();
})();