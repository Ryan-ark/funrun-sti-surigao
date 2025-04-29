"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-600">
          You are logged in as <strong>{session?.user?.name}</strong> with role: <strong>{userRole}</strong>
        </p>
      </div>

      {/* Role-specific content */}
      {userRole === "Admin" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Admin Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium">Events</h4>
              <p className="text-sm text-gray-600">Manage all fun run events</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium">Users</h4>
              <p className="text-sm text-gray-600">Manage registered users</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium">Categories</h4>
              <p className="text-sm text-gray-600">Manage event categories</p>
            </div>
          </div>
        </div>
      )}

      {userRole === "Runner" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Runner Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium">My Events</h4>
              <p className="text-sm text-gray-600">View your registered events</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium">Results</h4>
              <p className="text-sm text-gray-600">View your event results</p>
            </div>
          </div>
        </div>
      )}

      {userRole === "Marshal" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Marshal Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium">Assigned Events</h4>
              <p className="text-sm text-gray-600">View events you&apos;re managing</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium">Record Results</h4>
              <p className="text-sm text-gray-600">Record participant results</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 