/* Lani GAME — テーブルに置いて遊ぶゲーム
 * 指名ボトル / ハイ＆ロー / ナンバーボム / 山手線ゲーム / サイコロ
 * index.html の window.LaniGame（共通の演出）を使います。
 */
(function () {
'use strict';
var G = window.LaniGame;
if (!G) return;
var $ = function (id) { return document.getElementById(id); };
var rand = function (n) { return Math.floor(Math.random() * n); };

/* ---------- styles ---------- */
var css = [
'.lx-sub{display:flex;align-items:center;gap:10px;margin:26px 0 12px;font-family:var(--serif);font-size:13px;letter-spacing:.24em;color:var(--gold)}',
'.lx-sub::before,.lx-sub::after{content:"";flex:1;height:1px;background:var(--line)}',
'.lx-badge{display:inline-block;margin-left:6px;padding:0 6px;font-size:10px;border:1px solid var(--line);color:var(--gold);letter-spacing:.06em;vertical-align:2px;font-family:var(--sans)}',
'.lx-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:14px}',
'.lx-chips button{padding:7px 13px;border:1px solid var(--line);font-size:12.5px;color:var(--muted)}',
'.lx-chips button.on{background:var(--gold);color:#18140c;border-color:var(--gold);font-weight:700}',
'.lx-msg{min-height:64px;text-align:center;font-family:var(--serif);font-weight:700;font-size:clamp(20px,6vw,26px);line-height:1.5;margin:6px 0 14px;transition:opacity .3s,transform .4s}',
'.lx-msg.pop{animation:lxPop .5s cubic-bezier(.3,1.6,.5,1)}',
'@keyframes lxPop{from{transform:scale(.6);opacity:0}}',
'.lx-msg small{display:block;font-family:var(--sans);font-weight:400;font-size:12px;color:var(--muted);margin-top:2px}',
'.lx-row{display:flex;gap:10px}.lx-row>*{flex:1}',
'.lx-help{margin-top:16px;padding:12px 14px;border:1px solid var(--line);font-size:12px;color:var(--muted);line-height:1.8}',
'.lx-help b{color:var(--gold);font-weight:500}',
/* bottle */
'.bt-stage{position:relative;width:min(86vw,400px);aspect-ratio:1;margin:4px auto 10px;border-radius:50%;background:radial-gradient(circle,rgba(214,178,106,.08),transparent 65%);border:1px solid var(--line)}',
'.bt-stage::before{content:"";position:absolute;inset:10%;border-radius:50%;border:1px dashed rgba(214,178,106,.18)}',
'.bt-bottle{position:absolute;left:50%;top:50%;width:22%;height:76%;margin:-38% 0 0 -11%;transform-origin:50% 50%;will-change:transform;cursor:pointer;filter:drop-shadow(0 8px 18px rgba(0,0,0,.6))}',
'.bt-bottle svg{width:100%;height:100%}',
'.bt-tip{position:absolute;inset:0;border-radius:50%;pointer-events:none}',
/* hi-lo */
'.hl-table{display:flex;justify-content:center;align-items:center;gap:18px;margin:8px 0 16px;perspective:1000px}',
'.hl-card{position:relative;width:min(36vw,150px);aspect-ratio:5/7;border-radius:12px;background:linear-gradient(160deg,#f7f1e3,#e6dcc6);color:#141210;box-shadow:0 14px 40px rgba(0,0,0,.6),inset 0 0 0 5px #f7f1e3,inset 0 0 0 6px rgba(169,132,63,.6);display:grid;place-items:center;transform-style:preserve-3d}',
'.hl-card.red{color:#c4123d}',
'.hl-card .r{font-family:var(--latin);font-weight:600;font-size:clamp(46px,14vw,64px);line-height:1}',
'.hl-card .s{font-size:clamp(26px,8vw,36px);line-height:1;margin-top:-8px;text-align:center}',
'.hl-card .c{position:absolute;top:8px;left:10px;font-family:var(--latin);font-weight:600;font-size:18px;line-height:1;text-align:center}',
'.hl-card .c2{top:auto;left:auto;bottom:8px;right:10px;transform:rotate(180deg)}',
'.hl-card.back{background:repeating-linear-gradient(45deg,rgba(214,178,106,.08) 0 8px,transparent 8px 16px),#15120e;box-shadow:0 14px 40px rgba(0,0,0,.6),inset 0 0 0 5px #15120e,inset 0 0 0 6px var(--line)}',
'.hl-card.back img{width:62%}',
'.hl-card.flip{animation:hlFlip .55s ease}',
'@keyframes hlFlip{0%{transform:rotateY(90deg) scale(.9)}100%{transform:none}}',
'.hl-vs{font-family:var(--latin);color:var(--gold);font-size:20px;letter-spacing:.2em}',
'.hl-stats{display:flex;justify-content:center;gap:22px;margin-bottom:14px;font-size:12px;color:var(--muted);letter-spacing:.1em}',
'.hl-stats b{font-family:var(--latin);font-size:24px;color:var(--text);margin-left:4px}',
'.hl-btn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:16px 8px;border:1px solid var(--gold);font-family:var(--latin);font-size:24px;font-weight:600;letter-spacing:.14em;color:var(--gold);background:linear-gradient(180deg,rgba(214,178,106,.14),rgba(214,178,106,.02))}',
'.hl-btn small{font-family:var(--sans);font-size:11px;font-weight:400;letter-spacing:.06em;color:var(--muted)}',
'.hl-btn:active{transform:scale(.97)}',
'.hl-btn:disabled{opacity:.4}',
'.hl-hist{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:14px;min-height:30px}',
'.hl-hist span{min-width:30px;padding:3px 6px;border:1px solid var(--line);font-family:var(--latin);font-size:14px;text-align:center;background:var(--card)}',
'.hl-hist span.red{color:#ff6b8a}',
/* number bomb */
'.nb-range{text-align:center;margin:4px 0 6px}',
'.nb-range .lbl{font-size:12px;letter-spacing:.2em;color:var(--muted)}',
'.nb-range .v{font-family:var(--latin);font-weight:600;font-size:clamp(46px,15vw,72px);line-height:1.1;background:linear-gradient(180deg,var(--gold-hi),var(--gold-lo));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
'.nb-range .v i{font-style:normal;font-size:.5em;margin:0 .2em;-webkit-text-fill-color:var(--muted)}',
'.nb-bar{position:relative;height:10px;margin:6px 4px 16px;background:#211d17;border:1px solid var(--line)}',
'.nb-bar i{position:absolute;top:0;bottom:0;background:linear-gradient(90deg,var(--gold-lo),var(--gold));transition:left .5s,right .5s}',
'.nb-input{display:flex;align-items:center;justify-content:center;gap:10px;height:66px;margin-bottom:10px;border:1px solid var(--line);background:var(--card);font-family:var(--latin);font-size:42px;font-weight:600;letter-spacing:.06em}',
'.nb-input.err{animation:lxShake .4s;border-color:var(--pink)}',
'.nb-input span{font-family:var(--sans);font-size:13px;font-weight:400;color:var(--muted)}',
'@keyframes lxShake{0%,100%{transform:none}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}',
'.nb-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
'.nb-keys button{height:56px;border:1px solid var(--line);background:var(--card);font-family:var(--latin);font-size:26px;font-weight:600}',
'.nb-keys button:active{background:#241f18}',
'.nb-keys .fn{font-family:var(--sans);font-size:13px;color:var(--muted)}',
'.nb-keys .ok{background:linear-gradient(180deg,#ecd08e,#b8914a);color:#18140c;font-family:var(--serif);font-size:16px;font-weight:700;letter-spacing:.1em;border:0}',
'.nb-hist{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-top:12px}',
'.nb-hist span{padding:2px 8px;border:1px solid var(--line);font-family:var(--latin);font-size:14px;color:var(--muted)}',
/* yamanote */
'.ym-topic{text-align:center;padding:18px 14px;border:1px solid var(--gold);background:linear-gradient(160deg,#1f1b15,#0f0d0a);box-shadow:inset 0 0 0 5px #0f0d0a,inset 0 0 0 6px var(--line)}',
'.ym-topic .k{font-family:var(--latin);font-size:12px;letter-spacing:.3em;color:var(--gold)}',
'.ym-topic .t{font-family:var(--serif);font-weight:700;font-size:clamp(24px,7.5vw,32px);line-height:1.4;margin-top:6px}',
'.ym-beat{position:relative;width:min(56vw,220px);aspect-ratio:1;margin:22px auto 14px;display:grid;place-items:center}',
'.ym-beat .ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--line);transition:transform .12s,border-color .12s,box-shadow .12s}',
'.ym-beat.clap .ring{transform:scale(1.06);border-color:var(--gold);box-shadow:0 0 30px rgba(214,178,106,.35)}',
'.ym-beat.ans .ring{transform:scale(1.12);border-color:var(--pink);box-shadow:0 0 40px rgba(255,61,139,.45)}',
'.ym-beat .ic{font-size:clamp(46px,15vw,64px);line-height:1}',
'.ym-beat .lb{position:absolute;bottom:18%;font-family:var(--serif);font-size:14px;letter-spacing:.2em;color:var(--muted)}',
'.ym-beat.ans .lb{color:var(--pink)}',
'.ym-fuse{position:relative;height:6px;margin:0 10px 18px;background:#221e18;overflow:hidden;border-radius:3px}',
'.ym-fuse i{position:absolute;inset:0;background:linear-gradient(90deg,#ff9b3d,#ff3d8b,#ff9b3d);background-size:200% 100%;animation:ymFuse .6s linear infinite;opacity:0;transition:opacity .3s}',
'.ym-run .ym-fuse i{opacity:1}',
'@keyframes ymFuse{to{background-position:-200% 0}}',
'.ym-count{text-align:center;font-size:12px;color:var(--muted);letter-spacing:.14em;margin-bottom:12px}',
'.ym-count b{font-family:var(--latin);font-size:26px;color:var(--text);margin-left:4px}',
'.ym-add{display:flex;gap:8px;margin-top:12px}',
'.ym-add input{flex:1;min-width:0;padding:11px 12px;background:var(--card);border:1px solid var(--line);color:var(--text);font:inherit;font-size:16px;outline:none}',
'.ym-add button{padding:0 16px;border:1px solid var(--gold);color:var(--gold);font-size:13px}',
/* dice */
'.dc-stage{display:flex;justify-content:center;gap:26px;margin:18px 0 22px;perspective:900px;min-height:150px;align-items:center}',
'.dc-die{position:relative;width:min(34vw,130px);aspect-ratio:1;border-radius:20%;background:radial-gradient(circle at 30% 25%,#fffaf0,#e7dcc4 70%,#cdbf9f);box-shadow:0 16px 40px rgba(0,0,0,.6),inset 0 -6px 10px rgba(0,0,0,.12)}',
'.dc-die i{position:absolute;width:19%;height:19%;margin:-9.5% 0 0 -9.5%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#4a3f30,#120f0b);box-shadow:inset 0 2px 3px rgba(0,0,0,.5)}',
'.dc-die.one i{width:26%;height:26%;margin:-13% 0 0 -13%;background:radial-gradient(circle at 35% 30%,#ff5a8c,#a10d3a)}',
'.dc-die.roll{animation:dcRoll .9s cubic-bezier(.3,.7,.4,1)}',
'@keyframes dcRoll{0%{transform:translateY(-40px) rotate(0) rotateX(0)}30%{transform:translateY(10px) rotate(200deg) rotateX(180deg)}60%{transform:translateY(-14px) rotate(320deg) rotateX(300deg)}100%{transform:none}}',
'.dc-rules{display:grid;gap:6px;margin-top:16px}',
'.dc-rule{display:flex;align-items:center;gap:12px;padding:9px 12px;border:1px solid var(--line);background:var(--card);font-size:14px;transition:background .3s,border-color .3s}',
'.dc-rule .n{flex:0 0 28px;height:28px;display:grid;place-items:center;border:1px solid var(--gold);color:var(--gold);font-family:var(--latin);font-size:17px;font-weight:600}',
'.dc-rule.hit{background:rgba(214,178,106,.18);border-color:var(--gold)}',
'.dc-rule input{flex:1;min-width:0;background:transparent;border:0;border-bottom:1px dashed var(--line);color:var(--text);font:inherit;font-size:16px;padding:2px 0;outline:none}',
'.dc-tools{display:flex;justify-content:space-between;margin-top:10px}',
'.dc-tools button{font-size:12.5px;color:var(--gold);padding:6px 2px}',
'@media (prefers-reduced-motion:reduce){.dc-die.roll,.hl-card.flip{animation:none}}'
].join('\n');
var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* ---------- audio helpers ---------- */
var ctx = null;
function ac() { try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) {} return ctx; }
function clap(loud) {
  var c = ac(); if (!c) return;
  try {
    var len = .12, buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = loud ? 1500 : 1100; f.Q.value = .9; g.gain.value = loud ? .9 : .55;
    src.buffer = buf; src.connect(f); f.connect(g); g.connect(c.destination); src.start();
  } catch (e) {}
}
var wake = null;
function keepAwake(on) {
  try {
    if (on && navigator.wakeLock && !wake) navigator.wakeLock.request('screen').then(function (w) { wake = w; }).catch(function () {});
    if (!on && wake) { wake.release(); wake = null; }
  } catch (e) {}
}
function say(el, html) { el.innerHTML = html; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }

/* ---------- home buttons & screens ---------- */
var BTN = function (id, icon, name, desc) {
  return '<button class="game-btn" data-x="' + id + '"><span class="ic">' + icon + '</span><span><h2>' + name + '</h2><p>' + desc + '</p></span><span class="arrow">›</span></button>';
};
var I = {
  bottle: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M13.5 3h5v6l3 4v15a1 1 0 01-1 1h-9a1 1 0 01-1-1V13l3-4z"/><path d="M10.5 18h11"/></svg>',
  hilo: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="6" y="5" width="14" height="20" rx="2"/><path d="M24 9l3 4h-6zM24 23l3-4h-6z"/></svg>',
  num: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="15" cy="18" r="9"/><path d="M21 11l3-3M23 6l2 2M26 9l1-3"/><path d="M12 18h6M15 15v6" stroke-width="1.2"/></svg>',
  yama: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="16" cy="16" r="11"/><path d="M11 13c1-2 3-2 4 0M17 13c1-2 3-2 4 0"/><path d="M11 20c2 3 8 3 10 0"/><path d="M4 8l2 2M28 8l-2 2"/></svg>',
  dice: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="5" y="5" width="22" height="22" rx="5"/><circle cx="11" cy="11" r="1.6" fill="currentColor"/><circle cx="16" cy="16" r="1.6" fill="currentColor"/><circle cx="21" cy="21" r="1.6" fill="currentColor"/></svg>'
};
var list = document.querySelector('#home .games');
list.insertAdjacentHTML('beforeend',
  '<div class="lx-sub">テーブルに置いて遊ぶ</div>' +
  BTN('bottle', I.bottle, '指名ボトル', 'ボトルが指した人が飲む。スマホを真ん中に置いて回そう') +
  BTN('hilo', I.hilo, 'ハイ＆ロー', '次のカードは上か下か？外れたら飲む') +
  BTN('numbomb', I.num, 'ナンバーボム', '1〜100の爆弾の数字を踏んだら飲む') +
  BTN('yamanote', I.yama, '山手線ゲーム', 'リズムに合わせてお題に答えよう。爆発したら飲む') +
  BTN('dice', I.dice, 'サイコロ', '出た目のルールで飲む人が決まる'));

var anchor = document.getElementById('russian');
anchor.insertAdjacentHTML('afterend',
  /* bottle */
  '<section class="screen" id="bottle">' +
    '<div class="lx-chips" id="btModes"></div>' +
    '<div class="bt-stage" id="btStage"><div class="bt-bottle" id="btBottle">' +
      '<svg viewBox="0 0 60 210"><defs><linearGradient id="btg" x1="0" x2="1"><stop offset="0" stop-color="#7a5b25"/><stop offset=".45" stop-color="#f3dca2"/><stop offset=".6" stop-color="#d6b26a"/><stop offset="1" stop-color="#6b4f1f"/></linearGradient><linearGradient id="btgl" x1="0" x2="1"><stop offset="0" stop-color="#16301a"/><stop offset=".5" stop-color="#3f7a3a"/><stop offset="1" stop-color="#10220f"/></linearGradient></defs>' +
      '<path d="M24 4h12v8h-12z" fill="url(#btg)"/><path d="M23 12h14v36c0 6 14 14 14 30v120c0 5-3 8-8 8H17c-5 0-8-3-8-8V78c0-16 14-24 14-30z" fill="url(#btgl)" stroke="#d6b26a" stroke-width="1.5"/>' +
      '<rect x="12" y="104" width="36" height="46" rx="3" fill="#0f0d0a" stroke="#d6b26a" stroke-width="1"/><text x="30" y="132" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-size="15" fill="#d6b26a">Lani</text>' +
      '<path d="M30 -2l7 9h-14z" fill="#ff3d8b"/></svg>' +
    '</div></div>' +
    '<div class="lx-msg" id="btMsg">タップして回そう<small>スマホをテーブルの真ん中に置いてね</small></div>' +
    '<button class="btn" id="btSpin">回す</button>' +
    '<div class="lx-help"><b>遊び方</b>　スマホを平らに置いて「回す」。ピンクのキャップ側が指した人が対象です。</div>' +
  '</section>' +
  /* hi-lo */
  '<section class="screen" id="hilo">' +
    '<div class="hl-stats"><span>連続正解<b id="hlStreak">0</b></span><span>最高<b id="hlBest">0</b></span><span>残り<b id="hlLeft">52</b></span></div>' +
    '<div class="hl-table"><div class="hl-card" id="hlCur"></div><div class="hl-vs">VS</div><div class="hl-card back" id="hlNext"><img src="../assets/logo-gold.png" alt=""></div></div>' +
    '<div class="lx-msg" id="hlMsg">次のカードは？<small>順番に宣言して、外れたら飲む</small></div>' +
    '<div class="lx-row"><button class="hl-btn" id="hlHigh">HIGH ▲<small>上（大きい）</small></button><button class="hl-btn" id="hlLow">LOW ▼<small>下（小さい）</small></button></div>' +
    '<div class="hl-hist" id="hlHist"></div>' +
    '<div class="lx-help"><b>ルール</b>　A＝1、J＝11、Q＝12、K＝13。同じ数字が出たら宣言した人の負け！5連続正解で好きな人を指名できます。</div>' +
    '<div style="margin-top:12px"><button class="btn ghost" id="hlReset">シャッフルしてやり直す</button></div>' +
  '</section>' +
  /* number bomb */
  '<section class="screen" id="numbomb">' +
    '<div class="lx-chips" id="nbMax"></div>' +
    '<div class="nb-range"><div class="lbl">この中に爆弾がある</div><div class="v" id="nbRange"></div></div>' +
    '<div class="nb-bar"><i id="nbBar"></i></div>' +
    '<div class="nb-input" id="nbIn"><span>数字を入力</span></div>' +
    '<div class="nb-keys" id="nbKeys"></div>' +
    '<div class="nb-hist" id="nbHist"></div>' +
    '<div style="margin-top:12px"><button class="btn ghost" id="nbReset">新しい爆弾</button></div>' +
  '</section>' +
  /* yamanote */
  '<section class="screen" id="yamanote">' +
    '<div class="ym-topic"><div class="k">TOPIC</div><div class="t" id="ymTopic"></div></div>' +
    '<div class="lx-row" style="margin-top:10px"><button class="btn ghost" id="ymNext">お題を変える</button></div>' +
    '<div class="ym-beat" id="ymBeat"><div class="ring"></div><div class="ic" id="ymIc">👏</div><div class="lb" id="ymLb">READY</div></div>' +
    '<div class="ym-fuse"><i></i></div>' +
    '<div class="lx-chips" id="ymTempo"></div>' +
    '<div class="ym-count">答えた数<b id="ymCount">0</b></div>' +
    '<button class="btn" id="ymStart">スタート</button>' +
    '<div class="lx-row" style="margin-top:10px"><button class="btn ghost" id="ymStuck">詰まった！</button></div>' +
    '<form class="ym-add" id="ymAdd"><input id="ymIn" maxlength="20" placeholder="自分でお題を入れる" enterkeyhint="done"><button type="submit">決定</button></form>' +
    '<div class="lx-help"><b>遊び方</b>　「パン・パン」の手拍子のあと、ピンクに光ったタイミングで順番にお題に答えます。どこかで爆弾が爆発！そのとき答えていた人、詰まった人が飲みます。</div>' +
  '</section>' +
  /* dice */
  '<section class="screen" id="dice">' +
    '<div class="lx-chips" id="dcCount"></div>' +
    '<div class="dc-stage" id="dcStage"></div>' +
    '<div class="lx-msg" id="dcMsg">サイコロを振ろう</div>' +
    '<button class="btn" id="dcRoll">振る</button>' +
    '<div class="dc-rules" id="dcRules"></div>' +
    '<div class="dc-tools"><button id="dcEdit">ルールを編集</button><button id="dcDefault">最初のルールに戻す</button></div>' +
  '</section>');

/* nav integration */
var TITLES = { bottle: '指名ボトル', hilo: 'ハイ＆ロー', numbomb: 'ナンバーボム', yamanote: '山手線ゲーム', dice: 'サイコロ' };
Object.keys(TITLES).forEach(function (k) { G.titles[k] = TITLES[k]; });
document.querySelectorAll('[data-x]').forEach(function (b) { b.addEventListener('click', function () { G.go(b.dataset.x); }); });
G.onShow = function (id) { if (id !== 'yamanote') ymStop(true); };

/* ================= 指名ボトル ================= */
var BT_MODES = { '飲む人': 'が飲む！', '乾杯する人': 'と全員で乾杯！', '質問する人': 'に何でも1つ質問！', '命令する人': 'が王様！1つ命令できる', 'フリー': '' };
var btMode = G.store.get('btMode', '飲む人'), btRot = 0, btSpin = false;
var btModes = $('btModes');
Object.keys(BT_MODES).forEach(function (k) {
  var b = document.createElement('button'); b.textContent = k; if (k === btMode) b.className = 'on';
  b.onclick = function () { btMode = k; G.store.set('btMode', k); btModes.querySelectorAll('button').forEach(function (x) { x.className = x === b ? 'on' : ''; }); };
  btModes.appendChild(b);
});
function btGo() {
  if (btSpin) return; btSpin = true; $('btSpin').disabled = true; ac();
  $('btMsg').innerHTML = '<span style="color:var(--muted)">回ってる…</span>';
  var start = btRot, total = 360 * (5 + rand(4)) + rand(360), dur = 3800 + rand(1400), t0 = performance.now(), last = 0;
  (function f(now) {
    var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3.4);
    btRot = start + total * e; $('btBottle').style.transform = 'rotate(' + btRot + 'deg)';
    var step = Math.floor(btRot / 30); if (step !== last) { last = step; G.tone(1500, .02, 'square', .025); }
    if (p < 1) requestAnimationFrame(f);
    else {
      btSpin = false; $('btSpin').disabled = false; G.vibrate([40, 30, 80]); G.fanfare();
      var tail = BT_MODES[btMode];
      say($('btMsg'), tail ? 'キャップが指した人' + tail : 'この人に決定！');
    }
  })(t0);
}
$('btSpin').onclick = btGo; $('btBottle').onclick = btGo;

