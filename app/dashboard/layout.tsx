"use client";

import { signOut } from "@/app/lib/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const userRole = session?.user?.role;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Fun Run App</h2>
          <p className="text-sm text-gray-600">Welcome, {session?.user?.name}</p>
          <p className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 mt-1 inline-block">
            {userRole}
          </p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Dashboard
              </Link>
            </li>
            
            {/* Admin specific links */}
            {userRole === "Admin" && (
              <>
                <li>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/events"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Manage Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Manage Users
                  </Link>
                </li>
              </>
            )}
            
            {/* Runner specific links */}
            {(userRole === "Runner" || userRole === "Admin") && (
              <>
                <li>
                  <Link
                    href="/runner"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Runner Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/runner/events"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    My Events
                  </Link>
                </li>
              </>
            )}
            
            {/* Marshal specific links */}
            {(userRole === "Marshal" || userRole === "Admin") && (
              <>
                <li>
                  <Link
                    href="/marshal"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Marshal Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marshal/events"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Managed Events
                  </Link>
                </li>
              </>
            )}
            
            <li>
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                My Profile
              </Link>
            </li>
            
            <li>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="py-4 px-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
        </header>
        
        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 