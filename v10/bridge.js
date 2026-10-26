/* V10 isolated adapter: never modifies legacy prompt() or the root app. */
(function(){
"use strict";
function config(){
 const base=JSON.parse(JSON.stringify(window.BDS10.DEFAULTS));
 const s=typeof state!=="undefined"?state:{};
 const v=typeof V941!=="undefined"?V941:{};
 base.scene=String((window.BDS10SelectedFacade&&window.BDS10SelectedFacade.scene)||s.location||s.sceneName||(typeof DATA!=="undefined"&&DATA.scenes?DATA.scenes[(Number(s.scene)||1)-1]:"")||"");
 base.wall.text=String(s.wall||"");
 base.wall.enabled=v.wallOn!==false;
 base.wall.font=String(v.fontChoice||base.wall.font);
 base.camera.format=String(s.format||base.camera.format);
 base.camera.lens=Number(s.lens||s.cameraLens||base.camera.lens);
 base.camera.distance=Number(s.distance||s.cameraDistance||base.camera.distance);
 const historical=window.BDS10StreetProfile==="duygukapisi-v7";
 if(historical){base.camera.lens=28;base.camera.distance=30;base.camera.perspective="Urban Wide Establishing Shot · natürliche Augenhöhe";base.camera.format="9:16";base.wall.dominance=90;base.time="Nachmittag · leicht bewölkt, trocken";base.scene+=" | DUYGUKAPISI V7.0 ORIGINAL STREET PERSPECTIVE: hohe Metropolenfassade, breit und hoch, 90 Prozent Textausnutzung; gesamte Fassade und lebendiger geschäftiger Straßenalltag sichtbar; schräg gegenüberliegende Straßenecke, natürliche Augenhöhe, Mann mit Zopf klein aber klar erkennbar links im nahen Vordergrund; physisch getrennt durch realistische Straßenbreite; Straßencafé / Çay-Ocağı, Passanten, alltägliche Handlungen, Fahrzeuge und bei passender Szene Kreuzung / Fußgängerüberweg; nur natürlich vorhandenes Licht; erst Wand, dann gegenüberliegender Standort, dann Pose, zuletzt Kopf und Augen; Blickachse zu einem tatsächlichen roten Wort, anatomisch glaubwürdig; keine erfundenen Fassadenlampen.";}
 const separation=historical?0:Number(s.figureToFacadeDistance||0);
 if(separation>0)base.camera.figureToFacade=separation;
 base.poster.enabled=v.signOn===true;
 base.poster.text=String(s.signTextMode==="Wandtext übernehmen"?s.wall:s.signText||"");
 base.figures[0].name=String(v.mainSource||base.figures[0].name);
 base.figures[0].pose=mainPose();
 base.figures[0].position=historical?"Links im nahen Vordergrund, schräg gegenüberliegende Straßenecke, klein aber erkennbar":String(v.mainPosition||base.figures[0].position);
 base.figures[0].orientation=String(v.mainOrientation||base.figures[0].orientation);
 const gazes={"Zur Wand":"wall","Zur Kamera":"camera","Zur Hauptfigur":"camera","Zur Nebenfigur":"camera"};
 base.figures[0].gaze=gazes[v.mainGaze]||"auto";
 base.figures[0].enabled=v.mainEnabled!==false;
 if(!historical&&Array.isArray(v.figures))for(const [i,f] of v.figures.entries())base.figures.push({
 id:String(f.id||"extra"+i),name:String(f.type||f.name||"Nebenfigur"),
 enabled:f.enabled!==false,pose:String(f.pose||"Aufrecht stehen"),
 position:String(f.position||"Automatisch"),gaze:gazes[f.gaze]||"auto",
 orientation:String(f.orientation||"Automatisch")
 });
 return base;
}
function run(){
 const out=window.BDS10.generate(config());
 if(!out.ok){alert("V10: "+out.errors.join("\n"));return}
 const blob=new Blob([out.prompt],{type:"text/plain;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="BDS-V10-master-prompt.txt";
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}

// Director recommendations temporarily disabled for controlled geometry testing.

// Isolated facade finder presets for controlled single-character distance tests.
const GIANT_FACADES=[
 {name:"EXTREM BREIT · Schwarze Industrie-Brandwand",shape:"BREIT",size:"80–120 m breit · 25–45 m hoch",scene:"Extrem breite zusammenhängende schwarze Industrie-Brandwand jenseits einer breiten öffentlichen Straße; durchgehende freie XXL-Schriftfläche, sichtbarer Straßenraum, Mann mit Zopf auf gegenüberliegender Gehwegseite links unten."},
 {name:"EXTREM BREIT · Metropolen-Gebäudeblock",shape:"BREIT",size:"70–110 m breit · 35–65 m hoch",scene:"Gigantischer schwarzer Metropolen-Gebäudeblock an einer breiten Kreuzung; riesige ununterbrochene Seitenfassade für rote XXL-Schrift, Mann mit Zopf links unten auf der anderen Straßenseite."},
 {name:"GIGANTISCH HOCH · Schwarze Hochhaus-Brandwand",shape:"HOCH",size:"35–55 m breit · 100–160 m hoch",scene:"Gigantisch hohe schwarze Hochhaus-Brandwand jenseits einer mehrspurigen Straße; vollständig zusammenhängende vertikale Schriftfläche, Mann mit Zopf links unten auf der gegenüberliegenden Gehwegseite."},
 {name:"GIGANTISCH HOCH · Monolithischer Stadtturm",shape:"HOCH",size:"40–65 m breit · 120–190 m hoch",scene:"Monolithischer schwarzer Stadtturm mit gigantisch hoher durchgehender ebener Seitenfassade; breite öffentliche Platzfläche zwischen Gebäude und Mann mit Zopf links unten."}
];
function facadeFinderPanel(){
 const box=document.createElement("section");box.id="bds10-facade-finder";box.style.cssText="margin:18px 0;padding:14px;border:1px solid #555;border-radius:12px";
 box.innerHTML='<h3>V10 · XXL-Fassadenfinder</h3><p class="hint">Testgebäude: extrem breit oder gigantisch hoch. Kameraeinstellungen bleiben unverändert.</p>'+GIANT_FACADES.map((f,i)=>'<button class="btn" type="button" data-giant-facade="'+i+'" style="display:block;width:100%;margin:8px 0;text-align:left">'+f.name+'<br><small>'+f.size+'</small></button>').join('');
 box.addEventListener("click",e=>{const btn=e.target.closest("[data-giant-facade]");if(!btn)return;const f=GIANT_FACADES[Number(btn.dataset.giantFacade)];if(!f)return;
  if(typeof state!=="undefined"){state.location=f.scene;state.sceneName=f.scene;}
  window.BDS10SelectedFacade=f;
  const msg=document.getElementById("bds10-facade-status");if(msg)msg.textContent="Aktiv: "+f.name+" · Nur V10-Prompt, Kamera bleibt gesperrt.";
 });
 const status=document.createElement("p");status.id="bds10-facade-status";status.className="hint";box.appendChild(status);return box;
}


const MAIN_POSES=[
 "Auf stabiler Bank sitzen, Unterarme auf den Knien",
 "Auf breiter Treppe sitzen, Ellbogen auf den Oberschenkeln",
 "Auf Parkbank sitzen, Hände locker auf den Knien",
 "Rückwärts auf stabilem Stuhl sitzen, Unterarme auf der Lehne",
 "Auf niedrigem Hocker sitzen, Hände entspannt",
 "Ruhig stehen, Arme seitlich",
 "Ruhig stehen, Hände hinter dem Rücken",
 "Seitlich an freistehendem Geländer lehnen",
 "Auf niedriger Mauer sitzen, Beine ruhig am Boden",
 "Auf Bank sitzen, Oberkörper leicht nach vorn geneigt"
];
const POSE_KEY="bds10-main-pose";
function mainPose(){try{return localStorage.getItem(POSE_KEY)||MAIN_POSES[0]}catch(e){return window.BDS10MainPose||MAIN_POSES[0]}}
function installMainPose(){
 const content=document.getElementById("content");if(!content)return;
 const heading=Array.from(content.querySelectorAll("h2")).find(h=>/Hauptfigur.*unabhängige Steuerung/i.test(h.textContent));
 if(!heading||document.getElementById("bds10-main-pose"))return;
 const wrapper=document.createElement("div");wrapper.id="bds10-main-pose";
 const label=document.createElement("label");label.textContent="Mann mit Zopf · Pose (10 Optionen)";label.htmlFor="bds10-pose-select";
 const select=document.createElement("select");select.id="bds10-pose-select";select.style.cssText="display:block;width:100%;margin:8px 0 14px";
 for(const pose of MAIN_POSES){const option=document.createElement("option");option.value=pose;option.textContent=pose;select.appendChild(option)}
 select.value=MAIN_POSES.includes(mainPose())?mainPose():MAIN_POSES[0];
 select.addEventListener("change",()=>{window.BDS10MainPose=select.value;try{localStorage.setItem(POSE_KEY,select.value)}catch(e){}});
 wrapper.append(label,select);heading.insertAdjacentElement("afterend",wrapper);
}



// Override only the V10-rendered main-character template; legacy source remains untouched.
if(typeof V941main==='function'&&typeof V941select==='function'){
 V941main=function(){
  return '<div class="panel"><h2>Hauptfigur · Mann mit Zopf</h2>'+
   '<label class="v9823-toggle"><input type="checkbox" data-v941-key="mainEnabled" '+(V941.mainEnabled!==false?'checked':'')+'> Hauptfigur aktiv</label>'+
   '<label class="label">Pose · 10 Optionen</label><select id="bds10-pose-select">'+MAIN_POSES.map(p=>'<option value="'+p.replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'" '+(mainPose()===p?'selected':'')+'>'+p+'</option>').join('')+'</select>'+
   V941select('Position','mainPosition',V941positions,V941.mainPosition)+
   V941select('Blickrichtung','mainGaze',V941gazes,V941.mainGaze)+
   '<details class="v94details"><summary>Originalfoto (optional)</summary><div class="v941ref"><input type="file" accept="image/*" data-v941-upload="main"><small id="v941-main-file">'+(V941.mainReference?'Foto hinterlegt: '+V941.mainReference:'Noch kein Foto ausgewählt')+'</small></div></details></div>';
 };
 document.addEventListener('change',e=>{if(e.target?.id==='bds10-pose-select'){window.BDS10MainPose=e.target.value;try{localStorage.setItem(POSE_KEY,e.target.value)}catch(err){}}});
}

function simplifyMainCharacter(){
 const root=document.getElementById('content');if(!root)return;
 const heading=Array.from(root.querySelectorAll('h2')).find(h=>/Hauptfigur.*unabhängige Steuerung/i.test(h.textContent));
 const panel=heading&&heading.closest('.panel');if(!panel||panel.dataset.bds10Compact==='yes')return;
 const active=panel.querySelector('[data-v941-key="mainEnabled"]');
 const position=panel.querySelector('[data-v941-key="mainPosition"]');
 const gaze=panel.querySelector('[data-v941-key="mainGaze"]');
 const photo=panel.querySelector('.v941ref');
 if(!active||!position||!gaze)return;
 // Replace the entire legacy character panel rather than hiding nested menus.
 // Existing delegated V941 handlers continue to own the original inputs.
 const compact=document.createElement('div');compact.className='bds10-compact-main';
 const h=document.createElement('h2');h.textContent='Hauptfigur · Mann mit Zopf';compact.appendChild(h);
 const activeLabel=document.createElement('label');activeLabel.className='v9823-toggle';activeLabel.appendChild(active);activeLabel.appendChild(document.createTextNode(' Hauptfigur aktiv'));compact.appendChild(activeLabel);
 const poseLabel=document.createElement('label');poseLabel.className='label';poseLabel.textContent='Pose · 10 Optionen';compact.appendChild(poseLabel);
 const poseSelect=document.createElement('select');poseSelect.id='bds10-pose-select';
 for(const pose of MAIN_POSES){const opt=document.createElement('option');opt.value=pose;opt.textContent=pose;poseSelect.appendChild(opt)}
 poseSelect.value=MAIN_POSES.includes(mainPose())?mainPose():MAIN_POSES[0];
 poseSelect.addEventListener('change',()=>{window.BDS10MainPose=poseSelect.value;try{localStorage.setItem(POSE_KEY,poseSelect.value)}catch(e){}});
 compact.appendChild(poseSelect);
 for(const [label,select] of [['Position',position],['Blickrichtung',gaze]]){
  const l=document.createElement('label');l.className='label';l.textContent=label;compact.appendChild(l);compact.appendChild(select);
 }
 if(photo){const details=document.createElement('details');details.className='v94details';const summary=document.createElement('summary');summary.textContent='Originalfoto (optional)';details.appendChild(summary);details.appendChild(photo);compact.appendChild(details)}
 panel.replaceChildren(...Array.from(compact.childNodes));panel.dataset.bds10Compact='yes';
}

function removeDirectorImpactUI(){
 const root=document.getElementById('content');if(!root)return;
 for(const el of root.querySelectorAll('section, .panel, .v96director')){
  if(el.id==='bds10-facade-finder'||el.id==='bds10-main-pose')continue;
  const heading=el.querySelector('h2, h3, .v96head strong');
  if(!heading)continue;
  const title=(heading.textContent||'').trim();
  if(/SMART SCENE DIRECTOR|EDITORIAL IMPACT PRO/i.test(title)){
   if(el.style.display!=='none')el.style.display='none';
  }
 }
}

function compactAllFigurePanels(){
 const root=document.getElementById('content');if(!root)return;
 const allowed=/^Hauptfigur · Mann mit Zopf$/i;
 for(const panel of root.querySelectorAll('.panel')){
  const h=panel.querySelector(':scope > h2');
  if(!h)continue;
  const title=(h.textContent||'').trim();
  if(allowed.test(title))continue;
  if(/Meine Posen & Handlungen|Eigene Pose & Handlung|Hauptfigur · Haltung, Gestik|V9\.6\.3 · Aktivität & Körperhaltung|Figurenverteilung · Hauptfigur|Referenz im Master-Prompt · Mann mit Zopf|Hauptfigur.*Pose|Hauptfigur.*Gestik|Hauptfigur.*Körperhaltung/i.test(title)){
   if(panel.style.display!=='none')panel.style.display='none';
  }
 }
 // Some late modules render their own character card as a nested section.
 for(const h of root.querySelectorAll('h2,h3')){
  const title=(h.textContent||'').trim();
  if(/^(Meine Posen & Handlungen|Eigene Pose & Handlung|Hauptfigur · Haltung, Gestik|V9\.6\.3 · Aktivität & Körperhaltung|Figurenverteilung · Hauptfigur)/i.test(title)){
   const panel=h.closest('.panel');if(panel&&panel.style.display!=='none')panel.style.display='none';
  }
 }
}


function replaceMainFigureTab(){
 const content=document.getElementById('content');
 const active=document.querySelector('#tabs button.active, #tabs [aria-selected="true"]');
 if(!content||!active||!/hauptfigur/i.test(active.textContent||''))return;
 if(content.querySelector('#bds10-only-main'))return;
 const panel=document.createElement('section');panel.className='panel';panel.id='bds10-only-main';
 const h=document.createElement('h2');h.textContent='Hauptfigur · Mann mit Zopf';panel.appendChild(h);
 const toggle=document.createElement('label');toggle.className='v9823-toggle';
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=typeof V941==='undefined'||V941.mainEnabled!==false;
 checkbox.addEventListener('change',()=>{if(typeof V941!=='undefined'){V941.mainEnabled=checkbox.checked;if(typeof V941save==='function')V941save()}});
 toggle.append(checkbox,document.createTextNode(' Hauptfigur aktiv'));panel.appendChild(toggle);
 function addSelect(label,values,value,change){
  const l=document.createElement('label');l.className='label';l.textContent=label;
  const select=document.createElement('select');
  for(const [key,title] of values){const o=document.createElement('option');o.value=key;o.textContent=title;select.appendChild(o)}
  select.value=value;select.addEventListener('change',()=>change(select.value));panel.append(l,select);
 }
 addSelect('Pose',MAIN_POSES.map(p=>[p,p]),MAIN_POSES.includes(mainPose())?mainPose():MAIN_POSES[0],v=>{window.BDS10MainPose=v;try{localStorage.setItem(POSE_KEY,v)}catch(e){}});
 const v=typeof V941!=='undefined'?V941:{};
 addSelect('Position',(typeof V941positions!=='undefined'?V941positions:['Links im Vordergrund','Rechts im Vordergrund','Gegenüberliegender Gehweg']).map(x=>[x,x]),v.mainPosition||'Links im Vordergrund',value=>{if(typeof V941!=='undefined'){V941.mainPosition=value;if(typeof V941save==='function')V941save()}});
 addSelect('Blickrichtung',(typeof V941gazes!=='undefined'?V941gazes:['Zur Wand','Zur Kamera']).map(x=>[x,x]),v.mainGaze||'Zur Wand',value=>{if(typeof V941!=='undefined'){V941.mainGaze=value;if(typeof V941save==='function')V941save()}});
 const note=document.createElement('p');note.className='hint';note.textContent='Referenzfoto des Mannes mit Zopf beim Bildgenerator separat hochladen.';panel.appendChild(note);
 content.replaceChildren(panel);
}


function installDedicatedMainTab(){
 const tabs=document.getElementById('tabs'),content=document.getElementById('content');
 if(!tabs||!content)return;
 // The legacy Hauptfigur page is rendered by several separate version wrappers.
 // Provide one explicit V10 tab, without relying on the legacy tab title.
 for(const button of tabs.querySelectorAll('button')){
  if(button.id==='bds10-main-tab')continue;
  if(/hauptfigur/i.test(button.textContent||'')&&button.style.display!=='none')button.style.display='none';
 }
 let button=document.getElementById('bds10-main-tab');
 if(!button){
  button=document.createElement('button');button.id='bds10-main-tab';button.type='button';
  button.textContent='Hauptfigur';tabs.appendChild(button);
  button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.BDS10MainTabOpen=true;showDedicatedMain();},true);
 }
 if(window.BDS10MainTabOpen&&!content.querySelector('#bds10-only-main'))showDedicatedMain();
}
function showDedicatedMain(){
 const tabs=document.getElementById('tabs'),content=document.getElementById('content');
 if(!tabs||!content)return;
 // Reuse the existing compact form constructor, but activate it with a dedicated tab.
 let tab=document.getElementById('bds10-main-tab');
 if(!tab)return;
 for(const button of tabs.querySelectorAll('button'))button.classList.toggle('active',button===tab);
 const legacyActive=tab;
 const proxy=document.createElement('button');proxy.className='active';proxy.textContent='Hauptfigur';proxy.style.display='none';
 tab.classList.remove('active');tabs.appendChild(proxy);
 try{replaceMainFigureTab()}finally{proxy.remove();legacyActive.classList.add('active')}
}
document.addEventListener('click',e=>{
 if(e.target.closest('#tabs button:not(#bds10-main-tab)'))window.BDS10MainTabOpen=false;
},true);


function simplifyFacadeScreen(){
 const content=document.getElementById('content'),tabs=document.getElementById('tabs');
 if(!content||!tabs)return;
 const active=tabs.querySelector('button.active');
 const title=(active&&active.textContent||'').trim();
 if(!/fassade|szene/i.test(title)||/hauptfigur/i.test(title))return;
 let finder=content.querySelector('#bds10-facade-finder');
 if(!finder)finder=facadeFinderPanel();
 // A single V10 façade screen; all legacy manual/511 suggestion cards are excluded.
 if(content.children.length===1&&content.firstElementChild===finder)return;
 content.replaceChildren(finder);
 const titleNode=finder.querySelector('h3');if(titleNode)titleNode.textContent='XXL-FASSADENFINDER · V10';
 if(!finder.querySelector('#bds10-street-profile')){
  const wrap=document.createElement('div');wrap.id='bds10-street-profile';wrap.style.margin='16px 0';
  const label=document.createElement('label');label.className='label';label.textContent='Straßenperspektive';
  const select=document.createElement('select');select.style.width='100%';
  for(const [value,text] of [['','Standard · aktuelle Kamera'],['duygukapisi-v7','DUYGUKAPISI V7.0 · ORIGINAL STREET PERSPECTIVE']]){
   const option=document.createElement('option');option.value=value;option.textContent=text;select.appendChild(option);
  }
  select.value=window.BDS10StreetProfile||'';
  select.addEventListener('change',()=>{window.BDS10StreetProfile=select.value;try{localStorage.setItem('bds10-street-profile',select.value)}catch(e){}});
  wrap.append(label,select);finder.appendChild(wrap);
 }
}

function enforceOnlyXXLFinder(){
 const root=document.getElementById('content');
 if(!root)return;
 // Remove legacy manual finder and its surrounding card even when nested in a different tab.
 for(const el of root.querySelectorAll('button,summary,h2,h3')){
  const t=(el.textContent||'').trim();
  if(!/MANUELLER FASSADENFINDER/i.test(t)||t.length>100)continue;
  const card=el.closest('.panel,section,details')||el.parentElement;
  if(card&&!card.contains(document.getElementById('bds10-facade-finder')))card.style.display='none';
 }
 // Hide old 511-facade recommendation cards by their specific heading.
 for(const el of root.querySelectorAll('h2,h3')){
  if(!/^FASSADENFINDER\s*[·•-]\s*INAKTIV/i.test((el.textContent||'').trim()))continue;
  const card=el.closest('.panel,section');if(card)card.style.display='none';
 }
 const active=document.querySelector('#tabs button.active');
 if(active&&/fassade|szene/i.test(active.textContent||'')){
  const finder=root.querySelector('#bds10-facade-finder');
  if(finder){finder.style.display='block';if(root.firstElementChild!==finder)root.prepend(finder)}
 }
}

function removeLegacyFacadeFinderEverywhere(){
 const root=document.getElementById('content');if(!root)return;
 for(const el of root.querySelectorAll('button,summary,h2,h3,h4,strong')){
  const label=(el.textContent||'').trim();
  if(!/^(MANUELLER FASSADENFINDER|FASSADENFINDER\s*[·•:]\s*INAKTIV|AKTIVE SZENENQUELLE\s*:)/i.test(label))continue;
  const block=el.closest('.panel,details,section');
  if(block&&block.id!=='bds10-facade-finder'&&block!==root&&block.style.display!=='none')block.style.display='none';
 }
}


function installCleanXXLTab(){
 const tabs=document.getElementById('tabs'),content=document.getElementById('content');if(!tabs||!content)return;
 for(const b of tabs.querySelectorAll('button')){
  if(b.id==='bds10-xxl-tab')continue;
  if(/fassade|szene|director|regie|impact|studio pro|pose fusion/i.test(b.textContent||''))b.style.display='none';
 }
 let button=document.getElementById('bds10-xxl-tab');
 if(!button){
  button=document.createElement('button');button.id='bds10-xxl-tab';button.type='button';button.textContent='XXL-Fassaden';
  tabs.appendChild(button);
  button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();window.BDS10MainTabOpen=false;window.BDS10XXLTabOpen=true;showCleanXXLTab()},true);
 }
 if(window.BDS10XXLTabOpen&&!content.querySelector('#bds10-xxl-screen'))showCleanXXLTab();
}
function showCleanXXLTab(){
 const tabs=document.getElementById('tabs'),content=document.getElementById('content');if(!tabs||!content)return;
 for(const b of tabs.querySelectorAll('button'))b.classList.toggle('active',b.id==='bds10-xxl-tab');
 const screen=document.createElement('section');screen.id='bds10-xxl-screen';
 screen.appendChild(facadeFinderPanel());
 const wrap=document.createElement('div');wrap.style.margin='18px 0';
 const label=document.createElement('label');label.className='label';label.textContent='Straßenperspektive';
 const select=document.createElement('select');select.style.width='100%';
 for(const [value,title] of [['','Standard'],['duygukapisi-v7','DUYGUKAPISI V7.0 · ORIGINAL STREET PERSPECTIVE']]){
  const opt=document.createElement('option');opt.value=value;opt.textContent=title;select.appendChild(opt);
 }
 select.value=window.BDS10StreetProfile||'';
 select.addEventListener('change',()=>{window.BDS10StreetProfile=select.value;try{localStorage.setItem('bds10-street-profile',select.value)}catch(e){}});
 wrap.append(label,select);screen.appendChild(wrap);content.replaceChildren(screen);
}
document.addEventListener('click',e=>{
 if(e.target.closest('#tabs button:not(#bds10-xxl-tab)'))window.BDS10XXLTabOpen=false;
},true);
function suppressLegacyDirector(){
 const root=document.getElementById('content');if(!root)return;
 const pattern=/manueller fassadenfinder|fassadenfinder\s*[·•:-]\s*inaktiv|aktive szenenquelle|smart.*director|editorial.*impact|regie.*director|511 passende fassaden/i;
 for(const node of root.querySelectorAll('h2,h3,h4,summary,button,strong')){
  const title=(node.textContent||'').trim();
  if(!pattern.test(title)||title.length>150)continue;
  let panel=node.closest('.panel,details,section');
  if(!panel||panel===root||panel.id==='bds10-facade-finder'||panel.id==='bds10-xxl-screen')continue;
  if(panel.style.display!=='none')panel.style.display='none';
 }
}


