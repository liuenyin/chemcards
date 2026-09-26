import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try{
 const host=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),guest=await browser.newPage();
 const errors=[];host.on('pageerror',e=>errors.push(e.message));guest.on('pageerror',e=>errors.push(e.message));
 await host.goto('http://127.0.0.1:4173');
 await host.locator('#feedback-btn').click();await host.locator('#sound-enabled').uncheck();await host.locator('#haptic-enabled').check();await host.locator('#sound-volume').fill('20');await host.locator('#close-modal').click();
 await host.reload();await host.locator('#feedback-btn').click();assert(!(await host.locator('#sound-enabled').isChecked()));assert(await host.locator('#haptic-enabled').isChecked());assert.equal(await host.locator('#sound-volume').inputValue(),'20');await host.locator('#close-modal').click();
 await host.locator('#create-name').fill('体验甲');await host.locator('#create-strategy').selectOption('mixed');await host.locator('#create-seconds').selectOption('0');await host.locator('#create-room').click();
 const code=(await host.locator('.room-code').textContent()).trim();assert(/^\d{4}$/.test(code));
 await guest.goto('http://127.0.0.1:4173/?room='+code);
 await guest.evaluate(code=>localStorage.setItem('chemcards-room-keys',JSON.stringify({[code]:'expired-seat-token'})),code);
 await guest.locator('#join-name').fill('体验乙');await guest.locator('#join-room').click();await guest.locator('#ready').click();await host.locator('#start:not([disabled])').click();await host.locator('#hand').waitFor();await host.waitForTimeout(850);
 assert.equal(await host.locator('.playing-card').count(),54);
 const bounds=await host.locator('#hand').evaluate(e=>{const r=e.getBoundingClientRect();return [...e.querySelectorAll('[data-card]')].every(c=>{const b=c.getBoundingClientRect();return b.left>=r.left-4&&b.right<=r.right+4;});});assert(bounds,'every card fits horizontally');
 const last=host.locator('.playing-card').last();await last.scrollIntoViewIfNeeded();await last.click({position:{x:14,y:50}});assert.equal(await last.getAttribute('aria-pressed'),'true');
 await host.locator('#clear').click();await host.locator('#hint').click();assert(await host.locator('[data-match]').count()>0);assert.equal(await host.locator('#hint').getAttribute('aria-expanded'),'true');
 const snapshot=await host.evaluate(async()=>{const code=JSON.parse(localStorage.getItem('chemcards-last-room')),token=JSON.parse(localStorage.getItem('chemcards-room-keys'))[code];return(await fetch('/api/rooms/'+code,{headers:{authorization:'Bearer '+token}})).json();});
 const organic=snapshot.game.moves.find(m=>m.graph);assert(organic);
 await host.locator('#collection-btn:visible, #game-collection:visible').click();await host.locator('#collection-search').fill(organic.name);await host.locator(`[data-discovery="${organic.id}"]`).click();await host.locator('#stage-detail').click();await host.locator('#play').click();
 await guest.locator('#hint:not([disabled])').waitFor();assert.equal(await host.locator('.molecule-canvas').count(),0,'quick mode does not open editor');
 await host.locator('#collection-btn:visible, #game-collection:visible').click();await host.locator('#show-unlocked').click();assert(await host.locator('.discovered').count()>=1);assert((await host.locator('#collection-list').textContent()).includes(organic.name));
 await host.locator('#pool-details').click();assert.equal(await host.locator('.pool-table tbody tr').count(),86);await host.locator('#close-modal').click();
 await host.screenshot({path:'artifacts/repaired-mobile.png',fullPage:true});
 // Use the actual editor for charged nitrobenzene, including its hydrogen helper.
 const editor=await browser.newPage({viewport:{width:1100,height:850}});editor.on('pageerror',e=>errors.push(e.message));await editor.goto('http://127.0.0.1:4173');
 const bonds=await editor.evaluate(async()=>{
  const {mountEditor}=await import('/editor.mjs');const {SUBSTANCES,structureMatches}=await import('/chemistry.mjs');
  const move=SUBSTANCES.find(s=>s.name==='硝基苯');document.querySelector('#root').innerHTML='<div id="test-editor"></div>';
  window.drawing=mountEditor(document.querySelector('#test-editor'),move,async graph=>{window.valid=structureMatches(move.graph,graph);});return move.graph.bonds;
 });
 for(const [a,b,o]of bonds){await editor.locator(`[data-order="${o}"]`).click();await editor.locator(`[data-node="${a}"]`).press('Enter');await editor.locator(`[data-node="${b}"]`).press('Enter');}
 await editor.locator('#add-h').click();assert((await editor.locator('.editor-status').textContent()).includes('已按骨架'));await editor.locator('#submit-structure').click();assert(await editor.evaluate(()=>window.valid));
 await editor.screenshot({path:'artifacts/repaired-nitrobenzene.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('Experience passed: feedback persistence, 54-card mobile access, suggestion drawer, quick organic move, local discoveries, real pool probabilities, charged structure drawing.');
}finally{await browser.close();}
