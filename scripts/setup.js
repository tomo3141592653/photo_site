#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GallerySetup {
    constructor(options = {}) {
        this.configPath = path.join(__dirname, '../config/config.json');
        this.configTemplatePath = path.join(__dirname, '../config/config_template.json');
        this.artworksPath = path.join(__dirname, '../docs/data/artworks.json');
        this.options = options;
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

            // 4. Generate config from template if needed
            this.generateConfig();
            
            // 5. Check config
            this.checkConfig();

            // 6. Install dependencies
            this.installDependencies();

            // 7. Show next steps
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

    generateConfig() {
        console.log('⚙️  Setting up configuration... / 設定ファイルをセットアップ中...');
        
        // If config.json doesn't exist, create from template
        if (!fs.existsSync(this.configPath)) {
            if (fs.existsSync(this.configTemplatePath)) {
                console.log('  📄 Creating config.json from template... / テンプレートからconfig.jsonを作成中...');
                fs.copyFileSync(this.configTemplatePath, this.configPath);
            }
        }

        // If config.json already exists and is not a template, skip generation
        if (fs.existsSync(this.configPath)) {
            const existingConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            if (existingConfig.s3 && existingConfig.s3.bucket !== 'YOUR-BUCKET-NAME') {
                console.log('  ✅ Configuration already exists / 設定ファイルは既に存在します');
                return;
            }
        }

        // Generate config from template if user provided options
        if (this.options.bucket) {
            console.log('  📝 Generating config from template... / テンプレートから設定を生成中...');
            
            if (!fs.existsSync(this.configTemplatePath)) {
                console.log('  ⚠️  Template not found, using default settings / テンプレートが見つかりません、デフォルト設定を使用');
                return;
            }

            const template = JSON.parse(fs.readFileSync(this.configTemplatePath, 'utf8'));
            
            // Replace placeholders
            template.s3.bucket = this.options.bucket;
            template.s3.cdnDomain = `https://${this.options.bucket}.s3.${template.s3.region}.amazonaws.com`;
            
            if (this.options.title) template.site.title = this.options.title;
            if (this.options.description) template.site.description = this.options.description;
            if (this.options.author) template.site.author = this.options.author;
            if (this.options.url) template.site.url = this.options.url;

            fs.writeFileSync(this.configPath, JSON.stringify(template, null, 2));
            console.log('  ✅ Configuration generated successfully / 設定ファイルを正常に生成しました');
        } else {
            console.log('  ℹ️  No bucket name provided, please update config manually');
            console.log('     バケット名が指定されていません、手動で設定を更新してください');
        }
        
        console.log('');
    }

    checkConfig() {
        console.log('⚙️  Checking configuration... / 設定ファイルをチェック中...');
        
        if (!fs.existsSync(this.configPath)) {
            console.log('⚠️  config/config.json not found / config/config.json が見つかりません');
            console.log('   Default config file should be created / デフォルト設定ファイルが作成されています');
            console.log('   Please update S3 settings / S3設定を更新してください');
        } else {
            const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            
            if (config.s3 && (config.s3.bucket === 'YOUR-BUCKET-NAME' || config.s3.bucket === 'your-gallery-bucket-name')) {
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
        console.log('   aws s3 mb s3://YOUR-BUCKET-NAME');
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
    const { program } = require('commander');
    
    program
        .name('setup')
        .description('tomoπgraphy Gallery Setup')
        .option('-b, --bucket <name>', 'S3 bucket name')
        .option('-t, --title <title>', 'Gallery title')
        .option('-d, --description <desc>', 'Gallery description')
        .option('-a, --author <author>', 'Author name')
        .option('-u, --url <url>', 'Gallery URL')
        .parse();

    const options = program.opts();
    const setup = new GallerySetup(options);
    setup.run();
}

module.exports = GallerySetup;