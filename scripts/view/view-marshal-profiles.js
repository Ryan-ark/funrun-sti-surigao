const { PrismaClient } = require('@prisma/client');

async function viewMarshalProfiles() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all marshal profiles with their related user information
    const profiles = await prisma.marshal_profile.findMany({
      include: {
        user: true
      }
    });
    
    console.log('Marshal Profiles in database:');
    console.log('===========================\n');
    
    profiles.forEach(profile => {
      console.log(`User: ${profile.user.name} (${profile.user.email})`);
      console.log(`Role: ${profile.user.role}`);
      console.log(`Date of Birth: ${profile.date_of_birth.toISOString().split('T')[0]}`);
      console.log(`Gender: ${profile.gender}`);
      console.log(`Address: ${profile.address}`);
      console.log(`Organization: ${profile.organization_name}`);
      console.log(`Position: ${profile.role_position}`);
      console.log(`Social Media: ${profile.social_media_links || 'None provided'}`);
      console.log(`Responsibilities: ${profile.responsibilities}`);
      console.log('----------------------------\n');
    });
    
    console.log(`Total marshal profiles: ${profiles.length}`);
    
  } catch (error) {
    console.error('Error fetching marshal profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

viewMarshalProfiles(); 