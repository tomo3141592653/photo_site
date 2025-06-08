#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const { program } = require('commander');
const https = require('https');
const http = require('http');

// AWS SDKの設定
AWS.config.update({
    region: 'ap-northeast-1',
    credentials: new AWS.SharedIniFileCredentials()
});

// Load configuration
const configPath = path.join(__dirname, '../config/config.json');
let config;

try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
    console.error('❌ Error: config/config.json not found. Please run setup first.');
    process.exit(1);
}

// Initialize AWS S3
const s3 = new AWS.S3({ region: config.s3.region });

class ResponsiveImageGenerator {
    constructor() {
        this.responsiveSizes = [640, 768, 1024, 1280, 1536, 1920, 2560];
        this.processedCount = 0;
        this.skippedCount = 0;
        this.errorCount = 0;
    }

    async generateResponsiveImages(startIndex = 0, batchSize = 10) {
        console.log('🚀 レスポンシブ画像生成開始...');
        
        // Load artworks.json
        const metadataPath = path.join(__dirname, '../docs/data/artworks.json');
        let metadata;
        
        try {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        } catch (error) {
            console.error('❌ artworks.jsonの読み込みエラー:', error.message);
            return;
        }

        const artworks = metadata.artworks;
        const endIndex = Math.min(startIndex + batchSize, artworks.length);
        
        console.log(`📊 処理対象: ${startIndex + 1}〜${endIndex}件目 (全${artworks.length}件)`);

        for (let i = startIndex; i < endIndex; i++) {
            const artwork = artworks[i];
            
            if (!artwork || !artwork.id) {
                console.log(`⏭️  ${i + 1}: 無効なアートワークデータ`);
                this.skippedCount++;
                continue;
            }

            // すでにレスポンシブ画像がある場合はスキップ
            if (artwork.responsive && Object.keys(artwork.responsive).length > 0) {
                console.log(`⏭️  ${i + 1}: ${artwork.id} - すでにレスポンシブ画像あり`);
                this.skippedCount++;
                continue;
            }

            try {
                console.log(`\n🖼️  ${i + 1}/${artworks.length}: ${artwork.id} を処理中...`);
                
                const responsiveUrls = await this.processArtwork(artwork);
                
                if (responsiveUrls && Object.keys(responsiveUrls).length > 0) {
                    // artworkにresponsiveフィールドを追加
                    artworks[i].responsive = responsiveUrls;
                    this.processedCount++;
                    console.log(`✅ ${artwork.id} 完了`);
                } else {
                    this.skippedCount++;
                    console.log(`⏭️  ${artwork.id} - 処理をスキップ`);
                }
                
                // 進捗保存（10件ごと）
                if ((i + 1) % 10 === 0) {
                    await this.saveMetadata(metadata, metadataPath);
                    console.log(`💾 進捗保存: ${i + 1}件処理完了`);
                }
                
            } catch (error) {
                console.error(`❌ ${artwork.id} エラー:`, error.message);
                this.errorCount++;
            }
        }

        // 最終保存
        await this.saveMetadata(metadata, metadataPath);
        
        console.log('\n🎉 処理完了!');
        console.log(`✅ 処理成功: ${this.processedCount}件`);
        console.log(`⏭️  スキップ: ${this.skippedCount}件`);
        console.log(`❌ エラー: ${this.errorCount}件`);
    }

    async processArtwork(artwork) {
        try {
            // オリジナル画像をダウンロード
            const imageBuffer = await this.downloadImage(artwork.original);
            const image = sharp(imageBuffer);
            const metadata = await image.metadata();
            
            console.log(`📐 画像サイズ: ${metadata.width}x${metadata.height}`);
            
            // 日付からパスを生成
            const date = new Date(artwork.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const basePath = `${year}/${month}`;
            
            const responsiveUrls = {};
            
            for (const size of this.responsiveSizes) {
                // 元画像のサイズより大きい場合はスキップ
                if (size > metadata.width) {
                    console.log(`⏭️  ${size}w: 元画像より大きいためスキップ`);
                    continue;
                }
                
                try {
                    const responsiveBuffer = await image
                        .resize(size, null, { 
                            fit: 'inside', 
                            withoutEnlargement: true,
                            fastShrinkOnLoad: false 
                        })
                        .jpeg({ quality: config.image.jpegQuality })
                        .toBuffer();
                    
                    const s3Key = `responsive/${basePath}/${artwork.id}_${size}w.jpg`;
                    await this.uploadToS3(responsiveBuffer, s3Key, 'image/jpeg');
                    responsiveUrls[size] = `${config.s3.cdnDomain}/${s3Key}`;
                    console.log(`✅ ${size}w生成・アップロード完了`);
                    
                } catch (error) {
                    console.error(`❌ ${size}w生成エラー:`, error.message);
                }
            }
            
            return responsiveUrls;
            
        } catch (error) {
            console.error(`処理エラー:`, error.message);
            return null;
        }
    }

    async downloadImage(url) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https:') ? https : http;
            
            protocol.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}: ${url}`));
                    return;
                }
                
                const chunks = [];
                response.on('data', chunk => chunks.push(chunk));
                response.on('end', () => resolve(Buffer.concat(chunks)));
                response.on('error', reject);
            }).on('error', reject);
        });
    }

    async uploadToS3(buffer, key, contentType) {
        const params = {
            Bucket: config.s3.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            CacheControl: 'max-age=31536000' // 1年間キャッシュ
        };
        
        return s3.upload(params).promise();
    }

    async saveMetadata(metadata, metadataPath) {
        metadata.lastUpdated = new Date().toISOString();
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }
}

// Command line interface
program
    .name('generate-responsive')
    .description('Generate responsive images for existing artworks')
    .option('-s, --start <number>', 'Start index (0-based)', '0')
    .option('-b, --batch <number>', 'Batch size', '10')
    .option('-a, --all', 'Process all images at once')
    .action(async (options) => {
        try {
            const generator = new ResponsiveImageGenerator();
            const startIndex = parseInt(options.start);
            const batchSize = options.all ? 999999 : parseInt(options.batch);
            
            await generator.generateResponsiveImages(startIndex, batchSize);
        } catch (error) {
            console.error('処理失敗:', error.message);
            process.exit(1);
        }
    });

// Add version info
program.version('1.0.0');

// Parse command line arguments
program.parse(); 