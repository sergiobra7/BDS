/* BİR.DUVARSESİ V9.7.7 — independent manual camera and figure distance controls */
'use strict';
const V977_VERSION='9.7.7';
function V977positive(value,fallback){const n=Number(value);return Number.isFinite(n)&&n>0?n:fallback;}
function V977cameraUI(){
 const cameraManual=V970.cameraMode==='manual', figuresManual=V970.wallDistanceMode==='manual';
 const people=(V941.figures||[]).map((f,i)=>`<label class="label" for="v977Figure${i}">${escapeHTML(f.customName||f.type||'Nebenfigur '+(i+1))} → Schriftwand (m)</label><input id="v977Figure${i}" type="number" min="1" step="0.5" inputmode="decimal" data-v977-figure="${escapeHTML(f.id)}" value="${V977positive(V970.manualFigures?.[f.id]??V970.manualSupport,14)}">`).join('');
 return `<div class="panel" id="v977CameraControls"><h2>MANUELLE KAMERA & ABSTÄNDE · V9.7.7</h2><p class="hint">Zwei unabhängige Schalter. Ohne Haken arbeitet die jeweilige Automatik. Mit Haken gelten deine Werte verbindlich.</p>
 <label class="label"><input id="v977CameraManual" type="checkbox" ${cameraManual?'checked':''}> ✓ Kamera manuell (XY)</label>
 ${cameraManual?`<label class="label" for="v977CameraDistance">Kamera → Schriftwand (m)</label><input id="v977CameraDistance" type="number" min="1" step="0.5" inputmode="decimal" value="${V977positive(state.distance,35)}"><label class="label" for="v977Lens">Brennweite (mm)</label><input id="v977Lens" type="number" min="10" max="200" step="1" inputmode="numeric" value="${V977positive(state.lens,28)}"><p class="hint">Kameraperspektive unten in den bestehenden Kameraoptionen auswählen. Kameraentfernung und Brennweite werden nicht automatisch überschrieben.</p>`:`<p class="hint">Automatische Brennweite: ${V970plan().suggestedLens} mm. Kameraentfernung aktuell: ${escapeHTML(String(state.distance))} m (bestehender Wert).</p>`}
 <label class="label"><input id="v977FiguresManual" type="checkbox" ${figuresManual?'checked':''}> ✓ Figurenabstände manuell (XY)</label>
 ${figuresManual?`<label class="label" for="v977MainDistance">Mann mit Zopf → Schriftwand (m)</label><input id="v977MainDistance" type="number" min="1" step="0.5" inputmode="decimal" value="${V977positive(V970.manualMain,12)}">${people}`:'<p class="hint">REALISM FIRST berechnet die Abstände der Figuren getrennt nach Architektur und Blickwinkel.</p>'}
 <p class="hint">Kamera → Wand und Figur → Wand sind unterschiedliche Entfernungen. Bei unrealistischen manuellen Werten warnt die Geometrieprüfung; sie überschreibt sie nicht.</p></div>`;
}
const V977previousRender=render;
render=function(){V977previousRender();if(tab==='camera'){const content=document.getElementById('content');if(content){content.querySelector('#v977CameraControls')?.remove();content.insertAdjacentHTML('afterbegin',V977cameraUI());}}};
function V977persist(){V970save();localStorage.setItem(KEY,JSON.stringify(state));}
document.addEventListener('change',function(e){const t=e.target;if(!t?.id?.startsWith('v977')&&!t?.dataset?.v977Figure)return;
 if(t.id==='v977CameraManual'){V970.cameraMode=t.checked?'manual':'auto';V977persist();render();return;}
 if(t.id==='v977FiguresManual'){V970.wallDistanceMode=t.checked?'manual':'auto';V977persist();render();return;}
 if(t.id==='v977CameraDistance'){state.distance=V977positive(t.value,V977positive(state.distance,35));}
 if(t.id==='v977Lens'){state.lens=String(V977positive(t.value,V977positive(state.lens,28)));}
 if(t.id==='v977MainDistance'){V970.manualMain=V977positive(t.value,V970.manualMain);}
 if(t.dataset.v977Figure){V970.manualFigures=V970.manualFigures||{};V970.manualFigures[t.dataset.v977Figure]=V977positive(t.value,14);}
 V977persist();render();
});
// Reuse CLEAN CORE as sole prompt authority, explicitly label independent manual controls.
const V977previousPrompt=prompt;
prompt=function(){const base=V977previousPrompt();return base.replace('BİR.DUVARSESİ V9.7.6 — CLEAN CORE','BİR.DUVARSESİ V9.7.7 — CLEAN CORE').replace(/CAMERA: ([^\n]*)/,(_,camera)=>'CAMERA: '+camera+' CAMERA DISTANCE MODE: '+(V970.cameraMode==='manual'?'MANUAL, user value binding':'AUTO, existing scene distance')+'. FIGURE DISTANCE MODE: '+(V970.wallDistanceMode==='manual'?'MANUAL, preserve each exact entered figure-to-wall value':'AUTO, architecture-based geometry')+'.');};
const V977previousExport=V970export;
V970export=async function(){return V977previousExport();};
render();
