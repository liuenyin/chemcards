import {ELEMENTS,countCards,massText} from './chemistry.mjs';
import {playSound} from './sound.mjs';
import {elementFinish} from './visuals.mjs';

// Owns physical card selection. Duplicate atoms stay distinct throughout a gesture.
export class CardHand {
 constructor(host,{cards,selection,sort,onChange,onDrop,canPlay,deal=false}){
  this.host=host;this.onChange=onChange;this.onDrop=onDrop;this.canPlay=canPlay;
  this.selected=new Set();this.anchor=null;this.gesture=null;this.first=deal;
  this.update({cards,selection,sort});
  this.resize=new ResizeObserver(()=>this.layout());this.resize.observe(host);
  this.down=e=>this.pointerDown(e);this.move=e=>this.pointerMove(e);this.up=e=>this.pointerUp(e);
  this.cancel=()=>this.cancelGesture();
  host.addEventListener('pointerdown',this.down);host.addEventListener('pointermove',this.move);
  host.addEventListener('pointerup',this.up);host.addEventListener('pointercancel',this.cancel);
  host.addEventListener('contextmenu',e=>e.preventDefault());
 }
 update({cards,selection={},sort='element'}){
  const oldRects=new Map([...this.host.querySelectorAll('[data-card]')].map(b=>[b.dataset.card,b.getBoundingClientRect()]));
  const occurrence={};this.cards=cards.map(e=>({e,id:e+'-'+(occurrence[e]=(occurrence[e]||0)+1)}));
  this.cards.sort((a,b)=>sort==='mass'?ELEMENTS[b.e].mass-ELEMENTS[a.e].mass:ELEMENTS[a.e].z-ELEMENTS[b.e].z);
  const available=new Set(this.cards.map(c=>c.id));this.selected=new Set([...this.selected].filter(id=>available.has(id)));
  for(const e of Object.keys(ELEMENTS)){
   const these=this.cards.filter(c=>c.e===e),desired=selection[e]||0;
   const chosen=these.filter(c=>this.selected.has(c.id));
   chosen.slice(desired).forEach(c=>this.selected.delete(c.id));
   let current=Math.min(chosen.length,desired);for(const c of these){if(current>=desired)break;if(!this.selected.has(c.id)){this.selected.add(c.id);current++;}}
  }
  this.host.classList.add('physical-hand');
  this.host.innerHTML=this.cards.map((c,i)=>{const el=ELEMENTS[c.e];return `<button class="playing-card ${elementFinish(c.e)}" data-card="${c.id}" data-element="${c.e}" aria-pressed="false" style="--card:${el.bg};--ink:${el.ink};--deal-delay:${Math.min(i*12,330)}ms" title="${el.name} · ${el.color}"><span class="card-corner"><b>${c.e}</b><small>${el.z}</small></span><span class="card-center"><strong>${c.e}</strong><span>${el.name}</span><small>${massText(el.mass)}</small></span><span class="card-picked" aria-hidden="true">✓</span></button>`;}).join('');
  this.host.querySelectorAll('[data-card]').forEach(b=>{b.onclick=e=>{if(e.detail===0){this.toggle(b.dataset.card,e.shiftKey);}};});
  this.layout();this.paint();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(this.first){playSound('deal');if(!reduced)this.host.classList.add('dealing');setTimeout(()=>this.host.classList.remove('dealing'),850);this.first=false;}
  else if(!reduced){for(const b of this.host.querySelectorAll('[data-card]')){const old=oldRects.get(b.dataset.card);if(!old)continue;const now=b.getBoundingClientRect();const dx=old.x-now.x,dy=old.y-now.y;if(Math.abs(dx)+Math.abs(dy)>3)b.animate([{translate:`${dx}px ${dy}px`},{translate:'0 0'}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)'});}}
 }
 layout(){
  if(this.gesture)return;
  const width=this.host.clientWidth,small=width<650,cardWidth=small?75:94,cardHeight=small?112:136;
  const capacity=Math.max(2,Math.floor((width-cardWidth-20)/(small?34:38))+1);
  const rows=Math.max(1,Math.ceil(this.cards.length/capacity)),perRow=Math.ceil(this.cards.length/rows);
  const spacing=Math.min(small?58:66,(width-cardWidth-20)/Math.max(1,perRow-1));
  this.host.style.setProperty('--card-width',cardWidth+'px');this.host.style.setProperty('--card-height',cardHeight+'px');
  this.host.style.height=(rows*(cardHeight+22)+32)+'px';
  const list=[...this.host.querySelectorAll('[data-card]')];
  list.forEach((b,i)=>{const row=Math.floor(i/perRow),j=i%perRow,count=Math.min(perRow,list.length-row*perRow),span=cardWidth+(count-1)*spacing,left=(width-span)/2;
   const normalized=count>1?(j-(count-1)/2)/((count-1)/2):0;
   b.style.left=(left+j*spacing)+'px';b.style.top=(27+row*(cardHeight+22)+Math.abs(normalized)*5)+'px';
   b.style.setProperty('--angle',(normalized*1.8)+'deg');b.style.setProperty('--order',String(j+1));b.dataset.row=String(row);
  });
 }

 counts(){return countCards(this.cards.filter(c=>this.selected.has(c.id)).map(c=>c.e));}
 paint(){for(const b of this.host.querySelectorAll('[data-card]')){const selected=this.selected.has(b.dataset.card);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));b.setAttribute('aria-label',`${ELEMENTS[b.dataset.element].name}原子，${selected?'已选，点击取消':'点击选择'}`);}}
 notify(){this.paint();this.onChange(this.counts());}
 toggle(id,range=false){
  playSound('select');
  if(range&&this.anchor){const a=this.cards.findIndex(c=>c.id===this.anchor),b=this.cards.findIndex(c=>c.id===id);this.cards.slice(Math.min(a,b),Math.max(a,b)+1).forEach(c=>this.selected.add(c.id));}
  else{this.selected.has(id)?this.selected.delete(id):this.selected.add(id);this.anchor=id;}
  this.notify();
 }
 pointerDown(e){const button=e.target.closest('[data-card]');if(!button||e.button>0||this.gesture)return;
  this.gesture={id:button.dataset.card,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,mode:'pending',original:new Set(this.selected),select:!this.selected.has(button.dataset.card),visited:new Set(),shift:e.shiftKey};
  this.host.setPointerCapture(e.pointerId);
 }
 pointerMove(e){const g=this.gesture;if(!g)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;
  if(g.mode==='pending'&&Math.hypot(dx,dy)>8){
   if(dy<-12&&Math.abs(dy)>Math.abs(dx)*.65){g.mode='drag';if(!this.selected.has(g.id)){this.selected.clear();this.selected.add(g.id);this.notify();}this.makeGhost();this.host.classList.add('dragging');document.querySelector('.table')?.classList.add('drop-ready');}
   else if(Math.abs(dx)>8){g.mode='sweep';this.sweep(g.id);this.host.classList.add('sweeping');}
  }
  if(g.mode==='sweep'){
   const steps=Math.ceil(Math.hypot(e.clientX-g.lastX,e.clientY-g.lastY)/7);for(let i=1;i<=steps;i++){const x=g.lastX+(e.clientX-g.lastX)*i/steps,y=g.lastY+(e.clientY-g.lastY)*i/steps;const hit=document.elementFromPoint(x,y)?.closest('[data-card]');if(hit&&this.host.contains(hit))this.sweep(hit.dataset.card);}
  }
  if(g.mode==='drag'){
   this.ghost.style.left=e.clientX+'px';this.ghost.style.top=e.clientY+'px';const table=document.querySelector('.table'),r=table?.getBoundingClientRect();g.over=!!r&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;table?.classList.toggle('drop-over',g.over);table?.classList.toggle('drop-invalid',g.over&&!this.canPlay());
  }
  g.lastX=e.clientX;g.lastY=e.clientY;
 }
 sweep(id){const g=this.gesture;if(g.visited.has(id))return;g.visited.add(id);g.select?this.selected.add(id):this.selected.delete(id);playSound('select');this.notify();}
 pointerUp(e){const g=this.gesture;if(!g)return;this.gesture=null;try{this.host.releasePointerCapture(e.pointerId);}catch{}
  if(g.mode==='pending')this.toggle(g.id,g.shift);
  this.cleanGesture();if(g.mode==='drag'&&g.over)this.onDrop();
 }
 makeGhost(){this.ghost=document.createElement('div');this.ghost.className='card-drag-ghost';const selected=this.cards.filter(c=>this.selected.has(c.id));this.ghost.innerHTML=selected.slice(0,5).map((c,i)=>{const el=ELEMENTS[c.e];return `<span style="--card:${el.bg};--ink:${el.ink};--i:${i}">${c.e}</span>`;}).join('')+`<b>${selected.length} 张</b>`;document.body.append(this.ghost);}
 cleanGesture(){this.ghost?.remove();this.ghost=null;this.host.classList.remove('dragging','sweeping');document.querySelector('.table')?.classList.remove('drop-ready','drop-over','drop-invalid');}
 cancelGesture(){if(this.gesture){this.selected=this.gesture.original;this.gesture=null;this.notify();}this.cleanGesture();}
 dispose(){this.gesture=null;this.cleanGesture();this.resize?.disconnect();this.host.removeEventListener('pointerdown',this.down);this.host.removeEventListener('pointermove',this.move);this.host.removeEventListener('pointerup',this.up);this.host.removeEventListener('pointercancel',this.cancel);}
}

export function flyCards(cards,from,to,{reverse=false}={}){
 if(!from||!to||!cards.length||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const shown=cards.slice(0,7);shown.forEach((e,i)=>{const el=ELEMENTS[e],node=document.createElement('div');node.className='flying-card';node.textContent=e;node.style.cssText=`--card:${el.bg};--ink:${el.ink};left:${from.x+from.width/2-27}px;top:${from.y+from.height/2-38}px`;
  document.body.append(node);const animation=node.animate([{transform:`translate(0,0) rotate(${i*3-9}deg)`,opacity:1},{transform:`translate(${to.x+to.width/2-from.x-from.width/2+i*10}px,${to.y+to.height/2-from.y-from.height/2}px) rotate(${i*5-12}deg) scale(.85)`,opacity:reverse?1:.25}],{duration:420,delay:i*28,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'});animation.finished.finally(()=>node.remove());
 });
}
