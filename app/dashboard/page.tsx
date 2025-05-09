"use client";

import { useSession } from "next-auth/react";
import { RefreshCw } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [isMobile, setIsMobile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkIsMobile()
    
    // Add event listener
    window.addEventListener("resize", checkIsMobile)
    
    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile)
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <header className="flex h-auto min-h-16 flex-col sm:flex-row shrink-0 items-center gap-2 border-b p-2">
        <div className="flex items-center gap-2 px-2 w-full sm:w-auto">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
          <Breadcrumb className="hidden sm:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span className="sm:hidden font-medium">Dashboard</span>
        </div>
        <div className="flex w-full sm:w-auto justify-between sm:ml-auto sm:pr-4 flex sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-1 sm:gap-2 ${isRefreshing ? 'opacity-50' : ''}`}
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {!isMobile && "Refresh"}
          </Button>
        </div>
      </header>

      <div className="space-y-6 p-6">
        <div className="bg-card shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Welcome to Your Dashboard</h2>
          <p className="text-foreground-secondary">
            You are logged in as <strong className="text-foreground">{session?.user?.name}</strong> with role: <strong className="text-foreground">{userRole}</strong>
          </p>
        </div>

        {/* Role-specific content */}
        {userRole === "Admin" && (
          <div className="bg-card shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Admin Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-foreground">Events</h4>
                <p className="text-sm text-foreground-secondary">Manage all fun run events</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-foreground">Users</h4>
                <p className="text-sm text-foreground-secondary">Manage registered users</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-foreground">Categories</h4>
                <p className="text-sm text-foreground-secondary">Manage event categories</p>
              </div>
            </div>
          </div>
        )}

        {userRole === "Runner" && (
          <div className="bg-card shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Runner Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-foreground">My Events</h4>
                <p className="text-sm text-foreground-secondary">View your registered events</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-foreground">Results</h4>
                <p className="text-sm text-foreground-secondary">View your event results</p>
              </div>
            </div>
          </div>
        )}

        {userRole === "Marshal" && (
          <div className="bg-card shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Marshal Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-foreground">Assigned Events</h4>
                <p className="text-sm text-foreground-secondary">View events you&apos;re managing</p>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-medium text-foreground">Record Results</h4>
                <p className="text-sm text-foreground-secondary">Record participant results</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 