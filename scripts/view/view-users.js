const { PrismaClient } = require('@prisma/client');

async function viewUsers() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all users
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone_number: true,
        created_at: true,
        updated_at: true
      }
    });
    
    console.log('Users in database:');
    console.log('=================\n');
    
    users.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Phone: ${user.phone_number || 'Not provided'}`);
      console.log(`Created: ${user.created_at.toISOString()}`);
      console.log(`Updated: ${user.updated_at.toISOString()}`);
      console.log(`ID: ${user.id}`);
      console.log('----------------------------\n');
    });
    
    console.log(`Total users: ${users.length}`);
    
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewUsers(); 