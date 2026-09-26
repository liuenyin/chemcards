import {ELEMENTS,SUBSTANCES,parseFormula,countCards,keyOf,compositionText,formatFormula,massText,atomCount,expand} from './chemistry.mjs';
import {newGame,legalMoves,play,skip,chooseBotMove,POOL} from './engine.mjs';
import {mountEditor,referenceSvg} from './editor.mjs';
import {CardHand,flyCards} from './hand.mjs';
import {playSound,getSoundSettings,setSoundSettings} from './sound.mjs';
import {showSubstanceEffect} from './visuals.mjs';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=$('#root'),modal=$('#modal');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=s=>formatFormula(esc(s));
const getStorage=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
const setStorage=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

let room=null,session=null,localGame=null,selection={},activeMove=null,sort='element',pollTimer=null,botTimer=null,turnTimerId=null,turnCountdown=30,busy=false,toastTimer,modalView='',entranceMode='A',hint=0,lastError='';
let handView=null,dealPending=false,candidatesOpen=false,serverOffset=0;
const poolCounts=countCards(POOL);

const title=m=>m==='A'?'质量竞技':'化学接龙';
const allSubstances=()=>[...SUBSTANCES,...(room?.custom||[])];

function toast(text){
 $('#toast').textContent=text;
 $('#toast').classList.add('show');
 clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);
}

function showModal(title,html,wide=false,view=''){
 modalView=view;
 modal.classList.toggle('editor-modal',wide);
 $('#modal-body').innerHTML=`<div class="modal-heading"><h2>${esc(title)}</h2><button class="close" aria-label="关闭" id="close-modal">×</button></div>${html}`;
 if(!modal.open)modal.showModal();
 $('#close-modal').onclick=closeModal;
}

function closeModal(){modal.close();modalView='';}
modal.addEventListener('close',()=>{modalView='';scheduleBot();});

