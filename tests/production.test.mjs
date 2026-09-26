import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import worker from '../dist/server/index.js';
import {database} from '../scripts/local-db.mjs';
// Separate bindings must each initialize, even within one Worker process.
for(let i=0;i<2;i++){
 const DB=database();
 try{
  await DB.prepare('DROP TABLE rooms').run();
  const res=await worker.fetch(new Request('http://localhost/api/rooms',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'初始化检查',size:54})}),{DB});
  assert.equal(res.status,201);
 } finally {DB.close();}
}
const folder=await fs.mkdtemp(path.join(os.tmpdir(),'chemcards-production-'));
const probe=net.createServer();probe.listen(0,'127.0.0.1');await once(probe,'listening');const port=probe.address().port;await new Promise(r=>probe.close(r));
let child,logs='';
const base='http://127.0.0.1:'+port;
async function start(){
 child=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,HOST:'127.0.0.1',PORT:String(port),DATABASE_PATH:path.join(folder,'rooms.sqlite')},stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
 for(let i=0;i<100;i++){try{const res=await fetch(base+'/api/health');if(res.ok)return;}catch{}if(child.exitCode!==null)throw Error(logs);await new Promise(r=>setTimeout(r,50));}
 throw Error('Server did not start: '+logs);
}
async function stop(){if(child&&child.exitCode===null){const ended=once(child,'exit');child.kill();await ended;}}
try{
 await start();assert((await (await fetch(base)).text()).includes('化学扑克牌'));
 const created=await fetch(base+'/api/rooms',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'持久化检查',size:54,mode:'B'})});
 assert.equal(created.status,201);const {room,token}=await created.json();assert.equal(room.options.size,108);
 await stop();await start();
 const response=await fetch(base+'/api/rooms/'+room.code,{headers:{authorization:'Bearer '+token}});
 assert.equal(response.status,200);const restored=await response.json();assert.equal(restored.id,room.id);assert.equal(restored.options.size,108);
 assert.equal((await fetch(base+'/api/rooms/'+room.code)).status,401);
 console.log('Production entry passed: static assets, health, 54-card room creation, restart persistence and private access.');
} finally {await stop();await fs.rm(folder,{recursive:true,force:true});}