/* ================= ハイ＆ロー ================= */
var SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var hlDeck = [], hlCur = null, hlStreak = 0, hlBest = G.store.get('hlBest', 0), hlBusy = false;
function hlFace(el, c) {
  var red = c.s === 1 || c.s === 2, r = RANKS[c.n], s = SUITS[c.s];
  el.className = 'hl-card' + (red ? ' red' : '');
  el.innerHTML = '<div class="c">' + r + '<br>' + s + '</div><div><div class="r">' + r + '</div><div class="s">' + s + '</div></div><div class="c c2">' + r + '<br>' + s + '</div>';
}
function hlBack(el) { el.className = 'hl-card back'; el.innerHTML = '<img src="../assets/logo-gold.png" alt="">'; }
function hlNew() {
  hlDeck = []; for (var s = 0; s < 4; s++) for (var n = 1; n <= 13; n++) hlDeck.push({ n: n, s: s });
  hlDeck = G.shuffle(hlDeck); hlCur = hlDeck.pop(); hlStreak = 0;
  hlFace($('hlCur'), hlCur); hlBack($('hlNext')); $('hlHist').innerHTML = ''; hlStats();
  $('hlMsg').innerHTML = '次のカードは？<small>順番に宣言して、外れたら飲む</small>';
}
function hlStats() { $('hlStreak').textContent = hlStreak; $('hlBest').textContent = hlBest; $('hlLeft').textContent = hlDeck.length; }
function hlGuess(high) {
  if (hlBusy) return; hlBusy = true; ac();
  if (!hlDeck.length) { hlNew(); hlBusy = false; return; }
  var nx = hlDeck.pop(), nEl = $('hlNext');
  hlFace(nEl, nx); nEl.classList.add('flip'); G.tone(700, .08, 'triangle', .05);
  setTimeout(function () {
    var win = high ? nx.n > hlCur.n : nx.n < hlCur.n;
    var h = document.createElement('span'); h.textContent = RANKS[hlCur.n]; if (hlCur.s === 1 || hlCur.s === 2) h.className = 'red'; $('hlHist').appendChild(h);
    if ($('hlHist').children.length > 12) $('hlHist').removeChild($('hlHist').firstChild);
    if (nx.n === hlCur.n) { hlStreak = 0; G.boom(); G.vibrate([150, 60, 250]); G.showResult('SAME!!', '同じ数字！\n宣言した人が飲む', true); say($('hlMsg'), '同じ数字…！'); }
    else if (win) {
      hlStreak++; if (hlStreak > hlBest) { hlBest = hlStreak; G.store.set('hlBest', hlBest); }
      G.tone(990, .12, 'triangle', .08); G.vibrate(25);
      if (hlStreak % 5 === 0) { G.fanfare(); G.showResult(hlStreak + '連続正解！', '好きな人を\n指名して飲ませる'); }
      say($('hlMsg'), '正解！<small>次の人どうぞ</small>');
    } else { hlStreak = 0; G.boom(); G.vibrate([150, 60, 250]); G.showResult('MISS', 'ハズレ！\n宣言した人が飲む', true); say($('hlMsg'), 'ハズレ…'); }
    hlCur = nx; setTimeout(function () { hlFace($('hlCur'), hlCur); $('hlCur').classList.add('flip'); hlBack(nEl); hlStats(); hlBusy = false;
      if (!hlDeck.length) say($('hlMsg'), 'カードがなくなりました<small>「シャッフルしてやり直す」を押してね</small>'); }, 900);
  }, 560);
}
$('hlHigh').onclick = function () { hlGuess(true); }; $('hlLow').onclick = function () { hlGuess(false); };
$('hlReset').onclick = hlNew; hlNew();

