"use client";

import { registerUser } from "@/app/lib/actions";
import { AuthForm, FormData } from "@/components/ui/auth-form";
import { Role } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterFormData extends FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const registerFields = [
    {
      id: "name",
      name: "name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
      label: "Full Name",
    },
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
      placeholder: "Choose a password",
      required: true,
      label: "Password",
    },
    {
      id: "phoneNumber",
      name: "phoneNumber",
      type: "tel",
      placeholder: "Enter your phone number (optional)",
      required: false,
      label: "Phone Number",
    },
    {
      id: "role",
      name: "role",
      type: "select",
      required: true,
      label: "Register as",
      options: [
        { value: "Runner", label: "Runner" },
        { value: "Marshal", label: "Marshal" },
      ],
    },
  ];

  const processForm = async (data: RegisterFormData) => {
    setError(undefined);
    
    try {
      const result = await registerUser(
        data.name,
        data.email,
        data.password,
        data.role as Role,
        data.phoneNumber || undefined
      );
      
      if (result.error) {
        setError(result.error);
        return;
      }
      
      // Redirect to login page after successful registration
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="mt-2 text-gray-600">
          Join us and participate in exciting fun run events
        </p>
      </div>
      
      <AuthForm<RegisterFormData>
        fields={registerFields}
        register={register}
        errors={errors}
        submitLabel="Create Account"
        onSubmit={handleSubmit(processForm)}
        error={error}
        footer={
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        }
      />
    </div>
  );
} 