import assets from 'site:assets';
import {newGame,legalMoves,play,skip} from '../dist/engine.mjs';
import {SUBSTANCES,parseFormula,keyOf,massOf,atomCount,structureMatches} from '../dist/chemistry.mjs';

const corsHeaders = {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
 'Access-Control-Max-Age': '86400',
};

const json = (data, status = 200) => Response.json(data, {
 status,
 headers: {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  ...corsHeaders,
 },
});

const fail = (message, status = 400) => {
 const error = new Error(message);
 error.status = status;
 throw error;
};

const randomToken = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, '0')).join('');
const hash = async t => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t))), b => b.toString(16).padStart(2, '0')).join('');
const nameOf = v => {
 if (typeof v !== 'string' || v.trim().length < 1 || v.trim().length > 16) fail('昵称需要 1—16 个字符');
 return v.trim();
};
const publicMember = (m, i) => ({id: m.id, name: m.name, ready: m.ready, index: i});

function snapshot(room, revision, member) {
 const me = room.members.findIndex(m => m.id === member.id), g = room.game;
 return {
  code: room.code,
  id: room.id,
  serverNow: Date.now(),
  revision,
  host: room.host,
  me,
  status: room.status,
  options: room.options,
  members: room.members.map(publicMember),
  custom: room.custom,
  proposals: room.proposals,
  game: g ? {
   deadline: g.deadline,
   structureMode: g.structureMode,
   relayRescue: g.relayRescue,
   mode: g.mode,
   size: g.size,
   initialHand: g.initialHand,
   current: g.current,
   winner: g.winner,
   turn: g.turn,
   context: g.context,
   table: g.table,
   hand: g.hands[me],
   handCounts: g.hands.map(h => h.length),
   ...(g.winner !== null && room.status === 'finished' ? {revealedHands: g.hands} : {}),
   stockCount: g.stock.length,
   discardCount: g.discard.length,
   dryTurns: g.dryTurns,
   passes: g.passes,
   history: g.history.slice(0, 70),
   moves: g.current === me && g.winner === null ? legalMoves(g) : [],
  } : null,
 };
}

async function bodyOf(req) {
 if (Number(req.headers.get('content-length') || 0) > 50000) fail('请求过大', 413);
 const raw = await req.text();
 if (raw.length > 50000) fail('请求过大', 413);
 try { return JSON.parse(raw); } catch { fail('请求格式错误'); }
}

function optionsOf(body) {
 const mode = body.mode ?? 'A', size = mode === 'B' ? 108 : body.size ?? 108, initialHand = mode === 'B' ? body.initialHand ?? 9 : null, strategy = body.strategy ?? 'random',
       structureMode = body.structureMode ?? 'quick', turnSeconds = body.turnSeconds ?? (structureMode === 'structure' ? 90 : 30),
       relayRescue = body.relayRescue ?? true, hintsEnabled = body.hintsEnabled ?? true;
 if (!['A', 'B'].includes(mode) || !Number.isInteger(size) || size < 16 || size > 108 || (mode === 'B' && (!Number.isInteger(initialHand) || initialHand < 2 || initialHand > 12)) || !['mixed', 'random'].includes(strategy) || !['quick', 'structure'].includes(structureMode) || ![0, 30, 60, 90, 120].includes(turnSeconds) || typeof relayRescue !== 'boolean') {
  fail('房间设置无效');
 }
 if(typeof hintsEnabled !== 'boolean')fail('成牌提示设置无效');
 return {mode, size, initialHand, hintsEnabled, strategy, structureMode, turnSeconds, relayRescue: mode === 'B' && relayRescue};
}

const expiresAfter = 24 * 60 * 60 * 1000;
function nextDeadline(room) { return room.options.turnSeconds === 0 ? null : Date.now() + (room.options.turnSeconds ?? 30) * 1000; }

function timedMove(game) {
 const player = game.current;
 const single = game.mode === 'A' && !game.table ? legalMoves(game).find(m=>m.cards.length===1&&m.cards[0]===game.hands[player][0]) : null;
 const next = single ? play(game, single.id, single.cards) : skip(game);
 next.history.unshift({type: 'timeout', player, turn: game.turn});
 return next;
}

const databaseInitializations = new WeakMap();
async function ensureDb(db) {
 if (!databaseInitializations.has(db)) {
  const pending = db.prepare('CREATE TABLE IF NOT EXISTS rooms (code TEXT PRIMARY KEY NOT NULL, state TEXT NOT NULL, revision INTEGER DEFAULT 0 NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)').run();
  databaseInitializations.set(db, pending);
 }
 try { await databaseInitializations.get(db); }
 catch (error) { databaseInitializations.delete(db); throw error; }
}