async function api(path,body){
 let response;
 try{response=await fetch(path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(session?{Authorization:'Bearer '+session.token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});}
 catch(error){throw Error(error.name==='TimeoutError'?'连接超时，请检查网络后重试':'无法连接服务器，请检查网络后重试');}
 let data;
 try{data=await response.json();}catch{throw Error('服务器暂时没有响应，请稍后重试');}
 if(!response.ok){const e=new Error(data.error||'操作失败');e.status=response.status;throw e;}
 return data;
}

function storeSession(code,token){
 session={code,token};
 const sessions=getStorage('chemcards-room-keys')||{};
 sessions[code]=token;
 setStorage('chemcards-room-keys',sessions);
 setStorage('chemcards-last-room',code);
 history.replaceState(null,'','?room='+code);
}

function startTurnTimer(){
 clearInterval(turnTimerId);
 if(!room?.game||room.game.winner!==null)return;
 const tick=()=>{
  const deadline=room.game.deadline;
  turnCountdown=Number.isFinite(deadline)?Math.max(0,Math.ceil((deadline-Date.now()-serverOffset)/1000)):null;
  const el=$('#turn-countdown');if(el){el.textContent=turnCountdown===null?'不限时':turnCountdown===0?'正在结算…':turnCountdown+'s';el.classList.toggle('urgent',turnCountdown!==null&&turnCountdown<=5);}
 };
 tick();turnTimerId=setInterval(tick,250);
}

function acceptRoom(next){
 if(room&&next.code===room.code&&next.revision<room.revision)return;
 const old=room?.game;
 const handRect=$('#hand')?.getBoundingClientRect();
 const selectedRect=$('.playing-card.selected')?.getBoundingClientRect()||handRect;
 const playerRects=$$('.player').map(p=>p.getBoundingClientRect());
 const pileRect=$('.draw-pile')?.getBoundingClientRect();
 if(!old||next.game?.turn<old.turn)dealPending=true;
 if(JSON.stringify(old?.hand)!==JSON.stringify(next.game?.hand)){selection={};activeMove=null;}
 if(old?.turn!==next.game?.turn){activeMove=null;hint=0;}
 room=next;lastError='';if(next.serverNow)serverOffset=next.serverNow-Date.now();
 recordDiscoveries(next);
 $('#connection').textContent=localGame?'本机练习':`房间 ${room.code} · 已同步`;
 if(modalView==='editor'&&(!room.game||room.game.current!==room.me||room.game.winner!==null)){closeModal();toast('牌局已更新，返回牌桌。');}
 render();
 if(modalView==='votes')openVotes();
 startTurnTimer();
 if(old&&next.game&&next.game.turn>old.turn){
  const move=next.game.history.find(h=>h.type==='play'&&h.turn>=old.turn);
  if(move)showSubstanceEffect(move,$('.table'));
  if(move&&isRareMove(move))toast('稀有合成 · '+move.name);
  if(move)flyCards(move.cards,move.player===next.me?selectedRect:playerRects[move.player],$('.play-field')?.getBoundingClientRect());
  if(next.game.hand.length>old.hand.length){
   const before=countCards(old.hand),after=countCards(next.game.hand);
   const e=Object.keys(after).find(e=>after[e]>(before[e]||0));
   if(e)flyCards([e],pileRect||$('.table')?.getBoundingClientRect(),$('#hand')?.querySelector('[data-card="'+e+'-'+after[e]+'"]')?.getBoundingClientRect()||handRect,{reverse:true});
  }
 }
}

async function sync(){
 if(!session||localGame)return;
 try{
  const next=await api('/api/rooms/'+session.code);
  if(next.revision!==room?.revision)acceptRoom(next);
  else{$('#connection').textContent=`房间 ${room.code} · 已同步`;if(lastError){lastError='';render();}}
 }catch(e){
  $('#connection').textContent='连接中断 · 正在重试';lastError=e.message;
  if([401,404].includes(e.status)){clearTimeout(pollTimer);clearInterval(turnTimerId);session=null;room=null;renderEntrance(e.message);return;}
 }finally{
  if(session&&!localGame){clearTimeout(pollTimer);pollTimer=setTimeout(sync,1400);}
 }
}

async function action(type,data={}){
 if(busy)throw Error('上一项操作尚未完成');
 busy=true;
 try{
  if(localGame){
   if(type==='play'){localGame=play(localGame,data.moveId,data.cards);playSound('play');}
   else if(type==='skip'){localGame=skip(localGame);playSound('skip');}
   else if(type==='lobby'){clearInterval(turnTimerId);localGame=null;room=null;selection={};renderEntrance();return;}
   else return;
   setStorage('chemcards-practice-v2',localGame);
   acceptRoom(practiceView());
   scheduleBot();
   return;
  }
  const turn=room.game?.turn;let next;
  try{
   next=await api(`/api/rooms/${session.code}/action`,{type,revision:room.revision,...data});
   if(type==='play')playSound('play');
   else if(type==='skip')playSound('skip');
  }catch(error){
   if(error.status!==409)throw error;
   acceptRoom(await api('/api/rooms/'+session.code));
   if(['play','skip'].includes(type)&&room.game?.turn!==turn)throw Error('回合已经变化，请重新选牌');
   next=await api(`/api/rooms/${session.code}/action`,{type,revision:room.revision,...data});
   if(type==='play')playSound('play');
   else if(type==='skip')playSound('skip');
  }
  if(next.left){clearTimeout(pollTimer);clearInterval(turnTimerId);session=null;room=null;setStorage('chemcards-last-room',null);history.replaceState(null,'','./');closeModal();renderEntrance();}
  else acceptRoom(next);
 }catch(e){
  if(e.status===409)await sync();
  throw e;
 }finally{
  busy=false;
 }
}

const run=(fn)=>async(...args)=>{try{await fn(...args);}catch(e){toast(e.message);}};

function practiceView(){
 const g=localGame;
 return{code:'练习',revision:g.turn,me:0,host:'practice-0',status:g.winner===null?'playing':'finished',options:{mode:g.mode,size:g.size,initialHand:g.initialHand,hintsEnabled:g.hintsEnabled,strategy:g.strategy,structureMode:g.structureMode,relayRescue:g.relayRescue,turnSeconds:0},members:['你','林同学','周同学'].map((name,index)=>({id:'practice-'+index,name,index,ready:true})),custom:[],proposals:[],game:{...g,hand:g.hands[0],handCounts:g.hands.map(h=>h.length),stockCount:g.stock.length,discardCount:g.discard.length,moves:g.current===0&&g.winner===null?legalMoves(g):[]}};
}

function scheduleBot(){
 clearTimeout(botTimer);
 if(!localGame||localGame.current===0||localGame.winner!==null||modal.open)return;
 botTimer=setTimeout(()=>{
  if(!localGame||modal.open)return;
  const m=chooseBotMove(localGame);
  localGame=m?play(localGame,m.id,m.cards):skip(localGame);
  if(m)playSound('play');else playSound('skip');
  setStorage('chemcards-practice-v2',localGame);
  acceptRoom(practiceView());
  scheduleBot();
 },1000);
}

function extraOptions(opts={},disabled=false,prefix='option'){
 const off=disabled?'disabled':'';
 return `<label class="field">成牌提示<select id="${prefix}-hints" ${off}><option value="yes" ${opts.hintsEnabled!==false?'selected':''}>开启</option><option value="no" ${opts.hintsEnabled===false?'selected':''}>关闭</option></select></label><label class="field">有机物操作<select id="${prefix}-structure" ${off}><option value="quick" ${opts.structureMode!=='structure'?'selected':''}>快速局 · 配方出牌</option><option value="structure" ${opts.structureMode==='structure'?'selected':''}>结构局 · 自由拼键</option></select></label><label class="field">每回合时间<select id="${prefix}-seconds" ${off}>${[0,30,60,90,120].map(n=>'<option value="'+n+'" '+((opts.turnSeconds??60)===n?'selected':'')+'>'+(n?n+' 秒':'不限时')+'</option>').join('')}</select></label><label class="field" data-mode-only="B">无组合时解套<select id="${prefix}-rescue" ${off}><option value="yes" ${opts.relayRescue!==false?'selected':''}>开启 · 无组合时可单原子领出</option><option value="no" ${opts.relayRescue===false?'selected':''}>关闭 · 严格接龙，可能长局</option></select></label>`;
}
function readExtra(prefix){return{hintsEnabled:$('#'+prefix+'-hints').value==='yes',structureMode:$('#'+prefix+'-structure').value,turnSeconds:+$('#'+prefix+'-seconds').value,relayRescue:$('#'+prefix+'-rescue').value==='yes'};}
function rangeControl(prefix,key,label,min,max,value,disabled,mode){return `<label class="field deck-control" data-mode-only="${mode}">${label} <output id="${prefix}-${key}-label" for="${prefix}-${key}">${value} 张</output><input type="range" id="${prefix}-${key}" min="${min}" max="${max}" step="1" value="${value}" aria-valuetext="${value} 张" ${disabled?'disabled':''}><span class="deck-marks"><span>${min} 张</span><span>${max} 张</span></span></label>`;}
function deckControl(prefix,size=108,disabled=false,initialHand=9){return rangeControl(prefix,'size','总牌数',16,108,size,disabled,'A')+rangeControl(prefix,'initial','每人起手',2,12,initialHand??9,disabled,'B');}
function deckSize(prefix){return +$('#'+prefix+'-size').value;}
function cardOptions(prefix,mode){return mode==='A'?{size:deckSize(prefix)}:{initialHand:+$('#'+prefix+'-initial').value};}
function bindDeck(prefix){for(const key of ['size','initial']){const slider=$('#'+prefix+'-'+key);slider.oninput=()=>{const text=slider.value+' 张';$('#'+prefix+'-'+key+'-label').textContent=text;slider.setAttribute('aria-valuetext',text);};}}
function showModeOptions(prefix,mode){const scope=$('#'+prefix+'-size')?.closest(prefix==='create'?'.entrance':'.lobby-panel');scope?.querySelectorAll('[data-mode-only]').forEach(e=>e.hidden=e.dataset.modeOnly!==mode);}
function optionFields(opts,disabled=false){
 return `<label class="field">玩法<select id="option-mode" ${disabled?'disabled':''}><option value="A" ${opts.mode==='A'?'selected':''}>A · 质量竞技</option><option value="B" ${opts.mode==='B'?'selected':''}>B · 化学接龙</option></select></label>${deckControl('option',opts.size,disabled,opts.initialHand)}<label class="field">抽牌方式<select id="option-strategy" ${disabled?'disabled':''}><option value="mixed" ${opts.strategy==='mixed'?'selected':''}>配方混合</option><option value="random" ${opts.strategy==='random'?'selected':''}>自由随机</option></select></label>${extraOptions(opts,disabled)}`;
}

function renderEntrance(error=''){
 document.body.classList.remove('in-room','in-game');
 clearTimeout(botTimer);
 clearInterval(turnTimerId);
 const savedName=getStorage('chemcards-nickname')||'',code=new URLSearchParams(location.search).get('room')||'';
 root.innerHTML=`<section class="welcome"><div class="welcome-title"><div><span class="eyebrow">chemical cards</span><h1>化学扑克牌</h1><p>支持 2—6 人在线游玩，也可进行单人练习。</p></div><span class="edition">${Object.keys(ELEMENTS).length} 种元素 / ${SUBSTANCES.length} 种物质</span></div><nav class="home-tabs" aria-label="进入方式"><button class="btn" data-entry="create">建房</button><button class="btn" data-entry="join">加入房间</button></nav><div class="entrances"><section class="entrance"><h2>建房</h2><p>选择规则并创建房间。其他玩家可通过房间码或链接加入。</p><label class="field">你的昵称<input id="create-name" maxlength="16" placeholder="输入昵称" value="${esc(savedName)}" autocomplete="nickname"></label><div class="choices"><button class="choice ${entranceMode==='A'?'active':''}" data-mode="A"><strong>A · 质量竞技</strong><span>组牌比质量，先出完获胜</span></button><button class="choice ${entranceMode==='B'?'active':''}" data-mode="B"><strong>B · 化学接龙</strong><span>使用手牌补全桌面原子</span></button></div><div class="field-grid">${deckControl('create')}<label class="field">抽牌方式<select id="create-strategy"><option value="random">自由随机</option><option value="mixed">配方混合</option></select></label>${extraOptions({},false,'create')}</div><button class="btn primary wide" id="create-room">创建房间</button><p class="form-error" id="create-error" role="alert"></p></section><section class="entrance"><h2>加入房间</h2><p>输入昵称和四位数字房间码。</p><label class="field">你的昵称<input id="join-name" maxlength="16" placeholder="输入昵称" value="${esc(savedName)}" autocomplete="nickname"></label><label class="field">房间码<input id="join-code" class="join-code" maxlength="4" placeholder="1001" inputmode="numeric" pattern="[0-9]*" value="${esc(code)}" autocomplete="off" spellcheck="false"></label><button class="btn wide" id="join-room">加入房间</button><p class="form-error" id="entrance-error" role="alert">${esc(error)}</p><p class="quiet-note">刷新或短暂断线后，用同一浏览器打开房间即可回到原来的座位。</p></section></div><div class="practice-line"><span>单人练习：与两名电脑玩家对局。</span><button class="quiet" id="practice">开始练习</button></div></section>`;
 const selectEntry=entry=>{$('.welcome').classList.toggle('show-join',entry==='join');$$('[data-entry]').forEach(b=>{b.classList.toggle('primary',b.dataset.entry===entry);b.setAttribute('aria-pressed',String(b.dataset.entry===entry));});};
 $$('[data-entry]').forEach(b=>b.onclick=()=>selectEntry(b.dataset.entry));selectEntry(code?'join':'create');
 bindDeck('create');showModeOptions('create',entranceMode);
 $$('[data-mode]').forEach(b=>b.onclick=()=>{entranceMode=b.dataset.mode;showModeOptions('create',entranceMode);$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));});
 const enter=async creating=>{
  const button=$(creating?'#create-room':'#join-room');
  if(button.disabled)return;
  const originalLabel=button.textContent;
  const errorBox=$(creating?'#create-error':'#entrance-error');
  errorBox.textContent='';
  button.disabled=true;
  button.textContent=creating?'正在创建…':'正在加入…';
  try{
   const name=$(creating?'#create-name':'#join-name').value.trim();
   if(!name)throw Error('请输入昵称');
   setStorage('chemcards-nickname',name);
   localGame=null;session=null;
   const code=$('#join-code').value.trim();
   if(!creating&&!/^\d{4}$/.test(code))throw Error('请输入四位数字房间码（如 1001）');
   const stored=(getStorage('chemcards-room-keys')||{})[code];
   if(!creating&&stored){
    storeSession(code,stored);
    try{acceptRoom(await api('/api/rooms/'+code));}
    catch(error){
     if(error.status!==401)throw error;
     const keys=getStorage('chemcards-room-keys')||{};delete keys[code];setStorage('chemcards-room-keys',keys);session=null;
     const data=await api(`/api/rooms/${code}/join`,{name});storeSession(code,data.token);acceptRoom(data.room);
    }
   }else{
    const data=await api(creating?'/api/rooms':`/api/rooms/${code}/join`,creating?{name,mode:entranceMode,...cardOptions('create',entranceMode),strategy:$('#create-strategy').value,...readExtra('create')}:{name});
    storeSession(data.room.code,data.token);
    acceptRoom(data.room);
   }
   sync();
  }catch(e){
   if(e.status===401||e.status===404){const keys=getStorage('chemcards-room-keys')||{};delete keys[$('#join-code')?.value.trim()];setStorage('chemcards-room-keys',keys);}
   session=null;
   if(errorBox.isConnected){errorBox.textContent=e.message;errorBox.scrollIntoView({block:'nearest'});}
   else toast(e.message);
  }finally{
   button.disabled=false;
   button.textContent=originalLabel;
  }
 };
 $('#create-room').onclick=()=>enter(true);
 $('#join-room').onclick=()=>enter(false);
 $('#join-code').onkeydown=e=>{if(e.key==='Enter')enter(false);};
 $('#practice').onclick=()=>{
  clearTimeout(pollTimer);clearInterval(turnTimerId);session=null;
  localGame=newGame({mode:entranceMode,...cardOptions('create',entranceMode),strategy:$('#create-strategy').value,...readExtra('create'),seed:crypto.getRandomValues(new Uint32Array(1))[0]});
  room=null;acceptRoom(practiceView());
 };
}

