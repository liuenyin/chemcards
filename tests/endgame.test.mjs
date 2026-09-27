import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {database} from '../scripts/local-db.mjs';
import {POOL,RELAY_POOL,newGame,auditGame,relayWeight} from '../dist/engine.mjs';
import {ELEMENTS,countCards} from '../dist/chemistry.mjs';
const a=countCards(POOL),b=countCards(RELAY_POOL);
assert.equal(RELAY_POOL.length,1800);
for(const e of Object.keys(ELEMENTS)){if(!relayWeight(e))assert.equal(b[e]||0,0);}
for(const e of ['Kr','Xe'])assert(b[e]>0&&b[e]<a[e]);
for(const e of ['He','Ne','Ar','Rn'])assert((b[e]||0)<a[e]);
for(const strategy of ['random','mixed'])for(let seed=0;seed<50;seed++){
 const g=newGame({mode:'B',strategy,seed});assert(auditGame(g));assert.equal(g.deck.length,108);assert(g.deck.every(e=>relayWeight(e)>0));
}
const DB=database(),env={DB};
async function req(path,body,token){const r=await worker.fetch(new Request('http://localhost'+path,{method:body?'POST':'GET',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined}),env);return {status:r.status,data:await r.json()};}
try{
 for(const mode of ['A','B']){
 const made=(await req('/api/rooms',{name:'房主',mode,size:16,initialHand:2,turnSeconds:0,structureMode:'quick'})).data;
 const base='/api/rooms/'+made.room.code,tokens=[made.token];
 const guest=(await req(base+'/join',{name:'朋友'})).data;tokens.push(guest.token);
 let r=(await req(base+'/action',{type:'ready',ready:true,revision:guest.room.revision},tokens[1])).data;
 r=(await req(base+'/action',{type:'start',revision:r.revision},tokens[0])).data;
 let finalMove;
 for(let turn=0;r.status==='playing'&&turn<400;turn++){
  assert(!('revealedHands' in r.game));assert(!('hands' in r.game));
  const token=tokens[r.game.current];r=(await req(base,null,token)).data;
  const m=r.game.moves[0];if(m)finalMove=m;
  const result=await req(base+'/action',m?{type:'play',revision:r.revision,moveId:m.id,cards:m.cards}:{type:'skip',revision:r.revision},token);
  assert.equal(result.status,200,JSON.stringify(result.data));r=result.data;
 }
 assert.equal(r.status,'finished');assert.equal(r.game.table.id,finalMove.id);assert.equal(r.game.revealedHands.length,2);
 for(let i=0;i<2;i++){const s=(await req(base,null,tokens[i])).data;assert.deepEqual(s.game.hand,s.game.revealedHands[i]);assert.deepEqual(s.game.handCounts,s.game.revealedHands.map(h=>h.length));}
 // Leaving a finished room must not misassign the removed player's hand to the next seat.
 assert.equal((await req(base+'/action',{type:'leave',revision:r.revision},tokens[0])).status,200);
 r=(await req(base,null,tokens[1])).data;assert.equal(r.game,null);assert.equal(r.status,'waiting');assert.equal(r.host,r.members[0].id);
 // Add a seat and verify an active non-host can leave cleanly.
 const newcomer=(await req(base+'/join',{name:'新朋友'})).data;
 r=(await req(base+'/action',{type:'ready',ready:true,revision:newcomer.room.revision},newcomer.token)).data;
 r=(await req(base+'/action',{type:'start',revision:r.revision},tokens[1])).data;
 assert.equal((await req(base+'/action',{type:'leave',revision:r.revision},newcomer.token)).status,200);
 r=(await req(base,null,tokens[1])).data;assert.equal(r.game,null);assert.equal(r.status,'waiting');assert.equal(r.members.length,1);
 assert.equal((await req(base,null,newcomer.token)).status,401);
 }
 console.log('Endgame passed: private active hands, revealed finished hands, final A/B move preserved, host transfer, active exit, relay pool coverage.');
}finally{DB.close();}
