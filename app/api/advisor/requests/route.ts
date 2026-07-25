import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureSeeded } from '@/lib/init-db';
import { getStoreRequests, saveStoreRequest, updateStoreRequestStatus } from '@/lib/kv-store';

// GET: Fetch all advisor access requests
export async function GET() {
  try {
    await ensureSeeded();
    let dbRequests: any[] = [];
    try {
      dbRequests = await prisma.advisorAccessRequest.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {}

    const storeRequests = getStoreRequests();

    // Merge store requests and DB requests seamlessly
    const mergedMap = new Map<string, any>();
    dbRequests.forEach((r) => mergedMap.set(r.email.toLowerCase(), r));
    storeRequests.forEach((r) => mergedMap.set(r.email.toLowerCase(), r));

    const allRequests = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allRequests);
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
    const newReqItem = {
      id: `req-${Date.now()}`,
      name,
      email,
      phone,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    saveStoreRequest(newReqItem);

    try {
      await prisma.advisorAccessRequest.create({
        data: {
          name,
          email,
          phone,
          status: 'pending',
        },
      });

      await prisma.task.create({
        data: {
          title: `Advisor Access Request: ${name}`,
          description: `Email: ${email} | Phone: ${phone} | Requested access as financial advisor.`,
          priority: 'high',
          status: 'todo',
        },
      });
    } catch (dbErr) {
      console.warn('DB write bypassed for request (saved in KV store):', dbErr);
    }

    return NextResponse.json(newReqItem, { status: 201 });
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

    updateStoreRequestStatus(id, status);

    try {
      await prisma.advisorAccessRequest.update({
        where: { id },
        data: { status },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, id, status });
  } catch (error: any) {
    console.error('Failed to update access request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
