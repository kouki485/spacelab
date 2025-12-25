# 合同会社Space Lab コーポレートサイト

「宇宙と自然の調和」をテーマにした、合同会社Space Labの企業サイトです。

## 📁 ファイル構成

```
spacelab/
├── index.html          # トップページ
├── business.html       # 事業紹介ページ
├── company.html        # 会社概要ページ
├── contact.html        # お問い合わせページ
├── page5.html          # サービス（準備中）
├── page6.html          # ブログ（準備中）
├── css/
│   ├── variables.css   # CSS変数定義
│   ├── common.css      # 共通スタイル
│   └── responsive.css  # レスポンシブ対応
├── js/
│   ├── main.js         # 共通JavaScript
│   └── form-validation.js  # フォームバリデーション
├── images/             # 画像ファイル格納フォルダ
└── README.md           # このファイル
```

## 🎨 デザインコンセプト

### Cosmic Nature - 宇宙と自然の調和

- **宇宙の神秘性**: 深淵、無限、探求
- **自然の生命力**: 成長、循環、調和
- **先端科学の革新性**: 精密、未来、知性

### カラーパレット

| 名称 | カラーコード | 用途 |
|------|-------------|------|
| ディープスペースブルー | `#0A0E27` | メイン背景 |
| フォレストグリーン | `#1B4332` | セカンダリ |
| コズミックブルー | `#4A9EFF` | アクセント |
| オーガニックグリーン | `#2D6A4F` | サブカラー |
| ライトミント | `#95D5B2` | サブカラー |
| ミスティックパープル | `#B8A7E8` | サブカラー |
| スターゴールド | `#FFD700` | 極少使用 |

### タイポグラフィ

| 用途 | フォント |
|------|----------|
| 見出し | Orbitron |
| 本文（日本語） | Noto Sans JP |
| 英数字 | Roboto |

## 🚀 セットアップ

### 必要条件

- モダンブラウザ（Chrome, Firefox, Safari, Edge の最新2バージョン）
- ローカルサーバー（推奨）

### 起動方法

1. プロジェクトをダウンロード/クローン
2. ローカルサーバーで起動

```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合（npx使用）
npx serve

# VS Codeの場合
# Live Server拡張機能を使用
```

3. ブラウザで `http://localhost:8000` にアクセス

## 📝 カスタマイズガイド

### カラーの変更

`css/variables.css` でCSS変数を編集してください：

```css
:root {
  --color-primary: #0A0E27;    /* メインカラーを変更 */
  --color-accent: #4A9EFF;     /* アクセントカラーを変更 */
  /* ... */
}
```

### 会社情報の更新

各HTMLファイルのプレースホルダー部分を実際の情報に置き換えてください：

- `company.html`: 設立日、代表者名、所在地、資本金など
- `contact.html`: メールアドレス、所在地、営業時間

### 新規ページの追加

1. 既存のHTMLファイル（例：`page5.html`）をコピー
2. ファイル名を変更
3. 各ページのナビゲーションリンクを更新
4. コンテンツを編集

### 画像の追加

1. 画像を `images/` フォルダに配置
2. HTMLの `img` タグで参照
3. WebP形式を推奨（軽量化のため）

```html
<img src="images/your-image.webp" 
     alt="画像の説明" 
     loading="lazy">
```

## ⚡ パフォーマンス最適化

### 実装済みの最適化

- 画像の遅延読み込み（`loading="lazy"`）
- CSS/JSファイルの分割
- スクロールイベントのスロットル/デバウンス
- アニメーション軽減設定への対応（`prefers-reduced-motion`）

### 本番環境向けの追加推奨事項

1. **CSS/JSの最小化**
   ```bash
   # CSSの最小化
   npx cssnano common.css common.min.css
   
   # JSの最小化
   npx terser main.js -o main.min.js
   ```

2. **画像の最適化**
   - WebP形式への変換
   - 適切なサイズへのリサイズ
   - 画像圧縮ツールの使用

3. **キャッシュの設定**
   - サーバー側でCache-Controlヘッダーを設定

## ♿ アクセシビリティ

- セマンティックHTMLの使用
- ARIA属性の適切な設定
- キーボードナビゲーション対応
- フォーカス状態の明示
- コントラスト比の確保
- `prefers-reduced-motion` への対応

## 🌐 ブラウザ対応

| ブラウザ | 対応バージョン |
|----------|---------------|
| Chrome | 最新2バージョン |
| Firefox | 最新2バージョン |
| Safari | 最新2バージョン |
| Edge | 最新2バージョン |

## 📚 使用技術・ライブラリ

- **HTML5**: セマンティックマークアップ
- **CSS3**: カスタムプロパティ、Flexbox、Grid、アニメーション
- **JavaScript (ES6+)**: Vanilla JS（フレームワーク未使用）
- **Google Fonts**: Orbitron, Noto Sans JP, Roboto

※ 外部ライブラリは使用していません（すべてネイティブ実装）

## 📧 お問い合わせフォームについて

現在のお問い合わせフォームはフロントエンドのみの実装です。
実際に機能させるには、以下のいずれかの対応が必要です：

1. **バックエンドAPIの実装**
   - Node.js, PHP, Python等でメール送信処理を実装
   - `form-validation.js` の `submitForm()` メソッドを修正

2. **外部サービスの利用**
   - Formspree
   - Netlify Forms
   - Google Forms
   などのサービスと連携

## 🔧 トラブルシューティング

### ローディング画面が消えない
- JavaScriptが正しく読み込まれているか確認
- ブラウザのコンソールでエラーをチェック

### スタイルが適用されない
- CSSファイルのパスが正しいか確認
- ブラウザのキャッシュをクリア

### フォントが表示されない
- インターネット接続を確認（Google Fonts使用のため）
- フォールバックフォントは自動適用

## 📄 ライセンス

© 2024 Space Lab LLC. All rights reserved.

---

制作: [制作者名/会社名]

