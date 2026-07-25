import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showTrash = searchParams.get('trash') === 'true';

    const clients = await prisma.client.findMany({
      where: {
        isDeleted: showTrash,
      },
      include: {
        family: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Map dates to match original schema and string-based representation
    const formattedClients = clients.map(client => ({
      ...client,
      // Convert database notes (if any) and other properties to match typescript structures
      notes: [], // API has a separate notes table/handling if needed or simple array
    }));

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { family, notes, ...clientData } = body;

    // Create client along with family members
    const newClient = await prisma.client.create({
      data: {
        ...clientData,
        family: {
          create: family?.map((member: any) => ({
            name: member.name,
            relation: member.relation,
            dob: member.dob || null,
            phone: member.phone || null,
          })) || [],
        },
      },
      include: {
        family: true,
      },
    });

    return NextResponse.json(newClient);
  } catch (error: any) {
    console.error('Failed to create client:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A client with this email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}
