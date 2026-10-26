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
 const separation=Number(s.figureToFacadeDistance||0);
 if(separation>0)base.camera.figureToFacade=separation;
 base.poster.enabled=v.signOn===true;
 base.poster.text=String(s.signTextMode==="Wandtext übernehmen"?s.wall:s.signText||"");
 base.figures[0].name=String(v.mainSource||base.figures[0].name);
 base.figures[0].pose=mainPose();
 base.figures[0].position=String(v.mainPosition||base.figures[0].position);
 base.figures[0].orientation=String(v.mainOrientation||base.figures[0].orientation);
 const gazes={"Zur Wand":"wall","Zur Kamera":"camera","Zur Hauptfigur":"camera","Zur Nebenfigur":"camera"};
 base.figures[0].gaze=gazes[v.mainGaze]||"auto";
 base.figures[0].enabled=v.mainEnabled!==false;
 if(Array.isArray(v.figures))for(const [i,f] of v.figures.entries())base.figures.push({
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

function install(){
 installMainPose();

 const anchor=document.getElementById("downloadPrompt");
 const content=document.getElementById("content");
 if(content&&!document.getElementById("bds10-facade-finder")&&anchor)content.appendChild(facadeFinderPanel());
 if(!anchor||document.getElementById("bds10-export"))return;
 const btn=document.createElement("button");btn.id="bds10-export";btn.className="btn primary";
 btn.type="button";btn.textContent="V10 Engine · Master-Prompt als TXT";
 btn.addEventListener("click",run);anchor.insertAdjacentElement("afterend",btn);
}
document.addEventListener("DOMContentLoaded",()=>{
 const root=document.getElementById("content");if(!root)return;
 new MutationObserver(install).observe(root,{childList:true,subtree:true});install();
});
window.BDS10Bridge={config,run,GIANT_FACADES,MAIN_POSES};
})();