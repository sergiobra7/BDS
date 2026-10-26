/* V10 isolated adapter: never modifies legacy prompt() or the root app. */
(function(){
"use strict";
function config(){
 const base=JSON.parse(JSON.stringify(window.BDS10.DEFAULTS));
 const s=typeof state!=="undefined"?state:{};
 const v=typeof V941!=="undefined"?V941:{};
 base.scene=String(s.location||s.sceneName||(typeof DATA!=="undefined"&&DATA.scenes?DATA.scenes[(Number(s.scene)||1)-1]:"")||"");
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
function install(){

 const anchor=document.getElementById("downloadPrompt");
 if(!anchor||document.getElementById("bds10-export"))return;
 const btn=document.createElement("button");btn.id="bds10-export";btn.className="btn primary";
 btn.type="button";btn.textContent="V10 Engine · Master-Prompt als TXT";
 btn.addEventListener("click",run);anchor.insertAdjacentElement("afterend",btn);
}
document.addEventListener("DOMContentLoaded",()=>{
 const root=document.getElementById("content");if(!root)return;
 new MutationObserver(install).observe(root,{childList:true,subtree:true});install();
});
window.BDS10Bridge={config,run};
})();