import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {newGame,legalMoves} from '../dist/engine.mjs';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
let seed=1;while(!legalMoves(newGame({mode:'A',strategy:'random',seed})).some(m=>m.formula==='FeO'))seed++;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(seed=>{const original=crypto.getRandomValues.bind(crypto);crypto.getRandomValues=a=>a instanceof Uint32Array&&a.length===1?(a[0]=seed,a):original(a);},seed);
 await page.goto('http://127.0.0.1:4173');await page.locator('#create-strategy').selectOption('random');await page.locator('#practice').click();await page.locator('#hand').waitFor();
 await page.locator('#game-collection').click();await page.locator('#collection-search').fill('氧化亚铁');await page.locator('[data-discovery]').first().click();await page.locator('#stage-detail').click();await page.locator('#play').click();
 assert.equal(await page.locator('body').getAttribute('data-substance-material'),'powder');
 assert.equal(await page.locator('body').evaluate(e=>e.style.getPropertyValue('--substance-color')),'#333b42');
 await page.screenshot({path:'artifacts/practice-feo-fixed.png'});
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('chemcards-practice-v2'))?.turn>=4,{},{timeout:8000});
 assert(!((await page.locator('#toast').textContent())||'').includes('not defined'));
 await page.locator('#history').click();assert((await page.locator('#modal-body').textContent()).includes('氧化亚铁'));await page.locator('#close-modal').click();
 assert.deepEqual(errors,[]);console.log('Practice regression passed: FeO play, both computer turns, history rendering, no undefined pool counts.');
}finally{await browser.close();}
