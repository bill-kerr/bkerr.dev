#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Configuration
const IMAGE_DIR = 'public/img';
const LARGE_IMAGE_THRESHOLD = 100 * 1024; // 100KB
const VERY_LARGE_IMAGE_THRESHOLD = 500 * 1024; // 500KB

console.log('🔍 Analyzing image performance...\n');

// Get all image files
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
}

// Get file size
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// Format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main analysis
function analyzeImages() {
  const imageFiles = getImageFiles(IMAGE_DIR);
  let totalSize = 0;
  let largeImages = [];
  let veryLargeImages = [];

  console.log('📊 Image Analysis Results:\n');
  
  imageFiles.forEach(file => {
    const filePath = path.join(IMAGE_DIR, file);
    const size = getFileSize(filePath);
    totalSize += size;
    
    const sizeFormatted = formatBytes(size);
    const ext = path.extname(file).toLowerCase();
    
    if (size > VERY_LARGE_IMAGE_THRESHOLD) {
      veryLargeImages.push({ file, size, sizeFormatted, ext });
      console.log(`🔴 CRITICAL: ${file} (${sizeFormatted}) - Consider WebP conversion`);
    } else if (size > LARGE_IMAGE_THRESHOLD) {
      largeImages.push({ file, size, sizeFormatted, ext });
      console.log(`🟡 LARGE: ${file} (${sizeFormatted}) - Optimize if possible`);
    } else {
      console.log(`🟢 OK: ${file} (${sizeFormatted})`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`📈 SUMMARY:`);
  console.log(`Total Images: ${imageFiles.length}`);
  console.log(`Total Size: ${formatBytes(totalSize)}`);
  console.log(`Large Images (>100KB): ${largeImages.length}`);
  console.log(`Critical Images (>500KB): ${veryLargeImages.length}`);
  
  if (veryLargeImages.length > 0) {
    console.log('\n🚨 IMMEDIATE ACTION REQUIRED:');
    veryLargeImages.forEach(img => {
      const savings = Math.round((img.size * 0.7) / 1024); // Estimated 70% savings with WebP
      console.log(`   • Convert ${img.file} to WebP (Est. savings: ${savings}KB)`);
    });
  }
  
  if (largeImages.length > 0) {
    console.log('\n⚠️  OPTIMIZATION OPPORTUNITIES:');
    largeImages.forEach(img => {
      if (img.ext === '.png') {
        console.log(`   • Convert ${img.file} to WebP for better compression`);
      } else if (img.ext === '.jpg' || img.ext === '.jpeg') {
        console.log(`   • Optimize ${img.file} quality or convert to WebP`);
      }
    });
  }
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Convert large JPG/PNG files to WebP format');
  console.log('2. Use responsive images with srcset');
  console.log('3. Implement lazy loading for all images');
  console.log('4. Consider AVIF format for even better compression');
  console.log('\n📋 To convert to WebP:');
  console.log('   cwebp -q 85 input.jpg -o output.webp');
  console.log('\n🔧 Use the OptimizedImage component for better performance');
}

// Run analysis
analyzeImages();