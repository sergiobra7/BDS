/* V9.9.17 concrete placard choreography for editorial presets; preserves manual settings */
(function(){
'use strict';
const previous=globalThis.BDS_EDITORIAL_FIGURE_PREVIEW;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function actors(){
 const out=[];
 if(V941.mainEnabled!==false)out.push({id:'main',label:'Mann mit Zopf'});
 for(const f of V941.figures||[])if(f.enabled!==false)out.push({id:String(f.id),label:String(f.type||'Figur')+' · '+String(f.id)});
 return out;
}
function action(r,actors){
 const enabled=V941.signOn!==false&&String(state.signMode||'Kein Plakat')!=='Kein Plakat';
 if(!enabled)return {who:'PLAKAT: DEAKTIVIERT',text:'Kein Plakat darstellen.'};
 const owner=BDS987.posterOwner||'main';
 const actor=actors.find(x=>x.id===owner);
 const who=owner==='none'?'Freistehend, ohne Figur':owner==='custom'?(BDS987.posterWho||'Manuell zugeordnete Person'):(actor?.label||'Plakatbesitzer derzeit nicht aktiv');
 if(BDS987.posterManual)return {who:'PLAKAT → '+who,text:'Manuelle Plakathandlung: '+String(BDS987.posterAction||'Keine Handlung eingetragen')+'. Manuelle Vorgabe unverändert übernehmen.'};
 const pose=actor?actor.id===actors[0]?.id?r.action:actor.id===actors[1]?.id?r.secondary:'Ruhig statisch stehen oder sitzen':'';
 const occupied=/hände hinter|hände in|beide hände|unterarme|verschränkt|gehstock|teeglas|tavla|abgestützt|hände auf/i.test(pose);
 const sitting=/sitz|stuhl|bank|schemel|treppenstufe/i.test(pose);
 let position=BDS987.posterPosition||'auto';
 const mode=String(state.signMode||'');
 if(position==='auto'){
  if(/Über dem Kopf/i.test(mode))position='held';
  else if(/Stuhl/i.test(mode))position='chair';
  else if(/Seitlich gehalten/i.test(mode))position='held';
  else if(sitting)position='chair';
  else position=r.id%4===0?'floor':r.id%4===1?'free':r.id%4===2?'floor':'bank';
 }
 let hand=BDS987.posterHand||'auto';
 if(position==='held'&&hand==='auto')hand=occupied?'none':r.id%3===0?'both':r.id%2===0?'right':'left';
 if(position!=='held')hand='none';
 const placements={
  held:hand==='both'?'Die Figur hält das XXL-Plakat mit BEIDEN Händen stabil vor dem Oberkörper.':hand==='right'?'Die Figur hält das XXL-Plakat mit der RECHTEN Hand seitlich am Rand.':hand==='left'?'Die Figur hält das XXL-Plakat mit der LINKEN Hand seitlich am Rand.':'Plakat soll gehalten werden, aber keine Hand ist verfügbar.',
  floor:'Das XXL-Plakat steht auf einem eigenen stabilen Bodenständer rechts neben der zugeordneten Figur, bis zum Boden.',
  free:'Das XXL-Plakat steht auf eigenem stabilem Fuß links neben der Figur, ohne Handkontakt.',
  bank:'Das XXL-Plakat lehnt sicher an einer tatsächlich vorhandenen Bank neben der Figur, ohne Handkontakt.',
  chair:'Das XXL-Plakat ist sicher am tatsächlich vorhandenen Stuhl befestigt und reicht bis zum Boden, ohne Handkontakt.'
 };
 let text=placements[position]||placements.floor;
 const clash=position==='held'&&(occupied||hand==='none');
 if(clash)text+=' ⚠ HANDKONFLIKT: Die festgelegte Pose bindet die Hände. Bestehende Plakat-Handwahl nicht überschreiben; erst manuell eine kompatible Haltung wählen.';
 if((position==='chair'&&!/stuhl/i.test(pose))||(position==='bank'&&!/bank/i.test(pose)))text+=' Falls kein passender Stuhl oder keine Bank existiert, keine Requisite erfinden: einen stabilen freistehenden Bodenständer verwenden.';
 return {who:'PLAKAT → '+who,text:text+' Plakatfläche zur Kamera, Text vollständig sichtbar. Weder Gesicht noch rote Wandbuchstaben verdecken. Alle Figuren drehen Augen, Kopf und Hals zum ERSTEN WORT der ERSTEN roten Wandzeile.'};
}
function update(){
 if(typeof previous==='function')previous();
 const records=globalThis.BDS_EDITORIAL_130||[],figs=actors();
 document.querySelectorAll('#v9915Editorial button[data-v9915="apply"][data-id]').forEach(b=>{
  const r=records.find(x=>x.id===Number(b.dataset.id));if(!r)return;
  const card=b.closest('.item'),box=card?.querySelector('.v9916-preview');if(!box)return;
  const info=action(r,figs);
  const p=box.querySelector('p:last-child');if(p)p.textContent=info.text;
  const title=[...box.querySelectorAll('strong')].find(x=>x.textContent.includes('PLAKAT'));
  if(title)title.textContent='🪧 '+info.who;
  box.querySelectorAll('p').forEach(x=>{if(x.querySelector('strong')?.textContent.startsWith('FIGUR '))x.append(document.createTextNode(' · Blick: erstes Wort der ersten roten Wandzeile (Kopf/Hals anatomisch gedreht).'))});
 });
}
const oldRender=render;
render=function(){oldRender.apply(this,arguments);update()};
globalThis.BDS_EDITORIAL_FIGURE_PREVIEW=update;
const oldPrompt=prompt;
prompt=function(){
 const base=oldPrompt.apply(this,arguments),records=globalThis.BDS_EDITORIAL_130||[];
 let selection={};try{selection=JSON.parse(localStorage.getItem('bds-v9915-editorial-ui')||'{}')}catch(_){}
 const r=records.find(x=>x.id===selection.selected);if(!r)return base;
 const info=action(r,actors());
 return base+'\n=== V9.9.17 EDITORIAL PLACARD ACTION — PRESERVE USER SELECTIONS ===\n'+info.who+': '+info.text+'\nDo not invent additional placards or alter manually locked sign owner, position, hand, texts or colors. This directive only describes the selected editorial pose with its existing poster.\n';
};
})();