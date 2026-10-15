(function () {
'use strict';
var C = window.LANI_CONFIG;
var $ = function (id) { return document.getElementById(id); };
var store = {
  get: function (k, d) { try { var v = localStorage.getItem('lani-' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem('lani-' + k, JSON.stringify(v)); } catch (e) {} }
};
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function vibrate(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
var actx = null;
function tone(f, d, type, vol) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
    o.type = type || 'sine'; o.frequency.value = f; o.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(vol || .08, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.start(t); o.stop(t + d);
  } catch (e) {}
}
function fanfare() { [523, 659, 784, 1047].forEach(function (f, i) { setTimeout(function () { tone(f, .25, 'triangle', .09); }, i * 110); }); }
function boom() { tone(90, .5, 'sawtooth', .16); setTimeout(function () { tone(60, .6, 'square', .1); }, 60); }
function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200); }

var ICON = {
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
  line: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 4C6.5 4 2.5 7.4 2.5 11.6c0 3.7 3.2 6.8 7.6 7.4l-.5 2.5 3.4-2.4c5-.4 8.5-3.6 8.5-7.5C21.5 7.4 17.5 4 12 4z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/></svg>',
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>'
};
var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.address.replace(/^〒\S+\s*/, ''));

/* ---------- age gate ---------- */
if (!store.get('age-ok', false)) $('ageGate').classList.add('show');
$('ageYes').onclick = function () { store.set('age-ok', true); $('ageGate').classList.remove('show'); };
$('ageNo').onclick = function () {
  $('ageGate').querySelector('.big').textContent = '申し訳ございません';
  $('ageGate').querySelector('p').innerHTML = '20歳になったら、またお待ちしております。';
  $('ageGate').querySelector('.row2').style.display = 'none';
};

