import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { getJwtSecret } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ak_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret()) as {
        userId: string;
        email: string;
        role: string;
        clientId?: string;
      };

      return NextResponse.json({
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          clientId: decoded.clientId,
        },
      });
    } catch (err) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
