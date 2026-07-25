import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const investments = await prisma.investment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(investments);
  } catch (error) {
    console.error('Failed to fetch investments:', error);
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newInvestment = await prisma.investment.create({
      data: {
        clientId: body.clientId,
        type: body.type,
        schemeName: body.schemeName,
        fundHouse: body.fundHouse || null,
        investedAmount: Number(body.investedAmount),
        currentValue: Number(body.currentValue),
        returns: Number(body.returns),
        sipAmount: body.sipAmount ? Number(body.sipAmount) : null,
        sipDate: body.sipDate ? Number(body.sipDate) : null,
        startDate: body.startDate,
        maturityDate: body.maturityDate || null,
        status: body.status,
      },
    });
    return NextResponse.json(newInvestment);
  } catch (error) {
    console.error('Failed to create investment:', error);
    return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
  }
}
