"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const userRole = session?.user?.role;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
              <p className="text-gray-600">{session?.user?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {userRole}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>{session?.user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{session?.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p>{userRole}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account ID</p>
                  <p className="text-sm">{session?.user?.id}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Role-specific profile information */}
          {userRole === "Runner" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Runner Profile</h3>
              <p className="text-gray-600 mb-2">
                Configure your runner-specific information for event participation.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                Update Runner Profile
              </button>
            </div>
          )}
          
          {userRole === "Marshal" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Marshal Profile</h3>
              <p className="text-gray-600 mb-2">
                Configure your marshal-specific information for event management.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                Update Marshal Profile
              </button>
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Account Settings</h3>
            <div className="space-y-3">
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300">
                Change Password
              </button>
              <button className="w-full sm:w-auto ml-0 sm:ml-2 mt-2 sm:mt-0 px-4 py-2 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 