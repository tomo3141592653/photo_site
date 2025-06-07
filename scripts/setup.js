#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GallerySetup {
    constructor() {
        this.configPath = path.join(__dirname, '../config/config.json');
        this.artworksPath = path.join(__dirname, '../docs/data/artworks.json');
    }

    async run() {
        console.log('🚀 tomoπgraphy Gallery Setup Starting... / tomoπgraphy ギャラリーセットアップを開始します...\n');

        try {
            // 1. Check Node.js version
            this.checkNodeVersion();

            // 2. Create directories
            this.createDirectories();

            // 3. Initialize artworks.json if it doesn't exist
            this.initializeArtworks();

            // 4. Check config
            this.checkConfig();

            // 5. Install dependencies
            this.installDependencies();

            // 6. Show next steps
            this.showNextSteps();

        } catch (error) {
            console.error('❌ Setup Error / セットアップエラー:', error.message);
            process.exit(1);
        }
    }

    checkNodeVersion() {
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
        
        console.log(`📋 Node.js Version / Node.js バージョン: ${nodeVersion}`);
        
        if (majorVersion < 14) {
            throw new Error('Node.js 14.0.0+ required / Node.js 14.0.0 以上が必要です');
        }
        
        console.log('✅ Node.js Version OK / Node.js バージョン OK\n');
    }

    createDirectories() {
        console.log('📁 Creating directory structure... / ディレクトリ構造を作成中...');
        
        const directories = [
            'docs/css',
            'docs/js', 
            'docs/data',
            'scripts',
            'config'
        ];

        directories.forEach(dir => {
            const fullPath = path.join(__dirname, '..', dir);
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`  📂 Created / 作成: ${dir}`);
            } else {
                console.log(`  ✅ Exists / 存在: ${dir}`);
            }
        });
        
        console.log('✅ Directory Structure OK / ディレクトリ構造 OK\n');
    }

    initializeArtworks() {
        console.log('🎨 Initializing artwork data... / アートワークデータを初期化中...');
        
        if (!fs.existsSync(this.artworksPath)) {
            const initialData = {
                artworks: [],
                totalCount: 0,
                lastUpdated: null
            };
            
            fs.writeFileSync(this.artworksPath, JSON.stringify(initialData, null, 2));
            console.log('  📄 Created artworks.json / artworks.json を作成しました');
        } else {
            console.log('  ✅ artworks.json already exists / artworks.json は既に存在します');
        }
        
        console.log('✅ Artwork Data OK / アートワークデータ OK\n');
    }

    checkConfig() {
        console.log('⚙️  Checking configuration... / 設定ファイルをチェック中...');
        
        if (!fs.existsSync(this.configPath)) {
            console.log('⚠️  config/config.json not found / config/config.json が見つかりません');
            console.log('   Default config file should be created / デフォルト設定ファイルが作成されています');
            console.log('   Please update S3 settings / S3設定を更新してください');
        } else {
            const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            
            if (config.s3 && (config.s3.bucket === 'your-gallery-bucket-name' || config.s3.bucket === 'tomo3141592653-gallery')) {
                console.log('⚠️  Please update S3 bucket name / S3バケット名を更新してください');
            } else {
                console.log('✅ Configuration OK / 設定ファイル OK');
            }
        }
        
        console.log('');
    }

    installDependencies() {
        console.log('📦 Installing dependencies... / 依存関係をインストール中...');
        
        try {
            execSync('npm install', { 
                stdio: ['inherit', 'inherit', 'inherit'],
                cwd: path.join(__dirname, '..')
            });
            console.log('✅ Dependencies installed / 依存関係インストール完了\n');
        } catch (error) {
            console.log('⚠️  Failed to install dependencies / 依存関係のインストールに失敗しました');
            console.log('   Please run `npm install` manually / 手動で `npm install` を実行してください\n');
        }
    }

    showNextSteps() {
        console.log('🎉 Setup Complete! / セットアップ完了!\n');
        console.log('📋 Next Steps / 次のステップ:');
        console.log('');
        console.log('1. AWS Configuration / AWS設定:');
        console.log('   aws configure');
        console.log('');
        console.log('2. Create S3 Bucket / S3バケット作成:');
        console.log('   aws s3 mb s3://tomo3141592653-gallery');
        console.log('');
        console.log('3. Edit config/config.json and update S3 settings');
        console.log('   config/config.json を編集してS3設定を更新');
        console.log('');
        console.log('4. Start Local Server / ローカルサーバー起動:');
        console.log('   npm run dev');
        console.log('');
        console.log('5. Upload Images / 画像アップロード:');
        console.log('   npm run upload ./your-image.jpg -- --title "Artwork Title"');
        console.log('   npm run upload ./your-image.jpg -- --title "作品名"');
        console.log('');
        console.log('6. Deploy to GitHub Pages / GitHub Pages にデプロイ:');
        console.log('   npm run deploy');
        console.log('');
        console.log('📚 For detailed instructions, see README.md');
        console.log('   詳細な手順は README.md を参照してください');
    }
}

// Run setup if called directly
if (require.main === module) {
    const setup = new GallerySetup();
    setup.run();
}

module.exports = GallerySetup;