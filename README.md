# tomoπgraphy - Photo Gallery / フォトギャラリー

A beautiful, modern photo gallery website with powerful upload management tools.

美しくモダンなフォトギャラリーウェブサイトと強力なアップロード管理ツール

## ✨ Features / 機能

### 🎨 Gallery Features / ギャラリー機能
- **Random Display**: Homepage shows random artwork with "next" button navigation
  - **ランダム表示**: ホームページでランダムな作品を「次へ」ボタンナビゲーションで表示
- **Chronological Gallery**: Time-based thumbnail view with year organization
  - **時系列ギャラリー**: 年別に整理された時系列サムネイル表示
- **Dual View Modes**: Toggle between standard and compact thumbnail layouts
  - **2つの表示モード**: 標準とコンパクトサムネイルレイアウトの切り替え
- **Interactive Modal**: Full-screen artwork viewer with keyboard navigation
  - **インタラクティブモーダル**: キーボードナビゲーション付きフルスクリーン作品ビューア
- **Responsive Design**: Mobile-optimized for all devices
  - **レスポンシブデザイン**: 全デバイス対応のモバイル最適化

### 🚀 Technical Features / 技術的機能
- **S3 Integration**: Seamless cloud storage with AWS S3
  - **S3統合**: AWS S3とのシームレスなクラウドストレージ
- **Automatic Optimization**: Generates thumbnails and WebP formats
  - **自動最適化**: サムネイルとWebP形式の自動生成
- **Command-Line Tools**: Simple upload scripts for batch operations
  - **コマンドラインツール**: バッチ操作用のシンプルなアップロードスクリプト
- **GitHub Pages Ready**: Static site deployment
  - **GitHub Pages対応**: 静的サイトデプロイメント
- **Modern UI**: Cyberpunk-inspired design with pixel animations
  - **モダンUI**: ピクセルアニメーション付きサイバーパンク風デザイン

## 🎯 Live Demo / ライブデモ

Visit the live gallery at: `https://tomo3141592653.github.io/tomopigraphy/`

ライブギャラリーはこちら: `https://tomo3141592653.github.io/tomopigraphy/`

## 📦 Quick Setup / クイックセットアップ

### Prerequisites / 前提条件
- Node.js 14.0.0+
- AWS Account (for image hosting) / AWS アカウント（画像ホスティング用）
- Git

### WSL2 Environment Setup (Windows) / WSL2環境でのセットアップ（Windows の場合）
```bash
# Install required build tools / 必要なビルドツールをインストール
sudo apt-get update
sudo apt-get install -y build-essential python3 libvips-dev

# Remove existing node_modules / 既存のnode_modulesを削除
rm -rf node_modules package-lock.json

# Install sharp module for specific platform / sharpモジュールを特定のプラットフォーム用にインストール
npm install --os=linux --cpu=x64 sharp@0.34.2

# Install remaining dependencies / 残りの依存関係をインストール
npm install

# Update xmlbuilder module to latest version / xmlbuilderモジュールを最新版に更新
npm install xmlbuilder@latest
```

### 1. Clone & Install / クローンとインストール
```bash
git clone https://github.com/tomo3141592653/tomopixel.git
cd tomopigraphy
npm install
npm run setup
```

### 2. Configure AWS / AWS設定
```bash
# Creating AWS Account / AWSアカウントの作成
# 1. Access https://aws.amazon.com/jp/ / 1. https://aws.amazon.com/jp/ にアクセス
# 2. Click "Create Account" / 2. 「アカウントを作成」をクリック
# 3. Enter email, password, account name / 3. メールアドレス、パスワード、アカウント名を入力
# 4. Enter contact information / 4. 連絡先情報を入力
# 5. Enter payment information (credit card required) / 5. 支払い情報を入力（クレジットカードが必要）
# 6. Identity verification (phone number verification) / 6. 本人確認（電話番号の確認）
# 7. Select support plan (free plan is OK) / 7. サポートプランの選択（無料プランでOK）

# Note: Create IAM User (security best practice) / 注意: IAMユーザーの作成（セキュリティのベストプラクティス）
# 1. Open "IAM" in AWS Management Console / 1. AWSマネジメントコンソールで「IAM」を開く
# 2. Select "Users" → "Create User" / 2. 「ユーザー」→「ユーザーを作成」を選択
# 3. Enter username (e.g., gallery-admin) / 3. ユーザー名を入力（例：gallery-admin）
# 4. Check "Access key - Programmatic access" / 4. 「アクセスキー - プログラムによるアクセス」にチェック
# 5. Grant necessary permissions: / 5. 必要な権限を付与：
#    - AmazonS3FullAccess
# 6. Save the created access key and secret key / 6. 作成したアクセスキーとシークレットキーを保存

# Install AWS CLI / AWS CLI をインストール
aws configure
# Enter your AWS credentials / AWS認証情報を入力

# Create S3 bucket / S3バケットを作成
aws s3 mb s3://tomo3141592653-gallery

# Note: S3 Bucket Public Access Settings / 注意: S3バケットのパブリックアクセス設定
# 1. Open S3 bucket in AWS Management Console / 1. AWSマネジメントコンソールでS3バケットを開く
# 2. Select "Permissions" tab / 2. 「アクセス許可」タブを選択
# 3. Edit "Block all public access" settings / 3. 「パブリックアクセスをすべてブロック」の設定を編集
# 4. Turn off the following settings: / 4. 以下の設定をオフにする：
#    - "Block all public access" / 「パブリックアクセスをすべてブロック」
#    - "Block new ACLs for public access" / 「パブリックアクセスをブロックする新しいACL」
#    - "Block new public bucket policies" / 「パブリックアクセスをブロックする新しいパブリックバケットポリシー」
#    - "Block public bucket policies" / 「パブリックアクセスをブロックするパブリックバケットポリシー」

# Set public read permissions / パブリック読み取り権限を設定
aws s3api put-bucket-policy --bucket tomo3141592653-gallery --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow", 
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::tomo3141592653-gallery/*"
    }
  ]
}'
```

