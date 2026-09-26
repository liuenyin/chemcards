import {build} from 'esbuild';
import fs from 'node:fs/promises';
const files=['index.html','style.css','app.mjs','chemistry.mjs','engine.mjs','editor.mjs','hand.mjs','cards.css','sound.mjs','visuals.mjs'];
const assets={};for(const file of files)assets['/'+file]={body:await fs.readFile('dist/'+file,'utf8'),type:file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/javascript; charset=utf-8'};
await build({entryPoints:['server/worker.mjs'],outfile:'dist/server/index.js',bundle:true,platform:'browser',format:'esm',target:'es2022',minify:true,plugins:[{name:'assets',setup(b){b.onResolve({filter:/^site:assets$/},()=>({path:'assets',namespace:'site'}));b.onLoad({filter:/.*/,namespace:'site'},()=>({contents:'export default '+JSON.stringify(assets),loader:'js'}));}}]});
console.log('Worker and embedded client built.');
