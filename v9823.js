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


/* V9.0-inspired Premium Director: detailed automatic figure choreography. */
const BDS_PREMIUM_KEY='bds-premium-v90';
let BDSPremiumEnabled=true;
try{BDSPremiumEnabled=localStorage.getItem(BDS_PREMIUM_KEY)!=='off';}catch(_){}
const BDSactions=[
 ['Rückwärts auf Stuhl','Sitzt rückwärts auf einem stabilen Holzstuhl, beide Unterarme getrennt auf der Rückenlehne, Oberkörper leicht vorgebeugt, beide Füße auf dem Boden; Hände entspannt, Schultern locker.'],
 ['Bank und angewinkeltes Bein','Sitzt auf einer stabilen Holzbank, ein Knie natürlich angewinkelt, das andere Bein nach vorne ausgestreckt, ein Unterarm auf dem angewinkelten Knie, die andere Hand am Bankrand.'],
 ['Teeglas in der Hand','Sitzt auf einer Bank, hält ein kleines türkisches Teeglas sicher mit einer Hand, der andere Unterarm liegt locker auf dem Oberschenkel, Füße stabil auf dem Boden.'],
 ['Stehend mit Manteltaschen','Steht seitlich versetzt, Gewicht auf einem Bein, beide Hände locker in den Manteltaschen, Oberkörper leicht zur Fassade gedreht.'],
 ['Bank und Ellenbogen','Sitzt leicht vorgebeugt auf einer Bank, Ellenbogen auf den Knien, Hände getrennt und locker, beide Schuhsohlen am Boden.'],
 ['An sichere Brüstung gelehnt','Steht im öffentlichen Vordergrund, ein Unterarm auf einer stabilen niedrigen Brüstung, die andere Hand in der Jackentasche, Beine natürlich versetzt.'],
 ['Seitlich auf Stuhl','Sitzt seitlich auf einem stabilen Stuhl, eine Hand auf der Lehne, der andere Unterarm auf dem Oberschenkel, Füße auf sicherem Boden.'],
 ['Auf Treppenstufe','Sitzt auf einer breiten trockenen Stufe, ein Knie höher als das andere, Unterarme getrennt auf den Beinen, Blick zur Schrift.'],
 ['Im Gehen innehalten','Steht nach einem langsamen Schritt still, ein Fuß leicht vorne, beide Arme in natürlicher Ruheposition, Oberkörper zur Schrift gedreht.'],
 ['Stuhl und ausgestrecktes Bein','Sitzt auf einem stabilen Stuhl, ein Bein leicht nach vorn ausgestreckt, das andere angewinkelt, beide Hände natürlich auf Lehne und Oberschenkel.'],
 ['Kaffeepause','Steht entspannt mit einem Becher in einer Hand, die andere Hand in der Jackentasche, Füße leicht versetzt.']
];
function BDSautoPose(index,position,figures){
 const base=V982proposal(index,position,figures);
 const source=BDSactions[(index*3+position*5)%BDSactions.length];
 const isElder=position>0&&/opa|dede|elder|yaşlı|älter|opa/i.test(figures[position]?.name||'');
 const detail=(isElder&&index%3===0?BDSactions[2]:source);
 return {name:base.name+' · '+detail[0],description:detail[1]+' Kopf und Hals anatomisch plausibel zur geometrischen Mitte der ERSTEN roten Textzeile drehen; beide Augen folgen demselben Blickvektor. Die Pose bleibt unabhängig von allen anderen Figuren. Kein Zeigefinger, keine verschmolzenen Hände oder Arme.'};
}
const BDSoldEditorial=V982editorialUI;
V982editorialUI=function(){
 if(!BDSPremiumEnabled)return BDSoldEditorial();
 const figures=V982activeFigures();
 const cards=V982_POSES.map((p,i)=>({p,i})).filter(x=>x.i!==4||figures.length>=2).map(({p,i})=>
 '<div class="item"><strong>Variante '+(i+1)+' · '+escapeHTML(p[0])+'</strong>'+
 figures.map((f,j)=>{const a=BDSautoPose(i,j,figures);return '<p class="hint"><b>'+escapeHTML(f.name)+':</b> '+escapeHTML(a.description)+'</p>';}).join('')+
 '<button type="button" class="small" data-bds-auto="'+i+'">Alle individuellen Posen übernehmen</button></div>').join('');
 return '<section class="panel" id="v982Editorial"><h2>PREMIUM DIRECTOR V9.0 · AUTOMATISCHE FIGURENREGIE</h2><p class="hint">Ein Klick: jede aktive Figur erhält eine eigene konkrete Körperhaltung, Arme, Hände, Beine und Blickgeometrie. Danach einzeln editierbar. Keine vorhandenen Projekte werden zurückgesetzt.</p><label class="check"><input type="checkbox" data-bds-premium checked> Premium Director aktiv</label><div class="list">'+(cards||'<p class="hint">Keine aktive Figur</p>')+'</div></section>';
};
const BDSoldRenderPremium=render;
render=function(){
 BDSoldRenderPremium();
 if(tab!=='text')return;
 const e=document.getElementById('v982Editorial');
 if(e&&!e.querySelector('[data-bds-premium]'))e.insertAdjacentHTML('afterbegin','<label class="check"><input type="checkbox" data-bds-premium '+(BDSPremiumEnabled?'checked':'')+'> V9.0 Premium Director aktivieren</label>');
};
document.addEventListener('change',function(e){
 if(e.target.dataset.bdsPremium!==undefined){
  BDSPremiumEnabled=e.target.checked;
  try{localStorage.setItem(BDS_PREMIUM_KEY,BDSPremiumEnabled?'on':'off');}catch(_){}
  render();
 }
});
document.addEventListener('click',function(e){
 const b=e.target.closest('button[data-bds-auto]');if(!b)return;
 const index=Number(b.dataset.bdsAuto),figures=V982activeFigures();
 if(!figures.length)return;
 V982.undo={custom:structuredClone(V979.custom),editorial:V982.editorial};
 figures.forEach((f,j)=>{
  const v=V979selected(f.id),a=BDSautoPose(index,j,figures);
  V979.custom[f.id]={...v,name:a.name,description:a.description,active:true};
 });
 V982.editorial=index;V979save();V982save();render();
 toast('Detaillierte Posen für '+figures.length+' Figuren übernommen');
});
const BDSbeforePremiumPrompt=prompt;
prompt=function(){
 const p=BDSbeforePremiumPrompt();
 if(!BDSPremiumEnabled)return p;
 const first=String(state.wall||'').split('\n').find(x=>x.trim())||'';
 const out=[
 'PREMIUM DIRECTOR V9.0 — FULL DOCUMENTARY FIGURE AND SCENE CHOREOGRAPHY',
 'VISUAL PRIORITY: A believable single real-life photograph, never CGI or composite. Monumental authentic facade, genuine open-space separation, foreground figures grounded in the same physical scene. Do not enlarge figures by collapsing real distance.',
 'CAMERA: Respect the selected focal length, low/other viewpoint, distance and framing; natural full-frame perspective, physically consistent body and architecture scale. Preserve all manual locks.',
 'FIRST RED WALL LINE: '+first,
 'SMART GAZE DIRECTOR: For every figure instructed to read the wall, establish a distinct geometrically plausible eye-to-FIRST-line vector from its actual position. Rotate BOTH EYES, nose, whole head and neck naturally toward that first line; never substitute the camera, another figure or the lower text lines.',
 'INDEPENDENT POSE DIRECTOR: Preserve the selected detailed individual pose for each figure. Different characters must not mirror one another. Keep anatomically believable hand contact, knees, feet, chair support, body weight, fingers and facial microtexture. Avoid pointing fingers.',
 'SCENE RELATIONSHIP: When a seated elder and a seated main man are present, let them share a credible social moment without forcing matching poses. Authentic rustic furniture and Turkish tea glasses only where appropriate and consistent with chosen props and scene. Never invent extra people or props against selected settings.',
 'PHYSICAL PLACARD: If enabled, render exactly one stable, physically supported placard in its selected position, with correct contact to ground or furniture and readable exact original text. If disabled, no placard.',
 'STRICT EXCLUSIONS: No visible lamps, streetlights, mounted fixtures, floodlights, flags, religious buildings, artificial plastic skin, floating props, merged limbs or additional readable signage. Night scenes must remain genuinely dark using plausible diffuse OFF-CAMERA ambient light.',
 'FINAL PREMIUM QUALITY GATE: One native '+state.format+' documentary photograph; preserve exact Turkish lettering and intentional line breaks, independent figure poses, individual gaze geometry, authentic architecture and all manual settings.'
 ];
 return p+'\n'+out.join('\n');
};
render();

