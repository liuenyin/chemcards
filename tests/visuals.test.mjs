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
assert.equal(substanceTheme('CuSO4').label,'白色固体');
assert.equal(substanceTheme('CuSO4·5H2O').label,'蓝色晶体');
assert.equal(substanceTheme('W(CO)6').label,'白色固体');
console.log('Visual themes passed: registry entries, isomer-specific states, hydrate separation, neutral fallback; '+SUBSTANCES.filter(s=>substanceTheme(s.formula,s.name)).length+' substances covered.');

for(const [formula,name,material]of [['Au','金','metal'],['CuSO4·5H2O','胆矾','crystal'],['CuO','氧化铜','powder'],['C','石墨','graphite'],['Hg','汞','mercury'],['C3H8O3','丙三醇','viscous']])assert.equal(substanceTheme(formula,name).material,material);

assert.equal(substanceTheme('FeO').material,'powder');
assert.equal(substanceTheme('FeO').label,'黑色固体');

// --- R1: 100% Coverage & Phase Calibration ---
assert.equal(SUBSTANCES.length, 598);
assert.equal(SUBSTANCES.filter(s=>substanceTheme(s.formula,s.name)).length, 598);

// R1: Physical phases at 25 °C and 1 atm
const phaseChecks = [
  ['TiCl4', '四氯化钛', 'liquid'],
  ['Mn2O7', '七氧化二锰', 'liquid'],
  ['CH3I', '碘甲烷', 'liquid'],
  ['C2H5I', '碘乙烷', 'liquid'],
  ['C3H7Cl', '氯代正丙烷', 'liquid'],
  ['SnCl4', '氯化锡', 'liquid'],
  ['SiCl4', '四氯化硅', 'liquid'],
  ['PCl3', '三氯化磷', 'liquid'],
  ['SCl2', '二氯化硫', 'liquid'],
  ['S2Cl2', '二氯化二硫', 'liquid'],
  ['ICl', '氯化碘', 'solid'],
  ['C2H5Br', '溴乙烷', 'liquid'],
  ['C3H7Br', '溴代正丙烷', 'liquid'],
  ['C3H7I', '碘代正丙烷', 'liquid'],
  ['H2Se', '硒化氢', 'gas'],
  ['BCl3', '三氯化硼', 'gas'],
  ['BF3', '三氟化硼', 'gas'],
  ['PF3', '三氟化磷', 'gas'],
  ['PF5', '五氟化磷', 'gas'],
  ['SiF4', '四氟化硅', 'gas'],
  ['C2H5Cl', '氯乙烷', 'gas'],
  ['CH3Br', '溴甲烷', 'gas'],
  ['C4H8', '1-丁烯', 'gas'],
  ['C4H6', '1-丁炔', 'gas'],
  ['C4H8', '环丁烷', 'gas'],
  ['C2H7N', '乙胺', 'gas'],
  ['C2H2O4', '乙二酸', 'solid'],
  ['C4H6O5', '苹果酸', 'solid'],
  ['C4H6O6', '酒石酸', 'solid'],
  ['C10H20O2', '癸酸', 'solid']
];
for(const [f,n,expectedPhase] of phaseChecks){
  const t = substanceTheme(f,n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert.equal(t.phase, expectedPhase, `${n} (${f}) phase expected ${expectedPhase}, got ${t.phase}`);
}

// --- R2: Characteristic Colored Substances ---
const coloredChecks = [
  ['K2MnO4', '锰酸钾', '绿'],
  ['Na2CrO4', '铬酸钠', '黄'],
  ['K2CrO4', '铬酸钾', '黄'],
  ['K2Cr2O7', '重铬酸钾', '橙'],
  ['Na2Cr2O7', '重铬酸钠', '橙'],
  ['PbCrO4', '铬酸铅', '黄'],
  ['Cu2(OH)2CO3', '碱式碳酸铜', '绿'],
  ['CoCl2', '氯化钴', '蓝'],
  ['Co(OH)2', '氢氧化钴', '红'],
  ['NiO', '氧化镍', '绿'],
  ['Ni(OH)2', '氢氧化镍', '绿'],
  ['AuCl3', '氯化金', '红'],
  ['HAuCl4', '氯金酸', '黄'],
  ['MnO', '一氧化锰', '绿'],
  ['WO3', '三氧化钨', '黄'],
  ['AgF', '氟化银', '黄'],
  ['Mg3N2', '氮化镁', '绿'],
  ['Ca3N2', '氮化钙', '黑'],
  ['Ca3P2', '磷化钙', '红'],
  ['AlP', '磷化铝', '灰'],
  ['CuBr2', '溴化铜', '黑'],
  ['Fe(NO3)3', '硝酸铁', '紫']
];
for(const [f,n,keyword] of coloredChecks){
  const t = substanceTheme(f,n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert(t.label.includes(keyword), `${n} (${f}) label expected to contain "${keyword}", got "${t.label}"`);
  assert(!t.label.includes('白色') && !t.label.includes('无色'), `${n} (${f}) must not be labeled white/colorless`);
}

// Special check: CuBr2 solid must NOT be labeled green (solution color confusion)
assert(!substanceTheme('CuBr2', '溴化铜').label.includes('绿'), 'CuBr2 pure solid must be black, not green');

// Special check: Fe(NO3)3 pale purple crystal hex color consistency
const feNitrateTheme = substanceTheme('Fe(NO3)3', '硝酸铁');
assert.equal(feNitrateTheme.color, '#bda8c7');

// --- R2: Metalloids / Semiconductors (Must not be regular metals) ---
for(const f of ['Si','Ge','Sb','Te','GaAs','SiC','As']){
  const t = substanceTheme(f);
  assert(t, `Theme missing for ${f}`);
  assert.notEqual(t.material, 'metal', `${f} must not be regular metal`);
  assert(['crystal','semiconductor'].includes(t.material), `${f} must be crystal or semiconductor, got ${t.material}`);
}

// Special material checks for newly supported textures
for(const f of ['P4']) assert.equal(substanceTheme(f).material, 'waxy', `${f} must be waxy`);
for(const f of ['TiCl4', 'SiCl4', 'SnCl4', 'PCl3']) assert.equal(substanceTheme(f).material, 'fuming', `${f} must be fuming`);
for(const [f, n] of [['C3H8O3','丙三醇'], ['C2H6O2','乙二醇'], ['H2SO4','硫酸'],  ['Mn2O7','七氧化二锰'], ['N2H4','联氨'], ['C6H7N','苯胺'], ['C6H5NO2','硝基苯']]) {
  assert.equal(substanceTheme(f, n).material, 'viscous', `${n} (${f}) must be viscous`);
}

// --- R2: All 15 Isomer Groups (31 substances) Strict Isolation ---
const ISOMER_FORMULAS = ['C2H6O','C2H4O2','C3H6','C3H8O','C3H6O','C3H6O2','C4H10','C4H8','C4H10O','C4H8O2','C5H12','C5H10','C6H12','C6H12O2','C6H12O6'];
for(const f of ISOMER_FORMULAS){
  assert.equal(substanceTheme(f), null, `Isomer formula ${f} without name must return null`);
  assert.equal(substanceTheme(f, '未知非收录异构体'), null, `Isomer formula ${f} with unlisted name must return null`);
}

// --- Robustness: Empty/Null inputs ---
assert.equal(substanceTheme(null, null), null);
assert.equal(substanceTheme(undefined, undefined), null);
assert.equal(substanceTheme('', ''), null);
assert.equal(substanceTheme('UnknownFormula123'), null);
assert.equal(substanceTheme('UnknownFormula123', 'UnknownName'), null);

// --- Material Types Validation & Hex Semantics ---
const VALID_MATERIALS = ['gas','liquid','viscous','mercury','metal','crystal','powder','graphite','semiconductor','waxy','fuming'];
for(const s of SUBSTANCES){
  const t = substanceTheme(s.formula, s.name);
  assert(VALID_MATERIALS.includes(t.material), `${s.name} has invalid material: ${t.material}`);
  assert.equal(t.material, t.kind);
  assert(/^#[\da-f]{6}$/i.test(t.color), `${s.name} color invalid: ${t.color}`);
  
  // Semantic check: purple crystals should have red & blue > green in RGB
  if (t.label.includes('紫') && !t.label.includes('红') && !t.label.includes('黑')) {
    const num = parseInt(t.color.slice(1), 16);
    const [r, g, b] = [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    assert(r >= g && b >= g, `${s.name} purple label has incompatible hex ${t.color}`);
  }
}

// --- Anhydrous vs Hydrated Salt Pairs ---
const hydratePairs = [
  ['CuSO4', '硫酸铜', '白色固体', 'powder', 'CuSO4·5H2O', '胆矾', '蓝色晶体', 'crystal', true],
  ['FeCl3', '氯化铁', '黑棕色固体', 'powder', 'FeCl3·6H2O', '六水合三氯化铁', '黄棕色晶体', 'crystal', true],
  ['CoCl2', '氯化钴', '天蓝色粉末', 'powder', 'CoCl2·6H2O', '六水合氯化钴', '粉红至红色晶体', 'crystal', true],
  ['NiSO4', '硫酸镍', '黄绿色固体', 'powder', 'NiSO4·7H2O', '七水硫酸镍', '绿色晶体', 'crystal', true],
  ['FeSO4', '硫酸亚铁', '浅绿色晶体', 'crystal', 'FeSO4·7H2O', '绿矾', '浅蓝绿色晶体', 'crystal', false],
  ['[Cu(NH3)4]SO4', '硫酸四氨合铜', '深蓝色晶体', 'crystal', 'Cu(NH3)4SO4·H2O', '一水合硫酸四氨合铜', '深蓝色晶体', 'crystal', false]
];
for(const [f1, n1, l1, m1, f2, n2, l2, m2, distinctColor] of hydratePairs){
  const t1 = substanceTheme(f1, n1);
  const t2 = substanceTheme(f2, n2);
  assert(t1, `Theme missing for ${n1} (${f1})`);
  assert(t2, `Theme missing for ${n2} (${f2})`);
  assert.equal(t1.label, l1, `${n1} label mismatch`);
  assert.equal(t1.material, m1, `${n1} material mismatch`);
  assert.equal(t2.label, l2, `${n2} label mismatch`);
  assert.equal(t2.material, m2, `${n2} material mismatch`);
  if (distinctColor) {
    assert.notEqual(t1.color, t2.color, `${n1} and ${n2} must have distinct colors`);
  }
}

// --- Key Oxide Visual & Material Assertions ---
const oxideChecks = [
  ['Fe3O4', '四氧化三铁', '黑色固体', 'powder', '#394149'],
  ['Fe2O3', '氧化铁', '红棕色固体', 'powder', '#a4513d'],
  ['FeO', '氧化亚铁', '黑色固体', 'powder', '#333b42'],
  ['Cr2O3', '三氧化二铬', '绿色固体', 'powder', '#4e8454'],
  ['CrO3', '三氧化铬', '暗红色晶体', 'crystal', '#a83030'],
  ['MnO2', '二氧化锰', '棕黑色固体', 'powder', '#494139'],
  ['PbO', '一氧化铅', '黄色固体', 'powder', '#d1b839'],
  ['Pb3O4', '四氧化三铅', '红色固体', 'powder', '#c95030'],
  ['Ag2O', '氧化银', '棕黑色固体', 'powder', '#5a4a3a'],
  ['CuO', '氧化铜', '黑色固体', 'powder', '#373e43'],
  ['Cu2O', '氧化亚铜', '砖红色固体', 'powder', '#a84c35'],
  ['Bi2O3', '三氧化二铋', '黄色固体', 'powder', '#d8c83a'],
  ['CeO2', '二氧化铈', '淡黄色粉末', 'powder', '#dcd3a8'],
  ['WO3', '三氧化钨', '黄色粉末', 'powder', '#d2b834'],
  ['MoO3', '三氧化钼', '淡黄绿色粉末', 'powder', '#c8d4a0'],
  ['HgO', '氧化汞', '红色固体', 'powder', '#c95030']
];
for(const [f, n, l, m, hex] of oxideChecks){
  const t = substanceTheme(f, n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert.equal(t.label, l, `${n} (${f}) label expected ${l}, got ${t.label}`);
  assert.equal(t.material, m, `${n} (${f}) material expected ${m}, got ${t.material}`);
  assert.equal(t.color.toLowerCase(), hex.toLowerCase(), `${n} (${f}) color expected ${hex}, got ${t.color}`);
  assert.equal(t.phase, 'solid', `${n} (${f}) must be solid`);
}

// --- Boundary Volatile Liquids and Gases ---
const boundaryChecks = [
  ['CH2O', '甲醛', 'gas'],
  ['C2H4O', '乙醛', 'gas'],
  ['C2H4O2', '乙酸', 'liquid'],
  ['CH2O2', '甲酸', 'liquid'],
  ['HCN', '氰化氢', 'liquid'],
  ['ClO2', '二氧化氯', 'gas']
];
for(const [f, n, p] of boundaryChecks){
  const t = substanceTheme(f, n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert.equal(t.phase, p, `${n} (${f}) phase expected ${p}, got ${t.phase}`);
}

// --- R2: Halogen Interhalogens & Halogens Comprehensive Assertions ---
const halogenChecks = [
  ['F2', '氟气', 'gas', '淡黄绿色气体', 'gas', '#c9cc6e'],
  ['Cl2', '氯气', 'gas', '黄绿色气体', 'gas', '#a4b745'],
  ['Br2', '溴', 'liquid', '红棕色液体', 'liquid', '#95462e'],
  ['I2', '碘', 'solid', '灰黑色晶体', 'crystal', '#514f61'],
  ['ICl', '氯化碘', 'solid', '暗红至黑色晶体（α 型）', 'crystal', '#592b31'],
  ['ICl3', '三氯化碘', 'solid', '橙黄色针状晶体', 'crystal', '#dfa820'],
  ['ClO2', '二氧化氯', 'gas', '黄绿色气体', 'gas', '#a4b745']
];
for(const [f, n, p, l, m, hex] of halogenChecks){
  const t = substanceTheme(f, n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert.equal(t.phase, p, `${n} (${f}) phase mismatch`);
  assert.equal(t.label, l, `${n} (${f}) label mismatch`);
  assert.equal(t.material, m, `${n} (${f}) material mismatch`);
  assert.equal(t.color.toLowerCase(), hex.toLowerCase(), `${n} (${f}) color mismatch`);
}
for(const unlisted of ['BrF3', 'BrF5', 'IF5', 'IF7']) {
  assert.equal(substanceTheme(unlisted), null, `${unlisted} must return null`);
}

// --- R2: Nitrogen Oxides Comprehensive Assertions ---
const nitrogenOxideChecks = [
  ['NO', '一氧化氮', 'gas', '无色气体', 'gas', '#c1cbd0'],
  ['NO2', '二氧化氮', 'gas', '红棕色气体', 'gas', '#9b5233'],
  ['N2O', '一氧化二氮', 'gas', '无色气体', 'gas', '#c1cbd0'],
  ['N2O4', '四氧化二氮', 'gas', '含 NO₂ 的平衡气体', 'gas', '#b58c65'],
  ['N2O5', '五氧化二氮', 'solid', '白色晶体', 'crystal', '#c5cbd0']
];
for(const [f, n, p, l, m, hex] of nitrogenOxideChecks){
  const t = substanceTheme(f, n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert.equal(t.phase, p, `${n} (${f}) phase mismatch`);
  assert.equal(t.label, l, `${n} (${f}) label mismatch`);
  assert.equal(t.material, m, `${n} (${f}) material mismatch`);
  assert.equal(t.color.toLowerCase(), hex.toLowerCase(), `${n} (${f}) color mismatch`);
}
assert.equal(substanceTheme('N2O3'), null, 'N2O3 must return null');

// --- R2: Carbon & Non-metal Allotropes Assertions ---
const allotropeChecks = [
  ['C', '石墨', 'solid', '灰黑色固体', 'graphite', '#51565b'],
  ['P4', '白磷', 'solid', '白色蜡状固体', 'waxy', '#d1cdb0'],
  ['P', '红磷', 'solid', '暗红色粉末', 'powder', '#8b3a3a'],
  ['S8', '环八硫', 'solid', '黄色晶体', 'crystal', '#d6bd35']
];
for(const [f, n, p, l, m, hex] of allotropeChecks){
  const t = substanceTheme(f, n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert.equal(t.phase, p, `${n} (${f}) phase mismatch`);
  assert.equal(t.label, l, `${n} (${f}) label mismatch`);
  assert.equal(t.material, m, `${n} (${f}) material mismatch`);
  assert.equal(t.color.toLowerCase(), hex.toLowerCase(), `${n} (${f}) color mismatch`);
}

// --- R2: Sulfide Minerals & Insoluble Precipitates Assertions ---
const sulfideChecks = [
  ['ZnS', '硫化锌', 'solid', '白色固体', 'powder', '#c5cbd0'],
  ['CdS', '硫化镉', 'solid', '黄色固体', 'powder', '#d4ad30'],
  ['HgS', '硫化汞', 'solid', '红色固体', 'powder', '#a83030'],
  ['PbS', '硫化铅', 'solid', '黑色固体', 'powder', '#373e43'],
  ['CuS', '硫化铜', 'solid', '黑色固体', 'powder', '#373e43'],
  ['Cu2S', '硫化亚铜', 'solid', '黑色固体', 'powder', '#3a4048'],
  ['FeS', '硫化亚铁', 'solid', '黑色固体', 'powder', '#394149'],
  ['FeS2', '二硫化铁', 'solid', '浅黄色晶体', 'crystal', '#c5a83a'],
  ['Sb2S3', '硫化锑', 'solid', '橙红色固体', 'powder', '#c95030'],
  ['As2S3', '三硫化二砷', 'solid', '黄色固体', 'powder', '#d1b839'],
  ['As4S4', '四硫化四砷', 'solid', '橙红色晶体', 'crystal', '#c95030'],
  ['MoS2', '二硫化钼', 'solid', '黑色固体', 'powder', '#394149'],
  ['Ag2S', '硫化银', 'solid', '黑色固体', 'powder', '#373e43']
];
for(const [f, n, p, l, m, hex] of sulfideChecks){
  const t = substanceTheme(f, n);
  assert(t, `Theme missing for ${n} (${f})`);
  assert.equal(t.phase, p, `${n} (${f}) phase mismatch`);
  assert.equal(t.label, l, `${n} (${f}) label mismatch`);
  assert.equal(t.material, m, `${n} (${f}) material mismatch`);
  assert.equal(t.color.toLowerCase(), hex.toLowerCase(), `${n} (${f}) color mismatch`);
}
assert.equal(substanceTheme('Bi2S3'), null, 'Bi2S3 must return null');

// --- Element Finishes for Non-metals, Metalloids & Metals ---
import {elementFinish} from '../dist/visuals.mjs';
assert.equal(elementFinish('C'), 'finish-graphite');
assert.equal(elementFinish('Si'), 'finish-crystal');
assert.equal(elementFinish('Ge'), 'finish-crystal');
assert.equal(elementFinish('Sb'), 'finish-crystal');
assert.equal(elementFinish('Te'), 'finish-crystal');
assert.equal(elementFinish('Au'), 'finish-metal finish-gold');
assert.equal(elementFinish('Cu'), 'finish-metal finish-copper');
assert.equal(elementFinish('Fe'), 'finish-metal');
assert.equal(elementFinish('Cl'), 'finish-gas');

// --- RGB Semantic Consistency Across All 598 Substances ---
for(const s of SUBSTANCES){
  const t = substanceTheme(s.formula, s.name);
  const num = parseInt(t.color.slice(1), 16);
  const [r, g, b] = [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  
  if (t.label.includes('红') && !t.label.includes('黄') && !t.label.includes('橙') && !t.label.includes('紫') && !t.label.includes('黑') && !t.label.includes('白') && !t.label.includes('棕')) {
    assert(r >= g && r >= b, `${s.name} red label has incompatible hex ${t.color}`);
  }
  if (t.label.includes('绿') && !t.label.includes('黄') && !t.label.includes('蓝') && !t.label.includes('黑') && !t.label.includes('白') && !t.label.includes('灰')) {
    assert(g >= r && g >= b, `${s.name} green label has incompatible hex ${t.color}`);
  }
  if (t.label.includes('蓝') && !t.label.includes('绿') && !t.label.includes('紫') && !t.label.includes('黑') && !t.label.includes('白') && !t.label.includes('灰')) {
    assert(b >= r && b >= g, `${s.name} blue label has incompatible hex ${t.color}`);
  }
  if (t.label.includes('黄') && !t.label.includes('绿') && !t.label.includes('红') && !t.label.includes('橙') && !t.label.includes('黑') && !t.label.includes('白') && !t.label.includes('灰') && !t.label.includes('棕') && !t.label.includes('金')) {
    assert(r >= b && g >= b, `${s.name} yellow label has incompatible hex ${t.color}`);
  }
}

// --- CSS Material Classes & Effects Verification ---
import fs from 'node:fs';
const layoutCss = fs.readFileSync(new URL('../dist/layout.css', import.meta.url), 'utf8');
const cardsCss = fs.readFileSync(new URL('../dist/cards.css', import.meta.url), 'utf8');
for(const mat of VALID_MATERIALS){
  const inLayout = layoutCss.includes(`data-substance-material=${mat}`) || layoutCss.includes(`data-substance-phase=${mat}`) || layoutCss.includes(`.substance-effect.${mat}`);
  const inCards = cardsCss.includes(`data-substance-material=${mat}`) || cardsCss.includes(`data-substance-phase=${mat}`) || cardsCss.includes(`.substance-effect.${mat}`) || cardsCss.includes(`finish-${mat}`);
  assert(inLayout || inCards, `CSS styling missing for material: ${mat}`);
}

// --- Documentation Synchronization Verification ---
const docContent = fs.readFileSync(new URL('../docs/substance-visuals.md', import.meta.url), 'utf8');
const docLines = docContent.split('\n');
const docTableRows = docLines.filter(l => l.startsWith('|') && !l.includes('---') && !l.includes('物质名称'));
assert.equal(docTableRows.length, 598, `docs/substance-visuals.md must list exactly 598 substances, got ${docTableRows.length}`);
for(const row of docTableRows){
  const parts = row.split('|').map(s => s.trim()).filter(Boolean);
  if (parts.length < 7) continue;
  const [name, formula, _cat, phase, label, hexCode, matCode] = parts;
  const hex = hexCode.replace(/[^#a-fA-F0-9]/g, '');
  const mat = matCode.replace(/[^a-zA-Z0-9_-]/g, '');
  const t = substanceTheme(formula, name);
  assert(t, `Doc entry ${name} (${formula}) missing in visuals.mjs`);
  assert.equal(t.phase, phase, `Doc phase mismatch for ${name} (${formula})`);
  assert.equal(t.label, label, `Doc label mismatch for ${name} (${formula})`);
  assert.equal(t.color.toLowerCase(), hex.toLowerCase(), `Doc color mismatch for ${name} (${formula})`);
  assert.equal(t.material, mat, `Doc material mismatch for ${name} (${formula})`);
}



// Reference-based regressions (sources are attached to APPEARANCE_CONDITIONS).
assert.equal(substanceTheme('H3PO4').phase,'solid');
assert.equal(substanceTheme('H3PO4').material,'crystal');
assert.equal(substanceTheme('P4O6').phase,'liquid');
assert.equal(substanceTheme('P4O6').material,'liquid');
assert.equal(substanceTheme('H2SO3').basis,'solution');
assert.equal(substanceTheme('H2SO3').label,'水溶液示意');
assert.equal(substanceTheme('N2O4').basis,'equilibrium');
assert(substanceTheme('ICl').note.includes('α'));
for(const f of ['HClO','HClO2','HClO3','HBrO','HBrO3','HNO2','HBF4','NH3·H2O'])assert.equal(substanceTheme(f).basis,'solution');
for(const s of SUBSTANCES){const t=substanceTheme(s.formula,s.name);assert.equal(t.temperatureC,25);assert.equal(t.pressureAtm,1);}
