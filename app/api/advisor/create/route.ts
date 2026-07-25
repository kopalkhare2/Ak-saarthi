import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ensureSeeded } from '@/lib/init-db';

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

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (existingUser.role === 'advisor') {
        return NextResponse.json(
          { error: `An Advisor account already exists for ${email}.` },
          { status: 400 }
        );
      } else {
        // Upgrade client user to advisor role and update password
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            role: 'advisor',
            password: hashedPassword,
          },
        });

        // Also mark any pending access request as approved
        await prisma.advisorAccessRequest.updateMany({
          where: { email },
          data: { status: 'approved' },
        });

        return NextResponse.json({
          success: true,
          message: `User ${email} upgraded to Advisor access!`,
          user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
        });
      }
    }

    // Create new Advisor user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'advisor',
      },
    });

    // Mark any pending access request as approved
    await prisma.advisorAccessRequest.updateMany({
      where: { email },
      data: { status: 'approved' },
    });

    return NextResponse.json({
      success: true,
      message: `Advisor account successfully created for ${email}`,
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error: any) {
    console.error('Failed to create advisor:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create advisor account' },
      { status: 500 }
    );
  }
}