/* ================= ナンバーボム ================= */
var NB_MAX = [30, 50, 100, 200], nbMax = G.store.get('nbMax', 100), nbLo, nbHi, nbBomb, nbIn = '', nbOver = false;
NB_MAX.forEach(function (m) {
  var b = document.createElement('button'); b.textContent = '1〜' + m; if (m === nbMax) b.className = 'on';
  b.onclick = function () { nbMax = m; G.store.set('nbMax', m); $('nbMax').querySelectorAll('button').forEach(function (x) { x.className = x === b ? 'on' : ''; }); nbNew(); };
  $('nbMax').appendChild(b);
});
function nbNew() { nbLo = 1; nbHi = nbMax; nbBomb = 1 + rand(nbMax); nbIn = ''; nbOver = false; $('nbHist').innerHTML = ''; nbPaint(); }
function nbPaint() {
  $('nbRange').innerHTML = nbLo + '<i>〜</i>' + nbHi;
  $('nbBar').style.left = ((nbLo - 1) / nbMax * 100) + '%'; $('nbBar').style.right = ((nbMax - nbHi) / nbMax * 100) + '%';
  $('nbIn').innerHTML = nbIn ? nbIn : '<span>' + (nbOver ? 'ゲーム終了' : nbLo === nbHi ? '残り1つ…！' : '数字を入力') + '</span>';
}
['1', '2', '3', '4', '5', '6', '7', '8', '9', '消す', '0', '決定'].forEach(function (k) {
  var b = document.createElement('button'); b.textContent = k; if (k === '消す') b.className = 'fn'; if (k === '決定') b.className = 'ok';
  b.onclick = function () {
    if (nbOver) return; ac();
    if (k === '消す') nbIn = nbIn.slice(0, -1);
    else if (k === '決定') return nbGuess();
    else if (nbIn.length < 3) nbIn = (nbIn === '0' ? '' : nbIn) + k;
    G.tone(1200, .025, 'square', .02); nbPaint();
  };
  $('nbKeys').appendChild(b);
});
function nbGuess() {
  var g = +nbIn;
  if (!nbIn || g < nbLo || g > nbHi) { var el = $('nbIn'); el.classList.remove('err'); void el.offsetWidth; el.classList.add('err'); G.vibrate(120); nbIn = ''; setTimeout(nbPaint, 350); return; }
  var h = document.createElement('span'); h.textContent = g; $('nbHist').appendChild(h); nbIn = '';
  if (g === nbBomb) {
    nbOver = true; nbLo = nbHi = g; nbPaint(); G.boom(); G.vibrate([200, 80, 300]);
    G.showResult('BOOM!!', '爆弾は「' + g + '」\n言った人が飲む', true); return;
  }
  if (g < nbBomb) nbLo = g + 1; else nbHi = g - 1;
  G.tone(660, .08, 'sine', .05); G.vibrate(15); nbPaint();
}
$('nbReset').onclick = nbNew; nbNew();

