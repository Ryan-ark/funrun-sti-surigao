import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Create a transporter object using environment variables or fallback to hardcoded Mailtrap values
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER || "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.EMAIL_PORT || "2525"),
  auth: {
    user: process.env.EMAIL_USER || "1027899dab9ad8", // Fallback to actual Mailtrap credentials
    pass: process.env.EMAIL_PASSWORD || "cc5a3cfa20e34e"
  }
});

// Verify the transporter is ready
transporter.verify(function(error) {
  if (error) {
    console.error("Error with email configuration:", error);
  }
});

// Define the extended user type with reset token fields
type UserWithResetToken = {
  resetToken: string;
  resetTokenExpiry: Date;
};

// Function to get the base URL for the application
function getBaseUrl() {
  // For Vercel production environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // For Vercel preview deployments
  if (process.env.VERCEL_DEPLOYMENT_URL) {
    return `https://${process.env.VERCEL_DEPLOYMENT_URL}`;
  }
  
  // For custom domains configured with NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  
  // Fallback for local development
  return 'http://localhost:3000';
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't reveal if the email exists or not
      return NextResponse.json({ success: true });
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token and expiry in database
    try {
      await prisma.users.update({
        where: { id: user.id },
        data: {
          // Use a well-typed object instead of 'any'
          ...({
            resetToken: resetTokenHash,
            resetTokenExpiry: tokenExpiry
          } as UserWithResetToken)
        },
      });
    } catch (updateError) {
      console.error("Error updating user:", updateError);
      throw updateError;
    }

    // Create reset URL using the proper base URL
    const baseUrl = getBaseUrl();
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Configure email
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"STI Surigao Fun Run" <noreply@stisurigao.com>`,
      to: email,
      subject: 'Password Reset Instructions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password for your STI Surigao Fun Run account.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0070f3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>Regards,<br>STI Surigao Fun Run Team</p>
        </div>
      `,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 