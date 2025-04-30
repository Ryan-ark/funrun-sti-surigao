"use client";

import { authenticate } from "@/app/lib/actions";
import { AuthForm, FormData } from "@/components/ui/auth-form";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface LoginFormData extends FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const loginFields = [
    {
      id: "email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
      label: "Email",
    },
    {
      id: "password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
      label: "Password",
    },
  ];

  const processForm = async (data: LoginFormData) => {
    setError(undefined);
    setIsLoading(true);
    
    try {
      const result = await authenticate(data.email, data.password);
      
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      
      console.log("Login successful, redirecting to dashboard");
      
      // Update the session before navigating
      await update();
      
      // Use Next.js router for navigation instead of window.location
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-gray-600">
          Sign in to access your account
        </p>
      </div>
      
      <AuthForm<LoginFormData>
        fields={loginFields}
        register={register}
        errors={errors}
        submitLabel={isLoading ? "Signing in..." : "Sign In"}
        onSubmit={handleSubmit(processForm)}
        error={error}
        isLoading={isLoading}
        footer={
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        }
      />
    </div>
  );
} 