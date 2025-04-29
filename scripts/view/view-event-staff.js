const { PrismaClient } = require('@prisma/client');

async function viewEventStaff() {
  const prisma = new PrismaClient();
  
  try {
    // Fetch all events with their staff
    const events = await prisma.events.findMany({
      include: {
        creator: true,
        event_staff: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        event_date: 'asc'
      }
    });
    
    console.log('Events with Staff:');
    console.log('================\n');
    
    events.forEach(event => {
      console.log(`Event: ${event.event_name}`);
      console.log(`Date: ${event.event_date.toLocaleDateString()} at ${event.event_date.toLocaleTimeString()}`);
      console.log(`Location: ${event.location}`);
      console.log(`Created by: ${event.creator.name} (${event.creator.role})`);
      
      if (event.event_staff && event.event_staff.length > 0) {
        console.log('\nAssigned Staff:');
        
        // Group staff by role
        const staffByRole = {
          EventMarshal: [],
          SubMarshal: [],
          Coordinator: []
        };
        
        event.event_staff.forEach(staff => {
          staffByRole[staff.role_in_event].push(staff);
        });
        
        // Display staff by role
        for (const role of Object.keys(staffByRole)) {
          if (staffByRole[role].length > 0) {
            console.log(`\n${role}s:`);
            staffByRole[role].forEach(staff => {
              console.log(`- ${staff.user.name} (${staff.user.email})`);
              console.log(`  Responsibilities: ${staff.responsibilities}`);
              console.log(`  Assigned on: ${staff.assigned_at.toLocaleDateString()}`);
            });
          }
        }
      } else {
        console.log('No staff assigned to this event yet.');
      }
      
      console.log('----------------------------\n');
    });
    
    // Also provide a summary of staff members and their event assignments
    console.log('\nStaff Members and Their Assignments:');
    console.log('=================================\n');
    
    const staffMembers = await prisma.users.findMany({
      where: {
        event_staff: {
          some: {}
        }
      },
      include: {
        event_staff: {
          include: {
            event: true
          }
        }
      }
    });
    
    staffMembers.forEach(staff => {
      console.log(`Staff Member: ${staff.name} (${staff.role})`);
      console.log(`Contact: ${staff.email}`);
      
      if (staff.event_staff && staff.event_staff.length > 0) {
        console.log('Event Assignments:');
        staff.event_staff.forEach(assignment => {
          console.log(`- ${assignment.event.event_name} (${assignment.role_in_event})`);
          console.log(`  Date: ${assignment.event.event_date.toLocaleDateString()}`);
          console.log(`  Responsibilities: ${assignment.responsibilities}`);
        });
      }
      
      console.log('----------------------------\n');
    });
    
  } catch (error) {
    console.error('Error fetching event staff:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

viewEventStaff(); 