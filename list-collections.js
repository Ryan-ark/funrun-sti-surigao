const { PrismaClient } = require('@prisma/client');

async function listCollections() {
  const prisma = new PrismaClient();
  
  try {
    // Use MongoDB's listCollections command through Prisma's $runCommandRaw
    const result = await prisma.$runCommandRaw({
      listCollections: 1
    });
    
    console.log('Collections in your MongoDB database:');
    if (result && result.cursor && result.cursor.firstBatch) {
      result.cursor.firstBatch.forEach(collection => {
        console.log(`- ${collection.name} (${collection.type})`);
      });
      
      // Count documents in each collection
      for (const collection of result.cursor.firstBatch) {
        const collectionName = collection.name;
        try {
          const count = await prisma.$runCommandRaw({
            count: collectionName
          });
          console.log(`  Documents in ${collectionName}: ${count.n || 0}`);
        } catch (err) {
          console.log(`  Error counting documents in ${collectionName}`);
        }
      }
    } else {
      console.log('No collections found or unexpected result format');
      console.log('Raw result:', result);
    }
    
  } catch (error) {
    console.error('Error accessing MongoDB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listCollections(); 