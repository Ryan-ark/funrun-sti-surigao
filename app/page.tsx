"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Fun Run App</h1>
          <div className="space-x-4">
            {status === "authenticated" ? (
              <Link
                href="/dashboard"
                className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-block text-accent hover:text-accent/90 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-foreground mb-4">
              Welcome to the Fun Run Event Platform
            </h2>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-8">
              Join us for exciting running events, track your progress, and connect with other runners.
            </p>
            {status !== "authenticated" && (
              <div className="mt-8 flex justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-accent-foreground bg-accent hover:bg-accent/90"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Participate in Events</h3>
              <p className="text-foreground-secondary">
                Register for upcoming fun run events and track your participation.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-foreground">View Your Results</h3>
              <p className="text-foreground-secondary">
                Check your race results and compare with other participants.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Connect with Runners</h3>
              <p className="text-foreground-secondary">
                Join the running community and share your experiences.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Fun Run App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
