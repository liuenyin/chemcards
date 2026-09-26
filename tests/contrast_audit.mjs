import { ELEMENTS, SUBSTANCES } from '../dist/chemistry.mjs';

function parseHex(hex) {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const num = parseInt(h, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function blend(fgHex, bgHex, alpha) {
  const fg = parseHex(fgHex);
  const bg = parseHex(bgHex);
  return {
    r: Math.round(fg.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(fg.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(fg.b * alpha + bg.b * (1 - alpha)),
  };
}

function relativeLuminance(rgb) {
  const { r, g, b } = rgb;
  const [R, G, B] = [r, g, b].map(val => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hex1, hex2, alpha1 = 1.0) {
  const rgbBg = typeof hex2 === 'string' ? parseHex(hex2) : hex2;
  const rgbFg = alpha1 < 1.0 ? blend(hex1, typeof hex2 === 'string' ? hex2 : '#ffffff', alpha1) : parseHex(hex1);
  const L1 = relativeLuminance(rgbFg);
  const L2 = relativeLuminance(rgbBg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('=== 1. ALL 19 CHEMICAL ELEMENTS (dist/chemistry.mjs) ===');
const elementResults = [];
for (const [sym, el] of Object.entries(ELEMENTS)) {
  const ratioRaw = contrastRatio(el.ink, el.bg);
  const ratio85 = contrastRatio(el.ink, el.bg, 0.85); // for opacity 0.85 subtext
  const ratio88 = contrastRatio(el.ink, el.bg, 0.88); // for opacity 0.88 name
  const passAA = ratioRaw >= 4.5;
  const pass85AA = ratio85 >= 4.5;
  elementResults.push({
    element: sym,
    name: el.name,
    bg: el.bg,
    ink: el.ink,
    ratioRaw: Number(ratioRaw.toFixed(2)),
    passAA,
    ratio85: Number(ratio85.toFixed(2)),
    pass85AA,
    ratio88: Number(ratio88.toFixed(2)),
  });
  console.log(`${sym.padEnd(3)} (${el.name}): bg=${el.bg}, ink=${el.ink} -> Contrast: ${ratioRaw.toFixed(2)}:1 (AA: ${passAA ? 'PASS' : 'FAIL'}) | @85%: ${ratio85.toFixed(2)}:1 (${pass85AA ? 'PASS' : 'FAIL'})`);
}

console.log('\n=== 2. CANVAS ATOM SYMBOLS (dist/editor.mjs) ===');
const editorColors = {
  C: '#0f172a',
  H: '#475569',
  O: '#dc2626',
  N: '#2563eb',
  S: '#854d0e',
  Cl: '#166534',
  Br: '#9a3412',
  I: '#6b21a8',
  _default: '#334155'
};
const canvasBackgrounds = {
  white: '#ffffff',
  active: '#ecfdf5',
};

const editorResults = [];
for (const [sym, color] of Object.entries(editorColors)) {
  const ratioWhite = contrastRatio(color, canvasBackgrounds.white);
  const ratioActive = contrastRatio(color, canvasBackgrounds.active);
  // Note: For C, O, N, S, Cl, Br, I: font is 17px bold (large text threshold in WCAG is 14pt bold = ~18.66px, or 18pt = 24px).
  // For H: font is 13px (normal text).
  const passNormalWhite = ratioWhite >= 4.5;
  const passLargeWhite = ratioWhite >= 3.0;
  const passNormalActive = ratioActive >= 4.5;
  const passLargeActive = ratioActive >= 3.0;
  editorResults.push({
    symbol: sym,
    color,
    ratioWhite: Number(ratioWhite.toFixed(2)),
    passNormalWhite,
    passLargeWhite,
    ratioActive: Number(ratioActive.toFixed(2)),
    passNormalActive,
    passLargeActive,
  });
  console.log(`Atom ${sym.padEnd(8)} ${color}: vs #ffffff -> ${ratioWhite.toFixed(2)}:1 (AA 4.5:1: ${passNormalWhite ? 'PASS' : 'FAIL'}, 3:1: ${passLargeWhite ? 'PASS' : 'FAIL'}) | vs #ecfdf5 -> ${ratioActive.toFixed(2)}:1 (AA 4.5:1: ${passNormalActive ? 'PASS' : 'FAIL'})`);
}

console.log('\n=== 3. GLOBAL TEXT COLORS & TOKENS ===');
const globalTokens = {
  '--text': '#0f172a',
  '--muted': '#64748b',
  '--danger': '#e11d48',
  '--lime/--emerald': '#059669',
  '--tech-blue': '#0284c7',
};
const globalBackgrounds = {
  '--bg': '#f8fafc',
  '--panel': '#ffffff',
  '--raised': '#f1f5f9',
  '--emerald (primary btn)': '#059669',
  '--emerald:hover (#047857)': '#047857',
  '--blue (table felt)': '#e6f0ed',
};

const globalResults = [];
for (const [textColorName, textColor] of Object.entries(globalTokens)) {
  for (const [bgName, bgColor] of Object.entries(globalBackgrounds)) {
    const ratio = contrastRatio(textColor, bgColor);
    globalResults.push({
      text: textColorName,
      bg: bgName,
      ratio: Number(ratio.toFixed(2)),
      pass4_5: ratio >= 4.5,
      pass3_0: ratio >= 3.0,
    });
    console.log(`${textColorName.padEnd(18)} (${textColor}) on ${bgName.padEnd(25)} (${bgColor}) -> ${ratio.toFixed(2)}:1 (${ratio >= 4.5 ? 'PASS AA' : (ratio >= 3.0 ? 'PASS Large/UI' : 'FAIL AA')})`);
  }
}

// Special button text cases:
console.log('\n--- Button Specific Combos ---');
console.log('Primary Button (#ffffff on --emerald #059669):', contrastRatio('#ffffff', '#059669').toFixed(2) + ':1');
console.log('Primary Button Hover (#ffffff on #047857):', contrastRatio('#ffffff', '#047857').toFixed(2) + ':1');
console.log('Normal Button (--text #0f172a on #ffffff):', contrastRatio('#0f172a', '#ffffff').toFixed(2) + ':1');
console.log('Normal Button Hover (--text #0f172a on --raised #f1f5f9):', contrastRatio('#0f172a', '#f1f5f9').toFixed(2) + ':1');
console.log('Quiet Button (--muted #64748b on #ffffff):', contrastRatio('#64748b', '#ffffff').toFixed(2) + ':1');
console.log('Quiet Button (--muted #64748b on --bg #f8fafc):', contrastRatio('#64748b', '#f8fafc').toFixed(2) + ':1');
console.log('Quiet Button Hover (--text #0f172a on --raised #f1f5f9):', contrastRatio('#0f172a', '#f1f5f9').toFixed(2) + ':1');

console.log('\n=== 4. MODAL TEXT & DIALOG COMPONENTS ===');
const modalChecks = [
  { name: '.rule-block (text)', fg: '#334155', bg: '#ffffff' },
  { name: '.rule-block h3', fg: '#0f172a', bg: '#ffffff' },
  { name: '.library-row strong', fg: '#0f172a', bg: '#ffffff' },
  { name: '.library-row span', fg: '#334155', bg: '#ffffff' },
  { name: '.library-row small', fg: '#64748b', bg: '#ffffff' },
  { name: '.library-row:hover (small)', fg: '#64748b', bg: '#f8fafc' },
  { name: '.tag', fg: '#334155', bg: '#f1f5f9' },
  { name: '.vote-card h3', fg: '#0f172a', bg: '#ffffff' },
  { name: '.vote-card p', fg: '#64748b', bg: '#ffffff' },
  { name: 'vote accept button', fg: '#ffffff', bg: '#059669' },
  { name: 'vote reject button', fg: '#e11d48', bg: '#fff1f2' },
  { name: 'vote reject hover', fg: '#be123c', bg: '#ffe4e6' },
  { name: '.error-banner', fg: '#9f1239', bg: '#fff1f2' },
  { name: '.close icon', fg: '#64748b', bg: '#f1f5f9' },
  { name: '.close:hover icon', fg: '#0f172a', bg: '#e2e8f0' },
  { name: '.turn-ribbon strong', fg: '#047857', bg: '#ecfdf5' },
  { name: '.turn-ribbon span', fg: '#065f46', bg: '#ecfdf5' },
  { name: '.table-bottom', fg: '#64748b', bg: '#e6f0ed' },
  { name: '.drop-message text', fg: '#0f172a', bg: '#ffffff' },
  { name: '.drop-message span', fg: '#64748b', bg: '#ffffff' },
  { name: '.table.drop-over .drop-message', fg: '#059669', bg: '#ecfdf5' },
  { name: '.table.drop-invalid .drop-message', fg: '#e11d48', bg: '#fff1f2' },
];

for (const c of modalChecks) {
  const ratio = contrastRatio(c.fg, c.bg);
  console.log(`${c.name.padEnd(35)}: ${c.fg} on ${c.bg} -> ${ratio.toFixed(2)}:1 (${ratio >= 4.5 ? 'PASS AA' : (ratio >= 3.0 ? 'PASS Large/UI' : 'FAIL AA')})`);
}

console.log('\n=== 5. SUBSTANCE NAME LENGTH STRESS TEST ===');
let maxNameLen = 0;
let maxFormulaLen = 0;
let longestName = null;
let longestFormula = null;

for (const s of SUBSTANCES) {
  if (s.name.length > maxNameLen) {
    maxNameLen = s.name.length;
    longestName = s;
  }
  if (s.formula.length > maxFormulaLen) {
    maxFormulaLen = s.formula.length;
    longestFormula = s;
  }
}
console.log(`Total substances: ${SUBSTANCES.length}`);
console.log(`Longest substance name: "${longestName.name}" (${maxNameLen} chars, formula: ${longestName.formula})`);
console.log(`Longest formula: "${longestFormula.formula}" (${maxFormulaLen} chars, name: ${longestFormula.name})`);
const longNames = SUBSTANCES.filter(s => s.name.length >= 8);
console.log(`Substances with name length >= 8 chars: ${longNames.length}`);
longNames.forEach(s => console.log(`  - ${s.name} (${s.formula}, ${s.category})`));
