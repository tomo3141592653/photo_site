#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const { program } = require('commander');
const mime = require('mime-types');

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

class ArtworkUploader {
    async uploadImage(imagePath, title = '', description = '') {
        try {
            console.log(`📸 アップロード開始: ${imagePath}`);
            
            // Validate file exists
            if (!fs.existsSync(imagePath)) {
                throw new Error(`File not found: ${imagePath}`);
            }

            // Generate file info
            const fileName = path.basename(imagePath, path.extname(imagePath));
            const ext = path.extname(imagePath);
            const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const id = `${timestamp}_${fileName}`;
            
            // Read and process image
            const imageBuffer = fs.readFileSync(imagePath);
            const image = sharp(imageBuffer);
            const metadata = await image.metadata();
            
            console.log(`📐 画像サイズ: ${metadata.width}x${metadata.height}`);
            
            // Generate S3 paths
            const year = new Date().getFullYear();
            const month = String(new Date().getMonth() + 1).padStart(2, '0');
            const basePath = `${year}/${month}`;
            
            const paths = {
                original: `originals/${basePath}/${id}${ext}`,
                thumbnail: `thumbnails/${basePath}/${id}_thumb.jpg`,
                webp: `webp/${basePath}/${id}.webp`
            };
            
            // Upload original image
            await this.uploadToS3(imageBuffer, paths.original, mime.lookup(ext) || 'application/octet-stream');
            console.log(`✅ オリジナル画像アップロード完了`);
            
            // Generate and upload thumbnail
            const thumbnailBuffer = await image
                .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: config.image.jpegQuality })
                .toBuffer();
            
            await this.uploadToS3(thumbnailBuffer, paths.thumbnail, 'image/jpeg');
            console.log(`✅ サムネイル生成・アップロード完了`);
            
            // Generate and upload WebP
            const webpBuffer = await image
                .webp({ quality: config.image.webpQuality })
                .toBuffer();
            
            await this.uploadToS3(webpBuffer, paths.webp, 'image/webp');
            console.log(`✅ WebP変換・アップロード完了`);
            
            // Create artwork metadata
            const artwork = {
                id,
                title: title || fileName,
                description,
                date: new Date().toISOString().slice(0, 10),
                year,
                month: parseInt(month),
                original: `${config.s3.cdnDomain}/${paths.original}`,
                thumbnail: `${config.s3.cdnDomain}/${paths.thumbnail}`,
                webp: `${config.s3.cdnDomain}/${paths.webp}`,
                dimensions: { width: metadata.width, height: metadata.height },
                fileSize: imageBuffer.length
            };
            
            // Update metadata file
            await this.updateMetadata(artwork);
            console.log(`✅ メタデータ更新完了`);
            
            console.log(`🎉 アップロード完了: ${id}`);
            console.log(`🔗 URL: ${artwork.original}`);
            
            return artwork;
            
        } catch (error) {
            console.error(`❌ エラー:`, error.message);
            throw error;
        }
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
    
    async updateMetadata(artwork) {
        const metadataPath = path.join(__dirname, '../docs/data/artworks.json');
        let metadata;
        
        try {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        } catch {
            metadata = { artworks: [], totalCount: 0, lastUpdated: null };
        }
        
        // Add new artwork at the beginning
        metadata.artworks.unshift(artwork);
        metadata.totalCount = metadata.artworks.length;
        metadata.lastUpdated = new Date().toISOString();
        
        // Ensure directory exists
        const dir = path.dirname(metadataPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    }
}

// Command line interface
program
    .name('upload')
    .description('Upload artwork to the pixel gallery')
    .argument('<image>', 'Path to the image file to upload')
    .option('-t, --title <title>', 'Artwork title')
    .option('-d, --description <description>', 'Artwork description')
    .action(async (imagePath, options) => {
        try {
            const uploader = new ArtworkUploader();
            await uploader.uploadImage(imagePath, options.title, options.description);
        } catch (error) {
            console.error('Upload failed:', error.message);
            process.exit(1);
        }
    });

// Add version info
program.version('1.0.0');

// Parse command line arguments
program.parse();