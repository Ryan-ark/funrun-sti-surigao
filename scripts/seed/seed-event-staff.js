const { PrismaClient } = require('@prisma/client');

async function seedEventStaff() {
  const prisma = new PrismaClient();
  
  try {
    // First, find marshals and admins who can be assigned to events
    const staffUsers = await prisma.users.findMany({
      where: {
        OR: [
          { role: 'Marshal' },
          { role: 'Admin' }
        ]
      }
    });
    
    if (staffUsers.length === 0) {
      console.error('No Marshal or Admin users found to assign as event staff.');
      return;
    }
    
    // Get existing events
    const events = await prisma.events.findMany();
    
    if (events.length === 0) {
      console.error('No events found to assign staff to.');
      return;
    }
    
    // Clear existing event staff assignments
    console.log('Clearing existing event staff assignments...');
    await prisma.event_staff.deleteMany({});
    
    // Prepare staff assignments (different role combinations for each event)
    const staffAssignments = [];
    
    // Use all available staff members up to 3 events
    const eventCount = Math.min(events.length, 3);
    
    for (let i = 0; i < eventCount; i++) {
      const event = events[i];
      
      // For each event, assign staff in different roles
      const availableStaff = [...staffUsers];
      
      // Get 1 to 3 staff members for each event (depending on how many are available)
      const staffCount = Math.min(availableStaff.length, 3);
      
      for (let j = 0; j < staffCount; j++) {
        // Assign different roles
        let role;
        let responsibilities;
        
        if (j === 0) {
          role = 'EventMarshal';
          responsibilities = 'Overall event coordination, safety management, emergency response oversight';
        } else if (j === 1) {
          role = 'SubMarshal';
          responsibilities = 'Runner guidance, route supervision, checkpoint management';
        } else {
          role = 'Coordinator';
          responsibilities = 'Registration assistance, refreshment distribution, finish line support';
        }
        
        staffAssignments.push({
          event_id: event.id,
          user_id: availableStaff[j].id,
          role_in_event: role,
          responsibilities: responsibilities
        });
      }
    }
    
    // Insert staff assignments
    console.log('Creating event staff assignments...');
    
    for (const assignment of staffAssignments) {
      const staff = staffUsers.find(u => u.id === assignment.user_id);
      const event = events.find(e => e.id === assignment.event_id);
      
      await prisma.event_staff.create({
        data: assignment
      });
      
      console.log(`Assigned ${staff.name} as ${assignment.role_in_event} to "${event.event_name}"`);
    }
    
    console.log('Event staff assignments completed successfully!');
    
    // Print summary of staff assignments
    console.log('\nEvent Staff Summary:');
    const eventStaff = await prisma.event_staff.findMany({
      include: {
        event: true,
        user: true
      }
    });
    
    const eventStaffByEvent = {};
    
    // Group staff by event
    eventStaff.forEach(staff => {
      if (!eventStaffByEvent[staff.event.event_name]) {
        eventStaffByEvent[staff.event.event_name] = [];
      }
      eventStaffByEvent[staff.event.event_name].push(staff);
    });
    
    // Display staff by event
    for (const [eventName, staffList] of Object.entries(eventStaffByEvent)) {
      console.log(`\nEvent: ${eventName}`);
      console.log('Staff:');
      
      staffList.forEach(staff => {
        console.log(`- ${staff.user.name} (${staff.role_in_event})`);
        console.log(`  Responsibilities: ${staff.responsibilities}`);
        console.log(`  Assigned on: ${staff.assigned_at.toLocaleDateString()}`);
      });
    }
    
  } catch (error) {
    console.error('Error seeding event staff:', error);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

seedEventStaff(); 