### 3. Update Configuration / 設定を更新
Edit `config/config.json` / `config/config.json` を編集:
```json
{
  "s3": {
    "bucket": "tomo3141592653-gallery",
    "region": "ap-northeast-1",
    "cdnDomain": "https://tomo3141592653-gallery.s3.ap-northeast-1.amazonaws.com"
  }
}
```

### 4. Start Development / 開発開始
```bash
npm run dev
# Opens at http://localhost:8000 / http://localhost:8000 で開きます
```

## 🔧 Setup Script / セットアップスクリプト

### About setup.js / setup.js について

The `setup.js` script automates the initial setup process for tomoπgraphy Gallery.

`setup.js` は tomoπgraphy ギャラリーの初期セットアップを自動化するスクリプトです。

### Features / 機能
- **Environment Check**: Validates Node.js version (14.0.0+ required)
  - **環境チェック**: Node.js バージョンの確認（14.0.0+必須）
- **Directory Creation**: Creates necessary folder structure
  - **ディレクトリ作成**: 必要なフォルダ構造の作成
- **Data Initialization**: Sets up empty `artworks.json` file
  - **データ初期化**: 空の `artworks.json` ファイルのセットアップ
- **Configuration Check**: Validates S3 settings in config file
  - **設定確認**: 設定ファイル内のS3設定の検証
- **Dependencies Installation**: Automatically runs `npm install`
  - **依存関係インストール**: `npm install` の自動実行
- **Next Steps Guide**: Shows what to do after setup
  - **次ステップガイド**: セットアップ後の手順を表示

### Usage / 使用方法
```bash
# Run setup script / セットアップスクリプトを実行
npm run setup

# Or run directly / または直接実行
node scripts/setup.js
```

### Process Flow / 実行される処理
1. **Node.js Version Check** → Ensures Node.js 14.0.0+ / Node.js 14.0.0+ の確認
2. **Directory Creation** → Creates `docs/`, `scripts/`, `config/` folders / 必要なフォルダの作成
3. **Data Initialization** → Initializes `docs/data/artworks.json` / `artworks.json` の初期化
4. **Config Check** → Validates `config/config.json` settings / 設定ファイルの確認
5. **Dependencies Install** → Runs `npm install` automatically / `npm install` の自動実行
6. **Next Steps Display** → Shows setup completion and next actions / 次のステップの表示

### Output Example / 出力例
```
🚀 tomoπgraphy Gallery Setup Starting... / tomoπgraphy ギャラリーセットアップを開始します...

📋 Node.js Version / Node.js バージョン: v18.17.0
✅ Node.js Version OK / Node.js バージョン OK

📁 Creating directory structure... / ディレクトリ構造を作成中...
  ✅ Exists / 存在: docs/css
  ✅ Exists / 存在: docs/js
  ✅ Exists / 存在: docs/data
  📂 Created / 作成: scripts
  📂 Created / 作成: config
✅ Directory Structure OK / ディレクトリ構造 OK

🎨 Initializing artwork data... / アートワークデータを初期化中...
  📄 Created artworks.json / artworks.json を作成しました
✅ Artwork Data OK / アートワークデータ OK

⚙️  Checking configuration... / 設定ファイルをチェック中...
⚠️  Please update S3 bucket name / S3バケット名を更新してください

📦 Installing dependencies... / 依存関係をインストール中...
✅ Dependencies installed / 依存関係インストール完了

🎉 Setup Complete! / セットアップ完了!
```