function render(){if(!room){renderEntrance();return;}if(room.status==='waiting')renderLobby();else renderGame();}
function isHost(){return room.members[room.me]?.id===room.host;}
function proposalBanner(){const n=room.proposals.filter(p=>p.status==='pending').length;return n?`<div class="pending-note"><span>${n} 项新物质等待大家确认</span><button class="quiet" id="review-proposals">查看提案</button></div>`:'';}
function attachProposal(){if($('#review-proposals'))$('#review-proposals').onclick=openVotes;}

async function copyInvite(){
 const link=location.origin+location.pathname+'?room='+room.code;
 try{await navigator.clipboard.writeText(link);toast('邀请链接已复制');}
 catch{showModal('邀请朋友',`<p class="muted">复制下面的链接，发给朋友。</p><input class="search" readonly value="${esc(link)}" id="invite-url">`);$('#invite-url').select();}
}

function renderLobby(){
 document.body.classList.add('in-room');document.body.classList.remove('in-game');
 const host=isHost(),me=room.members[room.me];
 root.innerHTML=`<section class="lobby"><div class="lobby-head"><div><span class="eyebrow">房间码</span><div class="room-code">${room.code}</div></div><button class="btn primary" id="invite">复制邀请链接</button></div>${proposalBanner()}<div class="lobby-grid"><div class="lobby-panel"><h2>已入座 <span class="muted">${room.members.length} / 6</span></h2>${room.members.map(m=>`<div class="seat-row"><div class="avatar ${m.index===room.me?'mine':''}">${esc(m.name.slice(0,1))}</div><div class="seat-name">${esc(m.name)}${m.index===room.me?' · 你':''}<small>${m.id===room.host?'房主':'玩家'}</small></div><span class="${m.ready?'ready-badge':'waiting-badge'}">${m.ready?'已准备':'未准备'}</span>${host&&m.id!==room.host?`<button class="quiet small" data-remove="${m.id}">移除</button>`:''}</div>`).join('')}<p class="quiet-note">各自准备好后，由房主发牌。手牌只对本人可见。</p></div><div class="lobby-panel"><h2>本局规则</h2>${optionFields(room.options,!host)}${host?'<button class="btn small wide" id="save-settings">保存设置</button>':'<p class="quiet-note">设置由房主调整。</p>'}<p class="quiet-note">大牌池 1,800 张；配方混合每局轮换扩展元素。</p></div></div><div class="lobby-footer"><div><button class="quiet" id="leave">离开房间</button><button class="quiet" id="propose">补充物质</button></div>${host?`<button class="btn primary" id="start" ${room.members.length<2||room.members.some(m=>!m.ready)?'disabled':''}>${room.members.length<2?'等待玩家加入':room.members.some(m=>!m.ready)?'等待所有人准备':'开始发牌'}</button>`:`<button class="btn ${me.ready?'':'primary'}" id="ready">${me.ready?'取消准备':'准备'}</button>`}</div></section>`;
 bindDeck('option');showModeOptions('option',room.options.mode);$('#option-mode').onchange=e=>showModeOptions('option',e.target.value);
 $('#invite').onclick=run(copyInvite);
 if($('#ready'))$('#ready').onclick=run(()=>action('ready',{ready:!me.ready}));
 if($('#start'))$('#start').onclick=run(()=>action('start'));
 $('#leave').onclick=run(()=>action('leave'));
 $('#propose').onclick=openProposal;
 $$('[data-remove]').forEach(b=>b.onclick=run(()=>action('remove',{memberId:b.dataset.remove})));
 if($('#save-settings'))$('#save-settings').onclick=run(()=>action('settings',{mode:$('#option-mode').value,...cardOptions('option',$('#option-mode').value),strategy:$('#option-strategy').value,...readExtra('option')}));
 attachProposal();
}

