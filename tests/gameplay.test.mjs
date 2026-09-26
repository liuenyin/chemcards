import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');await page.locator('#create-name').fill('手感检查');await page.locator('#create-seconds').selectOption('0');await page.locator('#create-room').click();
 const code=(await page.locator('.room-code').textContent()).trim();const base=`http://127.0.0.1:4173/api/rooms/${code}`;
 const guest=await (await page.request.post(base+'/join',{data:{name:'朋友'}})).json();const headers={authorization:'Bearer '+guest.token};
 await page.request.post(base+'/action',{headers,data:{type:'ready',ready:true,revision:guest.room.revision}});await page.locator('#start:not([disabled])').click();await page.locator('#hand').waitFor();await page.waitForTimeout(950);
 const save=()=>page.evaluate(()=>{window.savedHand=document.querySelector('#hand');window.savedCard=savedHand.firstElementChild;return{top:savedHand.getBoundingClientRect().top,scroll:savedHand.scrollTop,positions:[...savedHand.children].map(e=>[e.style.left,e.style.top])};});
 const check=async before=>{await page.waitForTimeout(150);const after=await saveState();assert.deepEqual(after,before);assert(await page.evaluate(()=>savedHand===document.querySelector('#hand')&&savedCard===savedHand.firstElementChild));};
 const saveState=()=>page.evaluate(()=>{const h=document.querySelector('#hand');return{top:h.getBoundingClientRect().top,scroll:h.scrollTop,positions:[...h.children].map(e=>[e.style.left,e.style.top])};});
 await page.locator('#hand').evaluate(e=>e.scrollTop=50);let before=await save();
 await page.locator('#hint').click();await check(before);await page.locator('#hint').click();await check(before);
 await page.locator('#clear').evaluate(e=>e.click());await check(before);
 // Select and clear through the public keyboard interaction, retaining DOM nodes.
 await page.locator('#hand').evaluate(e=>e.scrollTop=0);before=await save();await page.locator('.playing-card').first().press('Enter');await check(before);await page.locator('#clear').click();await check(before);
 await page.locator('.playing-card').first().press('Enter');await page.locator('#play').click();await page.waitForFunction(()=>!document.body.classList.contains('my-turn'));await page.waitForTimeout(400);
 before=await save();const state=await (await page.request.get(base,{headers})).json();
 assert((await page.request.post(base+'/action',{headers,data:{type:'skip',revision:state.revision}})).ok());
 await page.waitForFunction(()=>document.body.classList.contains('my-turn'));await check(before);
 await page.screenshot({path:'artifacts/gameplay-mobile.png'});
 assert.deepEqual(errors,[]);console.log('Gameplay passed: hint drawer, selection and clearing keep card positions; remote turns preserve hand nodes and scroll.');
}finally{await browser.close();}
