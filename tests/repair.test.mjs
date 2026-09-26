import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {database} from '../scripts/local-db.mjs';
import {SUBSTANCES,ELEMENTS,countCards,explicitGraph,structureMatches,parseFormula,keyOf} from '../dist/chemistry.mjs';
import {POOL,newGame,legalMoves,play,skip,chooseBotMove,auditGame} from '../dist/engine.mjs';

const expected={'硝基苯':'C6H5NO2','苯胺':'C6H7N','硫化银':'Ag2S','六羰基钨':'W(CO)6','三氟化氮':'NF3','四氟化碳':'CF4','萘':'C10H8','苯乙烯':'C8H8','乙酸丁酯':'C6H12O2','硫氰酸钾':'KSCN'};
for(const [name,formula]of Object.entries(expected))assert.equal(keyOf(SUBSTANCES.find(s=>s.name===name).counts),keyOf(parseFormula(formula)),name);
for(const s of SUBSTANCES.filter(s=>s.graph))assert.deepEqual(countCards(explicitGraph(s.graph).nodes.map(n=>n.e)),s.counts,s.name+' graph atoms match formula');
const nitro=SUBSTANCES.find(s=>s.name==='硝基苯'),nitroDrawing=explicitGraph(nitro.graph);assert(structureMatches(nitro.graph,nitroDrawing));
assert(!structureMatches(nitro.graph,{...nitroDrawing,nodes:nitroDrawing.nodes.map(n=>({...n,charge:0}))}),'nitro formal charges are part of structure');
assert.deepEqual(parseFormula('K4[Fe(CN)6]'),{K:4,Fe:1,C:6,N:6});
const frequencies=countCards(POOL),sum=Object.values(ELEMENTS).reduce((a,e)=>a+e.weight,0);
assert.equal(POOL.length,1800);for(const [e,v]of Object.entries(ELEMENTS)){assert(frequencies[e]>0);assert(Math.abs(frequencies[e]-v.weight/sum*1800)<1,'largest remainder allocation '+e);}
let games=0,maxTurns=0;
for(const players of [2,3,4,5,6])for(const size of [54,72,108])for(let seed=0;seed<10;seed++){
 let g=newGame({mode:'B',players,size,strategy:'random',seed,relayRescue:true});
 while(g.winner===null&&g.turn<200){const move=chooseBotMove(g);assert(move);g=play(g,move.id,move.cards);assert(auditGame(g));}
 assert.notEqual(g.winner,null);maxTurns=Math.max(maxTurns,g.turn);games++;
}
const base=newGame({mode:'B',seed:100});
const stuck={...base,current:0,context:['O'],hands:[['Hf'],['Er'],['Tc']]};
assert.equal(legalMoves({...stuck,relayRescue:false}).length,0);
assert.equal(legalMoves(stuck)[0].id,'rescue-Hf');
assert(!legalMoves({...stuck,hands:[['H','H'],['Er'],['Tc']]}).some(m=>m.rescue),'rescue is forbidden when a normal move exists');

