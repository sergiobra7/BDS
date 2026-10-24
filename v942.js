
'use strict';
/* V9.5 additive director layer: V9.4.1 is the source of truth. */
const V942KEY='bds-v942-director';
const V942defaults={mix:false,participants:{main:false,opa:false,donkey:false},roles:{},gazes:{},reactions:{},poses:{},scenario:'',extraParticipants:{}};
let V942={...V942defaults};
try{const v=JSON.parse(localStorage.getItem(V942KEY)||'{}');V942={...V942defaults,...v,participants:{...V942defaults.participants,...(v.participants||{})}}}catch(e){}
const V942tabs=[['text','Text'],['v941sign','Plakat'],['scenes','Szenen'],['v941main','Hauptfigur'],['v941figures','Nebenfiguren'],['v942mix','Posen-Mix'],['camera','Kamera'],['refs','Foto-Lock'],['studio','Studio Pro'],['series','Serie'],['export','Export'],['facade','Fassaden PRO'],['poses','143 Posen'],['preview','Live-Bild'],['projects','Projekte']];
const V942scenarios=[
['wall-all','Alle aktiven Personen betrachten die erste Wandzeile'],
['wall-two','Zwei lesen die Wand, eine weitere Person beobachtet'],
['talk-wall','Zwei Figuren sprechen miteinander, eine liest die Wand'],
['elder-advice','Opa gibt einen Rat, Hauptfigur hört aufmerksam zu'],
['silent','Alle stehen nachdenklich vor der Fassade'],
['sign','Eine aktive Person präsentiert das Plakat, andere reagieren'],
['street','Natürliche Begegnung auf dem gegenüberliegenden Gehweg'],
['donkey','Opa und Esel bilden eine ruhige Alltagsszene']
];
const V942gazeOptions=[['wall','Erste Wandzeile'],['camera','Kamera'],['street','Straße'],['sign','Plakat']];
const V942save=()=>{try{state._v95=JSON.parse(JSON.stringify(V942));localStorage.setItem(V942KEY,JSON.stringify(V942));localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};
function V942people(){
 const people=[['main','Hauptfigur'],['opa','Opa'],['donkey','Esel']];
 V941.figures.forEach(f=>people.push([f.id,`${f.type} (${f.id})`]));
 return people;
}
function V942on(id){return id in V942.participants?!!V942.participants[id]:!!V942.extraParticipants[id]}
function V942active(){return V942people().filter(([id])=>V942on(id))}
function V942options(arr,val){return arr.map(([v,t])=>`<option value="${escapeHTML(v)}" ${String(val)===String(v)?'selected':''}>${escapeHTML(t)}</option>`).join('')}
function V942mixTab(){
 const active=V942active(),sign=V941.signOn;
 const canScenario=(id)=>id==='sign'?sign&&active.length>0:id==='donkey'?active.some(x=>x[0]==='donkey'):id==='elder-advice'?active.some(x=>x[0]==='opa')&&active.some(x=>x[0]==='main'):id==='wall-two'?active.length>=3:id==='talk-wall'?active.length>=3:active.length>0;
 return `<div class="panel"><h2>Posen-Mix · gemeinsame Regie</h2>
 <p class="hint">Zuerst jeden Teilnehmer ausdrücklich aktivieren. Nur ausgewählte Figuren dürfen mitspielen. Einzelposen bleiben gespeichert.</p>
 <label class="v941switch"><input type="checkbox" data-v942="mix" ${V942.mix?'checked':''}><span>Posen-Mix aktivieren</span></label>
 <h3>1 · Teilnehmer auswählen</h3>
 ${V942people().map(([id,label])=>`<label class="v941switch"><input type="checkbox" data-v942-participant="${escapeHTML(id)}" ${V942on(id)?'checked':''}><span>${escapeHTML(label)}</span></label>`).join('')}
 ${!V942.mix?'<p class="hint">Mix AUS: Originalposen in Hauptfigur und Nebenfiguren bleiben aktiv.</p>':''}
 <div ${!V942.mix?'style="opacity:.5;pointer-events:none"':''}>
 <h3>2 · Situationsvorschläge</h3><select data-v942="scenario"><option value="">Freie Regie</option>${V942scenarios.filter(x=>canScenario(x[0])).map(x=>`<option value="${x[0]}" ${V942.scenario===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select>
 <h3>3 · Einzelregie der aktivierten Figuren</h3>
 ${active.length===0?'<p class="hint">Keine Teilnehmer ausgewählt.</p>':''}
 ${active.map(([id,label])=>`<details class="v94details" open><summary>${escapeHTML(label)}</summary>
 <label class="label">Rolle</label><select data-v942-person="${escapeHTML(id)}" data-v942-field="roles">${V942options([['Leser','Liest die Wand'],['Sprecher','Spricht'],['Zuhörer','Hört zu'],['Beobachter','Beobachtet'],['Plakatträger','Hält das Plakat']],V942.roles[id]||'Leser')}</select>
 <label class="label">Pose · Originalbibliothek mit 143 Posen</label><select data-v942-person="${escapeHTML(id)}" data-v942-field="poses"><option value="">Originalpose übernehmen</option>${ALL.map((pose,i)=>`<option value="${i}" ${String(V942.poses[id])===String(i)?'selected':''}>${i+1} · ${escapeHTML(pose)}</option>`).join('')}</select>
 <label class="label">Blickziel</label><select data-v942-person="${escapeHTML(id)}" data-v942-field="gazes">${V942options([...V942gazeOptions.filter(x=>x[0]!=='sign'||sign),...active.filter(x=>x[0]!==id).map(x=>[x[0],`Zu ${x[1]}`])],V942.gazes[id]||'wall')}</select>
 <label class="label">Reaktion</label><select data-v942-person="${escapeHTML(id)}" data-v942-field="reactions">${V942options([['Ruhig','Ruhig'],['Nachdenklich','Nachdenklich'],['Überrascht','Überrascht'],['Ernst','Ernst'],['Zustimmend','Zustimmend'],['Skeptisch','Skeptisch']],V942.reactions[id]||'Ruhig')}</select></details>`).join('')}
 </div><p class="hint">Wenn Mix AN: Einzelposen werden nur für die Ausgabe übersteuert, nicht gelöscht. Kein Plakat bei AUS. Keine inaktiven Teilnehmer im Mix.</p></div>`;
}
const V942oldRender=render;
render=function(){
 if(state._v95 && JSON.stringify(state._v95)!==JSON.stringify(V942)){V942={...V942defaults,...state._v95,participants:{...V942defaults.participants,...(state._v95.participants||{})}};}
 if(tab==='v942mix'){const selectedTab=tab;tab='text';V942oldRender();tab=selectedTab;document.getElementById('content').innerHTML=V942mixTab()}
 else V942oldRender();
 const nav=document.getElementById('tabs');
 const previousScroll=nav.scrollLeft;
 nav.innerHTML=V942tabs.map(([id,label])=>`<button data-tab="${id}" class="${tab===id?'active':''}">${label}</button>`).join('');
 nav.scrollLeft=previousScroll;
 const activeButton=nav.querySelector('button.active');if(activeButton && (activeButton.offsetLeft<nav.scrollLeft || activeButton.offsetLeft+activeButton.offsetWidth>nav.scrollLeft+nav.clientWidth)){activeButton.scrollIntoView({block:'nearest',inline:'nearest'});}
 if(V942.mix&&['poses','v941main','v941figures','cast'].includes(tab)){
  const content=document.getElementById('content');
  content.insertAdjacentHTML('afterbegin','<div class="panel"><strong>Posen-Mix aktiv:</strong> Einzelposen sind für die Bildausgabe pausiert. Gespeicherte Einzelposen bleiben erhalten. <button data-tab="v942mix">Posen-Mix öffnen</button></div>');
 }
};
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.hasAttribute('data-v942-participant')){
  const id=el.dataset.v942Participant;
  if(['main','opa','donkey'].includes(id))V942.participants[id]=el.checked;
  else V942.extraParticipants[id]=el.checked;
  V942save();render();return;
 }
 if(el.hasAttribute('data-v942-person')){
  const id=el.dataset.v942Person,field=el.dataset.v942Field;
  V942[field][id]=el.value;V942save();return;
 }
 if(el.hasAttribute('data-v942')){
  V942[el.dataset.v942]=el.type==='checkbox'?el.checked:el.value;
  V942save();render();
 }
});
const V942oldPrompt=prompt;
prompt=function(){
 const original=V942oldPrompt();
 const participants=V942active();
 const sign=V941.signOn;
 if(!V942.mix)return 'BİR.DUVARSESİ V9.5 — ORIGINAL V9.4.1 + V10 NAVIGATION\nPOSE MIX: OFF. Preserve original individual pose settings.\n\n'+original;
 const scenario=V942scenarios.find(x=>x[0]===V942.scenario && (x[0]!=='sign'||sign) && (x[0]!=='donkey'||participants.some(p=>p[0]==='donkey')) && (x[0]!=='wall-two'||participants.length>=3) && (x[0]!=='talk-wall'||participants.length>=3));
 const dirs=participants.map(([id,label])=>{
  const gaze=V942.gazes[id]||'wall';
  const validGaze=gaze==='sign'&&!sign?'wall':(!['wall','camera','street','sign'].includes(gaze)&&!participants.some(p=>p[0]===gaze))?'wall':gaze;
  const pose=V942.poses[id]!==undefined && V942.poses[id]!=='' ? ALL[Number(V942.poses[id])] : null;
  return `${label}: role=${V942.roles[id]||'Leser'}; pose=${pose||'retain original individual pose'}; gaze=${validGaze==='wall'?'exact center of FIRST red text line':validGaze==='camera'?'camera':validGaze==='street'?'street':validGaze==='sign'?'physical sign':`toward ${participants.find(x=>x[0]===validGaze)?.[1]||'wall'}`}; reaction=${V942.reactions[id]||'Ruhig'}.`;
 });
 return `BİR.DUVARSESİ V9.5 — MIX DIRECTOR OVERRIDE
PRIORITY: This block overrides conflicting original pose, elder/donkey and gaze instructions below, without changing the 55-scene architecture catalog, 143-pose library, exact text, identity locks or photo settings.
MIX ENABLED. DO NOT FOLLOW ANY CONTRADICTORY FIGURE-ENABLE INSTRUCTIONS BELOW. ONLY THESE EXPLICITLY SELECTED CHARACTERS PARTICIPATE: ${participants.map(x=>x[1]).join(', ')||'NONE'}.
DO NOT INCLUDE ANY UNSELECTED CHARACTER, ELDER, DONKEY, OR EXTRA PERSON IN THE STAGED ENSEMBLE. Generic distant anonymous passersby may remain only if original street activity allows them.
SCENE RECOMMENDATION: ${scenario?.[1]||'Natural interaction chosen for selected participants'}.
${dirs.join('\n')}
${sign?'SIGN ON: Apply original physical sign controls; only active characters can hold it.':'SIGN OFF: No placard or placard-specific choreography.'}
Preserve plausible body posture, hands, eye contact, neck and torso anatomy. For wall gaze, target the FIRST red line.
--- FULL ORIGINAL V9.4.1 PROMPT FOLLOWS, WITH MIX OVERRIDES ABOVE ---
${original}`;
};
render();
