import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ensureSeeded } from '@/lib/init-db';
import { saveStoreAdvisor, updateStoreRequestStatus, getStoreAdvisors } from '@/lib/kv-store';

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const { email: rawEmail, password } = await request.json();

    if (!rawEmail || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const email = rawEmail.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to persistent KV store first so authentication works 100%
    const newAdvisorRecord = {
      id: `advisor-${Date.now()}`,
      email,
      passwordHash: hashedPassword,
      role: 'advisor' as const,
      createdAt: new Date().toISOString(),
    };
    saveStoreAdvisor(newAdvisorRecord);

    // Attempt Prisma DB insert/update as well
    try {
      const existingUser = await prisma.user.findFirst({
        where: { email: { equals: email } },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: 'advisor', password: hashedPassword },
        });
      } else {
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            role: 'advisor',
          },
        });
      }

      await prisma.advisorAccessRequest.updateMany({
        where: { email },
        data: { status: 'approved' },
      });
    } catch (dbErr) {
      console.warn('Prisma DB write bypassed (handled via KV store):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Advisor account successfully created for ${email}`,
      user: { email, role: 'advisor' },
    });
  } catch (error: any) {
    console.error('Failed to create advisor:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create advisor account' },
      { status: 500 }
    );
  }
}
