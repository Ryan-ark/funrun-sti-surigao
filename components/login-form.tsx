"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { authenticate } from "@/app/lib/actions"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useTheme } from "@/app/context/ThemeContext"

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const { theme } = useTheme();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

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
    <form 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
      onSubmit={handleSubmit(processForm)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            {...register("email", { required: true })}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">Email is required</p>
          )}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Link
              href="#"
              className="ml-auto text-sm text-accent hover:text-accent/90 underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password", { required: true })}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-destructive text-xs mt-1">Password is required</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm text-foreground-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-accent hover:text-accent/90 underline-offset-4 hover:underline">
          Register
        </Link>
      </div>
    </form>
  )
}
