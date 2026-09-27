import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {newGame,auditGame} from '../dist/engine.mjs';
const game=newGame({mode:'B',players:6,initialHand:12,strategy:'random',seed:2026});
assert.deepEqual(game.hands.map(h=>h.length),[12,12,12,12,12,12]);
assert.equal(game.stock.length,35);assert(auditGame(game));
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');
 assert.equal(await page.locator('#library-btn').count(),0,'one unified catalog entry');
 await page.locator('#create-room').click();
 assert.equal(await page.locator('#create-error').textContent(),'请输入昵称');
 assert.equal(await page.locator('#create-room').textContent(),'创建房间');
 assert.equal(await page.locator('#entrance-error').textContent(),'');
 await page.locator('[data-mode="B"]').click();
 for(const [value,label] of [['2','2 张'],['7','7 张'],['12','12 张']]){
  await page.locator('#create-initial').fill(value);
  assert.equal(await page.locator('#create-initial-label').textContent(),label);
 }
 await page.locator('#create-initial').fill('12');
 await page.screenshot({path:'artifacts/design-home-mobile.png',fullPage:true});
 await page.locator('#create-name').fill('小牌库');await page.locator('#create-room').click();
 assert.equal(await page.locator('#option-initial-label').textContent(),'12 张');
 assert.equal(await page.locator('#option-mode').inputValue(),'B');
 await page.locator('#collection-btn').click();
 for(const width of [320,390,1100]){
  await page.setViewportSize({width,height:844});
  const layout=await page.locator('.collection-tile').evaluateAll(tiles=>tiles.map(t=>{const r=t.getBoundingClientRect();return{w:r.width,h:r.height,right:r.right,overflow:t.scrollHeight>t.clientHeight+2};}));
  assert(layout.length>500);
  assert(layout.every(r=>Math.abs(r.w-r.h)<2&&r.right<=width),'square tiles fit viewport '+width);
  assert(layout.every(r=>!r.overflow),'tile text fits '+width);
 }
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'artifacts/design-collection-mobile.png',fullPage:true});
 await page.locator('#collection-search').fill('KSCN');assert.equal(await page.locator('.collection-tile').count(),1);
 await page.locator('.collection-tile').click();
 assert.equal(await page.locator('#back-collection').textContent(),'返回图鉴');
 await page.locator('#back-collection').click();
 assert.equal(await page.locator('#collection-search').inputValue(),'KSCN');
 assert.equal(await page.locator('.collection-tile').count(),1);
 await page.locator('#collection-search').fill('');
 const tile=page.locator('.collection-tile').nth(80);
 await tile.scrollIntoViewIfNeeded();
 const scroll=await page.locator('#modal').evaluate(e=>e.scrollTop);assert(scroll>0);
 await tile.click();await page.locator('#back-collection').click();
 assert(Math.abs(await page.locator('#modal').evaluate(e=>e.scrollTop)-scroll)<2);
 assert(await page.locator('.collection-tile').count()>500);
 // Retain the actual collection filter and its working event handlers.
 await page.locator('#close-modal').click();
 await page.evaluate(()=>localStorage.setItem('chemcards-discoveries',JSON.stringify({'硫氰酸钾|KSCN':{date:'2026-09-26',count:1}})));
 await page.locator('#collection-btn').click();await page.locator('#show-unlocked').click();
 assert.equal(await page.locator('.collection-tile').count(),1);
 await page.locator('.collection-tile').click();await page.locator('#back-collection').click();
 assert.equal(await page.locator('#show-unlocked').textContent(),'显示全部');
 assert.equal(await page.locator('.collection-tile.discovered').count(),1);
 await page.locator('#show-unlocked').click();assert(await page.locator('.collection-tile').count()>500);
 await page.locator('#close-modal').click();
 await page.locator('#collection-btn').click();await page.locator('#collection-search').fill('KSCN');
 await page.locator('[data-discovery]').click();assert.equal(await page.locator('#back-collection').textContent(),'返回图鉴');
 await page.locator('#back-collection').click();assert.equal(await page.locator('#collection-search').inputValue(),'KSCN');
 assert.equal(await page.locator('.collection-tile').count(),1);
 await page.locator('#close-modal').click();
 const effects=await page.evaluate(async()=>{
  const v=await import('/visuals.mjs'),s=await import('/sound.mjs');
  const table=document.createElement('div');document.body.append(table);
  s.setSoundSettings({effects:true});v.showSubstanceEffect({formula:'AgI'},table);
  const count=table.querySelectorAll('.substance-effect i').length;
  table.replaceChildren();s.setSoundSettings({effects:false});v.showSubstanceEffect({formula:'KMnO4'},table);
  const disabled=table.childElementCount===0;
  s.setSoundSettings({effects:true});v.showSubstanceEffect({formula:'AgI'},table);
  await new Promise(r=>setTimeout(r,2500));
  return{count,disabled,cleaned:table.childElementCount===0,metal:v.elementFinish('Cu'),tungsten:v.substanceTheme('W(CO)6'),fallback:v.substanceTheme('UnknownFormula123')};
 });
 assert.equal(effects.count,14);assert(effects.disabled&&effects.cleaned);assert(effects.metal.includes('finish-copper'));assert.equal(effects.tungsten?.label,'白色固体');assert.equal(effects.fallback,null);
 assert.deepEqual(errors,[]);
 console.log('Design passed: 54-card six-player relay, slider persistence, mode selection, square collection at 320/390/1100px, search, materials and effect settings.');
} finally {await browser.close();}
