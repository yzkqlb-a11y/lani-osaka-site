/*
 * Lani OSAKA アプリの設定ファイル
 * ここを書き換えるだけで、アプリの内容を変えられます。
 */
window.LANI_CONFIG = {
  // お店の情報
  shopName: 'Lani OSAKA',
  address: '〒542-0085 大阪府大阪市中央区心斎橋筋2丁目2-13 宝山心斎橋ビル 3F',
  openTime: '20:00',
  closeTime: '5:00',
  closedDays: [0],            // 定休日（0=日曜, 1=月曜 … 6=土曜）
  closedLabel: '日曜日',
  phone: '',                  // 例: '06-1234-5678'（空ならボタン非表示）

  // リンク
  instagram: 'https://www.instagram.com/lani.osaka/',
  lineUrl: '',                // 公式LINEの友だち追加URL（例: 'https://lin.ee/xxxxxx'）。空ならボタン非表示
  website: 'https://yzkqlb-a11y.github.io/lani-osaka-site/',

  // スタンプカード
  stampGoal: 10,              // 何個で特典か
  stampReward: 'シーシャ1台無料',   // 特典の内容（仮）
  staffPin: '2580',           // スタッフ用の暗証番号（4桁）。必ず変更してください

  // お知らせ（上から新しい順）
  news: [
    { date: '2026.10', title: 'Lani OSAKA 公式アプリができました！', body: '来店ごとにスタンプが貯まります。スタッフに画面を見せてください。' }
  ]
};
