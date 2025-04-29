const { PrismaClient } = require('@prisma/client');

async function viewParticipants() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all participants with their user and category info
    const participants = await prisma.participants.findMany({
      include: {
        user: true,
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
      orderBy: {
        registered_at: 'desc'
      }
    });
    
    console.log('Participants Information:');
    console.log('========================\n');
    
    participants.forEach(participant => {
      console.log(`Participant: ${participant.user.name}`);
      console.log(`Contact: ${participant.user.email} | ${participant.user.phone_number || 'No phone provided'}`);
      console.log(`RFID: ${participant.rfid_number || 'Not assigned'}`);
      console.log(`Category: ${participant.category.category_name}`);
      console.log(`Target Audience: ${participant.category.target_audience}`);
      
      // Get events this category is part of
      const events = participant.category.events.map(link => link.event);
      if (events.length > 0) {
        console.log('Events:');
        events.forEach(event => {
          console.log(`- ${event.event_name} (${event.event_date.toLocaleDateString()})`);
        });
      }
      
      console.log(`Registration Status: ${participant.registration_status}`);
      console.log(`Payment Status: ${participant.payment_status}`);
      console.log(`Registered On: ${participant.registered_at.toLocaleDateString()} at ${participant.registered_at.toLocaleTimeString()}`);
      console.log('----------------------------\n');
    });
    
    // Group participants by category
    console.log('\nParticipants by Category:');
    console.log('========================\n');
    
    const categories = await prisma.event_categories.findMany({
      include: {
        participants: {
          include: {
            user: true
          }
        }
      }
    });
    
    categories.forEach(category => {
      console.log(`Category: ${category.category_name}`);
      if (category.participants.length === 0) {
        console.log('No participants registered for this category');
      } else {
        console.log(`Total Participants: ${category.participants.length}`);
        
        // Group by registration status
        const approvedCount = category.participants.filter(p => p.registration_status === 'Approved').length;
        const pendingCount = category.participants.filter(p => p.registration_status === 'Pending').length;
        const rejectedCount = category.participants.filter(p => p.registration_status === 'Rejected').length;
        
        console.log(`Status Breakdown: ${approvedCount} Approved, ${pendingCount} Pending, ${rejectedCount} Rejected`);
        
        // List participants
        console.log('Participants:');
        category.participants.forEach(participant => {
          console.log(`- ${participant.user.name} (${participant.registration_status}/${participant.payment_status})`);
        });
      }
      console.log('----------------------------\n');
    });
    
  } catch (error) {
    console.error('Error fetching participants:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

viewParticipants(); 