const ownTurn=()=>room?.game&&room.game.current===room.me&&room.game.winner===null;

function renderGame(){
 document.body.classList.add('in-room','in-game');
 const g=room.game,scroll=$('#hand')?.scrollTop||0;
 root.innerHTML=`<div class="game-header"><div class="game-title"><span class="mode-chip">${g.mode}</span><div><h1>${title(g.mode)}</h1><span class="room-label">${localGame?'电脑练习':`房间 ${room.code}`} / ${g.mode==='A'?g.size+' 张':'起手 '+(g.initialHand??9)+' 张'}</span></div></div><div class="game-controls"><button class="quiet" id="game-collection">图鉴</button><button class="quiet" id="game-feedback">声音</button><button class="quiet" id="fullscreen">${document.fullscreenElement?'退出全屏':'全屏'}</button>${!localGame?'<button class="quiet" id="invite">邀请</button>':''}<button class="quiet" id="history">记录</button><button class="quiet" id="room-options">${localGame?'退出练习':'房间'}</button></div></div><div class="game-notices">${lastError?`<p class="error-banner">${esc(lastError)} · 正在自动重连，你的选牌会保留。</p>`:''}${proposalBanner()}</div><section class="table"><div class="drop-message">松手出牌</div><div class="players">${room.members.map(m=>`<div style="--seat-row:${Math.floor(m.index/2)+1};--seat-column:${m.index%2?3:1}" class="player ${m.index===g.current&&g.winner===null?'turn':''}"><span class="avatar ${m.index===room.me?'mine':''}">${esc(m.name.slice(0,1))}</span><div><div class="player-name">${esc(m.name)}${m.index===room.me?' · 你':''}</div><div class="player-cards">${g.handCounts[m.index]} 张${m.index===g.current&&g.winner===null?' · 出牌中':''}</div><div class="opponent-backs" aria-hidden="true">${m.index!==room.me?'<i></i>'.repeat(Math.min(5,g.handCounts[m.index])):''}</div></div></div>`).join('')}</div><div class="play-field">${g.mode==='B'?'<button class="draw-pile" id="draw-pile" aria-label="摸一张牌"><span>C</span><small>摸一张</small></button>':''}${tableContent(g)}</div><div class="table-bottom"><span>第 ${g.turn} 回合 · ${room.members.length} 人</span><span>${g.mode==='A'?'质量相同不能压牌':`摸牌堆 ${g.stockCount} · 连续摸牌 ${g.dryTurns}/${room.members.length*2}`}</span></div></section><section class="hand-bar" id="hand-bar"><div class="hand-bar-row"><div class="hand-status"><strong class="turn-status ${ownTurn()?'my-turn':''}">${g.winner!==null?`${esc(room.members[g.winner].name)}先出完了！`:ownTurn()?'轮到你出牌':`等待 ${esc(room.members[g.current].name)} 出牌`}</strong><span id="turn-countdown" class="turn-timer"></span><span class="hand-count">你的手牌 <b>${g.hand.length}</b> 张</span></div><div class="hand-selection" id="hand-selection"></div><div class="hand-actions" id="hand-actions"><button class="quiet" id="hint" ${room.options.hintsEnabled===false?'hidden':''} aria-expanded="${candidatesOpen}">成牌提示</button><button class="quiet" id="clear" disabled>清空</button><button class="btn" id="skip" ${!ownTurn()||(room.game.mode==='A'&&!room.game.table)?'disabled':''}>${room.game.mode==='A'?'过牌':'摸一张'}</button><button class="btn primary" id="play" disabled>确认出牌</button></div></div><div id="composer-candidates"></div></section><div class="hand physical-hand" id="hand"></div>`;
 renderHand();$('#hand').scrollTop=scroll;
 renderComposer();
 if($('#draw-pile')){$('#draw-pile').disabled=!ownTurn();$('#draw-pile').onclick=run(()=>action('skip'));}
 $('#history').onclick=openHistory;$('#game-collection').onclick=openCollection;$('#game-feedback').onclick=openFeedback;$('#fullscreen').onclick=toggleFullscreen;
 $('#room-options').onclick=openRoomOptions;
 if($('#invite'))$('#invite').onclick=run(copyInvite);
 attachProposal();
}