function pruneLegacyPanels(){
 const root=document.getElementById('content');if(!root)return;
 const unwanted=/aktive szenenquelle|kamera\s*[·•:-]\s*schnellzugriff|manueller fassadenfinder|fassadenfinder\s*[·•:-]\s*inaktiv|smart\s*(scene\s*)?director|editorial\s*impact|director|511 passende fassaden|figurenverteilung|v9\.6\.3\s*[·•:-]\s*aktivität/i;
 for(const heading of root.querySelectorAll('h1,h2,h3,h4,h5,summary,strong,button')){
  const title=(heading.textContent||'').trim();
  if(title.length>130||!unwanted.test(title))continue;
  const card=heading.closest('.panel,details,section,article');
  if(!card||card===root||card.id==='bds10-facade-finder'||card.id==='bds10-xxl-screen'||card.id==='bds10-only-main')continue;
  if(card.style.display!=='none')card.style.display='none';
 }
}


function hardRemoveLegacyCards(){
 const root=document.getElementById('content');if(!root)return;
 const unwanted=/kamera\s*[·•:-]\s*schnellzugriff|aktive szenenquelle|manueller fassadenfinder|smart\s*(scene\s*)?director|editorial\s*impact|fassadenfinder\s*[·•:-]\s*inaktiv/i;
 for(const node of root.querySelectorAll('h1,h2,h3,h4,h5,summary,button,strong')){
  const label=(node.textContent||'').trim();
  if(label.length>100||!unwanted.test(label))continue;
  let el=node;
  while(el.parentElement&&el.parentElement!==root&&!el.classList.contains('panel')&&el.tagName!=='SECTION')el=el.parentElement;
  if(el===root||el.id==='bds10-facade-finder'||el.id==='bds10-xxl-screen')continue;
  if(el.parentElement===root){el.remove();continue}
  el.style.setProperty('display','none','important');
 }
}

