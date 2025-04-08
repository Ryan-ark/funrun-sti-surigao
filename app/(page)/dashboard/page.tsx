'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport on component mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener
    window.addEventListener("resize", checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-auto min-h-16 flex-col sm:flex-row shrink-0 items-center gap-2 border-b p-2">
          <div className="flex items-center gap-2 px-2 w-full sm:w-auto">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 hidden sm:block" />
            <Breadcrumb className="hidden sm:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <span className="sm:hidden font-medium">Dashboard</span>
          </div>
          <div className="flex w-full sm:w-auto justify-between sm:ml-auto sm:pr-4 sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                {!isMobile && "Refresh"}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-2 sm:p-4 pt-4 sm:pt-6 overflow-x-hidden">
          {/* Dashboard Summary Cards */}
          <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Card Title 1</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Placeholder data</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Card Title 2</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Placeholder data</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Card Title 3</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Placeholder data</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Card Title 4</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Placeholder data</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Chart Title 1</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Chart placeholder</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chart Title 2</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Chart placeholder</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Full-width Content Area</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground">Content placeholder</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
