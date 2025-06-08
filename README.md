# tomoπgraphy - PixelVision Gallery

A modern pixel art gallery website with cyberpunk aesthetics and powerful upload management tools.

サイバーパンク美学と強力なアップロード管理ツールを備えたモダンなピクセルアートギャラリーサイト

## ✨ Features

- **Random Display**: Homepage shows random artwork with navigation
- **Chronological Gallery**: Time-based thumbnail view organized by year  
- **Dual View Modes**: Toggle between standard and compact layouts
- **Interactive Modal**: Full-screen viewer with keyboard navigation
- **Responsive Design**: Mobile-optimized for all devices
- **S3 Integration**: Cloud storage with automatic optimization
- **Command-Line Tools**: Simple upload scripts for batch operations

## 🎯 Live Demo

Visit: [https://tomo3141592653.github.io/tomopigraphy/](https://tomo3141592653.github.io/tomopigraphy/)

## 🚀 Quick Setup

### Prerequisites
- Node.js 14.0.0+ 
- AWS Account
- Git

### 1. Install

```bash
git clone https://github.com/tomo3141592653/tomopigraphy.git
cd tomopigraphy
npm install
npm run setup
```

### 2. Configure AWS

**Create S3 Bucket:**
```bash
# Install AWS CLI and configure with your credentials
aws configure

# Create your bucket (replace YOUR-BUCKET-NAME)
aws s3 mb s3://YOUR-BUCKET-NAME

# Set public read policy
aws s3api put-bucket-policy --bucket YOUR-BUCKET-NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*", 
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
  }]
}'
```

**Update Configuration:**

Edit `config/config.json`:
```json
{
  "s3": {
    "bucket": "YOUR-BUCKET-NAME",
    "region": "YOUR-AWS-REGION", 
    "cdnDomain": "https://YOUR-BUCKET-NAME.s3.YOUR-AWS-REGION.amazonaws.com"
  }
}
```

### 3. Start Development

```bash
npm run dev
# Opens at http://localhost:8000
```

## 📸 Upload Images

**Single Image:**
```bash
npm run upload ./image.jpg -- --title "My Artwork"
```

**Batch Upload:**
```bash
npm run batch-upload ./artwork-folder/
```

**Deploy Changes:**
```bash
npm run deploy
```

## 🏗️ Project Structure

```
tomopigraphy/
├── docs/                 # Website files (GitHub Pages)
│   ├── index.html       # Main gallery page
│   ├── js/gallery.js    # Gallery functionality
│   └── data/artworks.json # Artwork metadata
├── scripts/             # Upload tools
│   ├── upload.js        # Single image uploader
│   ├── batch-upload.js  # Batch uploader
│   └── setup.js         # Initial setup
├── config/
│   └── config.json      # S3 and site settings
└── package.json         # Dependencies and scripts
```

## ⚙️ Configuration

### AWS Setup Guide

1. **Create AWS Account** at [aws.amazon.com](https://aws.amazon.com)
2. **Create IAM User** (recommended for security):
   - Go to IAM → Users → Create User
   - Enable "Access key - Programmatic access"
   - Attach policy: `AmazonS3FullAccess` 
   - Save access key and secret key
3. **Configure AWS CLI**:
   ```bash
   aws configure
   # Enter your access key, secret key, and region
   ```

### S3 Bucket Setup

Choose your bucket name and AWS region:
- **Bucket naming**: Use lowercase, no spaces (e.g., `my-gallery-2025`)
- **Common regions**: 
  - `us-east-1` (Virginia) - cheapest
  - `ap-northeast-1` (Tokyo) - for Japan
  - `eu-west-1` (Ireland) - for Europe

Enable public access in AWS Console:
1. Go to S3 → Your Bucket → Permissions
2. Edit "Block all public access" → Uncheck all boxes
3. Confirm the changes

### Site Customization

Update `config/config.json`:
```json
{
  "site": {
    "title": "Your Gallery Name",
    "description": "Your gallery description",
    "author": "Your Name"
  },
  "image": {
    "webpQuality": 80,
    "jpegQuality": 90
  }
}
```

## 🔧 Commands Reference

```bash
# Development
npm run dev              # Start local server
npm run setup           # Initial project setup

# Upload
npm run upload FILE     # Upload single image
npm run batch-upload DIR # Upload folder
npm run deploy          # Deploy to GitHub Pages

# Advanced upload options
npm run upload FILE -- --title "Title" --description "Description"
npm run upload FILE -- --use-file-date  # Use file date instead of upload date
npm run batch-upload DIR --dry-run      # Preview upload without executing
```

## 💰 AWS Costs (Estimate)

- **Storage**: ~$0.025/GB/month
- **Requests**: ~$0.0004/1000 uploads
- **Data Transfer**: First 1GB/month free

**Example**: 1000 images (~5GB) ≈ $1.25/month

## 🛠️ Troubleshooting

### Windows/WSL2 Issues
If you encounter build errors on Windows:
```bash
sudo apt-get update
sudo apt-get install -y build-essential python3 libvips-dev
rm -rf node_modules package-lock.json
npm install --os=linux --cpu=x64 sharp@0.34.2
npm install
```

### Common Issues
- **AWS credentials**: Run `aws configure` to set up authentication
- **Bucket access**: Ensure public read policy is applied
- **Node.js version**: Use Node.js 14.0.0 or higher

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

All artwork and images are protected by copyright and belong to the site owner.