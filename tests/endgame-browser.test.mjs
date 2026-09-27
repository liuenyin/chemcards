import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');await page.locator('#create-name').fill('小林');await page.locator('#create-seconds').selectOption('0');await page.locator('#create-strategy').selectOption('mixed');await page.locator('#create-room').click();
 const code=(await page.locator('.room-code').textContent()).trim(),base='http://127.0.0.1:4173/api/rooms/'+code;
 const tokens=[await page.evaluate(code=>JSON.parse(localStorage.getItem('chemcards-room-keys'))[code],code)];
 for(const name of ['小陈','小周','小吴','小张','小李']){const j=await(await page.request.post(base+'/join',{data:{name}})).json();tokens.push(j.token);assert((await page.request.post(base+'/action',{headers:{authorization:'Bearer '+j.token},data:{type:'ready',ready:true,revision:j.room.revision}})).ok());}
 await page.locator('#start:not([disabled])').click();await page.locator('#hand').waitFor();
 const get=async token=>(await page.request.get(base,{headers:{authorization:'Bearer '+token}})).json();
 let r=await get(tokens[0]),themeCaptured=false;
 const {substanceTheme}=await import('../dist/visuals.mjs');
 // Verify persistent material layer and accessibility preferences in the actual browser.
 for(const [formula,phase]of [['H2O','liquid'],['Cl2','gas'],['KMnO4','solid']]){
  await page.evaluate(async formula=>{const v=await import('/visuals.mjs');v.applySubstanceTheme({formula});},formula);
  assert.equal(await page.locator('body').getAttribute('data-substance-phase'),phase);assert.equal(await page.locator('.ambient-matter').count(),1);
 }
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.ambient-matter i').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 await page.locator('#game-feedback').click();await page.locator('#effects-enabled').uncheck();assert.equal(await page.locator('.ambient-matter').count(),0);await page.locator('#effects-enabled').check();await page.locator('#close-modal').click();
 for(let turn=0;r.status==='playing'&&turn<500;turn++){
  const token=tokens[r.game.current];r=await get(token);assert(!r.game.revealedHands);
  const m=(!themeCaptured&&r.game.moves.find(m=>substanceTheme(m.formula)))||r.game.moves[0];const result=await page.request.post(base+'/action',{headers:{authorization:'Bearer '+token},data:m?{type:'play',revision:r.revision,moveId:m.id,cards:m.cards}:{type:'skip',revision:r.revision}});assert(result.ok());r=await result.json();
  if(!themeCaptured&&m&&substanceTheme(m.formula)&&r.status==='playing'){
   await page.waitForFunction(name=>document.querySelector('.played-name')?.textContent===name,m.name);
   await page.waitForTimeout(2600);assert(await page.locator('body').getAttribute('data-substance-phase'));
   await page.screenshot({path:'artifacts/material-mobile.png'});
   await page.setViewportSize({width:1366,height:768});await page.waitForTimeout(300);await page.screenshot({path:'artifacts/material-desktop.png'});
   await page.setViewportSize({width:390,height:844});themeCaptured=true;
  }
 }
 assert.equal(r.status,'finished');await page.locator('.revealed-hand').first().waitFor();await page.waitForTimeout(2600);
 assert((await page.locator('.played-name').textContent()).includes(r.game.table.name));assert.equal(await page.locator('.revealed-hand').count(),5);
 for(const [width,height]of [[1366,768],[390,844],[320,568],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(250);
  const measured=await page.evaluate(()=>{const field=document.querySelector('.play-field'),p=document.querySelector('.played').getBoundingClientRect(),f=field.getBoundingClientRect();return{height:document.documentElement.scrollHeight,field:field.scrollHeight-field.clientHeight,fits:p.top>=f.top-1&&p.bottom<=f.bottom+1,miniVisible:[...document.querySelectorAll('.revealed-hand')].every(e=>e.clientHeight>10)};});
  assert(measured.height<=height+2&&measured.field<=2&&measured.fits&&measured.miniVisible,JSON.stringify({width,...measured}));
  await page.screenshot({path:`artifacts/finished-${width}.png`});
 }
 await page.locator('#room-options').click();await page.locator('#room-leave').click();await page.locator('#confirm-leave').click();await page.locator('#create-room').waitFor();
 assert.equal((await get(tokens[1])).status,'waiting');assert.deepEqual(errors,[]);
 console.log('Endgame browser passed: actual six-player game, final card and revealed mini hands, portrait/landscape/desktop screenshots, phase layers, reduced motion, effect toggle, exit flow.');
}finally{await browser.close();}
