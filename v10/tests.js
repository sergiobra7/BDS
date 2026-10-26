/* Minimal deterministic regression tests: run in browser console or Node after core.js */
(function(){
 const assert=(condition,message)=>{if(!condition)throw new Error("V10 TEST FAILED: "+message)};
 const b=globalThis.BDS10;const base=JSON.parse(JSON.stringify(b.DEFAULTS));
 base.wall.text="RAHMETLİ AMCAM\nDERDİ Kİ:";base.figures.push({id:"N1",name:"Mantelmann",enabled:true,pose:"Stehend",position:"Rechter Mittelgrund",orientation:"Automatisch",gaze:"camera"});
 const out=b.generate(base);assert(out.ok,"valid input");assert(out.prompt.includes('FIRST WALL LINE: "RAHMETLİ"'),"first word only");assert(out.prompt.includes("GAZE TARGET=camera lens"),"independent gaze");assert(!out.prompt.includes('SAME exact FIRST WORD'),"no global gaze");
 base.poster={enabled:true,text:"TEST",owner:"main",mode:"Freistehend",hand:"Links"};assert(!b.generate(base).ok,"reject contradictory poster hand");
 base.poster={enabled:true,text:"TEST",owner:"main",mode:"Gehalten",hand:"Keine"};assert(!b.generate(base).ok,"reject held placard without hand");
 base.poster.hand="Links";assert(b.generate(base).ok,"accept held placard with left hand");
 base.poster.hand="Rechts";assert(b.generate(base).ok,"accept held placard with right hand");
 base.poster.mode="Freistehend";base.poster.hand="Keine";assert(b.generate(base).ok,"accept freestanding placard without hand");
 base.figures[0].pose="Hände in Manteltaschen";base.poster.mode="Gehalten";base.poster.hand="Links";assert(!b.generate(base).ok,"reject poster held with hands in pockets");
 base.figures[0].pose="Ruhig stehend, Hände locker";assert(b.generate(base).ok,"allow held poster with free hands");
 base.poster.enabled=false;base.figures[0].pose="Langsam gehend";assert(!b.generate(base).ok,"reject moving pose");
 base.figures[0].pose="Ruhig stehend, Hände locker";base.figures.forEach(f=>f.enabled=false);assert(!b.generate(base).ok,"reject zero active figures");
 base.figures[0].enabled=true;base.wall.dominance=101;assert(!b.generate(base).ok,"reject typography dominance above 100");
 base.wall.dominance=90;assert(b.generate(base).ok,"recover valid configuration");
 console.log("BDS V10 engine regression tests passed");
})();
