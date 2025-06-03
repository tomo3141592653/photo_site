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
        console.log('🚀 PixelVision Gallery セットアップを開始します...\n');

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
            console.error('❌ セットアップエラー:', error.message);
            process.exit(1);
        }
    }

    checkNodeVersion() {
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
        
        console.log(`📋 Node.js バージョン: ${nodeVersion}`);
        
        if (majorVersion < 14) {
            throw new Error('Node.js 14.0.0 以上が必要です');
        }
        
        console.log('✅ Node.js バージョン OK\n');
    }

    createDirectories() {
        console.log('📁 ディレクトリ構造を作成中...');
        
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
                console.log(`  📂 作成: ${dir}`);
            } else {
                console.log(`  ✅ 存在: ${dir}`);
            }
        });
        
        console.log('✅ ディレクトリ構造 OK\n');
    }

    initializeArtworks() {
        console.log('🎨 アートワークデータを初期化中...');
        
        if (!fs.existsSync(this.artworksPath)) {
            const initialData = {
                artworks: [],
                totalCount: 0,
                lastUpdated: null
            };
            
            fs.writeFileSync(this.artworksPath, JSON.stringify(initialData, null, 2));
            console.log('  📄 artworks.json を作成しました');
        } else {
            console.log('  ✅ artworks.json は既に存在します');
        }
        
        console.log('✅ アートワークデータ OK\n');
    }

    checkConfig() {
        console.log('⚙️  設定ファイルをチェック中...');
        
        if (!fs.existsSync(this.configPath)) {
            console.log('⚠️  config/config.json が見つかりません');
            console.log('   デフォルト設定ファイルが作成されています');
            console.log('   S3設定を更新してください');
        } else {
            const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            
            if (config.s3.bucket === 'your-gallery-bucket-name') {
                console.log('⚠️  S3バケット名を更新してください');
            } else {
                console.log('✅ 設定ファイル OK');
            }
        }
        
        console.log('');
    }

    installDependencies() {
        console.log('📦 依存関係をインストール中...');
        
        try {
            execSync('npm install', { 
                stdio: ['inherit', 'inherit', 'inherit'],
                cwd: path.join(__dirname, '..')
            });
            console.log('✅ 依存関係インストール完了\n');
        } catch (error) {
            console.log('⚠️  依存関係のインストールに失敗しました');
            console.log('   手動で `npm install` を実行してください\n');
        }
    }

    showNextSteps() {
        console.log('🎉 セットアップ完了!\n');
        console.log('📋 次のステップ:');
        console.log('');
        console.log('1. AWS設定:');
        console.log('   aws configure');
        console.log('');
        console.log('2. S3バケット作成:');
        console.log('   aws s3 mb s3://your-gallery-bucket-name');
        console.log('');
        console.log('3. config/config.json を編集してS3設定を更新');
        console.log('');
        console.log('4. ローカルサーバー起動:');
        console.log('   npm run dev');
        console.log('');
        console.log('5. 画像アップロード:');
        console.log('   npm run upload ./your-image.jpg -- --title "作品名"');
        console.log('');
        console.log('📚 詳細な手順は README.md を参照してください');
    }
}

// Run setup if called directly
if (require.main === module) {
    const setup = new GallerySetup();
    setup.run();
}

module.exports = GallerySetup;