/* BİR.DUVARSESİ V10 — independent pure prompt engine, no legacy prompt wrappers */
(function(root){
"use strict";
const DEFAULTS={scene:"",facade:"Schwarzer Backstein",time:"Nacht",camera:{perspective:"Low Angle",lens:35,distance:45,format:"9:16"},wall:{enabled:true,text:"",font:"DIN CONDENSED BLACK",color:"Mattrot",dominance:90},poster:{enabled:false,text:"",owner:"main",mode:"Freistehend",hand:"Keine",colors:{}},mix:false,figures:[{id:"main",name:"Mann mit Zopf",enabled:true,pose:"Aufrecht stehen",position:"Linker Vordergrund",gaze:"wall",orientation:"Automatisch"}]};
const clone=x=>JSON.parse(JSON.stringify(x));
const normalize=s=>String(s||"").trim();
const firstWord=s=>String(s||"").split(/\r?\n/u).map(v=>v.trim()).find(Boolean)?.split(/\s+/u)[0]||"";
const modes=new Set(["wall","camera","street","poster","auto"]);
function validate(input){
 const x=clone(input||{});const errors=[];
 if(!x.camera||!Number.isFinite(Number(x.camera.lens))||Number(x.camera.lens)<=0)errors.push("Ungültige Brennweite");
 if(!x.camera||!Number.isFinite(Number(x.camera.distance))||Number(x.camera.distance)<=0)errors.push("Ungültige Entfernung");
 if(!["9:16","4:5"].includes(x.camera?.format))errors.push("Ungültiges Format");
 if(!Array.isArray(x.figures))errors.push("Figuren fehlen");
 if(!x.wall||!x.poster||!x.camera)errors.push("Pflichtkonfiguration unvollständig");
 if(x.wall?.enabled&&(!Number.isFinite(Number(x.wall.dominance))||Number(x.wall.dominance)<1||Number(x.wall.dominance)>100))errors.push("Schriftdominanz muss zwischen 1 und 100 liegen");
 const active=(Array.isArray(x.figures)?x.figures:[]).filter(f=>f.enabled!==false);
 const ids=new Set();for(const f of active){if(!f.id||ids.has(f.id))errors.push("Doppelte/fehlende Figuren-ID");ids.add(f.id)}
 if(x.wall?.enabled&&!firstWord(x.wall.text))errors.push("Wandtext fehlt");
 if(x.poster?.enabled&&!normalize(x.poster.text))errors.push("Plakattext fehlt");
 if(x.poster?.enabled&&!x.poster.owner)errors.push("Plakatbesitzer fehlt");
 if(x.poster?.enabled&&x.poster.owner&&!ids.has(x.poster.owner))errors.push("Plakatbesitzer ist nicht aktiv");
 if(x.poster?.enabled&&x.poster.mode==="Gehalten"&&active.some(f=>f.id===x.poster.owner&&/taschen|pockets|verschränkt|beide hände|both hands/i.test(f.pose||"")))errors.push("Gehaltenes Plakat kollidiert mit der gewählten Hand-/Armhaltung des Besitzers");
 for(const f of active){if(!modes.has(f.gaze)&&!active.some(other=>other.id===f.gaze&&other.id!==f.id))errors.push("Ungültiges Blickziel für "+f.id);}
 if(active.some(f=>/(gehend|laufend|walking|running|spaziergang|im flug|gleitschirm)/i.test(f.pose||"")))errors.push("Gehende oder laufende Posen sind nicht erlaubt");
 if(active.length===0)errors.push("Mindestens eine aktive Figur erforderlich");
 if(x.poster?.enabled&&(!x.poster.colors||typeof x.poster.colors!=="object"||Array.isArray(x.poster.colors)))errors.push("Ungültige Plakat-Wortfarben");
 if(x.poster?.enabled&&Object.entries(x.poster.colors||{}).some(([word,color])=>!word.trim()||typeof color!=="string"||!color.trim()))errors.push("Wortfarben benötigen nichtleere Wörter und Farbnamen");
 if(x.poster?.enabled){
  if(!["Freistehend","Gehalten"].includes(x.poster.mode))errors.push("Ungültiger Plakatmodus");
  if(x.poster.mode==="Freistehend"&&x.poster.hand!=="Keine")errors.push("Freistehendes Plakat darf keine Haltehand haben");
  if(x.poster.mode==="Gehalten"&&!["Links","Rechts"].includes(x.poster.hand))errors.push("Gehaltenes Plakat benötigt eine ausdrücklich gewählte Haltehand (Links/Rechts)");
 }
 return {errors,active};
}
function gazeTarget(f,x,active){
 const g=normalize(f.gaze||"auto");
 if(g==="wall")return x.wall.enabled?'FIRST WORD OF FIRST WALL LINE: "'+firstWord(x.wall.text)+'"':"scene-specific natural gaze (wall disabled)";
 if(g==="poster")return x.poster.enabled?"physical placard":"scene-specific natural gaze (placard disabled)";
 if(g==="camera")return "camera lens";
 if(g==="street")return "street";
 if(g==="auto")return x.wall.enabled?'FIRST WORD OF FIRST WALL LINE: "'+firstWord(x.wall.text)+'"':"scene-specific natural gaze";
 const person=active.find(v=>v.id===g);return person&&person.id!==f.id?"person "+person.name+" ["+person.id+"]":"scene-specific natural gaze";
}
function generate(input){
 const x=clone(input||{}),{errors,active}=validate(x);
 if(errors.length)return {ok:false,errors,prompt:""};
 const lines=["BİR.DUVARSESİ V10 — CLEAN MASTER PROMPT","OUTPUT: Exactly ONE photorealistic editorial photograph. No CGI.","SCENE: "+normalize(x.scene)+". FACADE: "+normalize(x.facade)+". TIME: "+normalize(x.time)+".","CAMERA (IMMUTABLE): "+x.camera.perspective+"; "+x.camera.lens+" mm; "+x.camera.distance+" m; "+x.camera.format+".","PHYSICAL GEOMETRY: Figures stand or sit on a safe publicly accessible foreground separate from the text-bearing facade. Keep authentic scale, depth, perspective and clear sight lines. Do not move manual positions.","NO facade lamps, wall-mounted fixtures, floodlights, flags, invented signage, or moving poses.","DIAGONAL COMPOSITION LOCK: Build a strong, readable diagonal across the frame from the lower foreground figure-and-prop group toward the opposite-side text facade. The diagonal must be visible in perspective, spatial depth, body orientation and actual eye lines, not just a decorative slant. Keep the figures and their support objects grouped on one lower side and the lettering dominant on the opposite upper side; preserve legible text and natural anatomy. LEFT-RIGHT COMPOSITION LOCK: If the text-bearing wall occupies the LEFT side of the image, place ALL figures and ALL objects they use together in the LOWER-RIGHT foreground, across from the facade. If the text-bearing wall occupies the RIGHT side, place ALL figures and their used objects together in the LOWER-LEFT foreground. Do not distribute characters or props beneath the wall or across both sides. The diagonal eye line must reach the first red wall word with anatomically natural head and neck rotation. For a front-facing facade, choose a coherent opposite foreground grouping without inventing a left/right wall side. SUPPORT OBJECTS / OPPOSITE-SIDE LOCK: Any bench, stairs, steps, railing, chair, ledge or other object that a figure sits on, leans against, holds or physically uses MUST be placed on the publicly accessible foreground OPPOSITE the text-bearing facade, never directly underneath the wall lettering or attached to the text-bearing wall. Show the complete usable object and its contact points clearly, with realistic support and perspective. Place the figure and its support object together across the street or on a facing foreground platform, leaving a clear open sightline toward the first red word. Never place a seated or leaning figure immediately at the foot of the text wall; do not demand an anatomically extreme upward neck tilt. Preserve manually selected figure placement when compatible; otherwise flag the spatial conflict rather than silently moving a manually locked figure."];
 if(x.wall.enabled)lines.push("WALL: monumental matte red typography, "+x.wall.font+"; dominance "+x.wall.dominance+"%; single planar perspective; preserve every glyph and original line break.","BEGIN EXACT WALL TEXT",normalize(x.wall.text),"END EXACT WALL TEXT");
 else lines.push("WALL DISABLED: no wall lettering.");
 lines.push("FIGURES: ONLY "+active.length+" enabled figures. Every figure is independently controlled.");
 for(const f of active){const target=gazeTarget(f,x,active);lines.push("FIGURE ["+f.id+"] "+f.name+": POSE="+f.pose+"; POSITION="+f.position+"; BODY ORIENTATION="+f.orientation+"; CLOTHING="+(f.clothing||"preserve original clothing")+"; GESTURE="+(f.gesture||"none beyond selected pose")+"; GAZE TARGET="+target+". Preserve the exact independent pose, limb support and selected placement. For the gaze, calculate the eye-to-target vector from THIS figure's physical position; rotate both eyes, entire head and neck anatomically. Do not force a common head direction. Do not change the pose to solve gaze.");}
 if(x.poster.enabled){if(Object.keys(x.poster.colors||{}).length)lines.push("POSTER WORD COLORS (EXACT MANUAL MAP): "+JSON.stringify(x.poster.colors)+". Apply colors only to the specified words; preserve all other lettering.");lines.push("POSTER: one physical placard only; mode="+x.poster.mode+"; owner="+x.poster.owner+"; hand="+x.poster.hand+". Mode and hand are a single locked decision. Preserve selected owner and legible colors; do not invent alternative hand, stand or holding mode.","BEGIN EXACT POSTER TEXT",normalize(x.poster.text),"END EXACT POSTER TEXT");}
 else lines.push("POSTER DISABLED: no placard.");
 lines.push("POSE MIX: "+(x.mix?"ON; only explicit per-figure choices apply.":"OFF; preserve every original individual pose and gaze.") ,"PRIORITY: manual user selections > automatic defaults. No legacy overrides. No alternative camera or poster instructions.","FINAL CHECK: exact text, correct gaze target per figure, independent poses, physically plausible foreground, one consistent poster state, no text collisions.");
 return {ok:true,errors:[],prompt:lines.join("\n")};
}
root.BDS10={DEFAULTS:clone(DEFAULTS),validate,generate,firstWord};
})(typeof globalThis!=="undefined"?globalThis:window);
