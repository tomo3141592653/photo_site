# tomoπgraphy - フォトギャラリー

A beautiful, modern photo gallery website with powerful upload management tools.

## ✨ Features

### 🎨 Gallery Features
- **Random Display**: Homepage shows random artwork with "next" button navigation
- **Chronological Gallery**: Time-based thumbnail view with year organization
- **Dual View Modes**: Toggle between standard and compact thumbnail layouts
- **Interactive Modal**: Full-screen artwork viewer with keyboard navigation
- **Responsive Design**: Mobile-optimized for all devices

### 🚀 Technical Features
- **S3 Integration**: Seamless cloud storage with AWS S3
- **Automatic Optimization**: Generates thumbnails and WebP formats
- **Command-Line Tools**: Simple upload scripts for batch operations
- **GitHub Pages Ready**: Static site deployment
- **Modern UI**: Cyberpunk-inspired design with pixel animations

## 🎯 Live Demo

Visit the live gallery at: `https://tomo3141592653.github.io/photo_site`

## 📦 Quick Setup

### Prerequisites
- Node.js 14.0.0+
- AWS Account (for image hosting)
- Git

### WSL2環境でのセットアップ（Windowsの場合）
```bash
# 必要なビルドツールをインストール
sudo apt-get update
sudo apt-get install -y build-essential python3 libvips-dev

# 既存のnode_modulesを削除
rm -rf node_modules package-lock.json

# sharpモジュールを特定のプラットフォーム用にインストール
npm install --os=linux --cpu=x64 sharp@0.34.2

# 残りの依存関係をインストール
npm install

# xmlbuilderモジュールを最新版に更新
npm install xmlbuilder@latest
```

### 1. Clone & Install
```bash
git clone https://github.com/tomo3141592653/tomopixel.git
cd tomopigraphy
npm install
npm run setup
```

### 2. Configure AWS
```bash
# AWSアカウントの作成
# 1. https://aws.amazon.com/jp/ にアクセス
# 2. 「アカウントを作成」をクリック
# 3. メールアドレス、パスワード、アカウント名を入力
# 4. 連絡先情報を入力
# 5. 支払い情報を入力（クレジットカードが必要）
# 6. 本人確認（電話番号の確認）
# 7. サポートプランの選択（無料プランでOK）

# 注意: IAMユーザーの作成（セキュリティのベストプラクティス）
# 1. AWSマネジメントコンソールで「IAM」を開く
# 2. 「ユーザー」→「ユーザーを作成」を選択
# 3. ユーザー名を入力（例：gallery-admin）
# 4. 「アクセスキー - プログラムによるアクセス」にチェック
# 5. 必要な権限を付与：
#    - AmazonS3FullAccess
# 6. 作成したアクセスキーとシークレットキーを保存

# Install AWS CLI
aws configure
# Enter your AWS credentials

# Create S3 bucket
aws s3 mb s3://tomo3141592653-gallery

# 注意: S3バケットのパブリックアクセス設定
# 1. AWSマネジメントコンソールでS3バケットを開く
# 2. 「アクセス許可」タブを選択
# 3. 「パブリックアクセスをすべてブロック」の設定を編集
# 4. 以下の設定をオフにする：
#    - 「パブリックアクセスをすべてブロック」
#    - 「パブリックアクセスをブロックする新しいACL」
#    - 「パブリックアクセスをブロックする新しいパブリックバケットポリシー」
#    - 「パブリックアクセスをブロックするパブリックバケットポリシー」

# Set public read permissions
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

### 3. Update Configuration
Edit `config/config.json`:
```json
{
  "s3": {
    "bucket": "tomo3141592653-gallery",
    "region": "ap-northeast-1",
    "cdnDomain": "https://tomo3141592653-gallery.s3.ap-northeast-1.amazonaws.com"
  }
}
```

### 4. Start Development
```bash
npm run dev
# Opens at http://localhost:8000
```

## 📸 Upload Images

### Single Image Upload
```bash
# Basic upload
npm run upload ./my-artwork.png

# With title
npm run upload ./my-artwork.png -- --title "夕暮れの街角"

# With title and description
npm run upload ./my-artwork.png -- --title "夕暮れの街角" --description "美しい夕暮れの風景"