/* ================= 山手線ゲーム ================= */
var TOPICS = ['山手線の駅', '大阪環状線の駅', 'お酒の名前', 'カクテルの名前', 'シーシャのフレーバー', '大阪の地名', 'コンビニで買えるもの', '果物', '野菜', '赤いもの', '都道府県', '世界の国', '動物', 'スポーツ', '焼肉の部位', '寿司ネタ', 'お菓子の名前', 'ファッションブランド', '車のメーカー', '家電', '夏といえば', '冬といえば', '居酒屋メニュー', '星座', '色の名前', '楽器', '職業', '鍋の具材', '大阪名物', '朝ごはんのメニュー', '「あ」から始まる言葉', '「か」から始まる言葉', '「ら」から始まる言葉', 'カタカナ4文字の言葉', '遊園地にあるもの', '学校にあるもの', '体の部位', '魚の名前', '花の名前', 'ラーメンの種類', 'パンの種類', '飲み物（ノンアル）', '有名なチェーン店', 'スマホのアプリ', 'ダーツ・カラオケ用語', 'ゲームのタイトル', '映画のタイトル'];
var ymTopic = '', ymTimer = null, ymRun = false, ymBeatN = 0, ymCount = 0, ymEnd = 0;
var TEMPO = { 'ゆっくり': 560, 'ふつう': 440, 'はやい': 340 }, ymTempo = G.store.get('ymTempo', 'ふつう');
function ymNewTopic() { var t; do { t = TOPICS[rand(TOPICS.length)]; } while (t === ymTopic && TOPICS.length > 1); ymTopic = t; $('ymTopic').textContent = t; }
Object.keys(TEMPO).forEach(function (k) {
  var b = document.createElement('button'); b.textContent = k; if (k === ymTempo) b.className = 'on';
  b.onclick = function () { ymTempo = k; G.store.set('ymTempo', k); $('ymTempo').querySelectorAll('button').forEach(function (x) { x.className = x === b ? 'on' : ''; }); };
  $('ymTempo').appendChild(b);
});
function ymPaint(state, ic, lb) { var b = $('ymBeat'); b.classList.remove('clap', 'ans'); if (state) { void b.offsetWidth; b.classList.add(state); } $('ymIc').textContent = ic; $('ymLb').textContent = lb; }
function ymTick() {
  if (!ymRun) return;
  if (Date.now() >= ymEnd) return ymBoom();
  var pos = ymBeatN % 4; // 👏 👏 答 (休)
  if (pos === 0 || pos === 1) { clap(false); ymPaint('clap', '👏', pos === 0 ? 'パン' : 'パン'); }
  else if (pos === 2) { clap(true); G.tone(880, .09, 'triangle', .05); ymPaint('ans', '🗣', '答えて！'); ymCount++; $('ymCount').textContent = ymCount; }
  else ymPaint('', '…', '');
  ymBeatN++;
  // 後半は少しずつ速く
  var left = (ymEnd - Date.now()) / 1000, base = TEMPO[ymTempo];
  ymTimer = setTimeout(ymTick, left < 8 ? base * .82 : base);
}
function ymStart() {
  if (ymRun) return ymStop(); ac();
  ymRun = true; ymBeatN = 0; ymCount = 0; $('ymCount').textContent = 0;
  ymEnd = Date.now() + (18 + rand(40)) * 1000;
  document.getElementById('yamanote').classList.add('ym-run'); $('ymStart').textContent = 'ストップ'; keepAwake(true);
  ymPaint('', '3', ''); var n = 3;
  (function cd() { if (!ymRun) return; if (n > 0) { ymPaint('clap', String(n), 'READY'); G.tone(660, .1, 'sine', .06); n--; ymTimer = setTimeout(cd, 600); } else { ymTimer = setTimeout(ymTick, 200); } })();
}
function ymStop(silent) {
  ymRun = false; clearTimeout(ymTimer); keepAwake(false);
  var sec = document.getElementById('yamanote'); if (sec) sec.classList.remove('ym-run');
  if ($('ymStart')) $('ymStart').textContent = 'スタート';
  if (!silent && $('ymIc')) ymPaint('', '👏', 'READY');
}
function ymBoom() { ymStop(true); ymPaint('ans', '💥', 'BOOM!'); G.boom(); G.vibrate([250, 80, 350]); G.showResult('BOOM!!', '爆発！\n今答えていた人が飲む', true); }
$('ymStart').onclick = ymStart;
$('ymStuck').onclick = function () { var was = ymRun; ymStop(true); ymPaint('ans', '😵', 'アウト'); G.boom(); G.vibrate([150, 60, 250]); G.showResult(was ? 'OUT!' : 'OUT!', '詰まった人が飲む', true); };
$('ymNext').onclick = function () { ymNewTopic(); G.tone(880, .08, 'triangle', .05); };
$('ymAdd').onsubmit = function (e) { e.preventDefault(); var v = $('ymIn').value.trim(); if (!v) return; ymTopic = v; $('ymTopic').textContent = v; $('ymIn').value = ''; $('ymIn').blur(); };
ymNewTopic();
document.addEventListener('visibilitychange', function () { if (document.hidden && ymRun) ymStop(); });

