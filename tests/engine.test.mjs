import assert from 'node:assert/strict';
import {ELEMENTS,SUBSTANCES,parseFormula,countCards,keyOf,massOf,graphMatches,expand} from '../dist/chemistry.mjs';
import {POOL,newGame,generateDeck,seededRandom,legalMoves,selectedMoves,play,skip,chooseBotMove,auditGame} from '../dist/engine.mjs';

assert.equal(POOL.length,1800);
assert.deepEqual(parseFormula('Ca3(PO4)2'),{Ca:3,P:2,O:8});
assert.throws(()=>parseFormula('Na(OH'));
assert.throws(()=>parseFormula('Xx2'));
assert.equal(massOf(parseFormula('CO')),28010);
assert.equal(massOf(parseFormula('N2')),28014);
assert.equal(massOf(parseFormula('C2H4')),28054);
for(const s of SUBSTANCES){assert.deepEqual(countCards(expand(s.counts)),s.counts);if(s.graph){assert(graphMatches(s.graph,s.graph.bonds),s.name);if(s.graph.bonds.length)assert(!graphMatches(s.graph,s.graph.bonds.slice(1)),s.name);}}
const propane=SUBSTANCES.find(s=>s.name==='丙烷');assert(graphMatches(propane.graph,[[2,1,1],[1,0,1]]));assert(!graphMatches(propane.graph,[[0,1,2],[1,2,1]]));
const a=newGame({mode:'A',size:72,seed:42});assert.deepEqual(a.hands.map(h=>h.length),[24,24,24]);assert(auditGame(a));
let mono={...a,hands:[['H'],['C'],['O']],table:null,current:0};assert.equal(play(mono,'atom-H',['H']).winner,0);
let lead=play(a,legalMoves(a)[0].id,legalMoves(a)[0].cards);lead=skip(lead);lead=skip(lead);assert.equal(lead.current,0);assert.equal(lead.table,null);assert(auditGame(lead));
const sameMass={...a,table:{mass:28014},hands:[['N','N','C','O'],[],[]]};assert(!legalMoves(sameMass).some(m=>m.formula==='N2'||m.formula==='CO'));
let b=newGame({mode:'B',size:108,seed:17});assert.deepEqual(b.hands.map(h=>h.length),[9,9,9]);assert.equal(b.stock.length,80);assert(auditGame(b));
const controlled={...b,context:['H'],hands:[['C','C','C','C','C','C','H','H','H','H','H','O'],['Cl','Na'],['H','O']],current:0};
const benzene=legalMoves(controlled).find(m=>m.name==='苯');assert(benzene);assert.equal(benzene.cards.length,11);const benzenePlay=play(controlled,benzene.id,benzene.cards);assert.equal(benzenePlay.context.length,11);const chloro=legalMoves(benzenePlay).find(m=>m.name==='氯苯');assert.deepEqual(chloro.cards,['Cl']);
for(let n=0;n<5;n++)b=skip(b);assert.equal(b.dryTurns,5);b=skip(b);assert.equal(b.dryTurns,0);assert.equal(b.context.length,1);assert(b.history.some(h=>h.type==='reset'));assert(auditGame(b));
let depleted={...newGame({mode:'B',size:72,seed:17}),stock:[],discard:['Cl','O']};const before=depleted.hands[0].length;depleted=skip(depleted);assert.equal(depleted.hands[0].length,before+1);assert.equal(depleted.stock.length,1);
const poolCounts=countCards(POOL);for(let seed=0;seed<40;seed++)for(const size of [54,72,108])for(const strategy of ['mixed','random']){const d=generateDeck(size,seededRandom(seed),strategy);assert.equal(d.cards.length,size);for(const[e,n]of Object.entries(countCards(d.cards)))assert(n<=poolCounts[e]);assert.deepEqual(d,generateDeck(size,seededRandom(seed),strategy));}
const report=[];
for(const mode of ['A','B']){
 let ended=0,maxTurns=0,totalTurns=0;const longGames=[];
 for(let seed=0;seed<36;seed++){
  let g=newGame({mode,size:seed%2?72:108,strategy:seed%3?'mixed':'random',seed:seed+100});
  for(let turn=0;turn<600&&g.winner===null;turn++){
   const move=chooseBotMove(g);g=move?play(g,move.id,move.cards):skip(g);
   assert(auditGame(g),`Card conservation ${mode} ${seed} ${turn}`);
   assert.equal(keyOf(countCards([...g.hands.flat(),...g.stock,...g.discard,...(mode==='B'?g.context:[])])),keyOf(countCards(g.deck)));
  }
  if(g.winner!==null)ended++;else longGames.push({seed:seed+100,strategy:g.strategy});
  maxTurns=Math.max(maxTurns,g.turn);totalTurns+=g.turn;
 }
 report.push({mode,completed:ended,games:36,averageTurns:Math.round(totalTurns/36),maxTurns,longGames});
 // Default B rescue guarantees a legal nonempty play. Always-playing bots
 // should finish; strict B can still run indefinitely and is a separate option.
 assert.equal(ended,36,'default rescue games should finish for always-playing bots');
}
console.log(JSON.stringify({status:'passed',substances:SUBSTANCES.length,pool:POOL.length,simulations:report},null,2));
