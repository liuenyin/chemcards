import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');await page.locator('#create-name').fill('小林');await page.locator('#create-seconds').selectOption('0');await page.locator('#create-strategy').selectOption('mixed');await page.locator('#create-room').click();
 const code=(await page.locator('.room-code').textContent()).trim();
 for(const name of ['小周','小陈']){
  const join=await (await page.request.post(`http://127.0.0.1:4173/api/rooms/${code}/join`,{data:{name}})).json();
  assert((await page.request.post(`http://127.0.0.1:4173/api/rooms/${code}/action`,{headers:{authorization:'Bearer '+join.token},data:{type:'ready',ready:true,revision:join.room.revision}})).ok());
 }
 await page.waitForFunction(()=>document.querySelectorAll('.seat-row').length===3);await page.locator('#start:not([disabled])').click();await page.locator('#hand').waitFor();await page.waitForTimeout(950);
 async function check(label){
  for(const [w,h]of [[1366,768],[1024,576],[390,844],[320,568],[844,390]]){
   await page.setViewportSize({width:w,height:h});await page.waitForTimeout(150);
   const result=await page.evaluate(()=>{const field=document.querySelector('.play-field'),played=document.querySelector('.played'),rect=field.getBoundingClientRect(),p=played?.getBoundingClientRect(),hand=document.querySelector('#hand');return{page:document.documentElement.scrollHeight,height:innerHeight,fieldOverflow:field.scrollHeight-field.clientHeight,handOverflow:hand.scrollHeight-hand.clientHeight,playedFits:!p||(p.top>=rect.top-1&&p.bottom<=rect.bottom+1),controls:[...document.querySelectorAll('#hand-actions button')].every(e=>{const r=e.getBoundingClientRect();return r.right<=innerWidth+1&&r.bottom<=innerHeight+1;})};});
   assert(result.page<=h+2&&result.fieldOverflow<=2&&result.playedFits&&result.controls,`${label} ${w}: ${JSON.stringify(result)}`);
   const readable=await page.locator('#hand.compact-cards .playing-card').evaluateAll(cards=>cards.every(card=>{
    const parts=['.card-corner small','.card-center strong','.card-center span','.card-center small'].map(s=>card.querySelector(s).getBoundingClientRect());
    const r=card.getBoundingClientRect();
    return parts.every((p,i)=>p.left>=r.left&&p.right<=r.right&&p.bottom<=r.bottom&&(i===0||p.top>=parts[i-1].bottom));
   }));
   assert(readable,'card text must not overlap or overflow at '+w);
   if(w===1366)assert(result.handOverflow<=2,'two desktop rows fit: '+JSON.stringify(result));
   await page.screenshot({path:`artifacts/actual-game-${label}-${w}.png`});
  }
 }
 await check('before');await page.setViewportSize({width:390,height:844});await page.locator('#hint').click();await page.locator('[data-match]').first().click();await page.locator('#hint').click();await page.locator('#play').click();await page.waitForFunction(()=>document.querySelector('.played'));await page.waitForTimeout(550);await check('after');
 assert.deepEqual(errors,[]);console.log('Actual three-player game passed: before/after play, desktop two rows, mobile portrait/landscape, no table scrolling or clipped played cards.');
}finally{await browser.close();}
