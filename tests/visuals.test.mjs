import assert from 'node:assert/strict';
import {SUBSTANCES} from '../dist/chemistry.mjs';
import {FORMULA_THEMES,NAMED_THEMES,substanceTheme} from '../dist/visuals.mjs';
for(const formula of Object.keys(FORMULA_THEMES))assert(SUBSTANCES.some(s=>s.formula===formula),formula);
for(const [name,[formula]]of Object.entries(NAMED_THEMES))assert(SUBSTANCES.some(s=>s.name===name&&s.formula===formula),name);
for(const s of SUBSTANCES){const t=substanceTheme(s.formula,s.name);if(t){assert(/^#[\da-f]{6}$/i.test(t.color));assert(['gas','liquid','solid'].includes(t.phase));assert(t.label);}}
assert.equal(substanceTheme('C2H6O','乙醇').phase,'liquid');
assert.equal(substanceTheme('C2H6O','二甲醚').phase,'gas');
assert.equal(substanceTheme('C5H12','正戊烷').phase,'liquid');
assert.equal(substanceTheme('C5H12','新戊烷').phase,'gas');
assert.equal(substanceTheme('C2H6O'),null);
assert.equal(substanceTheme('C2H6O','未收录异构体'),null);
assert.equal(substanceTheme('C3H8O','乙醇'),null);
assert.equal(substanceTheme('CuSO4'),null);
assert.equal(substanceTheme('CuSO4·5H2O').label,'蓝色晶体');
assert.equal(substanceTheme('W(CO)6'),null);
console.log('Visual themes passed: registry entries, isomer-specific states, hydrate separation, neutral fallback; '+SUBSTANCES.filter(s=>substanceTheme(s.formula,s.name)).length+' substances covered.');

for(const [formula,name,material]of [['Au','金','metal'],['CuSO4·5H2O','胆矾','crystal'],['CuO','氧化铜','powder'],['C','石墨','graphite'],['Hg','汞','mercury'],['C3H8O3','丙三醇','viscous']])assert.equal(substanceTheme(formula,name).material,material);

assert.equal(substanceTheme('FeO').material,'powder');
assert.equal(substanceTheme('FeO').label,'黑色固体');
