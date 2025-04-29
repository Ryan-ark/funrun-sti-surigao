import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { Role } from "@prisma/client";

export async function authenticate(email: string, password: string) {
  try {
    const result = await nextAuthSignIn("credentials", { 
      email, 
      password,
      redirect: false, // Prevent NextAuth from redirecting automatically
    });
    
    if (result?.error) {
      return { error: "Invalid credentials" };
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      // Check if it's an auth error based on message
      const errorMessage = error.message || "";
      if (errorMessage.includes("CredentialsSignin")) {
        return { error: "Invalid credentials" };
      }
      return { error: "Something went wrong" };
    }
    throw error;
  }
}

export async function signOut() {
  await nextAuthSignOut();
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: Role,
  phoneNumber?: string
) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        phoneNumber,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to register user" };
    }

    return { success: data.success, userId: data.userId };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register user" };
  }
} 