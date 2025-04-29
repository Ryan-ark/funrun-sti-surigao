const { PrismaClient } = require('@prisma/client');

async function seedEvents() {
  const prisma = new PrismaClient();
  
  try {
    // First, find marshals or admins who can create events
    const eventCreators = await prisma.users.findMany({
      where: {
        OR: [
          { role: 'Marshal' },
          { role: 'Admin' }
        ]
      },
      take: 3
    });
    
    if (eventCreators.length === 0) {
      console.error('No Marshal or Admin users found to create events.');
      return;
    }
    
    // Clear existing events
    console.log('Clearing existing events...');
    await prisma.events.deleteMany({});
    
    // Sample events data
    const events = [
      {
        event_name: 'STI Surigao Fun Run 2025',
        event_date: new Date('2025-06-15T06:00:00Z'),
        location: 'Surigao City Sports Complex',
        target_audience: 'All fitness levels, ages 15-60',
        description: 'Annual charity fun run organized by STI Surigao to raise funds for local education initiatives. Multiple categories: 3K, 5K, and 10K.',
        created_by: eventCreators[0].id
      },
      {
        event_name: 'Surigao Marathon Challenge',
        event_date: new Date('2025-09-20T05:30:00Z'),
        location: 'Surigao Boulevard',
        target_audience: 'Experienced runners, ages 18+',
        description: 'Challenging marathon along the scenic coast of Surigao. Half marathon and full marathon categories available. Prizes for top finishers.',
        created_by: eventCreators.length > 1 ? eventCreators[1].id : eventCreators[0].id
      },
      {
        event_name: 'Kids Dash for Health',
        event_date: new Date('2025-08-01T07:00:00Z'),
        location: 'Luneta Park, Surigao City',
        target_audience: 'Children ages 5-12',
        description: 'Fun-filled running event for kids to promote health and fitness. Includes 500m and 1K distances with medals for all participants.',
        created_by: eventCreators.length > 2 ? eventCreators[2].id : eventCreators[0].id
      }
    ];
    
    // Insert events
    console.log('Creating events...');
    for (const event of events) {
      const creator = eventCreators.find(user => user.id === event.created_by);
      const createdEvent = await prisma.events.create({
        data: event
      });
      console.log(`Created event: ${event.event_name} (by ${creator.name})`);
    }
    
    console.log('Seeding events completed successfully!');
    
    // Print summary of created events
    console.log('\nEvents Summary:');
    const createdEvents = await prisma.events.findMany({
      include: {
        creator: true
      }
    });
    
    createdEvents.forEach(event => {
      console.log(`\nEvent: ${event.event_name}`);
      console.log(`Date: ${event.event_date.toLocaleDateString()}`);
      console.log(`Location: ${event.location}`);
      console.log(`Target Audience: ${event.target_audience}`);
      console.log(`Created by: ${event.creator.name} (${event.creator.role})`);
    });
    
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents(); 