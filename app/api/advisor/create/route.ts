import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email: rawEmail, password, name } = await request.json();

    if (!rawEmail || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase().trim();

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: `An account with ${email} already exists.` },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'advisor',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Advisor account created for ${email}`,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error('Failed to create advisor:', error);
    return NextResponse.json({ error: 'Failed to create advisor account' }, { status: 500 });
  }
}