async function toggleFullscreen(){
 try{
  if(document.fullscreenElement){await document.exitFullscreen();return;}
  if(!document.documentElement.requestFullscreen){toast('此浏览器不支持网页全屏，可将手机横过来游玩。');return;}
  await document.documentElement.requestFullscreen({navigationUI:'hide'});
  if(matchMedia('(pointer: coarse)').matches&&screen.orientation?.lock){try{await screen.orientation.lock('landscape');}catch{toast('已全屏；可将手机横过来游玩。');}}
 }catch{toast('暂时无法全屏，当前窗口仍可正常游玩。');}
}
document.addEventListener('fullscreenchange',()=>{if($('#fullscreen'))$('#fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏';if(!document.fullscreenElement)screen.orientation?.unlock?.();});

function tableContent(g){
 if(g.winner!==null)return `<div class="center-empty"><span class="eyebrow">对局结束</span><h2>${g.winner===room.me?'你获得胜利':esc(room.members[g.winner].name)+'获胜。'}</h2><p>第 ${g.turn-1} 回合出完手牌</p></div>`;
 if(g.mode==='B'){return `<div class="context-card"><p class="turn-caption">上家留下的原子 · 全部参与组成物质</p><div class="context-atoms">${Object.entries(countCards(g.context)).map(([e,n])=>`<span class="context-atom">${e}<small>× ${n}</small></span>`).join('')}</div><p class="played-meta">${g.table?`上一手：${f(g.table.formula)} · ${esc(g.table.name)}`:'开局原子，等你来接'}</p></div>`;}
 if(g.table)return `<div><p class="turn-caption">${esc(room.members[g.table.player].name)} 的出牌</p><div class="played"><div class="played-formula">${f(g.table.formula)}</div><div class="played-name">${esc(g.table.name)}</div><div class="played-atom-cards">${g.table.cards.slice(0,9).map((e,i)=>'<span style="--card:'+ELEMENTS[e].bg+';--ink:'+ELEMENTS[e].ink+';--turn:'+(i%3-1)*4+'deg">'+e+'</span>').join('')}${g.table.cards.length>9?'<small>+'+(g.table.cards.length-9)+'</small>':''}</div><div class="played-meta">M ${massText(g.table.mass)} · ${g.table.cards.length} 张</div></div></div>`;
 return `<div class="center-empty"><span class="eyebrow">自由出牌</span><h2>${ownTurn()?'请选择出牌':esc(room.members[g.current].name)+'领出'}</h2><p>选原子、组物质。选牌区会实时给出结果。</p></div>`;
}

function renderHand(){
 const host=$('#hand');if(!host)return;
 const options={cards:room.game.hand,selection,sort};
 if(handView?.host===host){handView.update(options);return;}
 handView?.dispose();
 handView=new CardHand(host,{...options,deal:dealPending,onChange:counts=>{selection=counts;activeMove=null;renderComposer();},canPlay:()=>ownTurn()&&matches().length>0,onDrop:()=>{
  if(!ownTurn()){toast('已经预选好了，等轮到你再出。');return;}
  if(!matches().length){toast('这些原子还不能组成当前可出的物质。');host.classList.remove('returning');void host.offsetWidth;host.classList.add('returning');return;}
  const exact=matches();
  if(exact.length>1){
   showModal('选择出牌物质',`<p class="muted">当前原子可组成多种物质，请选择你要打出的一种：</p><div class="match-list" style="margin-top:15px">${exact.map(m=>`<button class="match" data-select-isomer="${m.id}"><strong>${f(m.formula)}</strong><span>${esc(m.name)}</span></button>`).join('')}</div>`);
   $$('[data-select-isomer]').forEach(b=>b.onclick=()=>{activeMove=b.dataset.selectIsomer;closeModal();$('#play').click();});
  }else{
   $('#play').click();
  }
 }});
 dealPending=false;
}

function matches(){const key=keyOf(selection);return room.game.moves.filter(m=>keyOf(countCards(m.cards))===key);}

function highlightHandCards(neededCards){
 $$('.playing-card').forEach(c=>c.classList.remove('card-highlight'));
 if(!neededCards||!neededCards.length)return;
 const counts=countCards(neededCards);
 for(const [e,n] of Object.entries(counts)){
  const cards=$$(`.playing-card[data-element="${e}"]`).slice(0,n);
  cards.forEach(c=>c.classList.add('card-highlight'));
 }
}

function renderComposer(){
 const n=atomCount(selection),exact=matches(),chosen=exact.find(m=>m.id===activeMove)||exact[0];
 if(chosen)activeMove=chosen.id;
 let suggestions=exact;
 if(candidatesOpen)suggestions=room.game.moves.filter(m=>Object.entries(selection).every(([e,n])=>(countCards(m.cards)[e]||0)>=n)).slice(0,24);
 else if(!n)suggestions=[];
 else if(!exact.length)suggestions=room.game.moves.filter(m=>Object.entries(selection).every(([e,n])=>(countCards(m.cards)[e]||0)>=n)).slice(0,8);

 if(room.options.hintsEnabled===false)suggestions=[];

 const selEl=$('#hand-selection');
 if(selEl){
  if(chosen){
   selEl.innerHTML=`<span class="selection-badge">已选 ${n} 张</span><span class="selection-target"><strong>${f(chosen.formula)}</strong> · ${esc(chosen.name)} · <small>M ${massText(chosen.mass)}</small></span>`;
  }else if(n){
   selEl.innerHTML=`<span class="selection-badge">已选 ${n} 张</span><span class="selection-formula">${esc(compositionText(selection))}</span><span class="selection-hint">${!ownTurn()?'已预选':'尚未成牌，可继续选牌'}</span>`;
  }else{
   selEl.innerHTML=`<span class="gesture-hint">${ownTurn()?'点选抬牌，横划多选，拖向桌面出牌':'等待其他玩家出牌 · 可预选手牌'}</span>`;
  }
 }

 const clearBtn=$('#clear');if(clearBtn)clearBtn.disabled=!n;
 const playBtn=$('#play');if(playBtn)playBtn.disabled=!ownTurn()||!chosen;
 const skipBtn=$('#skip');if(skipBtn){skipBtn.disabled=!ownTurn()||(room.game.mode==='A'&&!room.game.table);skipBtn.textContent=room.game.mode==='A'?'过牌':'摸一张';}
 const hintBtn=$('#hint');if(hintBtn){
  hintBtn.disabled=!ownTurn();
  hintBtn.setAttribute('aria-expanded',String(candidatesOpen));
  hintBtn.onclick=()=>{candidatesOpen=!candidatesOpen;renderComposer();};
 }

 const candEl=$('#composer-candidates');
 if(candEl){
  candEl.innerHTML=suggestions.length?`<div class="match-list candidate-list" aria-label="可出组合">${suggestions.map(m=>`<button class="match ${chosen?.id===m.id?'active':''}" data-match="${m.id}"><strong>${f(m.formula)}</strong><span>${esc(m.name)}</span><small>${m.cards.length} 张 · ${massText(m.mass)}</small></button>`).join('')}</div>`:n&&!chosen&&!suggestions.length?`<p class="quiet-note" style="margin:4px 0 0;font-size:11px">没有找到？${localGame?'可以查阅图鉴。':'可在图鉴中提交新物质，由全体玩家确认后加入本房间。'}</p>`:'';
 }

 if(clearBtn)clearBtn.onclick=()=>{selection={};activeMove=null;renderHand();renderComposer();};
 if(skipBtn)skipBtn.onclick=run(()=>action('skip'));
 if(playBtn)playBtn.onclick=run(async()=>{
  const m=matches().find(m=>m.id===activeMove);
  if(!m)return;
  if(m.graph&&room.options.structureMode==='structure'){
   showModal(m.name+' · 自由结构画布','<div id="structure-editor"></div>',true,'editor');
   mountEditor($('#structure-editor'),m,async structure=>{await action('play',{moveId:m.id,cards:m.cards,structure});closeModal();});
  }else await action('play',{moveId:m.id,cards:m.cards});
 });

 $$('[data-match]').forEach(b=>{
  const m=room.game.moves.find(m=>m.id===b.dataset.match);
  if(!m)return;
  b.onclick=()=>stage(m);
  b.onmouseenter=()=>highlightHandCards(m.cards);
  b.onmouseleave=()=>highlightHandCards([]);
  b.onfocus=()=>highlightHandCards(m.cards);b.onblur=()=>highlightHandCards([]);
 });
}

function stage(m){selection=countCards(m.cards);activeMove=m.id;renderHand();renderComposer();}

function openHistory(){
 showModal('牌局记录',`<div class="library-list">${room.game.history.map(h=>`<div class="history-row">${h.type==='timeout'?`${esc(room.members[h.player]?.name)} 超时，由服务器操作`:h.type==='play'?`${esc(room.members[h.player]?.name)} 打出 ${f(h.formula)} · ${esc(h.name)}${h.rescue?'（解套领出）':isRareMove(h)?' ✧ 稀有合成':''}`:h.type==='reset'?'连续两圈无人出牌，更换桌面原子':h.type==='lead'?`${esc(room.members[h.player]?.name)}重新领出`:h.type==='draw'?`${esc(room.members[h.player]?.name)}摸一张`:`${esc(room.members[h.player]?.name)}过牌`}<small>第 ${h.turn} 回合${h.mass?' · M '+massText(h.mass):''}</small></div>`).join('')||'<p class="muted">还没有出牌记录。</p>'}</div>`);
}

function openRoomOptions(){
 if(localGame){
  showModal('结束练习？','<p class="muted">回到首页，创建房间邀请朋友。</p><div class="modal-footer"><button class="btn primary" id="exit-practice">回到首页</button></div>');
  $('#exit-practice').onclick=run(async()=>{closeModal();await action('lobby');});
  return;
 }
 showModal('房间 '+room.code,`<p class="muted">${room.members.map(m=>esc(m.name)).join(' · ')}</p><p class="quiet-note">短暂离开后，用同一浏览器打开邀请链接可以回到座位。启用限时后，超时由服务器过牌或摸牌；A 模式领出会代出一张原子。24 小时无人访问的房间会回收。</p><div class="modal-footer"><button class="btn" id="room-propose">补充物质</button><button class="btn" id="room-invite">复制邀请</button>${isHost()?'<button class="btn primary" id="return-lobby">结束本局，返回房间</button>':''}</div>`);
 $('#room-invite').onclick=run(copyInvite);
 $('#room-propose').onclick=openProposal;
 if($('#return-lobby'))$('#return-lobby').onclick=()=>{
  showModal('结束当前对局？','<p class="muted">所有人将回到等候室，当前手牌不再保留。</p><div class="modal-footer"><button class="btn danger" id="confirm-end">确认结束</button></div>');
  $('#confirm-end').onclick=run(async()=>{await action('lobby');closeModal();});
 };
}

function openDetail(id){
 const s=allSubstances().find(s=>s.id===id);
 const previousNodes=[...$('#modal-body').childNodes],previousScroll=modal.scrollTop,previousFocus=document.activeElement,previousView=modalView;
 showModal(s.name,`<div class="detail-formula">${f(s.formula)}</div><p class="muted">M ${massText(s.mass)} · ${s.size} 个原子 · ${esc(s.category)}</p><p style="margin:16px 0">${Object.entries(s.counts).map(([e,n])=>`<span class="tag">${e} × ${n}</span>`).join('')}</p>${s.graph?referenceSvg(s.graph)+`<p class="muted">${esc(s.graph.reference)}</p>`:''}${s.source?`<p class="quiet-note">房间玩家共同确认 · <a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer">查看提交资料</a></p>`:''}<div class="modal-footer"><button class="btn" id="back-collection">返回图鉴</button>${room.options.hintsEnabled!==false&&ownTurn()&&room.game.moves.some(m=>m.id===id)?'<button class="btn primary" id="stage-detail">选出这些牌</button>':''}</div>`);
 $('#back-collection').textContent='返回图鉴';
 $('#back-collection').onclick=()=>{
  $('#modal-body').replaceChildren(...previousNodes);
  modalView=previousView;
  previousFocus?.focus({preventScroll:true});
  modal.scrollTop=previousScroll;
 };
 modal.scrollTop=0;
 if($('#stage-detail'))$('#stage-detail').onclick=()=>{closeModal();stage(room.game.moves.find(m=>m.id===id));};
}

function openProposal(){
 if(!room||localGame)return;
 showModal('提交物质',`<p class="muted">提交名称、常用化学式和可核对的资料。全体玩家同意后，本房间立即允许使用。</p><p class="quiet-note">这是房间共同约定，不是自动科学认证；请核实物质真实存在。自定物质按配方出牌。</p><form id="proposal-form"><label class="field">名称<input id="proposal-name" maxlength="16" required placeholder="例如：硫氰酸钾"></label><label class="field">常用化学式<input id="proposal-formula" maxlength="80" required placeholder="例如：KSCN"></label><label class="field">参考资料链接<input id="proposal-source" type="url" required placeholder="https://…"></label><p class="form-error" id="proposal-error"></p><div class="modal-footer"><button class="btn primary" type="submit">提交给全体玩家</button></div></form>`);
 $('#proposal-form').onsubmit=async e=>{
  e.preventDefault();
  try{await action('propose',{name:$('#proposal-name').value,formula:$('#proposal-formula').value,source:$('#proposal-source').value});openVotes();}
  catch(err){$('#proposal-error').textContent=err.message;}
 };
}

function openVotes(){
 showModal('房间物质提案',room.proposals.length?room.proposals.map(p=>`<article class="vote-card"><h3>${esc(p.name)} · ${f(p.formula)}</h3><p>${esc(compositionText(p.counts))} · M ${massText(p.mass)}</p><a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">核对参考资料 ↗</a><p>${p.status==='pending'?`${Object.values(p.votes).filter(Boolean).length}/${room.members.length} 人同意`:p.status==='accepted'?'已加入本房间':'未通过'}</p>${p.status==='pending'?`<div class="vote-buttons"><button class="btn primary small" data-vote="${p.id}" data-accept="true">同意收录</button><button class="btn small" data-vote="${p.id}" data-accept="false">不同意</button></div>`:''}</article>`).join(''):'<p class="muted">还没有提案。可在图鉴中提交。</p>',false,'votes');
 $$('[data-vote]').forEach(b=>b.onclick=run(()=>action('vote',{proposalId:b.dataset.vote,accept:b.dataset.accept==='true'})));
}

function isRareMove(move){if(move.rescue)return false;const counts=parseFormula(move.formula);return atomCount(counts)>1&&Object.keys(counts).some(e=>(poolCounts[e]||0)<=4);}
function recordDiscoveries(next){
 const saved=getStorage('chemcards-discoveries')||{};let changed=false;
 for(const h of next.game?.history||[]){
  if(h.type!=='play'||h.player!==next.me||h.rescue)continue;
  const substance=allSubstances().find(s=>s.name===h.name&&s.formula===h.formula);if(!substance)continue;
  const key=h.name+'|'+h.formula;if(!saved[key]){saved[key]={name:h.name,formula:h.formula,date:new Date().toISOString(),practice:!!localGame};changed=true;}
 }
 if(changed)setStorage('chemcards-discoveries',saved);
}
function openCollection(){
 const saved=getStorage('chemcards-discoveries')||{};
 showModal('物质图鉴',`<p class="quiet-note">可查询全部物质；亲手打出的物质会点亮（含练习），记录保存在此浏览器。解套原子不计入。已点亮 ${Object.keys(saved).length} 种。</p><div class="collection-tools"><button class="btn small" id="show-unlocked">只看已点亮</button><button class="btn small" id="pool-details">查看真实牌池概率</button></div><label class="field">搜索物质<input id="collection-search" type="search" placeholder="名称、化学式或原子组成，例如 KSCN"></label><div class="collection-grid" id="collection-list"></div>${room&&!localGame?'<div class="modal-footer"><button class="btn" id="custom-list">房间提案</button><button class="btn primary" id="new-substance">提交未收录物质</button></div>':''}`);
 let only=false;
 const draw=()=>{const q=$('#collection-search').value.trim().toLowerCase();let key;try{key=keyOf(parseFormula($('#collection-search').value.trim()));}catch{}const list=allSubstances().filter(s=>(!only||saved[s.name+'|'+s.formula])&&(!q||s.name.includes(q)||s.formula.toLowerCase().includes(q)||s.aliases?.some(a=>a.toLowerCase().includes(q))||s.key===key||s.category.includes(q)));$('#collection-list').innerHTML=list.map(s=>{const entry=saved[s.name+'|'+s.formula];return '<button class="collection-tile '+(entry?'discovered':'undiscovered')+'" data-discovery="'+s.id+'"><div><strong>'+f(s.formula)+'</strong><span>'+esc(s.name)+'</span></div><small>'+(entry?'已合成 · '+entry.date.slice(0,10):'尚未合成')+'</small></button>';}).join('')||'<p class="quiet-note">'+(q?'没有找到符合条件的物质。':only?'暂无合成记录。':'暂无物质。')+'</p>';$$('[data-discovery]').forEach(b=>b.onclick=()=>openDetail(b.dataset.discovery));};
 $('#show-unlocked').onclick=()=>{only=!only;$('#show-unlocked').textContent=only?'显示全部':'只看已点亮';draw();};$('#pool-details').onclick=openPool;$('#collection-search').oninput=draw;if($('#new-substance'))$('#new-substance').onclick=openProposal;if($('#custom-list'))$('#custom-list').onclick=openVotes;draw();
}
function openPool(){showModal('1800 张牌池',`<p class="quiet-note">下表由实际牌池计算。自由随机为不放回抽样，表中是抽取第一张的概率；配方混合的分布不同。无稳定同位素的元素使用固定游戏质量值。</p><table class="pool-table"><thead><tr><th>元素</th><th>张数</th><th>概率</th></tr></thead><tbody>${Object.entries(ELEMENTS).map(([e,v])=>'<tr><td>'+e+' · '+v.name+'</td><td>'+poolCounts[e]+'</td><td>'+(poolCounts[e]/POOL.length*100).toFixed(3)+'%</td></tr>').join('')}</tbody></table>`);}
function openFeedback(){
 const prefs=getSoundSettings();
 showModal('声音与特效',`<label class="feedback-toggle"><input type="checkbox" id="sound-enabled" ${prefs.sound?'checked':''}>音效</label><label class="field">音量<input type="range" id="sound-volume" min="0" max="100" value="${Math.round(prefs.volume*100)}"></label><label class="feedback-toggle"><input type="checkbox" id="haptic-enabled" ${prefs.haptics?'checked':''}>轻微震动（需要浏览器支持）</label><label class="feedback-toggle"><input type="checkbox" id="effects-enabled" ${prefs.effects!==false?'checked':''}>物质特效</label><p class="quiet-note">设置保存在这台设备上。音效、震动和物质特效可分别关闭。</p><button class="btn" id="sound-preview">试听</button>`);
 const save=()=>setSoundSettings({sound:$('#sound-enabled').checked,haptics:$('#haptic-enabled').checked,volume:+$('#sound-volume').value/100,effects:$('#effects-enabled').checked});
 for(const id of ['sound-enabled','haptic-enabled','sound-volume','effects-enabled'])$('#'+id).oninput=save;
 $('#sound-preview').onclick=()=>playSound('play');
}

function openRules(){
 showModal('玩法与约定',`<div class="rule-block"><h3>A · 质量竞技</h3><p>总牌数可选 16—108 张，全部分给玩家（人数不能整除时，手牌数最多相差一张）。出一个原子，或组成一种单质、无机物、有机物。跟牌的质量值必须严格更大；其余玩家都过牌后，最后出牌者自由领出。先出完获胜。</p><h3>B · 化学接龙</h3><p>每人起手可选 2—12 张；系统使用 108 张临时牌库，其余作为摸牌堆与开局原子。你出的 P 与桌面全部原子 C 恰好组成一种物质。旧 C 弃掉，新 P 留给下家；也可以摸一张并结束回合。不限出牌张数。连续两圈无人出牌后更换 C。开启解套时，只有无任何合法组合才可单原子领出，旧 C 弃掉，该原子留给下家。关闭解套会保留严格规则，随机牌库可能产生无法消耗的牌。先出完获胜。</p><h3>物质与化学式</h3><p>内置 ${SUBSTANCES.length} 种物质，包括 KSCN、硫代硫酸盐、配合物及常见有机物。无机物保留常用化学式；未成物质的原子组使用“元素 × 数量”显示。新物质可经房间全体玩家确认加入，标记为房间约定。</p><h3>快速局与结构局</h3><p>快速局按配方出牌；结构局的内置有机物需要在自由画布连接所有原子，服务端校验结构。房间自定物质只按配方校验。结构局建议 90 秒以上或不限时。</p><h3>公平对局</h3><p>联网对局由服务器校验手牌、回合、质量与出牌合法性。其他人的手牌不会发到你的设备。房主调整规则后，所有人需要重新准备。可选不限时或 30／60／90／120 秒；服务器结算超时。A 领出超时会代出一张原子，其余情况过牌或摸牌。刷新不会重置时间。</p></div>`);
}


$('#rules-btn').onclick=openRules;
$('#feedback-btn').onclick=openFeedback;
$('#collection-btn').onclick=openCollection;

document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!modal.open&&room?.game){selection={};activeMove=null;renderHand();renderComposer();}
});

async function init(){
 const code=new URLSearchParams(location.search).get('room')||getStorage('chemcards-last-room');
 const token=(getStorage('chemcards-room-keys')||{})[code];
 if(code&&token){
  session={code,token};
  root.innerHTML='<p class="muted">正在回到房间…</p>';
  try{acceptRoom(await api('/api/rooms/'+code));sync();return;}
  catch(e){if([401,404].includes(e.status)){const keys=getStorage('chemcards-room-keys')||{};delete keys[code];setStorage('chemcards-room-keys',keys);}session=null;renderEntrance(e.message);return;}
 }
 renderEntrance();
}

init();

if(document.modelContext?.registerTool){
 try{
  Promise.resolve(document.modelContext.registerTool({name:'read_chemical_room',description:'Read current room and the current player hand; never exposes opponents hands.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(){return room?{code:room.code,status:room.status,me:room.me,members:room.members,hand:room.game?.hand,context:room.game?.context,current:room.game?.current}:{status:'home'};}})).catch(()=>{});
 }catch{}
}
