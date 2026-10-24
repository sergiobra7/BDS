/* BİR.DUVARSESİ V9.6.6 — direct, visible Smart Scene Director restoration */
'use strict';
const V966VERSION='9.6.6';
// Preserve all original V9.6.5.1 settings, state, project persistence and other tabs.
V96.open=true;
V941wall=function(){
  const switcher=V941check('Wandtext aktivieren','wallOn',!!V941.wallOn);
  if(!V941.wallOn)return `<div class="panel"><h2>Wandtext</h2>${switcher}<p class="hint">Wandtext und Director sind deaktiviert. Dein Text bleibt gespeichert.</p></div>`;
  return `<div class="panel"><h2>Wandtext</h2>${switcher}<label class="label">Türkischer Wandtext – exakt eingeben</label><textarea data-key="wall" rows="7">${escapeHTML(state.wall)}</textarea></div>
  <div class="panel" id="v966Director"><h2>SMART SCENE DIRECTOR PRO</h2>${V96panel()}<p class="hint">Optional. Empfehlungen ändern deine manuellen Einstellungen erst nach Klick auf „Übernehmen“.</p></div>
  <div class="panel"><h2>Schriftart & Wandqualität</h2>${V963select('wallPreset','Schrift-Preset',['T703 – Anatolian Monumental Bold','Bisherige Schriftwahl'],V963.wallPreset)}${V941select('Schriftart','fontChoice',V941fontOptions,V941.fontChoice)}${V941select('Schriftstärke','fontWeight',['Maximal fett','Fett','Extra fett'],V941.fontWeight)}${V941select('Buchstabenabstand','fontSpacing',['Sehr eng','Eng','Normal'],V941.fontSpacing)}${V941select('Zeilenabstand','fontLineSpacing',['Sehr eng','Eng','Normal'],V941.fontLineSpacing)}${V941select('Schriftwirkung','textEffect',['Mattrot','Leuchtrot ohne Leuchten oder Strahler'],V941.textEffect)}${V941select('Textdominanz','textDominance',['XXL','XXXL','MAXIMUM'],V941.textDominance)}${V963select('wallFinish','Wandoberfläche',['Tiefschwarz · sauberer Backstein','Bestehende Oberflächenwahl'],V963.wallFinish)}</div>
  <details class="v94details"><summary>Wandtext analysieren · vollständiger Text-Checker</summary>${V94oldTextTab()}</details><details class="v94details"><summary>TOP 3 · zusätzliche Fassadenempfehlungen</summary>${V94recommendations()}</details>`;
};
// Version is propagated into the exported English prompt without modifying original wall text.
const V966oldPrompt=prompt;
prompt=function(){return V966oldPrompt().replaceAll('BİR.DUVARSESİ V9.6.5.1','BİR.DUVARSESİ V9.6.6')};
render();

/* V9.6.6 AUTO-CHECK: correct ordered hierarchy, functional Director, and regression checks. */
const V966previousQA=V965qa;
V965qa=function(){
  const r=V966previousQA();
  r.version='9.6.6';
  const ordered=()=>{const previous=V941.wallOn;try{
    V941.wallOn=true;const h=V941wall();
    const tokens=['Wandtext aktivieren','Türkischer Wandtext – exakt eingeben','SMART SCENE DIRECTOR PRO','Schriftart & Wandqualität'];
    const pos=tokens.map(t=>h.indexOf(t));
    return pos.every(x=>x>=0)&&pos.every((x,i)=>i===0||x>pos[i-1]);
  }finally{V941.wallOn=previous}};
  const existing=r.checks.find(x=>x.name.startsWith('Wandtext: Schalter zuerst'));
  if(existing){existing.name='Wandtext: Aktivieren → Textfeld → Director → Schriftart';existing.ok=ordered();existing.detail=existing.ok?'':'Reihenfolge stimmt nicht';}
  const check=(name,fn)=>{let ok=false,detail='';try{ok=!!fn()}catch(e){detail=String(e)}r.checks.push({name,ok,detail})};
  check('Director: sichtbar und nicht in Details versteckt',()=>{const p=V941.wallOn;try{V941.wallOn=true;const h=V941wall();return h.includes('id="v966Director"')&&h.includes('data-v96="analyze"')&&h.indexOf('id="v966Director"')<h.indexOf('<details')}finally{V941.wallOn=p}});
  check('Director: fünf Empfehlungen nach Analyse',()=>{const a=V96analyse(state.wall);return !!a&&typeof V96panel==='function'&&typeof V96analyse==='function'&&Array.isArray(V96.proposals)});
  check('Wandtext deaktiviert: Text bleibt erhalten',()=>{const p=V941.wallOn,txt=state.wall;try{V941.wallOn=false;return !V941wall().includes('data-key="wall"')&&state.wall===txt}finally{V941.wallOn=p}});
  check('Startregister Wandtext',()=>V965ORDER[0]==='text');
  r.passed=r.checks.filter(c=>c.ok).length;r.failed=r.checks.length-r.passed;
  V965.qaLast=r;V965save();return r;
};
V965qaPanel=function(){const r=V965qa();return `<div class="panel"><h2>V9.6.6 · AUTO-CHECK</h2><p class="hint">${r.passed}/${r.checks.length} Prüfungen bestanden · ${r.failed} Fehler. Automatische Browserprüfung ist kein Ersatz für iPhone-Safari-Sichtprüfung.</p>${r.checks.map(x=>`<div class="item">${x.ok?'✓':'✗'} ${escapeHTML(x.name)}${x.detail?' · '+escapeHTML(x.detail):''}</div>`).join('')}<button class="btn primary" id="v965QaRerun">Auto-Check erneut ausführen</button><button class="small" id="v965QaExport">Prüfbericht herunterladen</button></div>`};
