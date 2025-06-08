# tomoπgraphy - Photo Gallery

A modern pixel art gallery with cyberpunk aesthetics and S3 cloud storage.

美しくモダンなピクセルアートギャラリー

## Features

- Random artwork display with navigation
- Chronological gallery with year organization
- Responsive design for all devices
- AWS S3 integration for image hosting
- Automatic thumbnail and WebP generation
- Command-line upload tools

## Live Demo

Visit: `https://tomo3141592653.github.io/tomopigraphy/`

## Quick Setup

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
```bash
# Install AWS CLI and configure
aws configure
# Enter your AWS credentials

# Create S3 bucket (replace YOUR-BUCKET-NAME)
aws s3 mb s3://YOUR-BUCKET-NAME

# Set public read permissions
aws s3api put-bucket-policy --bucket YOUR-BUCKET-NAME --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow", 
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}'
```

### 3. Update Configuration
Edit `config/config.json`:
```json
{
  "s3": {
    "bucket": "YOUR-BUCKET-NAME",
    "region": "YOUR-REGION",
    "cdnDomain": "https://YOUR-BUCKET-NAME.s3.YOUR-REGION.amazonaws.com"
  }
}
```

### 4. Start Development
```bash
npm run dev
# Opens at http://localhost:8000
```

## Upload Images

### Single Image
```bash
npm run upload ./image.jpg -- --title "My Artwork"
```

### Batch Upload
```bash
npm run batch-upload ./folder/
```

### Deploy Changes
```bash
npm run deploy
```

## Project Structure

```
tomopigraphy/
├── docs/                   # Website files (GitHub Pages)
│   ├── index.html          # Main gallery page
│   ├── js/gallery.js       # Gallery functionality
│   └── data/artworks.json  # Artwork metadata
├── scripts/                # Upload tools
│   ├── upload.js           # Single image uploader
│   └── batch-upload.js     # Batch uploader
└── config/config.json      # Configuration
```

## Commands Reference

```bash
npm install         # Install dependencies
npm run setup       # Initial setup
npm run dev         # Start development server
npm run upload      # Upload single image
npm run batch-upload # Upload folder
npm run deploy      # Deploy to GitHub Pages
```

## Troubleshooting

### WSL2 Environment (Windows)
```bash
sudo apt-get update
sudo apt-get install -y build-essential python3 libvips-dev
rm -rf node_modules package-lock.json
npm install --os=linux --cpu=x64 sharp@0.34.2
npm install
```

### Reset Gallery
```bash
echo '{"artworks":[],"totalCount":0,"lastUpdated":null}' > docs/data/artworks.json
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
