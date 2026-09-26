import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const playwrightPath = process.env.PLAYWRIGHT_MODULE || 'E:/School+AI/school-dice-duel/node_modules/playwright/index.mjs';
const chromiumPath = process.env.CHROMIUM_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const { chromium } = await import(pathToFileURL(playwrightPath));
const browser = await chromium.launch({ headless: true, executablePath: chromiumPath });

const findings = {
  cssSyntaxErrors: [],
  selectorFailures: [],
  mobileResponsiveFailures: [],
  contrastFailures: [],
  draggingFailures: [],
  overflowResults: []
};

// --- Part 1: Static CSS Parser to check brace balancing ---
function checkCssBraceBalance(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let depth = 0;
  let unclosedStack = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Strip comments
    const stripped = line.replace(/\/\*.*?\*\//g, '');
    for (let c of stripped) {
      if (c === '{') {
        depth++;
        unclosedStack.push({ lineNum: i + 1, text: line.trim() });
      } else if (c === '}') {
        depth--;
        unclosedStack.pop();
      }
    }
  }
  return { depth, unclosedStack };
}

const styleCssBalance = checkCssBraceBalance('dist/style.css');
const cardsCssBalance = checkCssBraceBalance('dist/cards.css');
console.log('dist/style.css brace depth at EOF:', styleCssBalance.depth);
if (styleCssBalance.depth !== 0) {
  findings.cssSyntaxErrors.push({
    file: 'dist/style.css',
    error: `Unbalanced braces: depth is ${styleCssBalance.depth} at EOF.`,
    unclosedBlocks: styleCssBalance.unclosedStack
  });
}

console.log('dist/cards.css brace depth at EOF:', cardsCssBalance.depth);
if (cardsCssBalance.depth !== 0) {
  findings.cssSyntaxErrors.push({
    file: 'dist/cards.css',
    error: `Unbalanced braces: depth is ${cardsCssBalance.depth} at EOF.`,
    unclosedBlocks: cardsCssBalance.unclosedStack
  });
}