function install(){
 installDedicatedMainTab();
 installCleanXXLTab();
 replaceMainFigureTab();
 simplifyFacadeScreen();
 enforceOnlyXXLFinder();
 suppressLegacyDirector();
 pruneLegacyPanels();
 hardRemoveLegacyCards();
 removeLegacyFacadeFinderEverywhere();
 compactAllFigurePanels();
 removeDirectorImpactUI();
 simplifyMainCharacter();

 const anchor=document.getElementById("downloadPrompt");
 const content=document.getElementById("content");
 if(content&&!document.getElementById("bds10-facade-finder")&&anchor)content.appendChild(facadeFinderPanel());
 if(!anchor||document.getElementById("bds10-export"))return;
 const btn=document.createElement("button");btn.id="bds10-export";btn.className="btn primary";
 btn.type="button";btn.textContent="V10 Engine · Master-Prompt als TXT";
 btn.addEventListener("click",run);anchor.insertAdjacentElement("afterend",btn);
}
try{window.BDS10StreetProfile=localStorage.getItem("bds10-street-profile")||""}catch(e){window.BDS10StreetProfile=""}
document.addEventListener("DOMContentLoaded",()=>{
 const direct=document.getElementById('bds10-xxl-direct');if(direct)direct.addEventListener('click',()=>{window.BDS10XXLTabOpen=true;window.BDS10MainTabOpen=false;showCleanXXLTab();document.getElementById('content')?.scrollIntoView({behavior:'smooth',block:'start'});});
 const root=document.getElementById("content");if(!root)return;
 new MutationObserver(install).observe(root,{childList:true,subtree:true});
 const tabs=document.getElementById('tabs');if(tabs)new MutationObserver(install).observe(tabs,{childList:true});
 install();
});
window.BDS10Bridge={config,run,GIANT_FACADES,MAIN_POSES};
})();