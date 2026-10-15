#!/bin/sh
# Lani OSAKA アプリ 初回セットアップ（MacBookで1回だけ実行）
set -e
cd "$(dirname "$0")"
echo "▶ 必要な部品をインストール中…"
npm install
[ -d ios ] || npx cap add ios
[ -d android ] || npx cap add android
echo "▶ アイコンと起動画面を作成中…"
npx capacitor-assets generate --iconBackgroundColor '#0b0b0a' --iconBackgroundColorDark '#0b0b0a' --splashBackgroundColor '#0b0b0a' --splashBackgroundColorDark '#0b0b0a'
npx cap sync
echo ""
echo "✅ 完了！ 次は  npm run ios  でXcodeを開いてください。"
