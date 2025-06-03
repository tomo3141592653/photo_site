#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { execSync } = require('child_process');

class BatchUploader {
    async uploadFolder(folderPath) {
        try {
            console.log(`📁 フォルダをスキャン中: ${folderPath}`);
            
            if (!fs.existsSync(folderPath)) {
                throw new Error(`Folder not found: ${folderPath}`);
            }

            const files = fs.readdirSync(folderPath);
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i.test(file)
            );
            
            if (imageFiles.length === 0) {
                console.log('❌ 画像ファイルが見つかりませんでした');
                return;
            }

            console.log(`📷 ${imageFiles.length}個の画像ファイルを発見`);
            
            let successCount = 0;
            let errorCount = 0;
            
            for (const file of imageFiles) {
                const filePath = path.join(folderPath, file);
                const title = path.basename(file, path.extname(file));
                
                try {
                    console.log(`\n📤 Processing: ${file}`);
                    
                    // Use the upload.js script
                    const uploadScript = path.join(__dirname, 'upload.js');
                    const command = `node "${uploadScript}" "${filePath}" --title "${title}"`;
                    
                    execSync(command, { 
                        stdio: ['inherit', 'inherit', 'inherit'],
                        cwd: __dirname 
                    });
                    
                    successCount++;
                    console.log(`✅ ${file} アップロード完了`);
                    
                } catch (error) {
                    errorCount++;
                    console.error(`❌ ${file} エラー:`, error.message);
                    
                    // Continue with next file instead of stopping
                    continue;
                }
            }
            
            console.log(`\n🎉 バッチアップロード完了!`);
            console.log(`✅ 成功: ${successCount}個`);
            if (errorCount > 0) {
                console.log(`❌ エラー: ${errorCount}個`);
            }
            
        } catch (error) {
            console.error('❌ バッチアップロードエラー:', error.message);
            process.exit(1);
        }
    }
}

// Command line interface
program
    .name('batch-upload')
    .description('Upload multiple artworks from a folder')
    .argument('<folder>', 'Path to the folder containing images')
    .option('--dry-run', 'Show what would be uploaded without actually uploading')
    .action(async (folderPath, options) => {
        if (options.dryRun) {
            console.log('🔍 Dry run mode - showing files that would be uploaded:');
            
            if (!fs.existsSync(folderPath)) {
                console.error(`❌ Folder not found: ${folderPath}`);
                process.exit(1);
            }

            const files = fs.readdirSync(folderPath);
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i.test(file)
            );
            
            imageFiles.forEach((file, index) => {
                console.log(`${index + 1}. ${file}`);
            });
            
            console.log(`\nTotal: ${imageFiles.length} files would be uploaded`);
            return;
        }

        const uploader = new BatchUploader();
        await uploader.uploadFolder(folderPath);
    });

// Add version info
program.version('1.0.0');

// Parse command line arguments
program.parse();