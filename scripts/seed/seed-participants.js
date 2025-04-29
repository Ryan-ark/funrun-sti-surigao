const { PrismaClient } = require('@prisma/client');

async function seedParticipants() {
  const prisma = new PrismaClient();
  
  try {
    // First, find users who can be participants (preferably Runners)
    const potentialParticipants = await prisma.users.findMany({
      where: {
        OR: [
          { role: 'Runner' },
          { role: 'Guest' } // If not enough runners, use guests
        ]
      }
    });
    
    // If not enough users, add admin and marshals too
    if (potentialParticipants.length < 3) {
      const allUsers = await prisma.users.findMany({
        take: 3
      });
      potentialParticipants.push(...allUsers.filter(
        user => !potentialParticipants.find(p => p.id === user.id)
      ));
    }
    
    if (potentialParticipants.length === 0) {
      console.error('No users found to register as participants.');
      return;
    }
    
    // Get event categories
    const categories = await prisma.event_categories.findMany();
    
    if (categories.length === 0) {
      console.error('No event categories found to register participants for.');
      return;
    }
    
    // Clear existing participants
    console.log('Clearing existing participants...');
    await prisma.participants.deleteMany({});
    
    // Sample RFID numbers (simulated)
    const sampleRfids = [
      'RF2504A918B7C3',
      'RF3612D734E2F1',
      'RF1908B623C7A4'
    ];
    
    // Create participants with different statuses
    const participantsData = [
      {
        user_id: potentialParticipants[0].id,
        rfid_number: sampleRfids[0],
        category_id: categories[0].id, // 5K Run
        payment_status: 'Verified',
        registration_status: 'Approved'
      },
      {
        user_id: potentialParticipants.length > 1 ? potentialParticipants[1].id : potentialParticipants[0].id,
        rfid_number: sampleRfids[1],
        category_id: categories.length > 1 ? categories[1].id : categories[0].id, // 10K Run or fallback
        payment_status: 'Paid',
        registration_status: 'Approved'
      },
      {
        user_id: potentialParticipants.length > 2 ? potentialParticipants[2].id : potentialParticipants[0].id,
        rfid_number: sampleRfids[2],
        category_id: categories.length > 2 ? categories[2].id : categories[0].id, // Kids Run or fallback
        payment_status: 'Pending',
        registration_status: 'Pending'
      }
    ];
    
    // Insert participants
    console.log('Creating participants...');
    
    for (const participantData of participantsData) {
      const user = potentialParticipants.find(u => u.id === participantData.user_id);
      const category = categories.find(c => c.id === participantData.category_id);
      
      const participant = await prisma.participants.create({
        data: participantData
      });
      
      console.log(`Registered ${user.name} for "${category.category_name}" with status: ${participant.registration_status}/${participant.payment_status}`);
    }
    
    console.log('Participant registration completed successfully!');
    
    // Print summary of participants
    console.log('\nParticipants Summary:');
    const registeredParticipants = await prisma.participants.findMany({
      include: {
        user: true,
        category: true
      }
    });
    
    registeredParticipants.forEach(participant => {
      console.log(`\nParticipant: ${participant.user.name} (${participant.user.email})`);
      console.log(`Category: ${participant.category.category_name}`);
      console.log(`RFID: ${participant.rfid_number}`);
      console.log(`Registration Status: ${participant.registration_status}`);
      console.log(`Payment Status: ${participant.payment_status}`);
      console.log(`Registered On: ${participant.registered_at.toLocaleDateString()}`);
    });
    
  } catch (error) {
    console.error('Error registering participants:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

seedParticipants(); 