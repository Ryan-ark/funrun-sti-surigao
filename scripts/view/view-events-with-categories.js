const { PrismaClient } = require('@prisma/client');

async function viewEventsWithCategories() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all events with their creators and categories
    const events = await prisma.events.findMany({
      include: {
        creator: true,
        event_categories: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        event_date: 'asc'
      }
    });
    
    console.log('Events with Categories:');
    console.log('=====================\n');
    
    events.forEach(event => {
      console.log(`Event: ${event.event_name}`);
      console.log(`Date: ${event.event_date.toLocaleDateString()} at ${event.event_date.toLocaleTimeString()}`);
      console.log(`Location: ${event.location}`);
      console.log(`Target Audience: ${event.target_audience}`);
      console.log(`Description: ${event.description}`);
      console.log(`Created by: ${event.creator.name} (${event.creator.role})`);
      
      if (event.event_categories && event.event_categories.length > 0) {
        console.log('Categories:');
        event.event_categories.forEach(link => {
          console.log(`- ${link.category.category_name}: ${link.category.description}`);
        });
      } else {
        console.log('Categories: None assigned');
      }
      
      console.log('----------------------------\n');
    });
    
    // Also show categories with their events
    console.log('\nCategories with Events:');
    console.log('=====================\n');
    
    const categories = await prisma.event_categories.findMany({
      include: {
        creator: true,
        events: {
          include: {
            event: true
          }
        }
      }
    });
    
    categories.forEach(category => {
      console.log(`Category: ${category.category_name}`);
      console.log(`Description: ${category.description}`);
      console.log(`Target Audience: ${category.target_audience}`);
      console.log(`Created by: ${category.creator.name}`);
      
      if (category.events && category.events.length > 0) {
        console.log('Events in this category:');
        category.events.forEach(link => {
          console.log(`- ${link.event.event_name} (${link.event.event_date.toLocaleDateString()})`);
        });
      } else {
        console.log('No events in this category');
      }
      
      console.log('----------------------------\n');
    });
    
  } catch (error) {
    console.error('Error fetching events with categories:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

viewEventsWithCategories(); 