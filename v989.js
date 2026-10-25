/* V9.8.9: additive shortcuts and iOS file sharing */
(function(){
const WALL=['ANNEM SOFRADA BİR TABAĞI KALDIRDI.','“NEDEN?” DİYE SORDUM.','','“YİRMİ YILDIR ONU BEKLİYORUM.','ARTIK KENDİME YER AÇACAĞIM.”'].join('\n');
const SIGN=['GELMEYENİ BEKLEME','ÖMRÜNÜ TÜKETME','KENDİ KIYMETİNİ','BİRAZ BİL.'].join('\n');
const OLD='BİR GÜN GELECEK…';
const mark='bds-v989-defaults';
defaults.wall=WALL;defaults.signText=SIGN;defaults.signTextMode='Eigener Plakattext';
V941default.wallOn=true;V941default.signOn=true;
if(!localStorage.getItem(mark)){
 const fresh=!localStorage.getItem(V941KEY);
 if(fresh){V941.wallOn=true;V941.signOn=true;V941save();}
 if(!state.wall||state.wall.startsWith(OLD))state.wall=WALL;
 if(!state.signText){state.signText=SIGN;state.signTextMode='Eigener Plakattext';}
 localStorage.setItem(KEY,JSON.stringify(state));
 localStorage.setItem(mark,'1');
}
// One-time migration for installations where V9.8.9 marked itself complete
// without actually applying the user's requested default texts.
// Preserve the prior values separately so the change is reversible.
const fixMark='bds-v989-text-defaults-fixed-1';
if(!localStorage.getItem(fixMark)){
 const oldValues={wall:state.wall,signText:state.signText,signTextMode:state.signTextMode,wallOn:V941.wallOn,signOn:V941.signOn};
 localStorage.setItem('bds-v989-previous-text-values',JSON.stringify(oldValues));
 state.wall=WALL;
 state.signText=SIGN;
 state.signTextMode='Eigener Plakattext';
 V941.wallOn=true;
 V941.signOn=true;
 localStorage.setItem(KEY,JSON.stringify(state));
 V941save();
 localStorage.setItem(fixMark,'1');
}
function addQuick(){
 const root=document.getElementById('content');
 if(!root)return;
 if(tab==='text'){
  const camera=document.createElement('section');
  camera.className='panel';camera.id='v989Quick';
  camera.innerHTML='<h2>KAMERA · SCHNELLZUGRIFF</h2><p class="hint">Gleiche Werte wie unter 04 BILDREGIE → Kamera.</p>'+
  select('format','Bildformat',['9:16','4:5'])+
  select('time','Tageszeit',['Morgen','Nachmittag','Dämmerung','Nacht','Mitternacht – 00:00','Innenraum'])+
  segment('lens','Brennweite (mm)',['24','28','35','50'])+
  input('distance','Kameraabstand (Meter)','number');
  root.appendChild(camera);
  const panel=document.createElement('section');
  panel.className='panel';panel.id='v989PromptPanel';
  panel.innerHTML='<h2>MASTER-PROMPT · SCHNELLKOPIE</h2><textarea id="v989PromptText" readonly rows="8" style="width:100%;box-sizing:border-box"></textarea><button type="button" class="btn primary" id="v989Copy">MASTER-PROMPT KOPIEREN</button>';
  root.appendChild(panel);
  panel.querySelector('textarea').value=prompt();
 }
 if(tab==='projects'){
  const panel=root.querySelector('.panel');
  if(panel){
   const section=document.createElement('div');section.id='v989Exports';
   section.innerHTML='<h2>DATEIEN SICHERN</h2><p class="hint">Teilen → In Dateien sichern → Ordner auswählen.</p><button type="button" class="btn" id="v989Backup">JSON-BACKUP IN DATEIEN SICHERN</button><button type="button" class="btn" id="v989Project">PROJEKT ALS JSON SICHERN</button><button type="button" class="btn" id="v989Safari">IN SAFARI ÖFFNEN</button>';
   panel.appendChild(section);
  }
 }
}
const oldRender=render;
render=function(){oldRender();addQuick();};
async function shareJSON(filename,object){
 const json=JSON.stringify(object,null,2);
 const file=new File([json],filename,{type:'application/json'});
 if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
  try{await navigator.share({files:[file],title:filename});return;}catch(err){if(err.name==='AbortError')return;}
 }
 download(filename,json,'application/json');
}
document.addEventListener('click',async function(e){
 const id=e.target.closest('button')?.id;
 if(!id||!id.startsWith('v989'))return;
 e.stopImmediatePropagation();
 if(id==='v989Copy')return copyPrompt(prompt());
 if(id==='v989Backup')return shareJSON('BIR_DUVARSESI_BACKUP.json',V970snapshot());
 if(id==='v989Project'){
  const name=(document.getElementById('projectName')?.value||projectName||'Projekt').trim();
  const snapshot=V970snapshot();
  snapshot.projects={[name]:{...state}};
  return shareJSON('BIR_DUVARSESI_PROJEKT.json',snapshot);
 }
 if(id==='v989Safari')window.open('https://sergiobra7.github.io/BDS/','_blank','noopener');
},true);
const versionLabel=document.querySelector('header small');
if(versionLabel)versionLabel.textContent='PREMIUM STUDIO · V9.8.9';
document.title='BİR.DUVARSESİ V9.8.9';
render();
})();