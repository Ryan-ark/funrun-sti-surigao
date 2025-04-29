const { PrismaClient } = require('@prisma/client');

async function viewRunnerProfiles() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all runner profiles with their related user information
    const profiles = await prisma.runner_profile.findMany({
      include: {
        user: true
      }
    });
    
    console.log('Runner Profiles in database:');
    console.log('===========================\n');
    
    profiles.forEach(profile => {
      console.log(`User: ${profile.user.name} (${profile.user.email})`);
      console.log(`Role: ${profile.user.role}`);
      console.log(`Date of Birth: ${profile.date_of_birth.toISOString().split('T')[0]}`);
      console.log(`Gender: ${profile.gender}`);
      console.log(`Address: ${profile.address}`);
      console.log(`T-shirt Size: ${profile.tshirt_size}`);
      console.log('Emergency Contact:');
      console.log(`  Name: ${profile.emergency_contact_name}`);
      console.log(`  Phone: ${profile.emergency_contact_phone}`);
      console.log(`  Relationship: ${profile.emergency_contact_relationship}`);
      console.log('----------------------------\n');
    });
    
    console.log(`Total runner profiles: ${profiles.length}`);
    
  } catch (error) {
    console.error('Error fetching runner profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewRunnerProfiles(); 