/* Release label V9.8.3; keep existing state and project data unchanged. */
const BDS983render=render;
render=function(){BDS983render();document.title='BİR.DUVARSESİ V9.8.3';const h=document.querySelector('header small');if(h)h.textContent='PREMIUM STUDIO · V9.8.3';const x=document.querySelector('#v979Export h2');if(x)x.textContent=x.textContent.replace(/V9\.8\.2\.4/g,'V9.8.3');};
render();

/* V9.8.4 — 200 additive four-line architecture presets and consolidated gaze direction.
   No storage clearing, no replacement of prior scenes, poses, photos or projects. */
const BDS984_VERSION='9.8.4';
const BDS984_ROWS="Industrie & Monumental~Zechen-Kohlenwäsche|Kokerei-Seitenfassade|Maschinenfabrik|Stahlwerkshalle|Backstein-Kraftwerk|Walzwerk|Gasometer-Vorplatz|Textilfabrik|Industriespeicher|Lokomotivdepot|Fabrikkomplex|Gießerei-Innenhof|Kanal-Industriehalle|Papierfabrik|Lagerhalle|Brauereifassade|Maschinenhalle|Spinnerei|Hafenwerkstatt|Werfthalle|Ziegelfabrik|Fabrik an Bahngleisen|Produktionshalle|Industriearkade|Hochofen-Seitenfassade~Essen|Dortmund|Duisburg|Oberhausen|Gelsenkirchen|Bochum|Oberhausen|Krefeld|Münster|Hagen|Wuppertal|Solingen|Herne|Düren|Düsseldorf|Köln|Chemnitz|Zwickau|Hamburg|Kiel|Bremen|Hannover|Magdeburg|Berlin|Duisburg\nHafen & Ufer~Speicherstadt-Kanalfront|Hafenspeicher|Hafenbecken-Lagerhaus|Kaianlage|Fischereihafen|Werft vom öffentlichen Ufer|Rheinhafenspeicher|Rheinufer-Industriefassade|Hafenpromenade mit Kran|Zollgebäude|Trave-Lagerhaus|Mainspeicher|Hafenmauer|Hafenplatz mit Hallen|Dockhallen|Kanalspeicher|Alte Dockfront|Hafenspeicher am Fluss|Kaispeicher|Hafenterrasse|Handelshafen|Hafenlagerkomplex|Uferpromenade mit Speicher|Historische Hafenmauer|Galata-Uferfassade~Hamburg|Bremen|Duisburg|Lübeck|Bremerhaven|Rostock|Köln|Düsseldorf|Mannheim|Emden|Lübeck|Frankfurt|Mainz|Rotterdam|Liverpool|Amsterdam|Glasgow|Antwerpen|Rouen|Marseille|Genua|Triest|Thessaloniki|İzmir|Istanbul\nBahn & Verkehr~Bahnhof-Seitenfassade|Bahnhofsvorplatz|Güterbahnhof|Bahnbetriebswerk|Bahnhofsarkaden|Güterhalle|Eisenbahnviadukt|Brückenunterführung|Straßenbahndepot|Bahnhofslagerhalle|Bahnviadukt am Fluss|Historischer Kopfbahnhof|Bahnwerkstatt|Backstein-Depot|Bahnhofshalle-Außenplatz|Historischer Bahnhofskomplex|Gemauerter Brückenpfeiler|Zugdepot|Tramdepot|Bahnwerkstatt am Hafen|Historischer Zugdepot-Hof|Bahnwerkstatt-Innenhof|Bahnhofsmauer|Eisenbahnviadukt am Hafen|Monumentale Bahnhofsseitenwand~Leipzig|Hannover|Berlin|Dresden|Hamburg|Bremen|Wuppertal|Köln|Düsseldorf|Frankfurt|Prag|Budapest|Wien|Warschau|Mailand|Paris|London|Manchester|Lissabon|Porto|Istanbul|Eskişehir|Ankara|İzmir|Konya\nPlätze & Großfassaden~Rathausplatz-Seitenfassade|Marktplatz-Backsteinbau|Messevorplatz|Industriehallenplatz|Kulturzentrum-Seitenwand|Stadtplatz-Verwaltungsbau|Fabrik-Innenhof|Ausstellungshallenplatz|Kongresszentrum-Vorplatz|Messefreifläche|Kulturquartier-Fabrikfassade|Ziegelbau-Platz|Historischer Messeplatz|Kulturgebäude-Vorplatz|Lagerhaus-Platz|Industriebau-Stadtplatz|Kulturplatz-Seitenfassade|Ausstellungsquartier|Industrieplatz|Kulturhof|Krakauer Stadtplatz|Fabrikquartier-Terrasse|Großzügiger Kulturplatz|Historischer Stadtplatz|Turiner Fabrikplatz~Hamburg|Bremen|Hannover|Essen|Dortmund|Münster|Leipzig|Berlin|Frankfurt|Köln|Chemnitz|Nürnberg|Leipzig|Stuttgart|Amsterdam|Rotterdam|Antwerpen|Wien|Prag|Budapest|Krakau|Barcelona|Madrid|Turin|Düsseldorf\nCampus & Kultur~Backstein-Auditorium|Hochschulhof|Campusbibliothek|Universitätsplatz|Museumsquartier|Industriemuseum|Ausstellungshalle|Backsteinbibliothek|Hochschul-Innenhof|Produktionshalle-Museum|Fabrik-Kunstzentrum|Campus-Institutsfassade|Industriemuseum-Hof|Museum-Seitenflügel|Hochschul-Ziegelbau|Depot-Kulturzentrum|Hafenspeicher-Museum|Universitäts-Backsteinbau|Industriekunstzentrum|Kulturhalle|Ausstellungshaus-Hof|Kulturfabrik|Universitäts-Innenhof|Industrie-Kunsthalle|Historischer Hochschulhof~Bochum|Dortmund|Münster|Hannover|Essen|Duisburg|Köln|Hamburg|Bremen|Leipzig|Berlin|Dresden|Chemnitz|Frankfurt|Karlsruhe|Amsterdam|Rotterdam|London|Manchester|Glasgow|Paris|Lyon|Bologna|Mailand|Istanbul\nTürkei & Anatolien~Historische Fabrikmauer|Speicher am Goldenen Horn|Alte Werftfassade|Uferterrasse-Industriebau|Produktionshalle|Hafenlager-Seitenwand|Bahnhofshof|Textilfabrik|Fabrikfassade|Industrieplatz|Maschinenwerkstatt|Bahnhofsvorplatz|Kulturhallenbau|Industriehalle|Historischer Lagerhof|Produktionshalle mit Hof|Fabrikhof|Hafenspeicher|Hafenmauer|Industriequartier|Alte Fabrikhalle|Markthallenbau|Bahnhofslager|Historischer Industriehof|Werkstattfassade~Istanbul|Istanbul|Istanbul|Istanbul|İzmir|İzmir|İzmir|Denizli|Bursa|Kocaeli|Eskişehir|Ankara|Ankara|Konya|Kayseri|Gaziantep|Adana|Mersin|Samsun|Trabzon|Malatya|Şanlıurfa|Sivas|Erzurum|Diyarbakır\nTerrassen & Gegenüber~Aussichtsterrasse am Speicher|Brückenpromenade|Erhöhter Uferweg|Terrassenplatz am Fabrikhof|Öffentlicher Dachgarten|Fußgängerbrücke vor Messehalle|Aussichtsplattform zur Zeche|Hochgelegener Stadtplatz|Flusspromenade|Öffentliche Treppenanlage|Brückenterrasse am Hafen|Erhöhter Kanalweg|Aussichtsterrasse an Docks|Uferstufen am Speicher|Fußgängerbrücke zur Kulturfabrik|Öffentliche Flussterrasse|Erhöhter Platz am Ziegelbau|Uferpromenade zur Werft|Hafenaussichtsterrasse|Brückenterrasse am Speicher|Galata-Brückenperspektive|Goldenes-Horn-Uferterrasse|Erhöhter Fabrikplatz|Küstenpromenade|Terrassenweg am Hafen~Hamburg|Duisburg|Düsseldorf|Essen|Berlin|Hannover|Bochum|Leipzig|Dresden|Köln|Rotterdam|Amsterdam|Liverpool|Antwerpen|Wien|Prag|Budapest|Genua|Marseille|Porto|Istanbul|Istanbul|Bursa|İzmir|Mersin\nSpezialarchitektur~Logistikzentrum-Seitenfassade|Flugzeugwartungshalle|Messehallen-Rückfassade|Historische Markthalle|Alter Schlachthof|Backstein-Siloensemble|Alte Eisfabrik|Elektrizitätswerk|Straßenbahndepot-Seitenwand|Brauereihalle-Innenhof|Wasserturm-Lagerwand|Alte Druckerei|Postverladehalle|Großküchenfabrik|Ehemaliges Kühlhaus|Güterbahnhof-Lagerhalle|Maschinenbauhalle|Industriekulturpark|Historische Ziegelei|Kraftwerksmaschinenhaus|Tabakfabrik-Innenhof|Seifenfabrik|Getreidespeicher|Baumwollfabrik-Innenhof|Werftwerkstatt-Ufer~Hannover|Berlin|Köln|Hamburg|München|Bremen|Berlin|Frankfurt|Leipzig|Dortmund|Essen|Düsseldorf|Köln|Stuttgart|Hamburg|Nürnberg|Mannheim|Duisburg|Münsterland|Berlin|Linz|Marseille|Rotterdam|Adana|Istanbul".split('\n');
const BDS984_CATALOG=BDS984_ROWS.flatMap((row,group)=>{
 const [category,names,cities]=row.split('~');
 const a=names.split('|'),b=cities.split('|');
 return a.map((name,i)=>({category,name,city:b[i],label:'4 ZEILEN · '+name+' · '+b[i]}));
});
if(BDS984_CATALOG.length!==200)throw Error('Expected exactly 200 scene presets');
const BDS984_START=DATA.scenes.length;
BDS984_CATALOG.forEach((p,i)=>{
 DATA.scenes.push(p.label);
 DATA.cities.push(p.city);
 DATA.limits.push([4,8,42]);
 DATA.wide.push(DATA.scenes.length);
 if(/terrasse|dachgarten|brücke|erhöht|aussicht|uferweg/i.test(p.name))DATA.roof.push(DATA.scenes.length);
});
const BDS984baseRender=render;
render=function(){
 BDS984baseRender();
 document.title='BİR.DUVARSESİ V'+BDS984_VERSION;
 const h=document.querySelector('header small');if(h)h.textContent='PREMIUM STUDIO · V'+BDS984_VERSION;
 const x=document.querySelector('#v979Export h2');if(x)x.textContent=x.textContent.replace(/V9\.8\.[0-9.]+/g,'V'+BDS984_VERSION);
 const m=document.querySelector('.metrics b');if(m)m.textContent=DATA.scenes.length;
 if(tab==='scene'||document.getElementById('v982Scenes')){
  const old=document.getElementById('bds984Scenes');if(old)old.remove();
  const root=document.getElementById('content');if(!root)return;
  const section=document.createElement('section');section.id='bds984Scenes';section.className='panel';
  const current=state.scene-BDS984_START-1;
  section.innerHTML='<h2>200 NEUE ORTE · V9.8.4 · VIERZEILER</h2><p class="hint">Zusätzliche Architektur-Presets, alle bisherigen Szenen bleiben erhalten. Realistische öffentliche Standorte und freie Textfassaden beachten.</p><label class="label" for="bds984Pick">Ort / Fassade auswählen</label><select id="bds984Pick"><option value="">— Aus 200 Presets auswählen —</option>'+BDS984_CATALOG.map((p,i)=>'<option value="'+i+'" '+(i===current?'selected':'')+'>'+(i+1)+'. '+escapeHTML(p.label)+'</option>').join('')+'</select><p class="hint">Auswahl wird im bestehenden Projekt gespeichert. Für vier Zeilen freie Fassade ohne verdeckende Fenster, Lampen, Flaggen oder Schilder bevorzugen.</p>';
  root.insertBefore(section,root.firstChild);
 }
};
document.addEventListener('change',e=>{
 if(e.target.id!=='bds984Pick'||e.target.value==='')return;
 state.scene=BDS984_START+Number(e.target.value)+1;
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(_){}
 render();toast('Neuer Vierzeiler-Ort übernommen');
});
const BDS984basePrompt=prompt;
prompt=function(){
 let p=BDS984basePrompt().replace(/BİR\.DUVARSESİ V9\.8\.2\.4/g,'BİR.DUVARSESİ V'+BDS984_VERSION);
 const figures=V982activeFigures();
 const first=String(state.wall||'').split('\n').find(x=>x.trim())||'';
 const firstTarget='geometric center of the FIRST RED WALL TEXT LINE ('+first+')';
 // Replace vague wall-facing gaze in per-figure sections; preserve explicit non-wall targets.
 p=p.replace(/(GAZE:\s*)Zur Wand\b/gi,'$1'+firstTarget).replace(/(gaze\s+)Zur Wand\b/gi,'$1'+firstTarget);
 p=p.replace(/(FIRST RED WALL LINE:\s*[^\n]*\n)/g,'$1');
 const detail=figures.map(f=>{
  const raw=(V979.manualGaze[f.id]||'').trim()||(f.id==='main'?V941.mainGaze:f.gaze)||'';
  const reading=/wand|wall|schrift|text|first|zeile/i.test(raw);
  return 'FIGURE '+f.id+' ('+f.name+'): '+(reading?'EYES TARGET: '+firstTarget+'. From THIS figure’s actual eye position, align both pupils, nose axis, skull and natural neck rotation to that same target; account for independent horizontal displacement and height; position shoulders and torso to avoid extreme neck twisting.':'Preserve the explicitly selected gaze target: '+raw+'.')+' Preserve assigned individual seat/furniture; never merge separate chair and bench. Furniture must independently support the correct figure’s body weight.';
 }).join('\n');
 return p+'\nV9.8.4 AUTHORITATIVE GAZE AND FURNITURE OVERRIDE — apply after all generic gaze phrases; do not infer that merely facing the facade means reading the first line.\n'+detail+'\nSCENE QUALITY: Four large lines on a single uninterrupted authentic facade; preserve real architecture and safe public access. No visible lamps, flags, extra signage, or religious symbols. This text is an instruction, not proof of automatic image verification.';
};
render();
