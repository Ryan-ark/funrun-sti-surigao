const { PrismaClient } = require('@prisma/client');

async function viewEvents() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all events with their creator information
    const events = await prisma.events.findMany({
      include: {
        creator: true
      },
      orderBy: {
        event_date: 'asc'
      }
    });
    
    console.log('Events in database:');
    console.log('=================\n');
    
    events.forEach(event => {
      console.log(`Event: ${event.event_name}`);
      console.log(`Date: ${event.event_date.toLocaleDateString()} at ${event.event_date.toLocaleTimeString()}`);
      console.log(`Location: ${event.location}`);
      console.log(`Target Audience: ${event.target_audience}`);
      console.log(`Description: ${event.description}`);
      console.log(`Created by: ${event.creator.name} (${event.creator.email})`);
      console.log(`Creator Role: ${event.creator.role}`);
      console.log(`Created on: ${event.created_at.toLocaleDateString()}`);
      console.log(`Last Updated: ${event.updated_at.toLocaleDateString()}`);
      console.log('----------------------------\n');
    });
    
    console.log(`Total events: ${events.length}`);
    
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewEvents(); 