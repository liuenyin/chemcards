import {ELEMENTS,SUBSTANCES,BY_KEY,countCards,keyOf,atomCount,massOf,expand,massText} from './chemistry.mjs';
export function seededRandom(seed){let t=seed>>>0;return()=>{t+=0x6D2B79F5;let x=Math.imul(t^t>>>15,t|1);x^=x+Math.imul(x^x>>>7,x|61);return((x^x>>>14)>>>0)/4294967296;};}
export function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createPool(){const sum=Object.values(ELEMENTS).reduce((s,e)=>s+e.weight,0),cards=[];for(const[e,v]of Object.entries(ELEMENTS))cards.push(...Array(Math.floor(v.weight/sum*1800)).fill(e));while(cards.length<1800)cards.push('H');return cards;}
export const POOL=createPool();
export function generateDeck(size,rng=Math.random,strategy='mixed'){
 if(![72,108].includes(size))throw Error('牌库必须为 72 或 108 张');
 let pool=shuffle(POOL,rng);if(strategy==='random')return{cards:pool.slice(0,size),seeds:[]};
 // A small rotating palette prevents 19 unrelated elements competing for a short deck.
 const palette=new Set(['H','C','O','N','Cl','Na',...shuffle(['S','P','Si'],rng).slice(0,1),...shuffle(['Mg','Ca','Fe','Cu','Zn','Al','K'],rng).slice(0,1),...shuffle(['Br','I','Ag'],rng).slice(0,1)]);
 pool=pool.filter(e=>palette.has(e));
 const cards=[],seeds=[];const budget=Math.floor(size*.66);let attempts=0;
 while(cards.length<budget-1&&attempts++<500){
  const group=rng();let options=SUBSTANCES.filter(s=>Object.keys(s.counts).every(e=>palette.has(e))&&s.size<=Math.min(14,budget-cards.length)&&s.size>=2&&(group<.4?s.category==='有机物':group<.85?s.category!=='有机物'&&s.category!=='单质':s.category==='单质'));
  if(!options.length)continue;const s=options[Math.floor(rng()*options.length)];const required=expand(s.counts);const available=countCards(pool);if(Object.entries(s.counts).some(([e,n])=>(available[e]||0)<n))continue;
  for(const e of required){pool.splice(pool.indexOf(e),1);cards.push(e);}seeds.push(s.id);
 }
 cards.push(...pool.slice(0,size-cards.length));return{cards:shuffle(cards,rng),seeds};
}
export function newGame({mode='A',size=108,strategy='mixed',seed=Date.now()}={}){
 if(!['A','B'].includes(mode))throw Error('未知模式');const rng=seededRandom(seed);const deck=generateDeck(size,rng,strategy);const hands=[[],[],[]],stock=[...deck.cards];
 if(mode==='A'){let i=0;while(stock.length)hands[i++%3].push(stock.pop());}else for(let n=0;n<9;n++)for(const h of hands)h.push(stock.pop());
 const context=mode==='B'?[stock.pop()]:[];
 return{version:1,mode,size,strategy,seed,hands,stock,discard:[],context,table:null,current:0,lastPlayer:null,passes:0,dryTurns:0,winner:null,turn:1,history:[],deck:deck.cards,seeds:deck.seeds};
}
const includesCounts=(have,need)=>Object.entries(need).every(([e,n])=>(have[e]||0)>=n);
export function legalMoves(state,player=state.current){
 if(state.winner!==null)return[];const have=countCards(state.hands[player]),moves=[];
 if(state.mode==='A'){
  for(const e of Object.keys(have)){const mass=ELEMENTS[e].mass;if(!state.table||mass>state.table.mass)moves.push({id:'atom-'+e,name:ELEMENTS[e].name+'原子',formula:e,counts:{[e]:1},mass,size:1,category:'原子',cards:[e],graph:null});}
  for(const s of SUBSTANCES)if((!state.table||s.mass>state.table.mass)&&includesCounts(have,s.counts))moves.push({...s,cards:expand(s.counts)});
 }else{
  const context=countCards(state.context);for(const s of SUBSTANCES){if(!includesCounts(s.counts,context))continue;const need={};for(const[e,n]of Object.entries(s.counts)){const d=n-(context[e]||0);if(d)need[e]=d;}if(atomCount(need)>0&&includesCounts(have,need))moves.push({...s,cards:expand(need)});}
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
 next.history.unshift({type:'play',player,name:move.name,formula:move.formula,mass:move.mass,cards:[...move.cards],turn:state.turn});
 if(!next.hands[player].length)next.winner=player;else next.current=(player+1)%3;next.turn++;return next;
}
function draw(next,rng){if(!next.stock.length&&next.discard.length){next.stock=shuffle(next.discard,rng);next.discard=[];}if(!next.stock.length)return null;const card=next.stock.pop();return card;}
export function skip(state){
 if(state.winner!==null)throw Error('本局已经结束');const next=structuredClone(state),p=state.current;
 if(state.mode==='A'){
  if(!state.table)throw Error('领出回合需要出牌，单原子也可以');next.passes++;next.history.unshift({type:'pass',player:p,turn:state.turn});
  if(next.passes===2){next.current=next.lastPlayer;next.table=null;next.passes=0;next.history.unshift({type:'lead',player:next.current,turn:state.turn});}else next.current=(p+1)%3;
 }else{
  const rng=seededRandom(state.seed+state.turn*719);const card=draw(next,rng);if(card)next.hands[p].push(card);next.history.unshift({type:card?'draw':'empty',player:p,turn:state.turn});next.dryTurns++;next.current=(p+1)%3;
  if(next.dryTurns>=6){next.discard.push(...next.context);next.context=[];const fresh=draw(next,rng);next.context=fresh?[fresh]:[];next.table=null;next.dryTurns=0;next.history.unshift({type:'reset',player:p,turn:state.turn,formula:fresh||''});}
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
