import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const MIN_SIZE_KB = 500; // Only optimize images larger than 500KB
const DIRECTORIES = [
    'public',
    'public/assets',
    'public/assets/posts',
    'public/assets/projects'
];

async function findLargePngFiles(dir) {
    const files = await readdir(dir, { withFileTypes: true });
    let pngFiles = [];

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            pngFiles = pngFiles.concat(await findLargePngFiles(fullPath));
        } else if (file.name.toLowerCase().endsWith('.png')) {
            const stats = await stat(fullPath);
            const sizeKB = stats.size / 1024;
            if (sizeKB > MIN_SIZE_KB) {
                pngFiles.push({ path: fullPath, size: sizeKB });
            }
        }
    }

    return pngFiles;
}

async function convertToWebP(pngInfo) {
    const { path: pngPath, size: originalSizeKB } = pngInfo;
    const webpPath = pngPath.replace('.png', '.webp');
    
    try {
        await sharp(pngPath)
            .webp({ 
                quality: 80,
                effort: 6 // Higher compression effort
            })
            .toFile(webpPath);
        
        const webpStats = await stat(webpPath);
        const webpSizeKB = webpStats.size / 1024;
        const savings = ((originalSizeKB - webpSizeKB) / originalSizeKB * 100).toFixed(2);
        
        console.log(`✅ ${path.basename(pngPath)}`);
        console.log(`   Original: ${originalSizeKB.toFixed(2)}KB`);
        console.log(`   WebP: ${webpSizeKB.toFixed(2)}KB`);
        console.log(`   Saved: ${savings}%\n`);
    } catch (error) {
        console.error(`❌ Error converting ${pngPath}:`, error.message);
    }
}

async function main() {
    console.log('🔍 Finding large PNG files (>500KB)...\n');
    
    let allPngFiles = [];
    for (const dir of DIRECTORIES) {
        try {
            const pngFiles = await findLargePngFiles(dir);
            allPngFiles = allPngFiles.concat(pngFiles);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error(`Error reading directory ${dir}:`, error.message);
            }
        }
    }

    if (allPngFiles.length === 0) {
        console.log('No large PNG files found to convert.');
        return;
    }

    const totalSize = allPngFiles.reduce((acc, file) => acc + file.size, 0);
    console.log(`Found ${allPngFiles.length} large PNG files (Total: ${totalSize.toFixed(2)}KB)\n`);
    
    for (const pngFile of allPngFiles) {
        await convertToWebP(pngFile);
    }

    console.log('✨ All done! WebP versions have been created alongside the original PNGs.');
}

main().catch(console.error); 