const { PrismaClient } = require('@prisma/client');

async function seedResults() {
  const prisma = new PrismaClient();
  
  try {
    // Get existing participants who have approved registrations
    const participants = await prisma.participants.findMany({
      where: {
        registration_status: 'Approved'
      },
      include: {
        user: true,
        category: true
      }
    });
    
    if (participants.length === 0) {
      console.log('No approved participants found. Trying to get any participants...');
      
      // Try to get any participants if there are no approved ones
      const allParticipants = await prisma.participants.findMany({
        include: {
          user: true,
          category: true
        }
      });
      
      if (allParticipants.length === 0) {
        console.error('No participants found to record results for.');
        return;
      }
      
      participants.push(...allParticipants);
    }
    
    // Clear existing results
    console.log('Clearing existing results...');
    await prisma.results.deleteMany({});
    
    // Sample completion times (realistic for each category type)
    const sampleResults = [
      {
        participant_id: participants[0].id,
        category_id: participants[0].category_id,
        completion_time: '00:23:45.21', // 5K completion time
        ranking: 1,
        notes: 'Excellent performance, personal best time'
      },
      {
        participant_id: participants.length > 1 ? participants[1].id : participants[0].id,
        category_id: participants.length > 1 ? participants[1].category_id : participants[0].category_id,
        completion_time: participants.length > 1 && participants[1].category.category_name.includes('10K') ? 
          '00:52:18.43' : // 10K completion time
          '00:25:31.09', // 5K fallback time
        ranking: 2,
        notes: 'Strong finish, consistent pace throughout'
      },
      {
        participant_id: participants.length > 2 ? participants[2].id : participants[0].id,
        category_id: participants.length > 2 ? participants[2].category_id : participants[0].category_id,
        completion_time: participants.length > 2 && participants[2].category.category_name.includes('Kids') ? 
          '00:05:12.87' : // Kids run completion time
          '00:28:45.63', // 5K fallback time
        ranking: 3,
        notes: null
      }
    ];
    
    // Insert results
    console.log('Recording race results...');
    
    for (const resultData of sampleResults) {
      const participant = participants.find(p => p.id === resultData.participant_id);
      
      try {
        // Check if this participant already has a result for this category
        const existingResult = await prisma.results.findFirst({
          where: {
            participant_id: resultData.participant_id,
            category_id: resultData.category_id
          }
        });
        
        if (existingResult) {
          console.log(`Result already exists for ${participant.user.name} in ${participant.category.category_name}. Skipping...`);
          continue;
        }
        
        const result = await prisma.results.create({
          data: resultData
        });
        
        console.log(`Recorded result for ${participant.user.name} in ${participant.category.category_name}: ${result.completion_time} (Rank: ${result.ranking})`);
      } catch (error) {
        console.error(`Error recording result for ${participant.user.name}:`, error.message);
      }
    }
    
    console.log('Race results recording completed successfully!');
    
    // Print summary of results with participant names and categories
    console.log('\nResults Summary:');
    const recordedResults = await prisma.results.findMany({
      include: {
        participant: {
          include: {
            user: true
          }
        },
        category: true
      },
      orderBy: {
        ranking: 'asc'
      }
    });
    
    recordedResults.forEach(result => {
      console.log(`\nRank: ${result.ranking}`);
      console.log(`Participant: ${result.participant.user.name}`);
      console.log(`Category: ${result.category.category_name}`);
      console.log(`Completion Time: ${result.completion_time}`);
      if (result.notes) {
        console.log(`Notes: ${result.notes}`);
      }
      console.log(`Recorded on: ${result.recorded_at.toLocaleDateString()} at ${result.recorded_at.toLocaleTimeString()}`);
    });
    
  } catch (error) {
    console.error('Error seeding results:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

seedResults(); 