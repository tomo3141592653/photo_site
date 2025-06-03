# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PixelVision Gallery - a modern pixel art gallery website with cyberpunk aesthetics and powerful upload management tools. The site features random artwork display, chronological galleries, and S3 integration for image hosting.

## Development Commands

```bash
# Install dependencies
npm install

# Setup project (run once)
npm run setup

# Start development server
npm run dev

# Upload single image
npm run upload ./image.jpg -- --title "Title"

# Upload folder of images
npm run batch-upload ./folder/

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Frontend
- **Static Site**: Pure HTML/CSS/JS hosted on GitHub Pages
- **Design**: Cyberpunk-inspired with green gradients and pixel animations
- **Features**: Random display, gallery with dual view modes, modal viewer

### Backend
- **Storage**: AWS S3 for image hosting
- **Processing**: Sharp.js for thumbnail generation and WebP conversion
- **Upload**: Node.js command-line tools

### Project Structure
```
docs/           # Website files (GitHub Pages)
├── index.html  # Main gallery page
├── js/         # JavaScript functionality
└── data/       # Artwork metadata JSON

scripts/        # Upload tools
├── upload.js   # Single image uploader
└── batch-upload.js # Batch uploader

config/         # Configuration files
└── config.json # S3 and site settings
```

## Key Files
- `docs/index.html` - Main gallery website
- `docs/js/gallery.js` - Gallery functionality
- `docs/data/artworks.json` - Artwork metadata
- `scripts/upload.js` - Image upload script
- `config/config.json` - Configuration settings