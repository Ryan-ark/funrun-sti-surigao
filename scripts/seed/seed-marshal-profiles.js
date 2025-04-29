const { PrismaClient } = require('@prisma/client');

async function seedMarshalProfiles() {
  const prisma = new PrismaClient();
  
  try {
    // First, let's get the existing users that should have marshal profiles
    // Preferably the ones with Marshal role, but could be any user
    const users = await prisma.users.findMany({
      take: 3,
      orderBy: {
        role: 'asc', // Try to prioritize Marshals first
      }
    });
    
    if (users.length < 3) {
      console.error('Not enough users found. Make sure to seed users first.');
      return;
    }
    
    // Clear existing marshal profiles
    console.log('Clearing existing marshal profiles...');
    await prisma.marshal_profile.deleteMany({});
    
    // Sample marshal profiles data
    const profiles = [
      {
        user_id: users[0].id,
        date_of_birth: new Date('1985-07-12'),
        gender: 'Male',
        address: '123 Marshal Ave, Surigao City',
        organization_name: 'Surigao Running Club',
        role_position: 'Head Marshal',
        social_media_links: 'facebook.com/marshal1, instagram.com/marshal1',
        responsibilities: 'Route supervision, Safety coordination, Emergency response management'
      },
      {
        user_id: users[1].id,
        date_of_birth: new Date('1990-03-25'),
        gender: 'Female',
        address: '456 Safety St, Surigao City',
        organization_name: 'Surigao Athletics Association',
        role_position: 'Course Marshal',
        social_media_links: 'twitter.com/marshal2',
        responsibilities: 'Runner guidance, Traffic control, First aid assistance'
      },
      {
        user_id: users[2].id,
        date_of_birth: new Date('1992-11-05'),
        gender: 'Other',
        address: '789 Security Blvd, Surigao City',
        organization_name: 'STI Surigao Volunteers',
        role_position: 'Event Marshal',
        social_media_links: null,
        responsibilities: 'Start/finish line management, Checkpoint supervision, Timing coordination'
      }
    ];
    
    // Insert marshal profiles
    console.log('Creating marshal profiles...');
    for (const profile of profiles) {
      const user = users.find(u => u.id === profile.user_id);
      const createdProfile = await prisma.marshal_profile.create({
        data: profile
      });
      console.log(`Created marshal profile for user: ${user.name} (${user.role})`);
    }
    
    console.log('Seeding marshal profiles completed successfully!');
    
    // Print summary of the linked profiles
    console.log('\nMarshal Profile Summary:');
    const createdProfiles = await prisma.marshal_profile.findMany({
      include: {
        user: true
      }
    });
    
    createdProfiles.forEach(profile => {
      console.log(`\nMarshal: ${profile.user.name}`);
      console.log(`Organization: ${profile.organization_name}`);
      console.log(`Position: ${profile.role_position}`);
      console.log(`Responsibilities: ${profile.responsibilities}`);
    });
    
  } catch (error) {
    console.error('Error seeding marshal profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMarshalProfiles(); 