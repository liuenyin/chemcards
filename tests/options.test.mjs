import assert from 'node:assert/strict';
import {newGame,legalMoves,auditGame} from '../dist/engine.mjs';
import {database} from '../scripts/local-db.mjs';
import worker from '../dist/server/index.js';
for(let size=16;size<=108;size++)for(const players of [2,3,6]){
 const g=newGame({mode:'A',size,players,seed:size});assert(auditGame(g));
 assert.equal(g.hands.flat().length,size);const lengths=g.hands.map(h=>h.length);assert(Math.max(...lengths)-Math.min(...lengths)<=1);
}
for(let initialHand=2;initialHand<=12;initialHand++)for(const players of [2,6]){
 const g=newGame({mode:'B',initialHand,players,size:16,seed:1});assert(auditGame(g));assert.equal(g.size,108);assert(g.hands.every(h=>h.length===initialHand));assert.equal(g.stock.length,108-players*initialHand-1);
}
for(const e of ['Xe','Fe','Cu','Au','Ag']){
 const g=newGame({mode:'A',size:16});g.hands[0]=[e];const moves=legalMoves(g);assert.equal(moves.length,1,e);assert.equal(moves[0].category,'单质',e);assert.equal(moves[0].formula,e);
}
const atom=newGame({mode:'A',size:16});atom.hands[0]=['H'];assert.equal(legalMoves(atom)[0].id,'atom-H');
const DB=database();
const request=async(path,body,token)=>{const r=await worker.fetch(new Request('http://localhost'+path,{method:'POST',headers:{'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}),{DB});return {status:r.status,data:await r.json()};};
try{
 for(const size of [16,37,108])assert.equal((await request('/api/rooms',{name:'A'+size,mode:'A',size})).status,201);
 for(const size of [15,109,16.5,'37'])assert.equal((await request('/api/rooms',{name:'无效',mode:'A',size})).status,400);
 for(const initialHand of [1,13,2.5,'12'])assert.equal((await request('/api/rooms',{name:'无效',mode:'B',initialHand})).status,400);
 assert.equal((await request('/api/rooms',{name:'无效',hintsEnabled:'no'})).status,400);
 const created=await request('/api/rooms',{name:'房主',mode:'B',size:16,initialHand:12,hintsEnabled:false,turnSeconds:0});assert.equal(created.status,201);
 const {room,token}=created.data;assert.equal(room.options.size,108);assert.equal(room.options.initialHand,12);assert.equal(room.options.hintsEnabled,false);
 const joined=await request(`/api/rooms/${room.code}/join`,{name:'朋友'});
 const ready=await request(`/api/rooms/${room.code}/action`,{type:'ready',ready:true,revision:joined.data.room.revision},joined.data.token);
 const started=await request(`/api/rooms/${room.code}/action`,{type:'start',revision:ready.data.revision},token);
 assert.equal(started.status,200);assert.deepEqual(started.data.game.handCounts,[12,12]);assert.equal(started.data.game.initialHand,12);assert.equal(started.data.options.hintsEnabled,false);
 console.log('Options passed: all integer A sizes, B hands 2–12, exact dealing, invalid settings, multiplayer hints, default elemental plays.');
}finally{DB.close();}
