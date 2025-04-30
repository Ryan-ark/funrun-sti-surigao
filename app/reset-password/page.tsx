"use client";

import { Activity } from "lucide-react"
import { ResetPasswordForm } from "@/components/reset-password-form"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

// Loading component for Suspense
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';
  const [tokenValid, setTokenValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate token and email
    if (!token || !email) {
      setTokenValid(false);
      setError("Invalid password reset link. Please request a new one.");
      setIsLoading(false);
      return;
    }

    // Verify token with backend
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();
        if (!response.ok) {
          setTokenValid(false);
          setError(data.error || "This password reset link is invalid or has expired.");
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setTokenValid(false);
        setError("An error occurred while verifying your reset link.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, email]);

  return (
    <div className="w-full max-w-xs">
      {isLoading ? (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying your reset link...</p>
        </div>
      ) : tokenValid ? (
        <ResetPasswordForm token={token} email={email} />
      ) : (
        <div className="p-6 text-center">
          <div className="text-red-500 mb-4 text-5xl">✗</div>
          <h2 className="text-xl font-bold mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/forgot-password" 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Request New Link
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Activity className="size-4" />
            </div>
            STI Surigao Fun Run
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Suspense fallback={
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading reset password page...</p>
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
      <div className="bg-primary/10 relative hidden lg:block">
        <Image
          src="/assets/login_page.jpg"
          alt="Fun Run Event"
          fill
          className="object-cover"
          priority
          unoptimized
          onError={(e) => {
            // @ts-expect-error - type error with onError event
            e.target.onerror = null;
            // @ts-expect-error - type error with currentTarget.src
            e.target.src = "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1975&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent flex items-end p-10">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">Set Your New Password</h2>
            <p className="max-w-md">Create a strong, secure password to protect your STI Surigao Fun Run account.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 