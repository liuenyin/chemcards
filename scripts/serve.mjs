import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {database} from './local-db.mjs';
import worker from '../dist/server/index.js';

const port=Number(process.env.PORT||8080),host=process.env.HOST||'0.0.0.0';
const dbPath=process.env.DATABASE_PATH||path.resolve('data/rooms.sqlite');
fs.mkdirSync(path.dirname(dbPath),{recursive:true});
const DB=database(dbPath);
const publicOrigin=process.env.PUBLIC_ORIGIN?new URL(process.env.PUBLIC_ORIGIN).origin:null;
const server=http.createServer(async(req,res)=>{
 try{
  const chunks=[];let bytes=0;
  for await(const chunk of req){bytes+=chunk.length;if(bytes>50000){res.writeHead(413);res.end('Request too large');return;}chunks.push(chunk);}
  const proto=req.headers['x-forwarded-proto']==='https'?'https':'http';
  const origin=publicOrigin||new URL(proto+'://'+(req.headers.host||'localhost')).origin;
  const body=Buffer.concat(chunks);
  const response=await worker.fetch(new Request(new URL(req.url,origin),{method:req.method,headers:req.headers,...(body.length?{body}: {})}),{DB});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){console.error('Request failed:',error.message);if(!res.headersSent)res.writeHead(500);res.end('Server error');}
});
server.requestTimeout=15000;server.headersTimeout=10000;
server.listen(port,host,()=>console.log('Chemical cards listening on port '+port));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>{DB.close();process.exit(0);});server.closeIdleConnections();});