/* ================= サイコロ ================= */
var DC_DEFAULT = ['振った人が飲む', '左隣の人が飲む', '右隣の人が飲む', '向かいの人が飲む', '好きな人を指名して飲ませる', '全員で乾杯！'];
var DC_SUM = { 2: 'ピンゾロ！振った人以外全員飲む', 12: '6ゾロ！好きな人を2人指名', 7: 'ラッキー7！振った人はセーフ、左右が飲む' };
var dcRules = G.store.get('dcRules', DC_DEFAULT.slice()), dcN = G.store.get('dcN', 1), dcEdit = false, dcBusy = false;
var PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function dcDie(n) { var P = [26, 50, 74], h = '<div class="dc-die' + (n === 1 ? ' one' : '') + '">'; PIPS[n].forEach(function (k) { h += '<i style="left:' + P[k % 3] + '%;top:' + P[Math.floor(k / 3)] + '%"></i>'; }); return h + '</div>'; }
function dcStage(vals, roll) { $('dcStage').innerHTML = vals.map(dcDie).join(''); if (roll) $('dcStage').querySelectorAll('.dc-die').forEach(function (d) { d.classList.add('roll'); }); }
[1, 2].forEach(function (n) {
  var b = document.createElement('button'); b.textContent = 'サイコロ ' + n + '個'; if (n === dcN) b.className = 'on';
  b.onclick = function () { dcN = n; G.store.set('dcN', n); $('dcCount').querySelectorAll('button').forEach(function (x) { x.className = x === b ? 'on' : ''; }); dcStage(n === 1 ? [6] : [5, 6]); dcRender(-1); $('dcMsg').textContent = n === 1 ? 'サイコロを振ろう' : '2個振り：目ごとに2人が対象！'; };
  $('dcCount').appendChild(b);
});
function dcRender(hits) {
  hits = [].concat(hits);
  $('dcRules').innerHTML = dcRules.map(function (r, i) {
    return '<div class="dc-rule' + (hits.indexOf(i + 1) >= 0 ? ' hit' : '') + '"><span class="n">' + (i + 1) + '</span>' + (dcEdit ? '<input data-dc="' + i + '" maxlength="24" value="' + r.replace(/"/g, '&quot;') + '">' : '<span>' + r.replace(/</g, '&lt;') + '</span>') + '</div>';
  }).join('');
  if (dcEdit) $('dcRules').querySelectorAll('input').forEach(function (inp) { inp.oninput = function () { dcRules[+inp.dataset.dc] = inp.value; G.store.set('dcRules', dcRules); }; });
}
$('dcEdit').onclick = function () { dcEdit = !dcEdit; this.textContent = dcEdit ? '編集を終わる' : 'ルールを編集'; dcRender(-1); };
$('dcDefault').onclick = function () { dcRules = DC_DEFAULT.slice(); G.store.set('dcRules', dcRules); dcRender(-1); };
$('dcRoll').onclick = function () {
  if (dcBusy) return; dcBusy = true; ac(); if (dcEdit) { dcEdit = false; $('dcEdit').textContent = 'ルールを編集'; }
  var vals = []; for (var i = 0; i < dcN; i++) vals.push(1 + rand(6));
  var flick = 0, iv = setInterval(function () { dcStage(vals.map(function () { return 1 + rand(6); })); G.tone(400 + rand(400), .03, 'square', .03); if (++flick > 6) clearInterval(iv); }, 90);
  setTimeout(function () {
    clearInterval(iv); dcStage(vals, true); G.vibrate([30, 30, 60]);
    setTimeout(function () {
      dcBusy = false; dcRender(vals); G.fanfare();
      var sum = vals.reduce(function (a, b) { return a + b; }, 0);
      if (dcN === 2 && DC_SUM[sum]) { say($('dcMsg'), DC_SUM[sum]); G.showResult(vals.join(' ＋ ') + ' ＝ ' + sum, DC_SUM[sum]); }
      else if (dcN === 2) say($('dcMsg'), vals.map(function (v) { return v + '：' + dcRules[v - 1]; }).join('<br>'));
      else say($('dcMsg'), dcRules[vals[0] - 1]);
    }, 900);
  }, 700);
};
dcStage(dcN === 1 ? [6] : [5, 6]); dcRender(-1);

/* deep link (#bottle など) */
var h = (location.hash || '').slice(1); if (TITLES[h]) G.go(h, false);
})();
