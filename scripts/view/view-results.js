const { PrismaClient } = require('@prisma/client');

async function viewResults() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all results with participant and category info
    const results = await prisma.results.findMany({
      include: {
        participant: {
          include: {
            user: true
          }
        },
        category: {
          include: {
            events: {
              include: {
                event: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          category_id: 'asc'
        },
        {
          ranking: 'asc'
        }
      ]
    });
    
    console.log('Race Results:');
    console.log('============\n');
    
    if (results.length === 0) {
      console.log('No race results recorded yet.');
      return;
    }
    
    // Group results by category
    const resultsByCategory = {};
    
    results.forEach(result => {
      const categoryName = result.category.category_name;
      
      if (!resultsByCategory[categoryName]) {
        resultsByCategory[categoryName] = [];
      }
      
      resultsByCategory[categoryName].push(result);
    });
    
    // Display results by category
    for (const [categoryName, categoryResults] of Object.entries(resultsByCategory)) {
      console.log(`\n${categoryName} Results:`);
      console.log('------------------------');
      
      // Get the event(s) for this category
      const events = categoryResults[0].category.events.map(e => e.event);
      if (events.length > 0) {
        console.log(`Event: ${events[0].event_name} (${events[0].event_date.toLocaleDateString()})`);
      }
      
      // Show participants in ranking order
      console.log('\nRankings:');
      
      categoryResults.forEach(result => {
        console.log(`  ${result.ranking}. ${result.participant.user.name} - ${result.completion_time}`);
      });
      
      // Show detailed results
      console.log('\nDetailed Results:');
      
      categoryResults.forEach(result => {
        console.log(`\n  Rank ${result.ranking}: ${result.participant.user.name}`);
        console.log(`  Contact: ${result.participant.user.email}`);
        console.log(`  Completion Time: ${result.completion_time}`);
        console.log(`  RFID Number: ${result.participant.rfid_number || 'Not registered'}`);
        
        if (result.notes) {
          console.log(`  Notes: ${result.notes}`);
        }
        
        console.log(`  Recorded on: ${result.recorded_at.toLocaleDateString()} at ${result.recorded_at.toLocaleTimeString()}`);
      });
    }
    
    // Show participant performance
    console.log('\n\nParticipant Performance:');
    console.log('=======================\n');
    
    // Group results by participant
    const resultsByParticipant = {};
    
    results.forEach(result => {
      const participantName = result.participant.user.name;
      
      if (!resultsByParticipant[participantName]) {
        resultsByParticipant[participantName] = [];
      }
      
      resultsByParticipant[participantName].push(result);
    });
    
    // Display participant performance
    for (const [participantName, participantResults] of Object.entries(resultsByParticipant)) {
      console.log(`\n${participantName}:`);
      
      participantResults.forEach(result => {
        console.log(`  - ${result.category.category_name}: ${result.completion_time} (Rank: ${result.ranking})`);
        
        // Get the event(s) for this category
        const events = result.category.events.map(e => e.event);
        if (events.length > 0) {
          console.log(`    Event: ${events[0].event_name} (${events[0].event_date.toLocaleDateString()})`);
        }
        
        if (result.notes) {
          console.log(`    Notes: ${result.notes}`);
        }
      });
    }
    
  } catch (error) {
    console.error('Error fetching race results:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

viewResults(); 