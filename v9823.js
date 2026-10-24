/* V9.8.2.4 figure visibility and recommendation gates */
'use strict';
const V9823render=render;
render=function(){V9823render();const root=document.getElementById('content');if(!root)return;
 if(tab==='text'){
  const active=(V941.mainEnabled!==false?1:0)+V941.figures.filter(f=>f.enabled!==false).length;
  const e=root.querySelector('#v982Editorial');
  if(e){if(!active){e.querySelector('.list')?.replaceChildren();e.insertAdjacentHTML('beforeend','<p class="hint">Keine Figur aktiv: keine Figuren- oder Pose-Empfehlungen.</p>');}else if(active<2){e.querySelectorAll('[data-v982-pose="4"]').forEach(b=>b.closest('.item')?.remove());}}
 }
};
const V9823oldFigures=V979figures;
V979figures=function(){return V9823oldFigures().filter(f=>f.id==='main'?V941.mainEnabled!==false:V941.figures.find(x=>x.id===f.id)?.enabled!==false);};
render();

/* Figure Director V9.8.2.5: non-destructive, independent pose controls. */
function BDSfigureEditor(){
 const fs=V982activeFigures();
 return '<section class="panel" id="bdsFigureDirector"><h2>FIGURE DIRECTOR · JEDE FIGUR EINZELN</h2><p class="hint">Jede aktive Figur besitzt ihre eigene Körper-, Arm-, Hand-, Bein- und Blickanweisung. Eingaben werden sofort lokal gespeichert; keine andere Figur wird geändert.</p>'+
 fs.map(f=>{const v=V979selected(f.id),g=V979.manualGaze[f.id]||'';
 return '<div class="item" data-bds-figure="'+escapeHTML(f.id)+'"><h3>'+escapeHTML(f.name)+'</h3>'+
 '<label class="check"><input type="checkbox" data-bds-enable="'+escapeHTML(f.id)+'" '+(v.active?'checked':'')+'> Individuelle Pose aktivieren</label>'+
 '<label class="label">Posenname (nur diese Figur)</label><input data-bds-name="'+escapeHTML(f.id)+'" value="'+escapeHTML(v.name||'')+'" placeholder="z. B. Umgekehrter Stuhl">'+
 '<label class="label">Körperhaltung, Arme, Hände, Beine, Position und Bewegung</label><textarea rows="5" data-bds-description="'+escapeHTML(f.id)+'" placeholder="Ausführlich und konkret: sitzt/steht, Schulter, Unterarme, Hände, Beine, Abstand ...">'+escapeHTML(v.description||'')+'</textarea>'+
 '<label class="label">Blickziel (nur diese Figur)</label><input data-bds-gaze="'+escapeHTML(f.id)+'" value="'+escapeHTML(g)+'" placeholder="Erste rote Textzeile, Kopf-/Halsdrehung ...">'+
 '<p class="hint">Die manuelle Blickangabe hat nur für diese Figur Vorrang, wenn sie ausgefüllt ist.</p></div>';
 }).join('')+'</section>';
}
const BDSfigureRender=render;
render=function(){
 BDSfigureRender();
 if(tab!=='text'&&tab!=='poses')return;
 const root=document.getElementById('content');if(!root)return;
 const section=document.createElement('div');section.innerHTML=BDSfigureEditor();
 const anchor=tab==='text'?root.querySelector('#v982Editorial'):null;
 if(anchor)anchor.insertAdjacentElement('afterend',section.firstElementChild);
 else root.insertAdjacentElement('beforeend',section.firstElementChild);
};
function BDSfigurePersist(id,field,value){
 const v=V979selected(id);
 V979.custom[id]={...v,[field]:value};
 V979save();
}
document.addEventListener('input',function(e){
 const t=e.target;
 if(t.dataset.bdsName!==undefined)BDSfigurePersist(t.dataset.bdsName,'name',t.value);
 if(t.dataset.bdsDescription!==undefined)BDSfigurePersist(t.dataset.bdsDescription,'description',t.value);
 if(t.dataset.bdsGaze!==undefined){
   V979.manualGaze[t.dataset.bdsGaze]=t.value;
   V979save();
 }
});
document.addEventListener('change',function(e){
 const t=e.target;
 if(t.dataset.bdsEnable!==undefined){
  BDSfigurePersist(t.dataset.bdsEnable,'active',t.checked);
 }
});
const BDSfigureBasePrompt=prompt;
prompt=function(){
 let p=BDSfigureBasePrompt();
 const fs=V982activeFigures();
 const lines=['FIGURE DIRECTOR — AUTHORITATIVE PER-FIGURE INSTRUCTIONS. Apply each entry ONLY to its named figure. Never copy poses, gestures or gaze between figures.'];
 for(const f of fs){
  const v=V979selected(f.id);
  const isCustom=!!(v.active&&v.description&&v.description.trim());
  const figure=V941.figures.find(x=>x.id===f.id);
  const pose=isCustom?(v.name? v.name+': ':'')+v.description.trim():V976pose(f.id,figure);
  const gaze=(V979.manualGaze[f.id]||'').trim()||(f.id==='main'?V941.mainGaze:figure?.gaze)||'first red text line';
  lines.push('FIGURE ID '+f.id+' ('+f.name+'): POSE: '+pose+'; GAZE: '+gaze+'. Anatomically realistic head and neck rotation, separate hands and forearms, secure footing. No pointing fingers. Other figures must keep their own instructions.');
 }
 lines.push('PRIORITY: These figure-specific instructions supersede any generic group pose or conflicting earlier posture/gaze descriptions. Preserve scene, camera, manual distances, original Turkish texts and all other selections.');
 return p+'\n'+lines.join('\n');
};
render();
