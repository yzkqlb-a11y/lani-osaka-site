# Lani OSAKA 公式アプリ

ホーム／メニュー／スタンプカード／パーティーゲーム／店舗情報 をまとめたアプリです。
iPhone（App Store）と Android（Google Play）の両方に出せます。

- アプリの中身 … `www/`（`index.html`・`app.js`）
- **お店の情報・お知らせ・スタンプ設定** … `www/config.js`（ふだん直すのはここだけ）
- アイコン・起動画面の元画像 … `assets/`

ブラウザで試す：https://yzkqlb-a11y.github.io/lani-osaka-site/app/www/

---

## 公開前に必ず決めること（config.js）

| 項目 | 今の値 | 説明 |
|---|---|---|
| `staffPin` | `2580`（仮） | スタッフがスタンプを押すときの4桁の暗証番号。**必ず変更** |
| `stampReward` | シーシャ1台無料（仮） | 10個たまったときの特典 |
| `stampGoal` | 10 | 何個で特典か |
| `lineUrl` | 空 | 公式LINEの友だち追加URL（入れるとボタンが出る） |
| `phone` | 空 | 電話番号（入れると電話ボタンが出る） |

---

## ストアに出すまでの流れ（MacBookで作業）

### 1. アカウント登録（最初だけ）
- **Apple Developer Program**：https://developer.apple.com/programs/enroll/ （年会費 99ドル）
  - iPhoneの「Apple Developer」アプリからも登録できます
- **Google Play Console**：https://play.google.com/console/signup （登録料 25ドル・1回のみ）
  - 個人アカウントは、本番公開の前に「12人以上のテスターで14日間のテスト」が必要です

### 2. Macにソフトを入れる（最初だけ）
- **Xcode**（Mac App Storeから無料）
- **Node.js**（https://nodejs.org の「LTS」）
- **Android Studio**（https://developer.android.com/studio）※Androidを出すとき

### 3. アプリのプロジェクトを作る（最初だけ）
「ターミナル」アプリを開いて、下の3行を順番に貼り付けて実行：

```
git clone https://github.com/yzkqlb-a11y/lani-osaka-site.git
cd lani-osaka-site/app
sh setup.sh
```

### 4. iPhone版を提出
1. `npm run ios` を実行 → Xcodeが開く
2. 左の「App」→「Signing & Capabilities」→ **Team** で自分のAppleアカウントを選ぶ
3. iPhoneをMacにつないで ▶ ボタンで実機テスト
4. メニュー「Product」→「Archive」→「Distribute App」→「App Store Connect」でアップロード
5. https://appstoreconnect.apple.com で「新規App」を作り、下の「ストア掲載情報」を入力して審査に提出

### 5. Android版を提出
1. `npm run android` を実行 → Android Studioが開く
2. メニュー「Build」→「Generate Signed App Bundle」で `.aab` を作成（作った鍵ファイルは絶対になくさない）
3. Play Consoleでアプリを作成してアップロード

### 内容を更新したとき
`www/` を変更したら、ターミナルで `cd lani-osaka-site/app && git pull && npx cap sync` → 再度アップロード。
（アプリ版は審査を通るまで反映されません）

---

## ストア掲載情報（コピペ用）

**アプリ名**：Lani OSAKA
**サブタイトル**：心斎橋のシーシャ＆アミューズメントラウンジ
**カテゴリ**：フード／ドリンク（サブ：ライフスタイル）
**年齢区分**：18+（アルコールへの言及があるため）

**説明文**
```
大阪・心斎橋のシーシャ＆アミューズメントラウンジ「Lani OSAKA」の公式アプリです。

南国 × アミューズメント × 少し非日常。
グリーンの壁とネオンに囲まれた空間で、100種類以上のフレーバーから選べるシーシャ、ダーツ、カラオケをお楽しみいただけます。

■ スタンプカード
ご来店ごとにスタンプが貯まり、10個で特典をプレゼント。

■ パーティーゲーム
ルーレット・お題カード・ロシアンルーレットで、みんなで盛り上がれます。

■ メニュー・料金
シーシャ、飲み放題プラン、ドリンク、フードをいつでも確認できます。

■ 店舗情報
営業時間、営業中かどうか、地図、Instagramへのリンク。

営業時間：20:00〜5:00（日曜定休）
※20歳未満の方はご利用いただけません。
```

**キーワード**：シーシャ,水タバコ,心斎橋,大阪,バー,ラウンジ,ダーツ,カラオケ,スタンプカード,飲みゲーム
**サポートURL**：https://yzkqlb-a11y.github.io/lani-osaka-site/
**プライバシーポリシーURL**：https://yzkqlb-a11y.github.io/lani-osaka-site/privacy.html
**Appのプライバシー**：「データを収集しない」

**審査メモ（App Review Information に記入）**
```
This is the official app of Lani OSAKA, a shisha lounge in Osaka, Japan.
The stamp card is stamped by our staff in the shop using a 4-digit staff PIN.
For review, please use PIN: ____ (the staffPin value in config.js).
The party games are for fun among adult customers; penalties can be done with soft drinks.
```
