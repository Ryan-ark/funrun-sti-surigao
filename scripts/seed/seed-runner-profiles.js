const { PrismaClient } = require('@prisma/client');

async function seedRunnerProfiles() {
  const prisma = new PrismaClient();
  
  try {
    // First, let's get the existing users that should have runner profiles
    // Preferably the one with Runner role, but could be any user
    const users = await prisma.users.findMany({
      take: 3,
      orderBy: {
        role: 'asc', // Try to prioritize Runners first
      }
    });
    
    if (users.length < 3) {
      console.error('Not enough users found. Make sure to seed users first.');
      return;
    }
    
    // Clear existing profiles
    console.log('Clearing existing runner profiles...');
    await prisma.runner_profile.deleteMany({});
    
    // Sample runner profiles data
    const profiles = [
      {
        user_id: users[0].id,
        date_of_birth: new Date('1990-05-15'),
        gender: 'Male',
        address: '123 Runner St, Surigao City',
        tshirt_size: 'M',
        emergency_contact_name: 'Emergency Contact 1',
        emergency_contact_phone: '09111222333',
        emergency_contact_relationship: 'Spouse'
      },
      {
        user_id: users[1].id,
        date_of_birth: new Date('1988-10-20'),
        gender: 'Female',
        address: '456 Marathon Ave, Surigao City',
        tshirt_size: 'S',
        emergency_contact_name: 'Emergency Contact 2',
        emergency_contact_phone: '09222333444',
        emergency_contact_relationship: 'Parent'
      },
      {
        user_id: users[2].id,
        date_of_birth: new Date('1995-03-12'),
        gender: 'Other',
        address: '789 Sprint Blvd, Surigao City',
        tshirt_size: 'L',
        emergency_contact_name: 'Emergency Contact 3',
        emergency_contact_phone: '09333444555',
        emergency_contact_relationship: 'Sibling'
      }
    ];
    
    // Insert runner profiles
    console.log('Creating runner profiles...');
    for (const profile of profiles) {
      const user = users.find(u => u.id === profile.user_id);
      const createdProfile = await prisma.runner_profile.create({
        data: profile
      });
      console.log(`Created profile for user: ${user.name} (${user.role})`);
    }
    
    console.log('Seeding runner profiles completed successfully!');
    
    // Print summary of the linked profiles
    console.log('\nRunner Profile Summary:');
    const createdProfiles = await prisma.runner_profile.findMany({
      include: {
        user: true
      }
    });
    
    createdProfiles.forEach(profile => {
      console.log(`\nRunner: ${profile.user.name}`);
      console.log(`Gender: ${profile.gender}`);
      console.log(`T-shirt Size: ${profile.tshirt_size}`);
      console.log(`Emergency Contact: ${profile.emergency_contact_name} (${profile.emergency_contact_relationship})`);
    });
    
  } catch (error) {
    console.error('Error seeding runner profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRunnerProfiles(); 