/* ---------- tabs ---------- */
function showTab(name) {
  document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('active', v.id === 'v-' + name); });
  document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === name); });
  $('v-' + name).scrollTop = 0;
  if (name === 'game' && curGame === 'roulette') drawWheel(rot);
  if (name === 'shop' && !$('mapFrame').src) $('mapFrame').src = 'https://www.google.com/maps?q=' + encodeURIComponent(C.address.replace(/^〒\S+\s*/, '')) + '&output=embed&hl=ja&z=17';
}
document.querySelectorAll('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { showTab(b.dataset.tab); }); });

/* ---------- business day helpers ---------- */
function bizDate(d) { return new Date(d.getTime() - 12 * 3600 * 1000); } // 営業日は昼12時で切り替え
function bizKey(d) { var b = bizDate(d); return b.getFullYear() + '-' + (b.getMonth() + 1) + '-' + b.getDate(); }
function hm(s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; }
function openState(now) {
  var mins = now.getHours() * 60 + now.getMinutes(), o = hm(C.openTime), c = hm(C.closeTime);
  var bd = bizDate(now).getDay(), closedToday = C.closedDays.indexOf(bd) >= 0;
  var inHours = c < o ? (mins >= o || mins < c) : (mins >= o && mins < c);
  if (inHours && !closedToday) return { cls: 'open', main: '営業中', sub: C.closeTime + ' まで営業しています' };
  if (now.getHours() >= 12 && C.closedDays.indexOf(now.getDay()) >= 0) return { cls: 'closed', main: '本日は定休日', sub: '定休日：' + C.closedLabel };
  return { cls: '', main: '本日 ' + C.openTime + ' OPEN', sub: '営業時間 ' + C.openTime + ' – ' + C.closeTime };
}

/* ---------- home ---------- */
function renderStatus() { var s = openState(new Date()); $('status').className = 'status ' + s.cls; $('statusMain').textContent = s.main; $('statusSub').textContent = s.sub; }
renderStatus(); setInterval(renderStatus, 60000);
(function quick() {
  var q = [
    { h: '#', i: ICON.menu, t: 'メニュー', tab: 'menu' },
    { h: C.instagram, i: ICON.ig, t: 'Instagram' },
    C.lineUrl ? { h: C.lineUrl, i: ICON.line, t: '公式LINE' } : { h: C.website, i: ICON.web, t: 'Webサイト' },
    { h: mapsUrl, i: ICON.map, t: '地図' }
  ];
  $('quick').innerHTML = q.map(function (x) {
    return x.tab ? '<button data-tab="' + x.tab + '">' + x.i + x.t + '</button>' : '<a href="' + esc(x.h) + '" target="_blank" rel="noopener">' + x.i + x.t + '</a>';
  }).join('');
  $('quick').querySelectorAll('[data-tab]').forEach(function (b) { b.onclick = function () { showTab(b.dataset.tab); }; });
})();
$('news').innerHTML = C.news.map(function (n) { return '<li><time>' + esc(n.date) + '</time><h4>' + esc(n.title) + '</h4>' + (n.body ? '<p>' + esc(n.body) + '</p>' : '') + '</li>'; }).join('');

/* ---------- menu ---------- */
var MENU = {
  'プラン': '<div class="card"><h3>飲み放題プラン<span>ALL-YOU-CAN-DRINK</span></h3>' +
    '<div class="row big"><div>1時間<span class="tag">チャージなし</span><small>焼酎・ソフトドリンク・缶もの</small></div><div class="p">¥2,000</div></div>' +
    '<div class="row big"><div>5:00以降 1時間</div><div class="p">¥3,000</div></div>' +
    '<div class="row"><div>スタッフ飲み放題<small>スタッフ全員</small></div><div class="p">¥3,000</div></div></div>' +
    '<div class="card"><h3>単品プラン<span>SINGLE ITEM</span></h3>' +
    '<div class="row"><div>フリーチャージ</div><div class="p">¥1,000</div></div>' +
    '<div class="sub-h">DRINK</div><div class="row"><div>ソフトドリンク</div><div class="p">¥500</div></div><div class="row"><div>アルコール</div><div class="p">¥800</div></div><div class="row"><div>缶もの</div><div class="p">¥1,000</div></div>' +
    '<div class="sub-h">PITCHER</div><div class="row"><div>ピッチャー（中）</div><div class="p">¥5,000</div></div><div class="row"><div>ピッチャー（大）</div><div class="p">¥8,000</div></div>' +
    '<div class="row"><div>スタッフドリンク</div><div class="p">¥1,000</div></div></div>',
  'シーシャ': '<div class="card"><h3>シーシャ<span>SHISHA</span></h3>' +
    '<div class="row big"><div>1台</div><div class="p">¥3,000</div></div>' +
    '<div class="row"><div>ブロンドリーフ</div><div class="p">+¥0</div></div><div class="row"><div>ダークリーフ（ハーフ）</div><div class="p">+¥500</div></div><div class="row"><div>ダークリーフ（MAX）</div><div class="p">+¥1,000</div></div>' +
    '<p class="note">シェアチャージ無料／100種類以上のフレーバーを揃えています</p></div>',
  'ドリンク': '<div class="card"><h3>ソフトドリンク<span>SOFT DRINK</span></h3><ul class="list"><li>緑茶</li><li>烏龍茶</li><li>ジャスミン茶</li><li>麦茶</li><li>爽健美茶</li><li>コーン茶</li><li>ミネラルウォーター</li><li>炭酸水</li></ul></div>' +
    '<div class="card"><h3>ジュース<span>JUICE</span></h3><ul class="list"><li>オレンジ</li><li>アップル</li><li>マンゴー</li><li>グァバ</li><li>パイナップル</li><li>カルピス</li><li>コーラ</li><li>ジンジャーエール</li><li>クランベリー</li><li>コーヒー（HOT/ICE）</li></ul></div>' +
    '<div class="card"><h3>アルコール<span>ALCOHOL</span></h3><ul class="list"><li>茉莉花</li><li>二階堂（麦）</li><li>黒霧島（芋）</li><li>鏡月</li><li>カシス</li><li>ミスティア</li><li>ハイボール</li></ul>' +
    '<div class="sub-h">缶もの</div><ul class="list"><li>淡麗グリーンラベル</li><li>氷結無糖レモン</li><li>つぶちゅーみかん</li><li>スラットシャルドネ</li></ul></div>' +
    '<div class="card"><h3>ショット<span>SHOT</span></h3><div class="row"><div>テキーラ・ウォッカ・イエガー・マルガリータ・コカレロ</div><div class="p">¥1,000</div></div><div class="row"><div>アネホ・クライナー・コカボム</div><div class="p">¥1,200</div></div></div>' +
    '<div class="card"><h3>シャンパン<span>CHAMPAGNE</span></h3><div class="row"><div>Laniオリジナルシャンパン<small>甘口・辛口</small></div><div class="p">¥30,000 / ¥50,000</div></div><div class="row"><div>ヴーヴ・クリコ イエロー</div><div class="p">¥30,000</div></div><div class="row"><div>PJ</div><div class="p">¥35,000</div></div><div class="row"><div>ベル エポック</div><div class="p">¥90,000</div></div><div class="row"><div>エンジェルシャンパン</div><div class="p">¥150,000〜</div></div></div>',
  'フード': '<div class="card"><h3>フード<span>FOOD</span></h3><div class="row"><div>ポップコーン・フライドポテト・ミックスナッツ</div><div class="p">各¥500</div></div><div class="row"><div>本日のラニ飯</div><div class="p">¥800〜</div></div><p class="note">その他フードメニューは店内掲示板をご覧ください</p></div>' +
    '<div class="card"><h3>アミューズメント<span>AMUSEMENT</span></h3><div class="row"><div>ダーツ</div><div class="p">1PLAY ¥100</div></div><div class="row"><div>カラオケ</div><div class="p">歌い放題</div></div></div>'
};
var mcat = $('mcat');
Object.keys(MENU).forEach(function (k, i) {
  var b = document.createElement('button'); b.textContent = k; if (!i) b.className = 'on';
  b.onclick = function () { mcat.querySelectorAll('button').forEach(function (x) { x.className = x === b ? 'on' : ''; }); $('menuBody').innerHTML = MENU[k]; };
  mcat.appendChild(b);
});
$('menuBody').innerHTML = MENU['プラン'];

/* ---------- stamp card ---------- */
var st = store.get('stamp', { count: 0, last: '', done: 0 });
var GOAL = C.stampGoal;
function renderStamp(animIdx) {
  $('sGoal').textContent = GOAL; $('sNum').textContent = st.count; $('sDone').textContent = st.done;
  var h = '';
  for (var i = 0; i < GOAL; i++) {
    var got = i < st.count, isGoal = i === GOAL - 1;
    h += '<div class="slot' + (got ? ' got' : '') + (isGoal ? ' goal' : '') + (i === animIdx ? ' new' : '') + '">' + (isGoal ? '特典' : (i + 1)) + '</div>';
  }
  $('sGrid').innerHTML = h;
  $('sReward').innerHTML = GOAL + '個集めると <b>' + esc(C.stampReward) + '</b>';
  var full = st.count >= GOAL, today = st.last === bizKey(new Date());
  $('ticketBox').innerHTML = full ? '<div class="ticket"><div class="k">REWARD</div><h3>' + esc(C.stampReward) + '</h3><p>この画面をスタッフに見せてください</p><button class="btn pink" id="useBtn">特典を使う（スタッフ操作）</button></div>' : '';
  if (full) $('useBtn').onclick = function () { askPin('特典の利用', 'スタッフが暗証番号を入力すると特典を使用済みにします', useReward); };
  var btn = $('stampBtn');
  btn.disabled = full || today;
  btn.textContent = full ? 'カードがいっぱいです' : today ? '本日のスタンプは押しました' : 'スタンプを押してもらう';
  // home mini
  var left = GOAL - st.count;
  $('ringNum').textContent = st.count; $('ringArc').setAttribute('stroke-dasharray', (st.count / GOAL * 100) + ' 100');
  $('miniTitle').textContent = full ? '特典が使えます！' : 'あと ' + left + ' 個で特典';
  $('miniSub').textContent = C.stampReward + '｜来店時にスタッフに見せてね';
}
function addStamp() {
  if (st.count >= GOAL || st.last === bizKey(new Date())) return;
  st.count++; st.last = bizKey(new Date()); store.set('stamp', st);
  renderStamp(st.count - 1); tone(880, .15, 'triangle', .1); vibrate([30, 40, 60]);
  if (st.count >= GOAL) { fanfare(); confetti(); setTimeout(function () { showResult('COMPLETE', '特典GET！\n' + C.stampReward); }, 600); }
  else toast('スタンプを押しました！あと ' + (GOAL - st.count) + ' 個');
}
function useReward() { st.count = 0; st.done++; store.set('stamp', st); renderStamp(); toast('特典を使用しました。ありがとうございます！'); }
$('stampBtn').onclick = function () { askPin('スタッフ確認', 'スタッフが暗証番号を入力してください', addStamp); };
renderStamp();

/* PIN pad */
var pin = '', pinCb = null;
var keys = $('keys');
['1', '2', '3', '4', '5', '6', '7', '8', '9', 'キャンセル', '0', '消す'].forEach(function (k) {
  var b = document.createElement('button'); b.textContent = k; if (k.length > 1) b.className = 'fn';
  b.onclick = function () {
    if (k === 'キャンセル') return closePin();
    if (k === '消す') pin = pin.slice(0, -1); else if (pin.length < 4) pin += k;
    tone(1200, .03, 'square', .02); paintPin();
    if (pin.length === 4) setTimeout(checkPin, 120);
  };
  keys.appendChild(b);
});
function paintPin() { $('pinDots').querySelectorAll('i').forEach(function (d, i) { d.className = i < pin.length ? 'f' : ''; }); }
function askPin(title, sub, cb) { pin = ''; pinCb = cb; $('pinTitle').textContent = title; $('pinSub').textContent = sub; paintPin(); $('pinSheet').classList.add('show'); }
function closePin() { $('pinSheet').classList.remove('show'); pin = ''; }
function checkPin() {
  if (pin === String(C.staffPin)) { var cb = pinCb; closePin(); cb && cb(); }
  else { var d = $('pinDots'); d.classList.remove('err'); void d.offsetWidth; d.classList.add('err'); vibrate(200); pin = ''; setTimeout(paintPin, 300); }
}
$('pinSheet').addEventListener('click', function (e) { if (e.target === this) closePin(); });

/* ---------- result overlay & confetti ---------- */
function showResult(k, text, hit) {
  $('resK').textContent = k; $('resBig').textContent = text; $('result').classList.toggle('hit', !!hit); $('overlay').classList.add('show');
  if (hit) { var f = $('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }
}
$('resClose').onclick = function () { $('overlay').classList.remove('show'); };
var cf = $('confetti'), cx = cf.getContext('2d'), parts = [], cfRun = false;
function confetti() {
  var r = window.devicePixelRatio || 1; cf.width = innerWidth * r; cf.height = innerHeight * r;
  var cols = ['#d6b26a', '#f3dca2', '#ff3d8b', '#6fa257', '#ffffff'];
  for (var i = 0; i < 120; i++) parts.push({ x: cf.width / 2, y: cf.height * .45, vx: (Math.random() - .5) * 26 * r, vy: (-Math.random() * 22 - 6) * r, s: (4 + Math.random() * 6) * r, c: cols[i % 5], a: Math.random() * 6, va: (Math.random() - .5) * .4, l: 0, r: r });
  if (!cfRun) { cfRun = true; requestAnimationFrame(stepCf); }
}
function stepCf() {
  cx.clearRect(0, 0, cf.width, cf.height);
  parts.forEach(function (p) { p.vy += .7 * p.r; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.a += p.va; p.l++; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx.restore(); });
  parts = parts.filter(function (p) { return p.y < cf.height + 40 && p.l < 240; });
  if (parts.length) requestAnimationFrame(stepCf); else { cfRun = false; cx.clearRect(0, 0, cf.width, cf.height); }
}

/* ---------- games: navigation ---------- */
var curGame = 'list';
var gTitles = { list: ['Game', 'パーティーゲーム'], roulette: ['Roulette', 'ルーレット'], cards: ['Cards', 'お題カード'], russian: ['Russian', 'ロシアンルーレット'] };
function openGame(g) {
  curGame = g;
  document.querySelectorAll('.gpanel').forEach(function (p) { p.classList.toggle('on', p.id === 'g-' + g); });
  $('gTitle').innerHTML = gTitles[g][0] + '<small>' + gTitles[g][1] + '</small>';
  $('gBack').classList.toggle('show', g !== 'list');
  $('v-game').scrollTop = 0;
  if (g === 'roulette') drawWheel(rot);
}
document.querySelectorAll('[data-game]').forEach(function (b) { b.onclick = function () { openGame(b.dataset.game); }; });
$('gBack').onclick = function () { openGame('list'); };

/* ---------- roulette ---------- */
var PRESETS = {
  '罰ゲーム': ['ドリンクを一口', '好きな人を指名', '左隣と乾杯', '右隣と乾杯', '全員で乾杯', 'セーフ！', 'モノマネ', '変顔を披露'],
  'はい/いいえ': ['YES', 'NO'],
  '順番決め': ['1', '2', '3', '4', '5', '6'],
  'シーシャ': ['フルーツ系', 'ミント系', 'スイーツ系', 'フラワー系', 'スパイス系', 'スタッフおまかせ']
};
var items = store.get('roulette', PRESETS['罰ゲーム']), rot = 0, spinning = false;
function renderItems() {
  var box = $('items'); box.innerHTML = '';
  items.forEach(function (t, i) {
    var d = document.createElement('span'); d.className = 'chip'; d.appendChild(document.createTextNode(t));
    var x = document.createElement('button'); x.textContent = '×'; x.setAttribute('aria-label', '削除');
    x.onclick = function () { if (spinning) return; items.splice(i, 1); saveItems(); }; d.appendChild(x); box.appendChild(d);
  });
  $('itemCount').textContent = items.length; $('spinBtn').disabled = items.length < 2;
}
function saveItems() { store.set('roulette', items); renderItems(); drawWheel(rot); }
Object.keys(PRESETS).forEach(function (k) { var b = document.createElement('button'); b.textContent = k; b.onclick = function () { if (!spinning) { items = PRESETS[k].slice(); saveItems(); } }; $('presets').appendChild(b); });
(function () { var b = document.createElement('button'); b.textContent = '全部消す'; b.onclick = function () { if (!spinning) { items = []; saveItems(); } }; $('presets').appendChild(b); })();
$('addForm').onsubmit = function (e) { e.preventDefault(); var v = $('addInput').value.trim(); if (!v || spinning) return; if (items.length >= 24) { toast('項目は24個までです'); return; } items.push(v); $('addInput').value = ''; saveItems(); };
var cv = $('wheel'), g = cv.getContext('2d');
function drawWheel(r) {
  var W = cv.width, R = W / 2, n = Math.max(items.length, 1), seg = Math.PI * 2 / n, pal = ['#1c1813', '#2a2318', '#3a2f1d'];
  g.clearRect(0, 0, W, W); g.save(); g.translate(R, R); g.rotate(r);
  for (var i = 0; i < n; i++) {
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, i * seg - Math.PI / 2, (i + 1) * seg - Math.PI / 2); g.closePath();
    g.fillStyle = (n % 2 === 1 && i === n - 1 && n > 1) ? pal[2] : pal[i % 2]; g.fill();
    g.strokeStyle = 'rgba(214,178,106,.55)'; g.lineWidth = 2; g.stroke();
    if (!items.length) continue;
    g.save(); g.rotate(i * seg + seg / 2 - Math.PI / 2); g.textAlign = 'right'; g.textBaseline = 'middle';
    var t = items[i], fs = Math.min(44, Math.max(22, 280 / Math.max(t.length, 3))); if (n > 12) fs = Math.min(fs, 28);
    var ff = '"Shippori Mincho","Hiragino Mincho ProN","Noto Serif CJK JP",serif';
    g.font = '700 ' + fs + 'px ' + ff;
    while (g.measureText(t).width > R * .66 && fs > 14) { fs -= 2; g.font = '700 ' + fs + 'px ' + ff; }
    g.fillStyle = i % 2 ? '#f3dca2' : '#f2ece0'; g.fillText(t, R - 28, 0); g.restore();
  }
  g.restore(); g.beginPath(); g.arc(R, R, R - 3, 0, Math.PI * 2); g.strokeStyle = '#d6b26a'; g.lineWidth = 6; g.stroke();
  if (!items.length) { g.fillStyle = '#a8a092'; g.font = '26px sans-serif'; g.textAlign = 'center'; g.fillText('項目を追加してね', R, R + 90); }
}
$('spinBtn').onclick = function () {
  if (spinning || items.length < 2) return; spinning = true; this.disabled = true;
  var n = items.length, seg = Math.PI * 2 / n, target = Math.floor(Math.random() * n), TAU = Math.PI * 2;
  var base = -(target * seg + seg / 2) + (Math.random() - .5) * seg * .7;
  var delta = ((base - rot % TAU) % TAU + TAU) % TAU, total = delta + TAU * (6 + Math.floor(Math.random() * 3));
  var start = rot, dur = 4600, t0 = performance.now(), last = -1;
  function frame(now) {
    var p = Math.min(1, (now - t0) / dur); rot = start + total * (1 - Math.pow(1 - p, 4)); drawWheel(rot);
    var s = Math.floor((((-rot) % TAU) + TAU) % TAU / seg); if (s !== last) { last = s; tone(1400, .03, 'square', .03); }
    if (p < 1) requestAnimationFrame(frame);
    else { spinning = false; $('spinBtn').disabled = false; vibrate([60, 40, 120]); fanfare(); confetti(); showResult('RESULT', items[target]); }
  }
  requestAnimationFrame(frame);
};
renderItems();

/* ---------- cards ---------- */
var CARDS = {
  'みんな': ['一番年下の人がドリンクを一口', '一番年上の人がドリンクを一口', '今日一番遠くから来た人がドリンクを一口', '最後にLINEを送った人がドリンクを一口', 'スマホの充電が一番少ない人がドリンクを一口', '黒い服を着ている人がドリンクを一口', 'メガネをかけている人がドリンクを一口', '誕生日が一番近い人がドリンクを一口', '兄弟姉妹がいる人がドリンクを一口', '一人っ子の人がドリンクを一口', '今日初めてLaniに来た人がドリンクを一口', 'Laniの常連さんがドリンクを一口', 'ピアスをしている人がドリンクを一口', '左隣の人がドリンクを一口', '右隣の人がドリンクを一口', 'カードをめくった人がドリンクを一口', '全員で乾杯！'],
  'アクション': ['10秒以内にシーシャのフレーバーを3つ言えなかったら罰ゲーム', 'じゃんけんで負けた人が罰ゲーム', '指名した人と乾杯する', '全員でせーので指差し、一番指された人が罰ゲーム', '30秒しりとり、詰まった人が罰ゲーム', '変顔で一番笑わせた人の勝ち', '次の3ターン、語尾に「ラニ」をつける。忘れたら罰ゲーム', '右隣の人の良いところを3つ言う', 'あっち向いてホイで負けた人が罰ゲーム', '全員で手をたたいて5秒数える。最後にたたいた人が罰ゲーム', '乾杯の音頭をとる。噛んだら罰ゲーム', 'ダーツで一番高い点を出した人の勝ち'],
  'トーク': ['最近一番笑ったことを話す', '今一番行きたい国は？', '人生で一番恥ずかしかった話をする。パスしたら罰ゲーム', '初恋の話をする。パスしたら罰ゲーム', 'このメンバーで一番モテそうな人を指名', '最近ハマっているものを紹介する', '宝くじで1億円当たったら何に使う？', '無人島に一つだけ持っていくなら？', '自分を動物に例えると？みんなで決める', '好きなシーシャのフレーバーとその理由']
};
var cat = 'ぜんぶ', deck = [], pos = 0, flipping = false;
function buildDeck() {
  var pool = []; Object.keys(CARDS).forEach(function (k) { if (cat === 'ぜんぶ' || cat === k) CARDS[k].forEach(function (q) { pool.push({ c: k, q: q }); }); });
  deck = shuffle(pool); pos = 0; $('flip').classList.remove('open'); $('drawBtn').textContent = 'めくる'; info();
}
function info() { $('deckInfo').textContent = '残り ' + (deck.length - pos) + ' / ' + deck.length; }
['ぜんぶ'].concat(Object.keys(CARDS)).forEach(function (k) {
  var b = document.createElement('button'); b.textContent = k; if (k === cat) b.className = 'on';
  b.onclick = function () { cat = k; $('catTabs').querySelectorAll('button').forEach(function (x) { x.className = x === b ? 'on' : ''; }); buildDeck(); };
  $('catTabs').appendChild(b);
});
function draw() {
  if (flipping) return; var f = $('flip');
  if (pos >= deck.length) { buildDeck(); return; }
  var card = deck[pos];
  function reveal() {
    $('cardCat').textContent = { 'みんな': 'EVERYONE', 'アクション': 'ACTION', 'トーク': 'TALK' }[card.c]; $('cardQ').textContent = card.q;
    pos++; info(); f.classList.add('open'); tone(880, .12, 'triangle', .06); vibrate(20);
    $('drawBtn').textContent = pos >= deck.length ? 'シャッフルしてもう一度' : '次のカード';
  }
  if (f.classList.contains('open')) { flipping = true; f.classList.remove('open'); setTimeout(function () { flipping = false; reveal(); }, 380); } else reveal();
}
$('drawBtn').onclick = draw; $('cardStage').onclick = draw; buildDeck();

/* ---------- russian roulette ---------- */
var cfg = store.get('rr', { slots: 12, hits: 1 }), hitsSet = {}, opened = 0, found = 0, over = false;
var glassSvg = '<svg viewBox="0 0 24 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 3h16l-2 26H6z"/><path d="M5 11h14"/></svg>';
function rrNew() {
  hitsSet = {}; shuffle(Array.from({ length: cfg.slots }, function (_, i) { return i; })).slice(0, cfg.hits).forEach(function (i) { hitsSet[i] = 1; });
  opened = 0; found = 0; over = false; $('slotsVal').textContent = cfg.slots; $('hitsVal').textContent = cfg.hits;
  var box = $('glasses'); box.innerHTML = '';
  for (var i = 0; i < cfg.slots; i++) (function (i) { var b = document.createElement('button'); b.className = 'glass'; b.innerHTML = '<span class="n">' + (i + 1) + '</span>' + glassSvg; b.onclick = function () { pick(b, i); }; box.appendChild(b); })(i);
  rrStatus();
}
function rrStatus() { $('rrStatus').innerHTML = over ? 'ゲーム終了！ <b>' + found + '</b> 人が当たり' : '当たり残り <b>' + (cfg.hits - found) + '</b> ／ グラス残り <b>' + (cfg.slots - opened) + '</b>'; }
function pick(b, i) {
  if (over || b.disabled) return; b.disabled = true; opened++;
  if (hitsSet[i]) {
    found++; b.classList.add('hit'); boom(); vibrate([200, 80, 300]);
    if (found >= cfg.hits) { over = true; document.querySelectorAll('.glass').forEach(function (x) { x.disabled = true; }); }
    rrStatus(); setTimeout(function () { showResult('HIT!!', '当たり！\nグラス ' + (i + 1) + ' の人は罰ゲーム', true); }, 350);
  } else { b.classList.add('safe'); tone(660, .08, 'sine', .05); vibrate(15); rrStatus(); }
}
document.querySelectorAll('[data-step]').forEach(function (b) {
  b.onclick = function () {
    var d = +b.dataset.d;
    if (b.dataset.step === 'slots') cfg.slots = Math.min(24, Math.max(3, cfg.slots + d)); else cfg.hits = Math.min(5, Math.max(1, cfg.hits + d));
    if (cfg.hits >= cfg.slots) cfg.hits = cfg.slots - 1; store.set('rr', cfg); rrNew();
  };
});
$('rrReset').onclick = rrNew; rrNew();

/* ---------- shop ---------- */
$('iHours').textContent = C.openTime + ' – ' + C.closeTime;
$('iClosed').textContent = C.closedLabel;
$('iAddr').innerHTML = esc(C.address).replace(' 大阪府', '<br>大阪府').replace(' 宝山', '<br>宝山');
var L = [{ h: mapsUrl, i: ICON.map, t: 'Googleマップで開く' }, { h: C.instagram, i: ICON.ig, t: 'Instagram @lani.osaka' }];
if (C.lineUrl) L.push({ h: C.lineUrl, i: ICON.line, t: '公式LINE 友だち追加' });
if (C.phone) L.push({ h: 'tel:' + C.phone.replace(/[^0-9+]/g, ''), i: ICON.tel, t: '電話する ' + C.phone });
L.push({ h: C.website, i: ICON.web, t: '公式Webサイト' });
$('links').innerHTML = L.map(function (x) { return '<a href="' + esc(x.h) + '" target="_blank" rel="noopener">' + x.i + esc(x.t) + '<span>›</span></a>'; }).join('');
$('privacyLink').href = C.website + 'privacy.html'; $('privacyLink').target = '_blank';

/* fonts loaded → redraw wheel */
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { drawWheel(rot); });
})();
