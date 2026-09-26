import {ELEMENTS,SUBSTANCES,BY_KEY,countCards,keyOf,atomCount,massOf,expand,massText} from './chemistry.mjs';
export function seededRandom(seed){let t=seed>>>0;return()=>{t+=0x6D2B79F5;let x=Math.imul(t^t>>>15,t|1);x^=x+Math.imul(x^x>>>7,x|61);return((x^x>>>14)>>>0)/4294967296;};}
export function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createPool(){
 const total=1800,sum=Object.values(ELEMENTS).reduce((n,e)=>n+e.weight,0);
 const rows=Object.entries(ELEMENTS).map(([e,v])=>({e,n:Math.floor(v.weight/sum*total),fraction:v.weight/sum*total%1}));
 let remainder=total-rows.reduce((n,r)=>n+r.n,0);
 for(const r of [...rows].sort((a,b)=>b.fraction-a.fraction||ELEMENTS[a.e].z-ELEMENTS[b.e].z)){if(remainder--<=0)break;r.n++;}
 return rows.flatMap(r=>Array(r.n).fill(r.e));
}
export const POOL=createPool();
export function generateDeck(size,rng=Math.random,strategy='mixed'){
 if(!Number.isInteger(size)||size<16||size>108)throw Error('牌库张数需要为 16—108 的整数');
 let pool=shuffle(POOL,rng);if(strategy==='random')return{cards:pool.slice(0,size),seeds:[]};
 // A small rotating palette prevents 19 unrelated elements competing for a short deck.
 const palette=new Set([
  'H','C','O','N','Cl','Na',
  ...shuffle(['S','P','Si','B','F'],rng).slice(0,2),
  ...shuffle(['Mg','Ca','Fe','Cu','Zn','Al','K','Li','Ba','Mn','Cr','Ti','Co','Ni','Sn','Pb'],rng).slice(0,2),
  ...shuffle(['Br','I','Ag','Pt','Au','Hg','Bi','As','Se','W','Mo','He','Ar','Xe'],rng).slice(0,2)
 ]);
 pool=pool.filter(e=>palette.has(e));
 const cards=[],seeds=[];const budget=Math.floor(size*.66);let attempts=0;
 while(cards.length<budget-1&&attempts++<500){
  const group=rng();let options=SUBSTANCES.filter(s=>Object.keys(s.counts).every(e=>palette.has(e))&&s.size<=Math.min(14,budget-cards.length)&&s.size>=2&&(group<.22?s.category==='有机物':group<.85?s.category!=='有机物'&&s.category!=='单质':s.category==='单质'));
  if(!options.length)continue;const s=options[Math.floor(rng()*options.length)];const required=expand(s.counts);const available=countCards(pool);if(Object.entries(s.counts).some(([e,n])=>(available[e]||0)<n))continue;
  for(const e of required){pool.splice(pool.indexOf(e),1);cards.push(e);}seeds.push(s.id);
 }
 cards.push(...pool.slice(0,size-cards.length));return{cards:shuffle(cards,rng),seeds};
}
export function newGame({mode='A',size=108,initialHand=9,hintsEnabled=true,strategy='random',seed=Date.now(),players=3,custom=[],structureMode='quick',relayRescue=true}={}){
 if(mode==='B'){size=108;if(!Number.isInteger(initialHand)||initialHand<2||initialHand>12)throw Error('起手牌数需要为 2—12 的整数');}else initialHand=null;
 if(!['A','B'].includes(mode))throw Error('未知模式');if(!Number.isInteger(players)||players<2||players>6)throw Error('需要 2—6 位玩家');const rng=seededRandom(seed);const deck=generateDeck(size,rng,strategy);const hands=Array.from({length:players},()=>[]),stock=[...deck.cards];
 if(mode==='A'){let i=0;while(stock.length)hands[i++%players].push(stock.pop());}else for(let n=0;n<initialHand;n++)for(const h of hands)h.push(stock.pop());
 const context=mode==='B'?[stock.pop()]:[];
 return{version:3,initialHand,hintsEnabled,mode,size,strategy,structureMode,relayRescue,seed,hands,stock,discard:[],context,table:null,current:0,lastPlayer:null,passes:0,dryTurns:0,winner:null,turn:1,history:[],deck:deck.cards,seeds:deck.seeds,custom};
}
const includesCounts=(have,need)=>Object.entries(need).every(([e,n])=>(have[e]||0)>=n);
export function legalMoves(state,player=state.current){
 if(state.winner!==null)return[];const have=countCards(state.hands[player]),moves=[];
 if(state.mode==='A'){
  for(const e of Object.keys(have)){const mass=ELEMENTS[e].mass;const elemental=SUBSTANCES.some(s=>s.category==='单质'&&s.size===1&&s.counts[e]===1);if(!elemental&&(!state.table||mass>state.table.mass))moves.push({id:'atom-'+e,name:ELEMENTS[e].name+'原子',formula:e,counts:{[e]:1},mass,size:1,category:'原子',cards:[e],graph:null});}
  for(const s of [...SUBSTANCES,...(state.custom||[])])if((!state.table||s.mass>state.table.mass)&&includesCounts(have,s.counts))moves.push({...s,cards:expand(s.counts)});
 }else{
  const context=countCards(state.context);for(const s of [...SUBSTANCES,...(state.custom||[])]){if(!includesCounts(s.counts,context))continue;const need={};for(const[e,n]of Object.entries(s.counts)){const d=n-(context[e]||0);if(d)need[e]=d;}if(atomCount(need)>0&&includesCounts(have,need))moves.push({...s,cards:expand(need)});}
 }
 if(state.mode==='B'&&state.relayRescue!==false&&!moves.length){
  for(const e of Object.keys(have))moves.push({id:'rescue-'+e,name:ELEMENTS[e].name+' · 单原子解套',formula:e,counts:{[e]:1},mass:ELEMENTS[e].mass,size:1,category:'接龙解套',cards:[e],graph:null,rescue:true});
 }
 return moves.sort((a,b)=>b.cards.length-a.cards.length||a.mass-b.mass||a.name.localeCompare(b.name,'zh'));
}
export function selectedMoves(state,cards){if(!cards.length)return[];const key=keyOf(countCards(cards));return legalMoves(state).filter(m=>keyOf(countCards(m.cards))===key);}
export function play(state,moveId,cards){
 if(state.winner!==null)throw Error('本局已经结束');const move=selectedMoves(state,cards).find(m=>m.id===moveId);if(!move)throw Error('这个组合不能在当前回合出牌');
 const next=structuredClone(state),player=state.current;
 for(const e of move.cards){const i=next.hands[player].indexOf(e);if(i<0)throw Error('手牌不足');next.hands[player].splice(i,1);}
 if(state.mode==='B'){next.discard.push(...next.context);next.context=[...move.cards];}else next.discard.push(...move.cards);
 next.table={id:move.id,name:move.name,formula:move.formula,mass:move.mass,category:move.category,player,cards:[...move.cards]};next.lastPlayer=player;next.passes=0;next.dryTurns=0;
 next.history.unshift({type:'play',player,name:move.name,formula:move.formula,mass:move.mass,cards:[...move.cards],rescue:!!move.rescue,turn:state.turn});
 if(!next.hands[player].length)next.winner=player;else next.current=(player+1)%state.hands.length;next.turn++;return next;
}
function draw(next,rng){if(!next.stock.length&&next.discard.length){next.stock=shuffle(next.discard,rng);next.discard=[];}if(!next.stock.length)return null;const card=next.stock.pop();return card;}
export function skip(state){
 if(state.winner!==null)throw Error('本局已经结束');const next=structuredClone(state),p=state.current;
 if(state.mode==='A'){
  if(!state.table)throw Error('领出回合需要出牌，单原子也可以');next.passes++;next.history.unshift({type:'pass',player:p,turn:state.turn});
  if(next.passes===state.hands.length-1){next.current=next.lastPlayer;next.table=null;next.passes=0;next.history.unshift({type:'lead',player:next.current,turn:state.turn});}else next.current=(p+1)%state.hands.length;
 }else{
  const rng=seededRandom(state.seed+state.turn*719);const card=draw(next,rng);if(card)next.hands[p].push(card);next.history.unshift({type:card?'draw':'empty',player:p,turn:state.turn});next.dryTurns++;next.current=(p+1)%state.hands.length;
  if(next.dryTurns>=state.hands.length*2){next.discard.push(...next.context);next.context=[];const fresh=draw(next,rng);next.context=fresh?[fresh]:[];next.table=null;next.dryTurns=0;next.history.unshift({type:'reset',player:p,turn:state.turn,formula:fresh||''});}
 }
 next.turn++;return next;
}
export function chooseBotMove(state){
 const moves=legalMoves(state);if(!moves.length)return null;const unique=moves.filter((m,i)=>moves.findIndex(x=>keyOf(countCards(x.cards))===keyOf(countCards(m.cards)))===i);
 if(state.mode==='A'){
  const hand=state.hands[state.current];unique.sort((a,b)=>score(b)-score(a));function score(m){const remain=[...hand];for(const e of m.cards)remain.splice(remain.indexOf(e),1);const counts=countCards(remain);const future=SUBSTANCES.filter(s=>includesCounts(counts,s.counts)).reduce((max,s)=>Math.max(max,s.size),0);return m.cards.length*12+future*2-m.mass/100000;}
 }
 if(state.mode==='B'){
  const frequency={};for(const s of SUBSTANCES)for(const e of Object.keys(s.counts))frequency[e]=(frequency[e]||0)+1;
  const score=m=>m.cards.reduce((sum,e)=>sum+1+30/Math.sqrt(frequency[e]||1),0)+(m.cards.length===state.hands[state.current].length?1000:0);
  unique.sort((a,b)=>score(b)-score(a)||a.mass-b.mass);
 }
 return unique[0];
}
export function auditGame(state){const total=state.hands.flat().length+state.stock.length+state.discard.length+(state.mode==='B'?state.context.length:0);return total===state.size;}
