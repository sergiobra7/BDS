/* Minimal deterministic regression tests: run in browser console or Node after core.js */
(function(){
 const b=globalThis.BDS10;const base=JSON.parse(JSON.stringify(b.DEFAULTS));
 base.wall.text="RAHMETLİ AMCAM\nDERDİ Kİ:";base.figures.push({id:"N1",name:"Mantelmann",enabled:true,pose:"Stehend",position:"Rechter Mittelgrund",orientation:"Automatisch",gaze:"camera"});
 const out=b.generate(base);console.assert(out.ok,"valid input");console.assert(out.prompt.includes('FIRST WALL LINE: "RAHMETLİ"'),"first word only");console.assert(out.prompt.includes("GAZE TARGET=camera lens"),"independent gaze");console.assert(!out.prompt.includes('SAME exact FIRST WORD'),"no global gaze");
 base.poster={enabled:true,text:"TEST",owner:"main",mode:"Freistehend",hand:"Links"};console.assert(!b.generate(base).ok,"reject contradictory poster hand");
 base.poster={enabled:true,text:"TEST",owner:"main",mode:"Gehalten",hand:"Keine"};console.assert(!b.generate(base).ok,"reject held placard without hand");
 base.poster.hand="Links";console.assert(b.generate(base).ok,"accept held placard with left hand");
 base.poster.hand="Rechts";console.assert(b.generate(base).ok,"accept held placard with right hand");
 base.poster.mode="Freistehend";base.poster.hand="Keine";console.assert(b.generate(base).ok,"accept freestanding placard without hand");
 console.log("BDS V10 engine smoke tests finished");
})();