// --- Part 2: Playwright Live DOM Evaluation in Chrome ---
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:4173');

  // Helper to test if a selector from style.css matches an element
  async function testElementStyles(htmlSnippet, selector, expectedStyleProperty, expectedValue) {
    return await page.evaluate(({ snippet, sel, prop, val }) => {
      const container = document.createElement('div');
      container.innerHTML = snippet;
      document.body.appendChild(container);
      const target = container.querySelector(sel);
      if (!target) return { found: false };
      const cs = window.getComputedStyle(target);
      const actualVal = cs[prop];
      
      const matched = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && target.matches(rule.selectorText)) {
              matched.push(rule.selectorText);
            }
          }
        } catch (e) {}
      }
      container.remove();
      return {
        found: true,
        actualVal,
        matched,
        matchesExpected: actualVal === val
      };
    }, { snippet: htmlSnippet, sel: selector, prop: expectedStyleProperty, val: expectedValue });
  }

  // Test elements defined after line 1067 in dist/style.css
  const componentsToTest = [
    {
      name: '.search in modal (outside .modal-footer)',
      snippet: '<dialog open><input class="search" id="test-search"></dialog>',
      sel: '.search',
      prop: 'width',
      // In CSS: width: 100%; In user-agent default: ~181px or '181px'
      check: res => res.actualVal !== '181px'
    },
    {
      name: '.library-row (outside .modal-footer)',
      snippet: '<dialog open><div class="library-list"><button class="library-row"><strong>H2</strong><span>氢气</span></button></div></dialog>',
      sel: '.library-row',
      prop: 'display',
      check: res => res.actualVal === 'flex'
    },
    {
      name: '.tag (outside .modal-footer)',
      snippet: '<dialog open><span class="tag">单质</span></dialog>',
      sel: '.tag',
      prop: 'display',
      check: res => res.actualVal === 'inline-block'
    },
    {
      name: '.rule-block (outside .modal-footer)',
      snippet: '<dialog open><div class="rule-block"><h3>规则</h3><p>内容</p></div></dialog>',
      sel: '.rule-block',
      prop: 'lineHeight',
      check: res => res.actualVal === '25.2px' || res.actualVal === '27px' || res.actualVal.includes('25')
    },
    {
      name: '.canvas-wrap (outside .modal-footer)',
      snippet: '<dialog open><div class="canvas-wrap"><svg class="molecule-canvas"><g class="node"><circle/></g></svg></div></dialog>',
      sel: '.canvas-wrap',
      prop: 'height',
      check: res => res.actualVal === '430px'
    },
    {
      name: '.molecule-canvas .node circle (outside .modal-footer)',
      snippet: '<dialog open><div class="canvas-wrap"><svg class="molecule-canvas"><g class="node"><circle/></g></svg></div></dialog>',
      sel: '.molecule-canvas .node circle',
      prop: 'fill',
      check: res => res.actualVal === 'rgb(255, 255, 255)' || res.actualVal === '#ffffff'
    },
    {
      name: '.vote-card (outside .modal-footer)',
      snippet: '<dialog open><div class="vote-card"><h3>提案</h3></div></dialog>',
      sel: '.vote-card',
      prop: 'padding',
      check: res => res.actualVal === '18px'
    }
  ];

  console.log('\n--- Checking CSS Rule Matching for Modal Components ---');
  for (const c of componentsToTest) {
    const res = await testElementStyles(c.snippet, c.sel, c.prop, '');
    const passed = c.check(res);
    console.log(`${c.name}: ${c.prop} = "${res.actualVal}" | Matched: [${res.matched.join(', ')}] -> ${passed ? 'OK' : 'BROKEN BY UNCLOSED BRACE'}`);
    if (!passed) {
      findings.selectorFailures.push({
        component: c.name,
        selector: c.sel,
        expectedProperty: c.prop,
        actualValue: res.actualVal,
        matchedRules: res.matched,
        reason: 'Selector failed to match standalone element because rule was nested inside .modal-footer'
      });
    }
  }

  // --- Part 3: Mobile Viewport Stress Testing ---
  console.log('\n--- Checking Mobile Viewport Rules (@media (max-width: 800px)) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);

  const mobileChecks = await page.evaluate(() => {
    const topbar = document.querySelector('.topbar');
    const csTopbar = window.getComputedStyle(topbar);
    
    // Test table on mobile
    const table = document.querySelector('.table') || document.body.appendChild(document.createElement('div'));
    table.className = 'table';
    const csTable = window.getComputedStyle(table);

    // Test hand on mobile
    const hand = document.querySelector('.hand') || document.body.appendChild(document.createElement('div'));
    hand.className = 'hand';
    const csHand = window.getComputedStyle(hand);

    return {
      topbarHeight: csTopbar.height, // expected 63px if mobile rule applies, 76px if desktop
      topbarPadding: csTopbar.padding, // expected '0px 15px' vs '0px 32px'
      tablePadding: csTable.padding, // expected '12px 10px' vs '18px 30px 15px'
      handGap: csHand.gap, // expected '10px'
    };
  });
  console.log('Mobile computed values at 390px width:', mobileChecks);
  if (mobileChecks.topbarHeight !== '63px') {
    findings.mobileResponsiveFailures.push({
      element: '.topbar',
      issue: 'Mobile rule height: 63px did not apply (actual: ' + mobileChecks.topbarHeight + ')',
      reason: '@media (max-width: 800px) block in dist/style.css is nested inside unclosed .modal-footer block'
    });
  }
  if (mobileChecks.tablePadding !== '13px 12px 12px') {
    findings.mobileResponsiveFailures.push({
      element: '.table',
      issue: 'Mobile table padding did not match cards.css (actual: ' + mobileChecks.tablePadding + ')',
      reason: 'Check the final responsive rule in cards.css, which overrides style.css.'
    });
  }

  // --- Part 4: Drag and Drop Feedback States ---
  console.log('\n--- Checking Drag and Drop Feedback States ---');
  const dndStates = await page.evaluate(() => {
    const t = document.createElement('div');
    t.className = 'table';
    const msg = document.createElement('div');
    msg.className = 'drop-message';
    msg.innerHTML = '松手出牌<span>合法化学物质</span>';
    t.appendChild(msg);
    document.body.appendChild(t);

    const results = {};

    // 1. Just drop-ready
    t.className = 'table drop-ready';
    results.dropReady = {
      display: getComputedStyle(msg).display,
      opacity: getComputedStyle(msg).opacity,
      color: getComputedStyle(msg).color,
      bg: getComputedStyle(msg).backgroundColor,
    };

    // 2. drop-ready + drop-over (normal valid drag hover)
    t.className = 'table drop-ready drop-over';
    results.validHover = {
      display: getComputedStyle(msg).display,
      opacity: getComputedStyle(msg).opacity,
      color: getComputedStyle(msg).color,
      bg: getComputedStyle(msg).backgroundColor,
      border: getComputedStyle(msg).borderColor,
    };

    // 3. drop-ready + drop-over + drop-invalid (normal invalid drag hover)
    t.className = 'table drop-ready drop-over drop-invalid';
    results.invalidHover = {
      display: getComputedStyle(msg).display,
      opacity: getComputedStyle(msg).opacity,
      color: getComputedStyle(msg).color,
      bg: getComputedStyle(msg).backgroundColor,
      border: getComputedStyle(msg).borderColor,
    };

    // 4. Standalone drop-over (edge case)
    t.className = 'table drop-over';
    results.standaloneDropOver = {
      display: getComputedStyle(msg).display,
    };

    // 5. Standalone drop-invalid (edge case)
    t.className = 'table drop-invalid';
    results.standaloneDropInvalid = {
      display: getComputedStyle(msg).display,
    };

    t.remove();
    return results;
  });

  console.log('DnD states:', dndStates);
  if (dndStates.standaloneDropOver.display === 'none') {
    findings.draggingFailures.push({
      state: '.table.drop-over',
      issue: 'Standalone .table.drop-over has display: none because display: flex is only defined on .table.drop-ready .drop-message',
      severity: 'LOW',
      impact: 'If hand.mjs removes drop-ready before drop-over, overlay immediately vanishes.'
    });
  }

  // --- Part 5: Long Substance Names Stress Testing ---
  console.log('\n--- Checking Long Substance Names & Overflow ---');
  const overflowTest = await page.evaluate(() => {
    const list = [
      '葡萄糖（开链式）',
      '超长多原子配位聚合物络合物结构测试名称',
      '十氧化四磷二聚体高分子衍生物',
      'KAl(SO4)2·12H2O',
      '(NH4)2Fe(SO4)2·6H2O'
    ];

    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;top:0;left:0;width:320px;background:#fff;z-index:999999;';
    document.body.appendChild(box);

    const outcomes = [];
    for (const name of list) {
      const el = document.createElement('div');
      el.className = 'played';
      el.innerHTML = `<span class="played-formula">${name}</span><span class="played-name">${name}</span>`;
      box.appendChild(el);

      outcomes.push({
        name,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        overflow: el.scrollWidth > el.clientWidth
      });
      el.remove();
    }
    box.remove();
    return outcomes;
  });
  console.log('Long name overflow test (320px mobile constraint):', overflowTest);
  findings.overflowResults = overflowTest;

} finally {
  await browser.close();
}

console.log('\n================ SUMMARY OF EMPIRICAL FINDINGS ================');
console.log(JSON.stringify(findings, null, 2));
