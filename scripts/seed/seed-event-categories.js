const { PrismaClient } = require('@prisma/client');

async function seedEventCategories() {
  const prisma = new PrismaClient();
  
  try {
    // First, find marshals or admins who can create categories
    const categoryCreators = await prisma.users.findMany({
      where: {
        OR: [
          { role: 'Marshal' },
          { role: 'Admin' }
        ]
      },
      take: 1
    });
    
    if (categoryCreators.length === 0) {
      console.error('No Marshal or Admin users found to create categories.');
      return;
    }
    
    const creator = categoryCreators[0];
    
    // Clear existing categories and relationships
    console.log('Clearing existing event categories and relationships...');
    await prisma.event_to_category.deleteMany({});
    await prisma.event_categories.deleteMany({});
    
    // Sample categories data
    const categories = [
      {
        category_name: '5K Run',
        description: 'A 5-kilometer running event suitable for beginners and intermediate runners.',
        target_audience: 'All fitness levels, ages 12+',
        created_by: creator.id
      },
      {
        category_name: '10K Run',
        description: 'A 10-kilometer running event for intermediate and experienced runners.',
        target_audience: 'Intermediate runners, ages 15+',
        created_by: creator.id
      },
      {
        category_name: 'Kids Fun Run',
        description: 'Short-distance runs designed specifically for children.',
        target_audience: 'Children ages 5-12',
        created_by: creator.id
      }
    ];
    
    // Insert categories
    console.log('Creating event categories...');
    const createdCategories = [];
    
    for (const category of categories) {
      const createdCategory = await prisma.event_categories.create({
        data: category
      });
      createdCategories.push(createdCategory);
      console.log(`Created category: ${category.category_name}`);
    }
    
    // Get existing events to link with categories
    const events = await prisma.events.findMany();
    
    if (events.length === 0) {
      console.error('No events found to link with categories.');
      return;
    }
    
    // Link events with appropriate categories
    console.log('\nLinking events with categories...');
    
    // Map to store event name pattern to category ID
    const categoryMapping = [
      { pattern: /fun run/i, categoryId: createdCategories[0].id }, // 5K Run
      { pattern: /marathon/i, categoryId: createdCategories[1].id }, // 10K Run
      { pattern: /kids|dash/i, categoryId: createdCategories[2].id } // Kids Fun Run
    ];
    
    for (const event of events) {
      // Find matching categories based on event name
      const matchingCategories = categoryMapping.filter(mapping => 
        mapping.pattern.test(event.event_name)
      );
      
      // If no specific match, link to first category as default
      if (matchingCategories.length === 0) {
        matchingCategories.push({ categoryId: createdCategories[0].id });
      }
      
      // Create links between event and categories
      for (const match of matchingCategories) {
        await prisma.event_to_category.create({
          data: {
            event_id: event.id,
            category_id: match.categoryId
          }
        });
        
        const category = createdCategories.find(c => c.id === match.categoryId);
        console.log(`Linked event "${event.event_name}" with category "${category.category_name}"`);
      }
    }
    
    // Print summary of created categories with their linked events
    console.log('\nCategory Summary:');
    const categoriesWithEvents = await prisma.event_categories.findMany({
      include: {
        events: {
          include: {
            event: true
          }
        }
      }
    });
    
    for (const category of categoriesWithEvents) {
      console.log(`\nCategory: ${category.category_name}`);
      console.log(`Description: ${category.description}`);
      console.log(`Target Audience: ${category.target_audience}`);
      
      if (category.events.length > 0) {
        console.log('Linked Events:');
        category.events.forEach(link => {
          console.log(`- ${link.event.event_name} (${link.event.event_date.toLocaleDateString()})`);
        });
      } else {
        console.log('No events linked to this category yet.');
      }
    }
    
  } catch (error) {
    console.error('Error seeding event categories:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

seedEventCategories(); 