## 📸 Upload Images / 画像のアップロード

### Single Image Upload / 単一画像アップロード
```bash
# Basic upload / 基本アップロード
npm run upload ./my-artwork.png

# With title / タイトル付き
npm run upload ./my-artwork.png -- --title "夕暮れの街角"

# With title and description / タイトルと説明付き
npm run upload ./my-artwork.png -- --title "夕暮れの街角" --description "美しい夕暮れの風景"

# Use file modification date instead of upload date / アップロード日の代わりにファイル変更日を使用
npm run upload ./my-artwork.png -- --use-file-date
```

### Batch Upload / バッチアップロード
```bash
# Upload entire folder / フォルダ全体をアップロード
npm run batch-upload ./artwork-folder/

# Preview what would be uploaded (dry run) / アップロード予定をプレビュー（ドライラン）
npm run batch-upload ./artwork-folder/ --dry-run

# Use file modification dates instead of upload dates / アップロード日の代わりにファイル変更日を使用
npm run batch-upload ./artwork-folder/ --use-file-date
```

### Deploy Changes / 変更をデプロイ
```bash
npm run deploy
# Commits and pushes to GitHub / GitHubにコミット・プッシュ
```

## 🏗️ Project Structure / プロジェクト構造

```
photo_site/
├── docs/                    # Website files (GitHub Pages) / ウェブサイトファイル（GitHub Pages）
│   ├── index.html          # Main gallery page / メインギャラリーページ
│   ├── js/
│   │   └── gallery.js      # Gallery functionality / ギャラリー機能
│   └── data/
│       └── artworks.json   # Artwork metadata / 作品メタデータ
├── scripts/                # Upload tools / アップロードツール
│   ├── upload.js          # Single image uploader / 単一画像アップローダー
│   ├── batch-upload.js    # Batch uploader / バッチアップローダー
│   └── setup.js           # Initial setup / 初期セットアップ
├── config/
│   └── config.json        # Configuration / 設定
└── package.json           # Dependencies and scripts / 依存関係とスクリプト
```

### Daily Workflow / 日常のワークフロー
```bash
# 1. Add new artwork / 1. 新しい作品を追加
npm run upload ./new-art.jpg -- --title "New Creation"

# 2. Check locally / 2. ローカルで確認
npm run dev

# 3. Deploy to live site / 3. ライブサイトにデプロイ
npm run deploy
```

### Site Configuration / サイト設定
Update `config/config.json` / `config/config.json` を更新:
```json
{
  "site": {
    "title": "Your Gallery Name",
    "description": "Your gallery description"
  },
  "image": {
    "webpQuality": 80,
    "jpegQuality": 90
  }
}
```

## 🔧 Advanced Features / 高度な機能

### Image Processing / 画像処理
- **Automatic thumbnails**: 300px max dimension
  - **自動サムネイル**: 最大300pxのサムネイル生成
- **WebP conversion**: Modern format for faster loading
  - **WebP変換**: 高速読み込み用のモダンフォーマット
- **Quality optimization**: Configurable compression
  - **品質最適化**: 設定可能な圧縮
- **Metadata preservation**: EXIF data handling
  - **メタデータ保持**: EXIFデータの処理

### AWS Cost Optimization / AWS コスト最適化
- **CDN integration**: CloudFront support ready
  - **CDN統合**: CloudFront対応準備完了
- **Intelligent tiering**: S3 storage class optimization
  - **インテリジェント階層化**: S3ストレージクラスの最適化
- **Lifecycle policies**: Automatic archiving
  - **ライフサイクルポリシー**: 自動アーカイブ

### Reset Gallery / ギャラリーリセット
```bash
# Clear all artworks (careful!) / 全作品をクリア（要注意！）
echo '{"artworks":[],"totalCount":0,"lastUpdated":null}' > docs/data/artworks.json
```

## 💰 Cost Estimation / コスト見積もり

### AWS S3 Costs (Tokyo Region) / AWS S3 コスト（東京リージョン）
- **Storage**: ~$0.025/GB/month
  - **ストレージ**: 約 $0.025/GB/月
- **Requests**: ~$0.0004/1000 PUT requests
  - **リクエスト**: 約 $0.0004/1000 PUT リクエスト
- **Data Transfer**: Free for first 1GB/month
  - **データ転送**: 最初の1GB/月は無料

**Example**: 1000 images (~5GB) = ~$1.25/month

**例**: 1000枚の画像（約5GB）= 約 $1.25/月

### GitHub Pages
- **Hosting**: Free for public repositories
  - **ホスティング**: パブリックリポジトリは無料
- **Bandwidth**: 100GB/month soft limit
  - **帯域幅**: 100GB/月のソフトリミット

## 📄 License / ライセンス

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

このプロジェクトはMITライセンスの下でライセンスされています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。
