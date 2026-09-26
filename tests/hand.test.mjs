import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try {
 const page=await browser.newPage({viewport:{width:1000,height:850}});
 await page.goto('http://127.0.0.1:4173');
 await page.evaluate(async()=>{
  document.body.innerHTML='<section class="table" style="height:200px">桌面</section><div id="test-hand" style="width:900px;margin-top:30px"></div>';
  const {CardHand}=await import('/hand.mjs');window.changes={};window.drops=0;
  window.hand=new CardHand(document.querySelector('#test-hand'),{cards:['H','H','H','H','H','H','H','H','H','H','O','O'],selection:{},sort:'element',onChange:c=>window.changes=c,onDrop:()=>window.drops++,canPlay:()=>true});
 });
 const point=async id=>{const r=await page.locator(`[data-card="${id}"]`).boundingBox();return {x:r.x+14,y:r.y+55};};
 let p=await point('H-1');await page.mouse.click(p.x,p.y);
 assert.deepEqual(await page.evaluate(()=>window.changes),{H:1});
 await page.waitForTimeout(180);p=await point('H-1');await page.mouse.click(p.x,p.y);
 assert.deepEqual(await page.evaluate(()=>window.changes),{});
 await page.waitForTimeout(180);const start=await point('H-1'),end=await point('H-10');
 await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:30});await page.mouse.up();
 assert.deepEqual(await page.evaluate(()=>window.changes),{H:10},'one sweep selects ten separate atoms');
 await page.waitForTimeout(180);p=await point('H-5');await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x,120,{steps:20});await page.mouse.up();
 assert.equal(await page.evaluate(()=>window.drops),1);assert.equal(await page.locator('.card-drag-ghost').count(),0);
 await page.evaluate(()=>window.hand.update({cards:['H','H','H','H','H','H','H','H','H','H','O','O'],selection:window.changes,sort:'mass'}));
 assert.equal(await page.locator('.playing-card.selected').count(),10);
 assert.equal(await page.locator('.playing-card').first().getAttribute('data-element'),'O');
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{document.querySelector('#test-hand').style.width='350px';window.hand.update({cards:Array(54).fill('H'),selection:{},sort:'element'});});
 await page.waitForTimeout(300);
 const size=await page.locator('#test-hand').evaluate(e=>({height:e.clientHeight,scroll:e.scrollHeight}));
 assert(size.height<=310&&size.scroll>size.height,'mobile hand scrolls without growing the whole page');
 await page.locator('#test-hand').evaluate(e=>e.scrollTop=e.scrollHeight);
 assert(await page.locator('#test-hand').evaluate(e=>e.scrollTop>0));
 // Real browser touch input catches touch-action rules that programmatic scrolling cannot.
 await page.locator('#test-hand').evaluate(e=>e.scrollTop=0);
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
 const touch=async(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
 p=await point('H-4');await touch('touchStart',p.x,p.y);
 for(let i=1;i<=12;i++){await touch('touchMove',p.x,p.y-i*8);await page.waitForTimeout(18);}
 await touch('touchEnd');await page.waitForTimeout(250);
 assert(await page.locator('#test-hand').evaluate(e=>e.scrollTop>30),'swiping over an unselected card scrolls the hand');
 assert.equal(await page.locator('.card-drag-ghost').count(),0,'native scrolling cleans up drag feedback');
 await page.locator('#test-hand').evaluate(e=>e.scrollTop=0);await page.waitForTimeout(200);
 const ts=await point('H-1'),te=await point('H-6');await touch('touchStart',ts.x,ts.y);
 for(let i=1;i<=15;i++){await touch('touchMove',ts.x+(te.x-ts.x)*i/15,ts.y+(te.y-ts.y)*i/15);await page.waitForTimeout(18);}
 await touch('touchEnd');
 assert.equal(await page.locator('.playing-card.selected').count(),6,'horizontal touch sweep selects cards');
 console.log('Card interactions passed: click, sweep ten atoms, drag bundle, sorting, mobile hand scrolling.');
} finally {await browser.close();}