async function handle(req, env) {
 if (req.method === 'OPTIONS') {
  return new Response(null, {status: 204, headers: corsHeaders});
 }

 const url = new URL(req.url);
 if (!url.pathname.startsWith('/api/')) {
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  const asset = assets[path];
  if (!asset) return new Response('Not found', {status: 404});
  return new Response(asset.body, {
   headers: {
    'Content-Type': asset.type,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
   },
  });
 }

 if (url.pathname === '/api/health') return json({ok: true, database: !!env.DB});
 if (!env.DB) fail('联机服务暂时不可用，请稍后再试。', 503);
 await ensureDb(env.DB);

 if (req.method === 'POST' && url.pathname === '/api/rooms') {
  const body = await bodyOf(req), token = randomToken(), member = {id: crypto.randomUUID(), name: nameOf(body.name), tokenHash: await hash(token), ready: true};
  const now = Date.now();
  await env.DB.prepare('DELETE FROM rooms WHERE updated_at < ?').bind(now - expiresAfter).run();
  const occupied = new Set((await env.DB.prepare('SELECT code FROM rooms').all()).results.map(r => r.code));
  const start = crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  for (let attempt = 0; attempt < 10000; attempt++) {
   const code = String((start + attempt) % 10000).padStart(4, '0');
   if (occupied.has(code)) continue;
   const room = {id: crypto.randomUUID(), code, host: member.id, members: [member], options: optionsOf(body), status: 'waiting', game: null, custom: [], proposals: []};
   const result = await env.DB.prepare('INSERT OR IGNORE INTO rooms (code,state,revision,created_at,updated_at) VALUES (?,?,0,?,?)').bind(code, JSON.stringify(room), now, now).run();
   if (result.meta.changes) return json({token, room: snapshot(room, 0, member)}, 201);
  }
  fail('当前房间已满，请稍后再试', 503);
 }

 const match = url.pathname.match(/^\/api\/rooms\/(\d{4})(?:\/(join|action))?$/);
 if (!match) fail('地址不存在', 404);
 const [, code, action] = match;

 const record = await env.DB.prepare('SELECT state,revision,updated_at FROM rooms WHERE code=?').bind(code).first();
 if (!record || record.updated_at < Date.now() - expiresAfter) fail('房间不存在或已超过 24 小时无人访问', 404);
 const room = JSON.parse(record.state);

 const save = async () => {
  const result = await env.DB.prepare('UPDATE rooms SET state=?,revision=revision+1,updated_at=? WHERE code=? AND revision=?').bind(JSON.stringify(room), Date.now(), code, record.revision).run();
  if (!result.meta.changes) fail('房间刚刚更新，请同步后重试', 409);
 };

 if (action === 'join' && req.method === 'POST') {
  const b = await bodyOf(req);
  if (room.status !== 'waiting') fail('这局已开始，请等待房主返回房间后加入');
  if (room.members.length >= 6) fail('房间已满，最多 6 人');
  const name = nameOf(b.name);
  if (room.members.some(m => m.name === name)) fail('昵称已被使用，请换一个');
  const token = randomToken(), member = {id: crypto.randomUUID(), name, tokenHash: await hash(token), ready: false};
  if (!room.members.length) { room.host = member.id; member.ready = true; }
  room.members.push(member);
  room.proposals = [];
  await save();
  return json({token, room: snapshot(room, record.revision + 1, member)});
 }

 const token = req.headers.get('authorization')?.replace(/^Bearer /, '');
 if (!token) fail('请先加入房间', 401);
 const tokenHash = await hash(token), member = room.members.find(m => m.tokenHash === tokenHash);
 if (!member) fail('加入凭证已失效，请重新加入', 401);

 if (room.status === 'playing' && room.game.winner === null && room.options.turnSeconds !== 0) {
  let changed = false;
  if (!Number.isFinite(room.game.deadline)) { room.game.deadline = nextDeadline(room); changed = true; }
  else if (Date.now() >= room.game.deadline) {
   room.game = timedMove(room.game);
   room.game.deadline = nextDeadline(room);
   if (room.game.winner !== null) room.status = 'finished';
   changed = true;
  }
  if (changed) { await save(); record.revision++; }
 }

 if (req.method === 'GET' && !action) {
  if (Date.now() - record.updated_at > 60000) {
   await env.DB.prepare('UPDATE rooms SET updated_at=? WHERE code=? AND revision=?').bind(Date.now(), code, record.revision).run();
  }
  return json(snapshot(room, record.revision, member));
 }

 if (req.method !== 'POST' || action !== 'action') fail('请求方式无效', 405);
 const b = await bodyOf(req);
 if (b.revision !== record.revision) fail('牌局已更新，正在同步，请稍后重试', 409);
 const me = room.members.indexOf(member), host = member.id === room.host;

 switch (b.type) {
  case 'ready':
   if (room.status !== 'waiting') fail('牌局已经开始');
   member.ready = !!b.ready;
   break;
  case 'settings':
   if (!host || room.status !== 'waiting') fail('只有房主可以在等候时更改设置', 403);
   room.options = optionsOf(b);
   for (const m of room.members) m.ready = m.id === room.host;
   break;
  case 'start':
   if (!host) fail('只有房主可以开始', 403);
   if (room.status !== 'waiting' || room.members.length < 2 || room.members.some(m => !m.ready)) fail('至少两人，且所有玩家准备后才能开始');
   room.game = newGame({...room.options, players: room.members.length, seed: crypto.getRandomValues(new Uint32Array(1))[0], custom: room.custom});
   room.game.deadline = nextDeadline(room);
   room.status = 'playing';
   break;
  case 'play': {
   if (room.status !== 'playing' || room.game.current !== me || room.game.winner !== null) fail('还没有轮到你', 403);
   if (!Array.isArray(b.cards) || b.cards.length > 108) fail('出牌无效');
   const move = legalMoves(room.game).find(m => m.id === b.moveId && keyOf(m.cards.reduce((a, e) => (a[e] = (a[e] || 0) + 1, a), {})) === keyOf(b.cards.reduce((a, e) => (a[e] = (a[e] || 0) + 1, a), {})));
   if (!move) fail('这些牌不能组成当前可出的物质');
   if (move.graph && ((room.options.structureMode === 'structure' || b.structure) && !structureMatches(move.graph, b.structure))) {
    fail('原子连接关系与所选物质不符，请检查结构');
   }
   room.game = play(room.game, move.id, b.cards);
   room.game.deadline = nextDeadline(room);
   if (room.game.winner !== null) room.status = 'finished';
   break;
  }
  case 'skip':
   if (room.status !== 'playing' || room.game.current !== me) fail('还没有轮到你', 403);
   room.game = skip(room.game);
   room.game.deadline = nextDeadline(room);
   break;
  case 'lobby':
   if (!host) fail('只有房主可以返回等候室', 403);
   room.status = 'waiting';
   room.game = null;
   for (const m of room.members) m.ready = m.id === room.host;
   break;
  case 'leave':
   // Seat indices belong to this game. Clear it before removing any seat.
   room.game = null;
   room.status = 'waiting';
   room.members.splice(me, 1);
   if (host && room.members.length) room.host = room.members[0].id;
   for (const m of room.members) m.ready = m.id === room.host;
   room.proposals = [];
   break;
  case 'remove':
   if (!host || room.status !== 'waiting' || b.memberId === member.id) fail('仅房主可移除等候中的其他玩家', 403);
   room.members = room.members.filter(m => m.id !== b.memberId);
   room.proposals = [];
   break;
  case 'propose': {
   if (room.custom.length >= 60 || room.proposals.filter(p => p.status === 'pending').length >= 3) fail('待确认物质过多，请先处理已有提案');
   const name = nameOf(b.name);
   if (typeof b.formula !== 'string' || b.formula.length > 80) fail('请输入化学式');
   const formula = b.formula.trim(), counts = parseFormula(formula);
   if (atomCount(counts) < 2 || atomCount(counts) > 108) fail('原子数需要在 2—108 之间');
   if ([...SUBSTANCES, ...room.custom].some(s => s.name === name)) fail('这个名称已收录');
   let source;
   try {
    source = new URL(b.source);
    if (source.protocol !== 'https:') throw Error();
   } catch {
    fail('请附上可核对的 https 资料链接');
   }
   const id = 'custom-' + crypto.randomUUID();
   room.proposals.push({id, name, formula, source: source.href, counts, key: keyOf(counts), mass: massOf(counts), size: atomCount(counts), category: '房间约定', graph: null, status: 'pending', author: member.id, votes: {[member.id]: true}});
   break;
  }
  case 'vote': {
   const proposal = room.proposals.find(p => p.id === b.proposalId && p.status === 'pending');
   if (!proposal) fail('提案已处理');
   proposal.votes[member.id] = !!b.accept;
   if (!b.accept) proposal.status = 'rejected';
   else if (room.members.every(m => proposal.votes[m.id])) {
    proposal.status = 'accepted';
    const {status, votes, author, ...substance} = proposal;
    room.custom.push(substance);
    if (room.game) room.game.custom = room.custom;
   }
   break;
  }
  default: fail('未知操作');
 }
 await save();
 return json(b.type === 'leave' ? {left: true} : snapshot(room, record.revision + 1, member));
}

export default {
 async fetch(req, env) {
  try {
   return await handle(req, env);
  } catch (error) {
   if (!error.status) console.error('room request failed', error.message);
   return json({error: error.status ? error.message : '操作未完成，请重试。若问题持续，请重新进入房间。'}, error.status || 500);
  }
 },
};
