(function(){'use strict';
const KEY='bds-smart-poster-918';let settings={mode:'auto',owner:'auto'};
try{settings={...settings,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}
function cast(){return [...(V941.mainEnabled!==false?[{id:'main',label:'Mann mit Zopf'}]:[]),...(V941.figures||[]).filter(f=>f.enabled!==false).map(f=>({id:String(f.id),label:String(f.type)+' · '+String(f.id)}))]}
function pose(r,i){return i===0?r.action:i===1?r.secondary:'Ruhig stehen mit Abstand'}
function busy(p){return /hände hinter|hände in|beide hände|unterarme|verschränkt|gehstock|teeglas|abgestützt|hände auf/i.test(p)}
function stage(r){
if(settings.mode==='off'||V941.signOn===false||state.signMode==='Kein Plakat')return ['PLAKAT: DEAKTIVIERT','Kein Plakat erzeugen'];
const figs=cast(),manual=settings.mode==='manual'||BDS987.posterManual;
let id=manual?(BDS987.posterOwner||'main'):settings.owner;
if(id==='auto')id=figs.find((f,i)=>!busy(pose(r,i)))?.id||figs[0]?.id||'none';
let idx=figs.findIndex(f=>f.id===id);if(idx<0&&id!=='none'){idx=0;id=figs[0]?.id||'none'}
const p=idx<0?'':pose(r,idx),name=id==='none'?'Freistehend':figs[idx]?.label||'Keine Figur';
if(manual)return ['PLAKAT → '+name,'MANUELL: '+(BDS987.posterManual?BDS987.posterAction:'Position '+BDS987.posterPosition+', Hand '+BDS987.posterHand)+'. Manuelle Auswahl unverändert; Handkonflikte nicht verdecken.'];
let action='';
if(id==='none')action='XXL-Plakat freistehend auf stabilem Bodenständer; kein Handkontakt.';
else if(/bank/i.test(p))action='XXL-Plakat freistehend NEBEN der vorhandenen Bank auf Bodenständer; kein Handkontakt.';
else if(/stuhl/i.test(p))action='XXL-Plakat am vorhandenen Stuhl sicher befestigt, bis zum Boden; kein Handkontakt.';
else if(/sitz|schemel|stufe/i.test(p)||busy(p))action='XXL-Plakat freistehend neben der Figur auf stabilem Bodenständer; kein Handkontakt.';
else if(r.poster==='required'&&r.id%3===0)action='XXL-Plakat mit beiden freien Händen am Rand vor dem Oberkörper halten.';
else if(r.poster==='required'&&r.id%3===1)action='XXL-Plakat seitlich mit der rechten freien Hand halten.';
else action='XXL-Plakat freistehend neben der Figur auf Bodenständer; kein Handkontakt.';
return ['PLAKAT → '+name,action+' Plakatfläche zur Kamera; Schrift groß und vollständig lesbar. Keine Gesichter oder rote Wandbuchstaben verdecken. Alle Figuren: Augen, Kopf und Hals zum ERSTEN WORT der ERSTEN roten Wandzeile.'];
}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function update(){
const root=document.getElementById('v9915Editorial');if(!root)return;
root.querySelector('#smart918')?.remove();
const el=document.createElement('div');el.id='smart918';el.className='panel';
el.innerHTML='<strong>🪧 SMART POSTER DIRECTOR</strong><label class="label">Plakat-Regie</label><select id="smart918mode"><option value="auto">SMART AUTO</option><option value="manual">MANUELL</option><option value="off">OHNE PLAKAT</option></select><label class="label">Plakat bei wem?</label><select id="smart918owner"><option value="auto">Automatisch passende aktive Figur</option>'+cast().map(f=>'<option value="'+esc(f.id)+'">'+esc(f.label)+'</option>').join('')+'<option value="none">Freistehend / niemand</option></select>';
root.prepend(el);el.querySelector('#smart918mode').value=settings.mode;el.querySelector('#smart918owner').value=settings.owner;el.querySelector('#smart918owner').disabled=settings.mode!=='auto';
for(const b of root.querySelectorAll('button[data-v9915="apply"]')){const r=(globalThis.BDS_EDITORIAL_130||[]).find(x=>x.id===Number(b.dataset.id));const box=b.closest('.item')?.querySelector('.v9916-preview');if(!r||!box)continue;const [who,what]=stage(r);const t=[...box.querySelectorAll('strong')].find(x=>x.textContent.includes('PLAKAT'));if(t)t.textContent='🪧 '+who;const ps=box.querySelectorAll('p');if(ps.length)ps[ps.length-1].textContent=what}
}
const oldRender=render;render=function(){oldRender.apply(this,arguments);update()};
document.addEventListener('change',e=>{if(e.target.id==='smart918mode'||e.target.id==='smart918owner'){settings[e.target.id==='smart918mode'?'mode':'owner']=e.target.value;localStorage.setItem(KEY,JSON.stringify(settings));render()}});
const oldPrompt=prompt;prompt=function(){const base=oldPrompt.apply(this,arguments);let x={};try{x=JSON.parse(localStorage.getItem('bds-v9915-editorial-ui')||'{}')}catch(e){}const r=(globalThis.BDS_EDITORIAL_130||[]).find(r=>r.id===Number(x.selected));if(!r)return base;const [who,what]=stage(r);return base+'\nFINAL SMART POSTER DIRECTOR (takes precedence over earlier poster AUTO directions): '+who+'. '+what+' Do not modify saved manual settings or generate extra placards.\n'};
globalThis.BDS_SMART_POSTER_918=stage;
})();