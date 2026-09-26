import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}}),guest=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');
 assert(await page.locator('#create-size').isVisible());assert(!await page.locator('#create-initial').isVisible());assert(!await page.locator('#create-rescue').isVisible());
 await page.locator('#create-size').fill('37');assert.equal(await page.locator('#create-size-label').textContent(),'37 张');
 await page.locator('[data-mode="B"]').click();assert(!await page.locator('#create-size').isVisible());assert(await page.locator('#create-rescue').isVisible());
 await page.locator('#create-initial').fill('12');await page.locator('[data-mode="A"]').click();assert.equal(await page.locator('#create-size').inputValue(),'37');
 await page.screenshot({path:'artifacts/compact-home-desktop.png',fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+2),'desktop entrance fits');
 await page.locator('#create-size').fill('108');await page.locator('#create-name').fill('布局检查');await page.locator('#create-seconds').selectOption('0');await page.locator('#create-room').click();
 const code=(await page.locator('.room-code').textContent()).trim();
 await guest.goto('http://127.0.0.1:4173/?room='+code);await guest.locator('#join-name').fill('玩家乙');await guest.locator('#join-room').click();await guest.locator('#ready').click();
 for(let i=3;i<=6;i++){
  const joined=await (await page.request.post(`http://127.0.0.1:4173/api/rooms/${code}/join`,{data:{name:'玩家'+i}})).json();
  assert((await page.request.post(`http://127.0.0.1:4173/api/rooms/${code}/action`,{headers:{authorization:'Bearer '+joined.token},data:{type:'ready',ready:true,revision:joined.room.revision}})).ok());
 }
 await page.waitForFunction(()=>document.querySelectorAll('.seat-row').length===6);await page.locator('#start:not([disabled])').click();
 await page.locator('#hand').waitFor();await page.waitForTimeout(900);
 for(const [width,height] of [[1366,768],[1920,1080],[390,844],[320,568],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(120);
  const result=await page.evaluate(()=>{const selectors=['.table','#hand','#play','#hint'];return {scroll:document.documentElement.scrollHeight,root:document.querySelector('#root').scrollHeight,height:innerHeight,rects:selectors.map(s=>{const r=document.querySelector(s).getBoundingClientRect();return{s,x:r.x,y:r.y,right:r.right,bottom:r.bottom,h:r.height};})};});
  assert(result.scroll<=height+2,JSON.stringify(result));assert(result.root<=height+2,JSON.stringify(result));
  assert(result.rects.every(r=>r.x>=0&&r.y>=0&&r.right<=width+1&&r.bottom<=height+1&&r.h>0),JSON.stringify(result));
  const last=page.locator('.playing-card').last();await last.scrollIntoViewIfNeeded();await last.click({position:{x:15,y:40}});assert.equal(await last.getAttribute('aria-pressed'),'true');await page.locator('#clear').click();
  await page.locator('#hint').click();await page.waitForTimeout(100);
  assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+2),'candidate drawer fits '+width);
  await page.screenshot({path:`artifacts/compact-table-${width}.png`,fullPage:true});
  await page.locator('#hint').click();
 }
 assert.equal(await page.locator('#sort').count(),0);
 await page.setViewportSize({width:1366,height:768});
 await page.locator('#fullscreen').click();assert(await page.evaluate(()=>!!document.fullscreenElement));await page.locator('#fullscreen').click();assert(!await page.evaluate(()=>!!document.fullscreenElement));
 // A separate practice session checks the no-hints interaction without changing the shared room.
 const quiet=await browser.newPage({viewport:{width:390,height:844}});quiet.on('pageerror',e=>errors.push(e.message));await quiet.goto('http://127.0.0.1:4173');
 await quiet.locator('#create-hints').selectOption('no');await quiet.locator('#practice').click();await quiet.locator('#hand').waitFor();
 assert(!await quiet.locator('#hint').isVisible());
 await quiet.locator('.playing-card').first().click({position:{x:14,y:40}});assert.equal(await quiet.locator('[data-match]').count(),0);assert(!await quiet.locator('#play').isDisabled());
 await quiet.locator('#play').click();assert.equal(await quiet.locator('.played').count(),1);
 assert.deepEqual(errors,[]);console.log('Viewport passed: mode-specific sliders, desktop entrance, fixed table/actions at five sizes, all cards selectable, candidate drawer.');
}finally{await browser.close();}
