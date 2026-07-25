import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const commissions = await prisma.commission.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(commissions);
  } catch (error) {
    console.error('Failed to fetch commissions:', error);
    return NextResponse.json({ error: 'Failed to fetch commissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCommission = await prisma.commission.create({
      data: {
        clientId: body.clientId,
        policyId: body.policyId || null,
        company: body.company,
        type: body.type,
        amount: Number(body.amount),
        month: body.month,
        status: body.status,
        paidDate: body.paidDate || null,
      },
    });
    return NextResponse.json(newCommission);
  } catch (error) {
    console.error('Failed to create commission:', error);
    return NextResponse.json({ error: 'Failed to create commission' }, { status: 500 });
  }
}
