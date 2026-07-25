import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSeeded } from '@/lib/init-db';

// GET: Fetch all advisor access requests
export async function GET() {
  try {
    await ensureSeeded();
    const requests = await prisma.advisorAccessRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error('Failed to fetch advisor access requests:', error);
    return NextResponse.json({ error: 'Failed to fetch access requests' }, { status: 500 });
  }
}

// POST: Submit a new advisor access request from website
export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const { name, email: rawEmail, phone } = await request.json();

    if (!name || !rawEmail || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required' },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase().trim();

    // Check if pending request already exists
    const existing = await prisma.advisorAccessRequest.findFirst({
      where: { email, status: 'pending' },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'An access request for this email is already pending approval.', request: existing },
        { status: 200 }
      );
    }

    const newRequest = await prisma.advisorAccessRequest.create({
      data: {
        name,
        email,
        phone,
        status: 'pending',
      },
    });

    // Also create a high priority task so advisor sees it on dashboard/tasks page
    try {
      await prisma.task.create({
        data: {
          title: `Advisor Access Request: ${name}`,
          description: `Email: ${email} | Phone: ${phone} | Requested access as financial advisor.`,
          priority: 'high',
          status: 'todo',
        },
      });
    } catch (e) {
      // Non-critical task creation error
    }

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    console.error('Failed to submit advisor access request:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}

// PUT: Update request status (approve/decline)
export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.advisorAccessRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Failed to update access request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
