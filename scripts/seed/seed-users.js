const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function seedUsers() {
  const prisma = new PrismaClient();
  
  try {
    // Check if bcrypt is available
    let hashPassword;
    try {
      const saltRounds = 10;
      hashPassword = async (password) => await bcrypt.hash(password, saltRounds);
    } catch (err) {
      console.log('bcrypt not available, using plain passwords');
      hashPassword = async (password) => password;
    }
    
    // Create 3 users with different roles
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await hashPassword('admin123'),
        phone_number: '09123456789',
        role: 'Admin'
      },
      {
        name: 'Runner User',
        email: 'runner@example.com',
        password: await hashPassword('runner123'),
        phone_number: '09876543210',
        role: 'Runner'
      },
      {
        name: 'Marshal User',
        email: 'marshal@example.com',
        password: await hashPassword('marshal123'),
        role: 'Marshal'
      }
    ];

    // Clear existing users
    console.log('Clearing existing users...');
    await prisma.users.deleteMany({});
    
    // Insert new users
    console.log('Creating new users...');
    for (const user of users) {
      await prisma.users.create({
        data: user
      });
      console.log(`Created user: ${user.name} (${user.role})`);
    }
    
    console.log('Seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers(); 