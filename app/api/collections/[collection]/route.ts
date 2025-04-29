import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Type-safe route handler with simpler parameter structure
export async function GET(request: NextRequest) {
  // Extract collection from the URL path
  const pathname = request.nextUrl.pathname;
  const collection = pathname.split('/').pop() || '';
  
  // Get search params for pagination
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const skip = (page - 1) * limit;

  try {
    let data = [];
    let totalCount = 0;

    // Map collection name to Prisma model
    switch (collection) {
      case 'users':
        totalCount = await prisma.users.count();
        data = await prisma.users.findMany({
          select: {
            id: true, 
            name: true, 
            email: true, 
            phone_number: true, 
            role: true, 
            created_at: true,
            updated_at: true
            // Explicitly exclude password
          },
          take: limit,
          skip: skip
        });
        break;
      case 'runner_profiles':
        totalCount = await prisma.runner_profile.count();
        data = await prisma.runner_profile.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          take: limit,
          skip: skip
        });
        break;
      case 'marshal_profiles':
        totalCount = await prisma.marshal_profile.count();
        data = await prisma.marshal_profile.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          take: limit,
          skip: skip
        });
        break;
      case 'events':
        totalCount = await prisma.events.count();
        data = await prisma.events.findMany({
          include: {
            creator: {
              select: {
                name: true
              }
            }
          },
          take: limit,
          skip: skip
        });
        break;
      case 'event_categories':
        totalCount = await prisma.event_categories.count();
        data = await prisma.event_categories.findMany({
          include: {
            creator: {
              select: {
                name: true
              }
            }
          },
          take: limit,
          skip: skip
        });
        break;
      case 'event_staff':
        totalCount = await prisma.event_staff.count();
        data = await prisma.event_staff.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            },
            event: {
              select: {
                event_name: true
              }
            }
          },
          take: limit,
          skip: skip
        });
        break;
      case 'participants':
        totalCount = await prisma.participants.count();
        data = await prisma.participants.findMany({
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            },
            category: {
              select: {
                category_name: true
              }
            }
          },
          take: limit,
          skip: skip
        });
        break;
      case 'results':
        totalCount = await prisma.results.count();
        data = await prisma.results.findMany({
          include: {
            participant: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            },
            category: {
              select: {
                category_name: true
              }
            }
          },
          take: limit,
          skip: skip
        });
        break;
      default:
        return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({
      data,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${collection}` },
      { status: 500 }
    );
  }
} 