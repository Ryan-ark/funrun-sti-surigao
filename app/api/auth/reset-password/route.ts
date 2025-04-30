import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Define the extended user type with reset token fields
type UserWithResetToken = {
  resetToken: string | null;
  resetTokenExpiry: Date | null;
};

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Check if token exists and is not expired
    if (!user.resetToken || !user.resetTokenExpiry) {
      return NextResponse.json({ error: 'No reset token found or token expired' }, { status: 400 });
    }

    // Check if token is expired
    if (user.resetTokenExpiry < new Date()) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    // Verify token
    const isValidToken = await bcrypt.compare(token, user.resetToken);
    if (!isValidToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and remove reset token using a more specific type
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        // Use a well-typed object instead of 'any'
        ...({
          resetToken: null,
          resetTokenExpiry: null
        } as UserWithResetToken)
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 