# Use file modification date instead of upload date
npm run upload ./my-artwork.png -- --use-file-date
```

### Batch Upload
```bash
# Upload entire folder
npm run batch-upload ./artwork-folder/

# Preview what would be uploaded (dry run)
npm run batch-upload ./artwork-folder/ --dry-run

# Use file modification dates instead of upload dates
npm run batch-upload ./artwork-folder/ --use-file-date
```

### Deploy Changes
```bash
npm run deploy
# Commits and pushes to GitHub
```

## 🏗️ Project Structure

```
photo_site/
├── docs/                    # Website files (GitHub Pages)
│   ├── index.html          # Main gallery page
│   ├── js/
│   │   └── gallery.js      # Gallery functionality
│   └── data/
│       └── artworks.json   # Artwork metadata
├── scripts/                # Upload tools
│   ├── upload.js          # Single image uploader
│   ├── batch-upload.js    # Batch uploader
│   └── setup.js           # Initial setup
├── config/
│   └── config.json        # Configuration
└── package.json           # Dependencies and scripts
```

## 🎮 Usage

### Navigation
- **About Page**: Random artwork display
  - Click "次の作品を見る" for next random image
  - Use spacebar or arrow keys for keyboard navigation
  
- **Gallery Page**: Chronological view
  - Toggle "標準表示" / "コンパクト表示" for different thumbnail sizes
  - Click any artwork to open modal viewer
  - Use arrow keys in modal for navigation

### Daily Workflow
```bash
# 1. Add new artwork
npm run upload ./new-art.jpg -- --title "New Creation"

# 2. Check locally
npm run dev

# 3. Deploy to live site
npm run deploy
```

## 🎨 Customization

### Design Themes
The current design features:
- **Cyberpunk aesthetic** with green gradients
- **Floating pixel bird** logo animation  
- **Glass morphism** effects
- **Dynamic pixel patterns**

### Modify Colors
Edit the CSS variables in `docs/index.html`:
```css
/* Change primary colors */
--primary: #00ff88;
--secondary: #88ff00;
--accent: #ffff00;
```

### Site Configuration
Update `config/config.json`:
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

## 🔧 Advanced Features

### Image Processing
- **Automatic thumbnails**: 300px max dimension
- **WebP conversion**: Modern format for faster loading
- **Quality optimization**: Configurable compression
- **Metadata preservation**: EXIF data handling

### AWS Cost Optimization
- **CDN integration**: CloudFront support ready
- **Intelligent tiering**: S3 storage class optimization
- **Lifecycle policies**: Automatic archiving

### SEO Ready
- **Meta tags**: Proper social media cards
- **Structured data**: Gallery schema markup
- **Performance**: Lazy loading and caching

## 📊 Analytics & Monitoring

### View Statistics
```bash
# Check S3 usage
aws s3api list-objects-v2 --bucket your-bucket-name --query 'length(Contents)'

# Monitor costs
# Visit AWS Billing Dashboard
```

### Performance Monitoring
- **Lighthouse scores**: Built-in optimization
- **Core Web Vitals**: Mobile-first design
- **Loading speeds**: Optimized image delivery

## 🚨 Troubleshooting

### Common Issues

**AWS Permission Errors**
```bash
aws configure list  # Check credentials
aws s3 ls s3://your-bucket-name  # Test access
```

**Upload Failures**
```bash
# Check file format
file your-image.png

# Verify Node.js version
node --version  # Should be 14+
```

**Missing Dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset Gallery
```bash
# Clear all artworks (careful!)
echo '{"artworks":[],"totalCount":0,"lastUpdated":null}' > docs/data/artworks.json
```

## 💰 Cost Estimation

### AWS S3 Costs (Tokyo Region)
- **Storage**: ~$0.025/GB/month
- **Requests**: ~$0.0004/1000 PUT requests
- **Data Transfer**: Free for first 1GB/month

**Example**: 1000 images (~5GB) = ~$1.25/month

### GitHub Pages
- **Hosting**: Free for public repositories
- **Bandwidth**: 100GB/month soft limit

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Japanese pixel art aesthetics
- Built with modern web technologies
- Optimized for artist workflows

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/photo_site/issues)
- **Documentation**: This README
- **Examples**: Check `docs/data/artworks.json` for sample data structure

---

Made with ❤️ for the pixel art community