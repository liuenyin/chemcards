import http from 'node:http';
import fs from 'node:fs';
import {database} from './local-db.mjs';
import worker from '../dist/server/index.js';
fs.mkdirSync('.sites-runtime',{recursive:true});const env={DB:database('.sites-runtime/rooms.sqlite')};
const server=http.createServer(async(req,res)=>{try{const chunks=[];for await(const c of req)chunks.push(c);const body=Buffer.concat(chunks);const request=new Request('http://127.0.0.1:4173'+req.url,{method:req.method,headers:req.headers,...(body.length?{body}:{} )});const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){res.writeHead(500);res.end('Local server error');console.error(e);}});server.listen(4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173'));
