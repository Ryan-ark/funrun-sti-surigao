"use client";

import { Activity } from "lucide-react"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
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
          <div className="w-full max-w-xs">
            <ForgotPasswordForm />
          </div>
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
            <h2 className="text-2xl font-bold mb-2">Need to Reset Your Password?</h2>
            <p className="max-w-md">We'll help you get back into your account. Enter your email to receive password reset instructions.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 