import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4173');
 const result=await page.evaluate(async()=>{
  const {SUBSTANCES}=await import('/chemistry.mjs');const v=await import('/visuals.mjs');const sound=await import('/sound.mjs');sound.setSoundSettings({effects:true});
  const covered=SUBSTANCES.filter(s=>v.substanceTheme(s.formula,s.name));
  for(const move of covered){v.applySubstanceTheme(move);if(document.body.dataset.substancePhase!==v.substanceTheme(move.formula,move.name).phase)throw Error(move.name);}
  const phases=[];const table=document.createElement('section');document.body.append(table);
  for(const name of ['乙醇','二甲醚','正戊烷','新戊烷']){const move=SUBSTANCES.find(s=>s.name===name);v.applySubstanceTheme(move);v.showSubstanceEffect(move,table);phases.push([document.body.dataset.substancePhase,table.querySelector('.effect-caption').textContent]);}
  const material=document.body.dataset.substanceMaterial;
  const layers=document.querySelectorAll('.ambient-matter').length,pointer=getComputedStyle(document.querySelector('.ambient-matter')).pointerEvents;
  sound.setSoundSettings({effects:false});v.applySubstanceTheme(covered[0]);const off=!document.querySelector('.ambient-matter')&&!document.querySelector('.substance-effect');
  sound.setSoundSettings({effects:true});v.applySubstanceTheme({formula:'C2H6O',name:'未收录异构体'});const unknown=!document.body.dataset.substancePhase;
  return{count:covered.length,phases,material,layers,pointer,off,unknown};
 });
 assert.equal(result.count,598);assert.deepEqual(result.phases.map(p=>p[0]),['liquid','gas','liquid','gas']);assert.deepEqual(result.phases.map(p=>p[1]),['无色液体','无色气体','无色液体','无色气体']);assert.equal(result.material,'gas');assert.equal(result.layers,1);assert.equal(result.pointer,'none');assert(result.off&&result.unknown);await page.emulateMedia({reducedMotion:'reduce'});
 for(const [formula,name,material]of [['Au','金','metal'],['CuO','氧化铜','powder'],['Hg','汞','mercury'],['C3H8O3','丙三醇','viscous'],['CuSO4·5H2O','胆矾','crystal'],['Si','硅','semiconductor'],['P4','白磷','waxy'],['TiCl4','四氯化钛','fuming']]){
  await page.evaluate(async move=>(await import('/visuals.mjs')).applySubstanceTheme(move),{formula,name});
  assert.equal(await page.locator('body').getAttribute('data-substance-material'),material);
  assert.equal(await page.locator('.ambient-matter i').first().evaluate(e=>getComputedStyle(e).animationName),'none');
 }
 assert.deepEqual(errors,[]);
 console.log('Browser themes passed: all 598 entries, organic phase/caption transitions, single non-interactive layer, off switch and unknown fallback.');
}finally{await browser.close();}
