import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAppointment = await prisma.appointment.create({
      data: {
        clientId: body.clientId || null,
        clientName: body.clientName || null,
        title: body.title,
        type: body.type,
        date: body.date,
        time: body.time,
        duration: Number(body.duration),
        location: body.location || null,
        notes: body.notes || null,
        status: body.status || 'scheduled',
      },
    });
    return NextResponse.json(newAppointment);
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
