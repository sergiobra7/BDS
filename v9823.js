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
