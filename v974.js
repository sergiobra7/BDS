/* BIR.DUVARSESI V9.7.4 - Director workflow, non-destructive */
'use strict';
if(typeof V973_ASSETS!=='undefined'&&!V973_ASSETS.includes('v974.js'))V973_ASSETS.push('v974.js');
const V974_oldRender=render;
render=function(){
 V974_oldRender();
 if(tab!=='text')return;
 const root=document.getElementById('content');if(!root)return;
 const textarea=root.querySelector('textarea[data-key="wall"]');
 const wallPanel=textarea?.closest('.panel');
 const scene=root.querySelector('#v966Director');
 const editorial=root.querySelector('#v969Director');
 if(!wallPanel||!scene||!editorial)return;
 let realism=root.querySelector('#v974Realism');
 if(!realism){realism=document.createElement('section');realism.className='panel';realism.id='v974Realism';realism.innerHTML=`<h2>3 · REALISM FIRST · WIE WEIT?</h2><p class="hint">Abstand, Blickrichtung und sichere Standorte nach Auswahl von Ort und Figurenkomposition prüfen. Die Abstände sind Planungswerte, keine Bildvermessung. Automatische Regeln gelten auch ohne Klick auf einen Director.</p><p class="hint"><b>Priorität:</b> sichtbarer freier Raum zwischen Figur und Fassade; bei Dachterrassen tatsächlich gegenüberliegende Gebäude. Keine Figuren direkt am Wandfuß. Manuelle Werte bleiben verbindlich.</p><button class="btn" id="v974SpatialSettings" type="button">Abstände und Kamera-Einstellungen öffnen</button>`;}
 wallPanel.insertAdjacentElement('afterend',scene);
 scene.insertAdjacentElement('afterend',editorial);
 editorial.insertAdjacentElement('afterend',realism);
 const title=scene.querySelector('h2');if(title)title.textContent='1 · WO? SMART SCENE DIRECTOR PRO · V9.6';
 const edTitle=editorial.querySelector('h2');if(edTitle)edTitle.textContent='2 · WIE? EDITORIAL IMPACT';
 const hint=editorial.querySelector('p.hint');if(hint)hint.textContent='11 Vorschläge für Posen, Figurenstellung und Plakat. Nur mit Übernehmen aktiv; Ort und manuelle Einstellungen bleiben maßgeblich.';
 const info=document.createElement('p');info.className='hint';info.id='v974ActiveScene';info.textContent='Aktive Szene: '+String(DATA.scenes[state.scene-1]||'Keine')+'. Vorschläge ändern nichts, bis du Übernehmen wählst.';editorial.append(info);
};
document.addEventListener('click',e=>{if(e.target.closest('#v974SpatialSettings')){const b=document.querySelector('[data-tab="camera"]');if(b){b.click();const p=document.getElementById('v970Spatial');if(p)p.scrollIntoView({block:'start'});}else toast('Kamera-Reiter öffnen: dort befinden sich die Abstandseinstellungen.');}});
render();