const DB=database(),env={DB},realNow=Date.now;let now=realNow();Date.now=()=>now;
const req=async(path,body,token)=>{const r=await worker.fetch(new Request('http://localhost'+path,{method:body?'POST':'GET',headers:{...(body?{'content-type':'application/json'}:{}),...(token?{authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined}),env);return {status:r.status,data:await r.json()};};
try{
 for(const code of ['1001','9999'])await DB.prepare('INSERT INTO rooms (code,state,revision,created_at,updated_at) VALUES (?,?,0,?,?)').bind(code,'{}',now,now).run();
 const created=await Promise.all(Array.from({length:20},()=>req('/api/rooms',{name:'房主',mode:'A',structureMode:'structure',turnSeconds:30})));
 assert(created.every(r=>r.status===201));assert.equal(new Set(created.map(r=>r.data.room.code)).size,20);assert(created.every(r=>/^\d{4}$/.test(r.data.room.code)));
 const {room:first,token:t1}=created[0].data,code=first.code;
 const join=await req('/api/rooms/'+code+'/join',{name:'朋友'}),t2=join.data.token;
 let r=(await req('/api/rooms/'+code,null,t1)).data;
 r=(await req('/api/rooms/'+code+'/action',{type:'ready',ready:true,revision:r.revision},t2)).data;
 r=(await req('/api/rooms/'+code+'/action',{type:'start',revision:r.revision},t1)).data;
 const deadline=r.game.deadline;now+=5000;
 assert.equal((await req('/api/rooms/'+code,null,t1)).data.game.deadline,deadline,'refresh keeps deadline');
 now=deadline+1;
 const timed=await Promise.all([req('/api/rooms/'+code,null,t2),req('/api/rooms/'+code,null,t2)]);
 assert(timed.some(x=>x.status===200));r=(await req('/api/rooms/'+code,null,t2)).data;
 assert.equal(r.game.turn,2);assert.equal(r.game.current,1);assert(r.game.history.some(h=>h.type==='timeout'));
 assert.equal(r.game.handCounts[0],53,'offline A leader plays one atom once');
 now=r.game.deadline+1;r=(await req('/api/rooms/'+code,null,t1)).data;assert.equal(r.game.turn,3);assert.equal(r.game.current,0);assert.equal(r.game.table,null,'offline follower passes');
 // Deterministic organic hand to check both the required and optional structure rules.
 const record=await DB.prepare('SELECT state,revision FROM rooms WHERE code=?').bind(code).first();const state=JSON.parse(record.state);
 state.game.hands[0]=['C','H','H','H','H','O'];state.game.deadline=now+30000;
 await DB.prepare('UPDATE rooms SET state=? WHERE code=?').bind(JSON.stringify(state),code).run();
 r=(await req('/api/rooms/'+code,null,t1)).data;const methane=r.game.moves.find(m=>m.name==='甲烷');assert(methane);
 const payload={type:'play',revision:r.revision,moveId:methane.id,cards:methane.cards};
 assert.equal((await req('/api/rooms/'+code+'/action',payload,t1)).status,400,'structure cannot be omitted');
 assert.equal((await req('/api/rooms/'+code+'/action',{...payload,structure:explicitGraph(methane.graph)},t1)).status,200);
 const rec2=await DB.prepare('SELECT state,revision FROM rooms WHERE code=?').bind(code).first(),quick=JSON.parse(rec2.state);
 quick.options.structureMode='quick';quick.game=newGame({players:2,mode:'B',relayRescue:true});quick.game.hands[0]=['C','H','H','H'];quick.game.context=['H'];quick.game.deadline=now+30000;
 await DB.prepare('UPDATE rooms SET state=? WHERE code=?').bind(JSON.stringify(quick),code).run();
 r=(await req('/api/rooms/'+code,null,t1)).data;const m=r.game.moves.find(m=>m.name==='甲烷');
 assert.equal((await req('/api/rooms/'+code+'/action',{type:'play',revision:r.revision,moveId:m.id,cards:m.cards},t1)).status,200,'quick organic play');
 // B timeout draws for the absent player.
 quick.game=newGame({players:2,mode:'B'});quick.game.deadline=now-1;quick.status='playing';
 await DB.prepare('UPDATE rooms SET state=? WHERE code=?').bind(JSON.stringify(quick),code).run();
 r=(await req('/api/rooms/'+code,null,t2)).data;assert.equal(r.game.turn,2);assert.equal(r.game.handCounts[0],10);
 now+=25*3600000;assert.equal((await req('/api/rooms/'+code,null,t1)).status,404);
 assert.equal((await req('/api/rooms',{name:'新房主'})).status,201);assert.equal((await DB.prepare('SELECT code FROM rooms').all()).results.length,1,'idle rooms recycled');
 console.log(JSON.stringify({status:'passed',randomRelayGames:games,maxTurns,checks:['chemical regression fixtures','charged organic graph','actual pool allocation','rescue gating','concurrent numeric rooms','deadline persistence','offline leader/follower/relay','timeout race','structure enforcement','quick play','expiry']},null,2));
}finally{Date.now=realNow;DB.close();}
