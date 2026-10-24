/* V9.8.8 functional smoke tests with isolated browser stubs. */
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const listeners={},store={};
const figures=[{id:'N1',type:'Mantelmann',enabled:true}];
const ctx={
 console,JSON,Math,Number,String,Array,Object,Set,Map,Date,
 localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v}},
 document:{addEventListener:(type,fn)=>(listeners[type]??=[]).push(fn),getElementById:()=>null},
 window:{scrollX:0,scrollY:0,scrollTo:()=>{}},requestAnimationFrame:()=>{},
 render:()=>{},prompt:()=>'',V970snapshot:()=>({}),V972validate:x=>x,V972restore:()=>{},
 state:{wall:'DEDEME KİME GÜVENEYİM DEDİM',facadeShape:'Auto',lineFilter:'Auto',scene:1,opa:'Nein'},
 V941:{figures,signOn:false,wallOn:true},V96:{proposals:[]},
 V94matches:()=>Array.from({length:10},(_,i)=>({i,name:'Fassade '+i,score:100-i,shape:'WIDE XXL',lim:[4,10,40]})),
 V96analyse:()=>({topic:'Vertrauen',kinds:['stadt','hafen'],longest:30,action:'Stille Reaktion'}),
 V96SCENES:Array.from({length:10},(_,i)=>({name:'Szene '+i,city:'Istanbul',kind:i%2?'hafen':'stadt'})),
 DATA:{scenes:Array.from({length:30},(_,i)=>'Architektur '+i)},
 BDS987figures:()=>[{id:'main',label:'Mann mit Zopf',enabled:true},{id:'N1',label:'Mantelmann',enabled:true}],
 BDS987:{main:true,N1:true,notes:{},poster:false},BDS987save:()=>{},
 BDS987textUI:()=>'<section class="panel"><h2>WANDTEXT</h2></section><section class="panel"><h2>FASSADENFINDER</h2></section>',
 BDS987editorUI:()=>'<section id="bds987Editorial"></section>',
 V941main:()=>'',V941figures:()=>'',V941figHTML:()=>'',V969figureControls:()=>'',poseTab:()=>'',castTab:()=>'',V941oldTextTab:()=>'',V94sceneCode:()=>'',toast:()=>{},
 escapeHTML:x=>String(x),tab:'text'
};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('v988.js','utf8'),ctx);ctx.V988=vm.runInContext('V988',ctx);
function ok(name,fn){fn();console.log('PASS '+name)}
ok('3 facade recommendations',()=>assert.equal((ctx.V988facades().match(/Diese Fassade auswählen/g)||[]).length,3));
ok('facades rotate',()=>{const a=ctx.V988facades();ctx.V988.facadePage=1;assert.notEqual(a,ctx.V988facades())});
ok('3 scene recommendations',()=>assert.equal((ctx.V988scenes().match(/Szene \+ Kamera übernehmen/g)||[]).length,3));
ok('scene scores vary by topic',()=>{ctx.V988scenes();assert.notEqual(ctx.V96.proposals[0].score,ctx.V96.proposals[1].score)});
ok('3 editorial ideas',()=>assert.equal(ctx.V988editorIdeas().length,3));
ok('editorial includes active figures',()=>assert.equal(ctx.V988editorIdeas()[0].notes.length,2));
ok('editorial apply changes saved notes',()=>{const b={dataset:{v988Apply:'0'},hasAttribute:x=>x==='data-v988-apply'};for(const cb of listeners.click||[])cb({target:{closest:()=>b}});assert.ok(ctx.BDS987.notes.main?.includes('ersten roten Textzeile'));assert.ok(ctx.BDS987.notes.N1)});
ok('manual settings unaffected by recommendation refresh',()=>{const original=ctx.state.scene;const b={dataset:{v988:'scenes'},hasAttribute:()=>false};for(const cb of listeners.click||[])cb({target:{closest:()=>b}});assert.equal(ctx.state.scene,original)});
console.log('V9.8.8 functional smoke checks complete');
