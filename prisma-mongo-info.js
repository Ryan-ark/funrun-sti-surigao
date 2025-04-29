#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');

async function getMongoDBInfo() {
  const prisma = new PrismaClient();
  
  try {
    console.log('MongoDB Database Status via Prisma:');
    console.log('===================================');
    
    // Get database info
    const dbStats = await prisma.$runCommandRaw({ dbStats: 1 });
    console.log(`\nDatabase: ${dbStats.db}`);
    console.log(`Storage Size: ${formatBytes(dbStats.storageSize)}`);
    console.log(`Total Collections: ${dbStats.collections}`);
    console.log(`Total Documents: ${dbStats.objects}`);
    console.log(`Total Indexes: ${dbStats.indexes}`);
    
    // List collections
    const result = await prisma.$runCommandRaw({ listCollections: 1 });
    
    if (result && result.cursor && result.cursor.firstBatch) {
      console.log('\nCollections:');
      console.log('============');
      
      for (const collection of result.cursor.firstBatch) {
        const collectionName = collection.name;
        try {
          // Get collection stats
          const stats = await prisma.$runCommandRaw({
            collStats: collectionName
          });
          
          // Count documents
          const count = await prisma.$runCommandRaw({
            count: collectionName
          });
          
          console.log(`\n- ${collectionName}`);
          console.log(`  Type: ${collection.type}`);
          console.log(`  Documents: ${count.n || 0}`);
          console.log(`  Storage: ${formatBytes(stats.size || 0)}`);
          console.log(`  Indexes: ${stats.nindexes || 0}`);
          
          // List indexes for this collection
          const indexes = await prisma.$runCommandRaw({
            listIndexes: collectionName
          });
          
          if (indexes && indexes.cursor && indexes.cursor.firstBatch) {
            console.log('  Indexes:');
            indexes.cursor.firstBatch.forEach(index => {
              console.log(`    - ${index.name}: ${JSON.stringify(index.key)}`);
            });
          }
        } catch (err) {
          console.log(`\n- ${collectionName}`);
          console.log(`  Error getting detailed stats: ${err.message}`);
        }
      }
    } else {
      console.log('\nNo collections found or unexpected result format');
    }
    
  } catch (error) {
    console.error('Error accessing MongoDB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Run the function
getMongoDBInfo(); 