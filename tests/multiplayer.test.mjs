import assert from 'node:assert/strict';
import worker from '../dist/server/index.js';
import {database} from '../scripts/local-db.mjs';
import {SUBSTANCES,parseFormula,countCards,keyOf,explicitGraph,structureMatches,formatFormula} from '../dist/chemistry.mjs';
import {newGame,legalMoves,skip,play,auditGame} from '../dist/engine.mjs';
const DB=database(),env={DB};
const request=async(path,body,token)=>{const response=await worker.fetch(new Request('http://localhost'+path,{method:body?'POST':'GET',headers:{...(body?{'content-type':'application/json'}:{}),...(token?{authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined}),env);return{status:response.status,data:await response.json()};};
assert(SUBSTANCES.some(s=>s.formula==='KSCN'));
assert.equal(SUBSTANCES.find(s=>keyOf(parseFormula('H3N'))===s.key&&s.name==='氨').formula,'NH3');
assert.equal(SUBSTANCES.find(s=>s.name==='氢氧化钠').formula,'NaOH');
assert.deepEqual(parseFormula('CuSO4·5H2O'),{Cu:1,S:1,O:9,H:10});
assert.equal(formatFormula('CuSO4·5H2O'),'CuSO<sub>4</sub>·5H<sub>2</sub>O');
for(const s of SUBSTANCES.filter(s=>s.graph)){const graph=explicitGraph(s.graph);assert(structureMatches(s.graph,graph),s.name);if(graph.bonds.length)assert(!structureMatches(s.graph,{nodes:graph.nodes,bonds:graph.bonds.slice(1)}));}
for(const players of [2,3,4,5,6]){let g=newGame({mode:'A',players,size:72,seed:25});assert.equal(g.hands.length,players);assert(auditGame(g));const move=legalMoves(g)[0];g=play(g,move.id,move.cards);for(let i=0;i<players-1;i++)g=skip(g);assert.equal(g.current,0);assert.equal(g.table,null);g=newGame({mode:'B',players,size:72,seed:25});for(let i=0;i<players*2-1;i++)g=skip(g);assert.equal(g.dryTurns,players*2-1);g=skip(g);assert.equal(g.dryTurns,0);assert(auditGame(g));}
const created=await request('/api/rooms',{name:'房主',mode:'A',size:72});assert.equal(created.status,201);const code=created.data.room.code,t1=created.data.token;
const joined=await request(`/api/rooms/${code}/join`,{name:'朋友'});assert.equal(joined.status,200);const t2=joined.data.token;
assert.equal((await request(`/api/rooms/${code}`)).status,401);
let room=(await request(`/api/rooms/${code}`,null,t1)).data;
assert.equal((await request(`/api/rooms/${code}/action`,{type:'start',revision:room.revision},t2)).status,403);
assert.equal((await request(`/api/rooms/${code}/action`,{type:'start',revision:room.revision},t1)).status,400);
room=(await request(`/api/rooms/${code}/action`,{type:'ready',ready:true,revision:room.revision},t2)).data;
room=(await request(`/api/rooms/${code}/action`,{type:'start',revision:room.revision},t1)).data;
assert.equal(room.status,'playing');assert.equal(room.game.hand.length,36);assert(!('hands' in room.game));assert(!('stock' in room.game));assert(!('seed' in room.game));assert(!JSON.stringify(room).includes('tokenHash'));
const second=(await request(`/api/rooms/${code}`,null,t2)).data;assert.equal(second.game.moves.length,0);assert.equal(second.me,1);
const move=room.game.moves.find(m=>!m.graph);const oldRevision=room.revision;
const outOfTurn=await request(`/api/rooms/${code}/action`,{type:'play',revision:oldRevision,moveId:move.id,cards:move.cards},t2);assert.equal(outOfTurn.status,403);
const organic=room.game.moves.find(m=>m.graph);if(organic){const bad=await request(`/api/rooms/${code}/action`,{type:'play',revision:room.revision,moveId:organic.id,cards:organic.cards,structure:{nodes:[],bonds:[]}},t1);assert.equal(bad.status,400);}
const results=await Promise.all([request(`/api/rooms/${code}/action`,{type:'play',revision:oldRevision,moveId:move.id,cards:move.cards},t1),request(`/api/rooms/${code}/action`,{type:'play',revision:oldRevision,moveId:move.id,cards:move.cards},t1)]);assert.deepEqual(results.map(r=>r.status).sort(),[200,409]);
room=(await request(`/api/rooms/${code}`,null,t1)).data;assert.equal(room.game.turn,2);assert.equal(room.game.hand.length,36-move.cards.length);
assert.equal((await request(`/api/rooms/${code}/action`,{type:'settings',revision:room.revision,mode:'B'},t2)).status,403);
room=(await request(`/api/rooms/${code}/action`,{type:'propose',revision:room.revision,name:'测试房间配方',formula:'KSCN',source:'https://pubchem.ncbi.nlm.nih.gov/compound/516872'},t1)).data;
const proposal=room.proposals.at(-1);assert.equal(proposal.status,'pending');
room=(await request(`/api/rooms/${code}/action`,{type:'vote',revision:room.revision,proposalId:proposal.id,accept:true},t2)).data;assert.equal(room.custom.length,1);assert.equal(room.proposals.at(-1).status,'accepted');
room=(await request(`/api/rooms/${code}/action`,{type:'lobby',revision:room.revision},t1)).data;assert.equal(room.status,'waiting');assert.equal(room.game,null);assert(!room.members[1].ready);
DB.close();console.log(JSON.stringify({status:'passed',substances:SUBSTANCES.length,checks:['KSCN and conventional formulae','hydrate parsing','all organic full-atom structures','2–6 players and full rounds','create/join/ready/start','private hands','turn permissions','replay and race rejection','server structure validation','unanimous room extension','lobby reset']},null,2));
