/* Lani GAME — キングスカップ（Laniルール） */
(function () {
'use strict';
var G = window.LaniGame;
if (!G) return;
var $ = function (id) { return document.getElementById(id); };
var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

var css = [
'.kc-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:12px;color:var(--muted);letter-spacing:.1em}',
'.kc-top b{font-family:var(--latin);font-size:22px;color:var(--text);margin-left:4px}',
'.kc-crowns{display:flex;gap:4px}',
'.kc-crowns i{font-style:normal;font-size:20px;filter:grayscale(1);opacity:.25;transition:.4s}',
'.kc-crowns i.on{filter:none;opacity:1;transform:scale(1.1)}',
'.kc-state{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;min-height:30px;margin-bottom:10px}',
'.kc-state span{padding:4px 10px;font-size:12px;border:1px solid var(--line);color:var(--muted)}',
'.kc-state span.on{border-color:var(--pink);color:#fff;background:rgba(255,61,139,.22);animation:kcBlink 2.4s infinite}',
'@keyframes kcBlink{50%{background:rgba(255,61,139,.1)}}',
'.kc-stage{display:flex;justify-content:center;perspective:1100px;margin:4px 0 14px;cursor:pointer}',
'.kc-card{position:relative;width:min(58vw,230px);aspect-ratio:5/7;border-radius:14px;display:grid;place-items:center;transform-style:preserve-3d}',
'.kc-card.back{background:repeating-linear-gradient(45deg,rgba(214,178,106,.08) 0 9px,transparent 9px 18px),#15120e;box-shadow:0 18px 50px rgba(0,0,0,.65),inset 0 0 0 6px #15120e,inset 0 0 0 7px var(--line)}',
'.kc-card.back img{width:58%}',
'.kc-card.back span{position:absolute;bottom:12%;font-family:var(--serif);font-size:12px;letter-spacing:.3em;color:var(--muted)}',
'.kc-card.face{background:linear-gradient(160deg,#f8f2e4,#e5dac2);color:#141210;box-shadow:0 18px 50px rgba(0,0,0,.65),inset 0 0 0 6px #f8f2e4,inset 0 0 0 7px rgba(169,132,63,.6)}',
'.kc-card.red{color:#c4123d}',
'.kc-card .r{font-family:var(--latin);font-weight:600;font-size:clamp(70px,22vw,100px);line-height:1}',
'.kc-card .s{font-size:clamp(34px,10vw,46px);line-height:1;text-align:center;margin-top:-6px}',
'.kc-card .c{position:absolute;top:10px;left:12px;font-family:var(--latin);font-weight:600;font-size:22px;line-height:1;text-align:center}',
'.kc-card .c2{top:auto;left:auto;bottom:10px;right:12px;transform:rotate(180deg)}',
'.kc-card.k{box-shadow:0 18px 50px rgba(0,0,0,.65),0 0 50px rgba(214,178,106,.45),inset 0 0 0 6px #f8f2e4,inset 0 0 0 7px #b8914a}',
'.kc-card.in{animation:kcIn .6s cubic-bezier(.2,1.2,.4,1)}',
'@keyframes kcIn{0%{transform:rotateY(100deg) translateY(-20px) scale(.9)}100%{transform:none}}',
'.kc-rule{text-align:center;margin-bottom:14px;min-height:96px}',
'.kc-rule .tt{font-family:var(--serif);font-weight:700;font-size:clamp(24px,7.5vw,32px);color:var(--gold);letter-spacing:.08em;line-height:1.3}',
'.kc-rule .ds{margin-top:6px;font-size:14px;color:#e2dccf;line-height:1.75}',
'.kc-rule.pop{animation:lxPop .5s cubic-bezier(.3,1.6,.5,1)}',
'.kc-box{margin-top:14px;border:1px solid var(--line);background:var(--card)}',
'.kc-box summary{list-style:none;cursor:pointer;padding:12px 14px;font-family:var(--serif);font-size:14px;color:var(--gold);letter-spacing:.1em;display:flex;justify-content:space-between}',
'.kc-box summary::-webkit-details-marker{display:none}',
'.kc-box summary::after{content:"+";font-family:var(--latin);font-size:20px;line-height:1}',
'.kc-box[open] summary::after{content:"−"}',
'.kc-box .in{padding:0 14px 14px}',
'.kc-jlist{list-style:none;font-size:14px;line-height:1.9}',
'.kc-jlist li{display:flex;justify-content:space-between;gap:8px;border-bottom:1px dotted var(--line);padding:4px 0}',
'.kc-jlist button{color:var(--muted);font-size:16px;padding:0 4px}',
'.kc-jadd{display:flex;gap:8px;margin-top:8px}',
'.kc-jadd input,.kc-edit input{flex:1;min-width:0;padding:9px 10px;background:#0f0d0a;border:1px solid var(--line);color:var(--text);font:inherit;font-size:16px;outline:none}',
'.kc-jadd button{padding:0 14px;border:1px solid var(--gold);color:var(--gold);font-size:13px}',
'.kc-rules{display:grid;gap:6px}',
'.kc-rules .rw{display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-bottom:1px dotted var(--line);font-size:13px;line-height:1.6}',
'.kc-rules .rk{flex:0 0 30px;height:30px;display:grid;place-items:center;border:1px solid var(--gold);color:var(--gold);font-family:var(--latin);font-weight:600;font-size:16px}',
'.kc-rules b{color:var(--text);font-weight:600;display:block}',
'.kc-rules span{color:var(--muted)}',
'.kc-rules .rw.hit{background:rgba(214,178,106,.12)}',
'.kc-edit{display:grid;gap:4px;flex:1}',
'.kc-tools{display:flex;justify-content:space-between;margin-top:10px}',
'.kc-tools button{font-size:12.5px;color:var(--gold);padding:4px 2px}'
].join('\n');
var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* ---------- rules ---------- */
var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var SUITS = ['♠', '♥', '♦', '♣'];
var DEFAULT = {
  A: ['全員で飲む', '全員で乾杯して飲む！'],
  '2': ['指名', '好きな人を1人指名して飲ませる'],
  '3': ['自分', '引いた人が飲む'],
  '4': ['テーブル', '最後にテーブルにタッチした人が飲む'],
  '5': ['男性', '男性全員が飲む'],
  '6': ['女性', '女性全員が飲む'],
  '7': ['ヘブン', '最後に手を上に挙げた人が飲む'],
  '10': ['カテゴリー', 'お題を決めて順番に答える。詰まった人が飲む'],
  J: ['ルール作成', 'ゲーム中ずっと続くルールを1つ作る（例：左手で飲む）。下の「今のルール」にメモしよう'],
  Q: ['クエスチョンマスター', '次のQが出るまで、この人の質問に答えた人が飲む']
};
// 8・9・K は枚数で内容が変わる特別ルール
var SPECIAL = {
  '8': { on: ['メイト', '相棒を1人選ぶ。自分が飲むたびに相棒も一緒に飲む'], off: ['メイト解除', 'メイトはここで解除！相棒は自由の身'] },
  '9': { on: ['英語禁止', '今から英語禁止！英語を言ったら飲む（「OK」「ナイス」もアウト）'], off: ['英語禁止 解除', '英語を話してOKになりました'] },
  K: { pour: ['キングスカップ', '真ん中のカップに自分のドリンクを少し注ぐ'], last: ['キングスカップを飲む！', '4枚目のK！キングスカップを飲み干す'] }
};
var rules = G.store.get('kcRules', null) || {};
function R(k) { return rules[k] || DEFAULT[k]; }

/* ---------- state ---------- */
var deck, drawn, cnt, mate, english, qm, jRules = G.store.get('kcJ', []), busy = false, over = false, editing = false;

/* ---------- markup ---------- */
document.querySelector('#home .games').insertAdjacentHTML('beforeend',
  '<button class="game-btn" data-x="kings"><span class="ic"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 12l5 4 5-8 5 8 5-4-2 12H8z"/><path d="M8 27h16"/><circle cx="16" cy="6" r="1.3" fill="currentColor"/></svg></span><span><h2>キングスカップ</h2><p>カードの数字ごとのルールで飲む。4枚目のKを引いたら…</p></span><span class="arrow">›</span></button>');
document.getElementById('dice').insertAdjacentHTML('afterend',
  '<section class="screen" id="kings">' +
    '<div class="kc-top"><span>残り<b id="kcLeft">52</b>枚</span><span class="kc-crowns" id="kcCrowns"><i>👑</i><i>👑</i><i>👑</i><i>👑</i></span></div>' +
    '<div class="kc-state" id="kcState"></div>' +
    '<div class="kc-stage" id="kcStage"><div class="kc-card back" id="kcCard"><img src="../assets/logo-gold.png" alt=""><span>タップして引く</span></div></div>' +
    '<div class="kc-rule" id="kcRule"><div class="tt">順番にカードを引こう</div><div class="ds">スマホを真ん中に置いて、1人ずつタップ</div></div>' +
    '<button class="btn" id="kcDraw">カードを引く</button>' +
    '<details class="kc-box" id="kcJBox"><summary>今のルール（Jで作ったもの）<span id="kcJCount"></span></summary><div class="in"><ul class="kc-jlist" id="kcJList"></ul><form class="kc-jadd" id="kcJAdd"><input id="kcJIn" maxlength="30" placeholder="例：左手で飲む" enterkeyhint="done"><button type="submit">追加</button></form></div></details>' +
    '<details class="kc-box"><summary>ルール一覧</summary><div class="in"><div class="kc-rules" id="kcRules"></div><div class="kc-tools"><button id="kcEdit">ルールを編集</button><button id="kcDefault">最初のルールに戻す</button></div></div></details>' +
    '<div style="margin-top:12px"><button class="btn ghost" id="kcReset">新しいゲーム</button></div>' +
  '</section>');
G.titles.kings = 'キングスカップ';
document.querySelector('[data-x="kings"]').addEventListener('click', function () { G.go('kings'); });

/* ---------- render ---------- */
function paintState() {
  $('kcLeft').textContent = deck.length;
  $('kcCrowns').querySelectorAll('i').forEach(function (c, i) { c.className = i < cnt.K ? 'on' : ''; });
  var s = [
    ['メイト', mate], ['英語禁止', english], ['Qマスター', qm]
  ].map(function (x) { return '<span class="' + (x[1] ? 'on' : '') + '">' + x[0] + (x[1] ? ' 有効' : '') + '</span>'; });
  s.push('<span class="' + (jRules.length ? 'on' : '') + '">ルール ' + jRules.length + '個</span>');
  $('kcState').innerHTML = s.join('');
  $('kcJCount').textContent = jRules.length ? '（' + jRules.length + '）' : '';
  $('kcJList').innerHTML = jRules.length ? jRules.map(function (r, i) { return '<li><span>' + esc(r) + '</span><button data-j="' + i + '" aria-label="削除">×</button></li>'; }).join('') : '<li style="color:var(--muted)">まだルールはありません</li>';
  $('kcJList').querySelectorAll('[data-j]').forEach(function (b) { b.onclick = function () { jRules.splice(+b.dataset.j, 1); G.store.set('kcJ', jRules); paintState(); }; });
}
function paintRules(hit) {
  var rows = RANKS.map(function (k) {
    var t, d;
    if (k === '8') { t = 'メイト'; d = '1・3枚目：相棒を選ぶ（自分が飲むたびに相棒も飲む）／2・4枚目：解除'; }
    else if (k === '9') { t = '英語禁止'; d = '1・3枚目：英語を言ったら飲む／2・4枚目：解除'; }
    else if (k === 'K') { t = 'キングスカップ'; d = '1〜3枚目：真ん中のカップに注ぐ／4枚目：飲み干す'; }
    else { t = R(k)[0]; d = R(k)[1]; }
    var body = (editing && DEFAULT[k]) ? '<div class="kc-edit"><input data-k="' + k + '" data-f="0" maxlength="16" value="' + esc(t) + '"><input data-k="' + k + '" data-f="1" maxlength="60" value="' + esc(d) + '"></div>' : '<div><b>' + esc(t) + '</b><span>' + esc(d) + '</span></div>';
    return '<div class="rw' + (hit === k ? ' hit' : '') + '"><div class="rk">' + k + '</div>' + body + '</div>';
  });
  $('kcRules').innerHTML = rows.join('');
  if (editing) $('kcRules').querySelectorAll('input').forEach(function (inp) {
    inp.oninput = function () { var k = inp.dataset.k, v = R(k).slice(); v[+inp.dataset.f] = inp.value; rules[k] = v; G.store.set('kcRules', rules); };
  });
}
function showRule(t, d, extra) {
  var el = $('kcRule'); el.innerHTML = '<div class="tt">' + esc(t) + '</div><div class="ds">' + esc(d) + (extra ? '<br><span style="color:var(--muted);font-size:12px">' + esc(extra) + '</span>' : '') + '</div>';
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
}
function face(c) {
  var red = c.s === 1 || c.s === 2, el = $('kcCard');
  el.className = 'kc-card face' + (red ? ' red' : '') + (c.r === 'K' ? ' k' : '');
  el.innerHTML = '<div class="c">' + c.r + '<br>' + SUITS[c.s] + '</div><div><div class="r">' + c.r + '</div><div class="s">' + SUITS[c.s] + '</div></div><div class="c c2">' + c.r + '<br>' + SUITS[c.s] + '</div>';
  el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
}

/* ---------- game ---------- */
function newGame() {
  deck = []; RANKS.forEach(function (r) { for (var s = 0; s < 4; s++) deck.push({ r: r, s: s }); });
  deck = G.shuffle(deck); drawn = 0; cnt = { '8': 0, '9': 0, K: 0 }; mate = english = qm = false; over = false;
  var el = $('kcCard'); el.className = 'kc-card back'; el.innerHTML = '<img src="../assets/logo-gold.png" alt=""><span>タップして引く</span>';
  $('kcRule').innerHTML = '<div class="tt">順番にカードを引こう</div><div class="ds">スマホを真ん中に置いて、1人ずつタップ</div>';
  $('kcDraw').textContent = 'カードを引く'; $('kcDraw').disabled = false;
  paintState(); paintRules();
}
function draw() {
  if (busy) return;
  if (over || !deck.length) { newGame(); return; }
  busy = true; setTimeout(function () { busy = false; }, 650);
  var c = deck.pop(); drawn++; face(c); G.tone(760, .08, 'triangle', .05); G.vibrate(20);
  var t, d, extra = '';
  if (c.r === '8') {
    cnt['8']++; var on8 = cnt['8'] % 2 === 1; mate = on8; t = SPECIAL['8'][on8 ? 'on' : 'off'][0]; d = SPECIAL['8'][on8 ? 'on' : 'off'][1]; extra = '8は' + cnt['8'] + '枚目';
  } else if (c.r === '9') {
    cnt['9']++; var on9 = cnt['9'] % 2 === 1; english = on9; t = SPECIAL['9'][on9 ? 'on' : 'off'][0]; d = SPECIAL['9'][on9 ? 'on' : 'off'][1]; extra = '9は' + cnt['9'] + '枚目';
    if (on9) { G.boom(); }
  } else if (c.r === 'K') {
    cnt.K++;
    if (cnt.K >= 4) {
      t = SPECIAL.K.last[0]; d = SPECIAL.K.last[1]; over = true;
      paintState(); paintRules('K'); showRule(t, d);
      $('kcDraw').textContent = '新しいゲーム';
      setTimeout(function () { G.boom(); G.vibrate([250, 80, 400]); G.showResult('KING\'S CUP', '4枚目のK！\nキングスカップを飲み干す', true); }, 500);
      return;
    }
    t = SPECIAL.K.pour[0]; d = SPECIAL.K.pour[1]; extra = 'Kは' + cnt.K + '枚目（あと' + (4 - cnt.K) + '枚）';
    G.fanfare();
  } else {
    if (c.r === 'Q') qm = true;
    t = R(c.r)[0]; d = R(c.r)[1];
    if (c.r === 'J') { $('kcJBox').open = true; }
    if (c.r === 'A') G.fanfare();
  }
  paintState(); paintRules(c.r); showRule(t, d, extra);
  if (!deck.length) { $('kcDraw').textContent = '新しいゲーム'; over = true; }
}
$('kcDraw').onclick = draw;
$('kcStage').onclick = draw;
$('kcReset').onclick = function () { newGame(); };
$('kcJAdd').onsubmit = function (e) { e.preventDefault(); var v = $('kcJIn').value.trim(); if (!v) return; jRules.push(v); G.store.set('kcJ', jRules); $('kcJIn').value = ''; $('kcJIn').blur(); paintState(); };
$('kcEdit').onclick = function () { editing = !editing; this.textContent = editing ? '編集を終わる' : 'ルールを編集'; paintRules(); };
$('kcDefault').onclick = function () { rules = {}; G.store.set('kcRules', rules); paintRules(); };
// 新しいゲームでJのルールもリセットするか
var _ng = newGame;
newGame = function () { if (drawn > 0) { jRules = []; G.store.set('kcJ', jRules); } _ng(); };
$('kcReset').onclick = function () { newGame(); };
_ng();

var h = (location.hash || '').slice(1); if (h === 'kings') G.go('kings', false);
})();
