import assert from 'node:assert/strict';
import {placeHydrogens} from '../dist/editor.mjs';
for(const center of [{x:160,y:180},{x:30,y:35},{x:295,y:365}]){
 const nodes=[{e:'C',...center},...Array.from({length:4},()=>({e:'H',x:100,y:100}))],bonds=[];
 placeHydrogens(nodes,bonds,[0,0,0,0],[1,2,3,4],320,420);
 assert.deepEqual(nodes[0],{e:'C',...center},'keep the player scaffold fixed');
 assert.equal(bonds.length,4);
 for(let i=1;i<nodes.length;i++){
  const n=nodes[i];assert(n.x>=23&&n.x<=297&&n.y>=23&&n.y<=388);
  for(let j=0;j<i;j++)assert(Math.hypot(n.x-nodes[j].x,n.y-nodes[j].y)>=32,'hydrogens must stay apart, including near canvas edges');
 }
}
console.log('Hydrogen layout passed: centered and edge-positioned methane, separate atoms, unchanged scaffold.');
