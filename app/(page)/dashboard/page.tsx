'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Collection types
type Collection = 'users' | 'runner_profiles' | 'marshal_profiles' | 'events' | 
                'event_categories' | 'event_staff' | 'participants' | 'results';

// Pagination type
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Define a type for collection data items
type CollectionDataItem = Record<string, unknown>;

// Format value for display
const formatValue = (value: unknown): string => {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return '';
  }
  
  // Format date strings
  if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
    try {
      const date = new Date(value);
      return date.toLocaleString();
    } catch {
      return String(value);
    }
  }
  
  // Format objects
  if (typeof value === 'object') {
    return JSON.stringify(value).slice(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '');
  }
  
  // Return string representation
  return String(value).slice(0, 50) + (String(value).length > 50 ? '...' : '');
};

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeCollection, setActiveCollection] = useState<Collection>('users');
  const [collectionData, setCollectionData] = useState<CollectionDataItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for mobile viewport on component mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Fetch data based on active collection and pagination
  useEffect(() => {
    const fetchCollectionData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(
          `/api/collections/${activeCollection}?page=${pagination.page}&limit=${pagination.limit}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeCollection}`);
        }
        
        const result = await response.json();
        setCollectionData(result.data);
        setPagination(result.pagination);
      } catch (err) {
        console.error(`Error fetching ${activeCollection}:`, err);
        setError(`Failed to load ${activeCollection} data`);
        setCollectionData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollectionData();
  }, [activeCollection, pagination.page, pagination.limit]);

  const handleRefresh = () => {
    // Keep the same page and fetch again
    const fetchCollectionData = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch(
          `/api/collections/${activeCollection}?page=${pagination.page}&limit=${pagination.limit}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${activeCollection}`);
        }
        
        const result = await response.json();
        setCollectionData(result.data);
        setPagination(result.pagination);
      } catch (err) {
        console.error(`Error fetching ${activeCollection}:`, err);
        setError(`Failed to load ${activeCollection} data`);
        setCollectionData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollectionData();
  };

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Get collection stats
  const getCollectionStats = () => {
    return {
      totalItems: pagination.total
    };
  };

  // Render column headers based on first item in collection
  const renderTableHeaders = () => {
    if (collectionData.length === 0) return null;
    
    const item = collectionData[0];
    const keys = Object.keys(item);
    
    return (
      <TableHeader>
        <TableRow>
          {keys.map((key) => (
            <TableHead key={key}>{key.replace('_', ' ').toUpperCase()}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
    );
  };

  // Render table rows
  const renderTableRows = () => {
    if (collectionData.length === 0) return null;
    
    return (
      <TableBody>
        {collectionData.map((item, index) => (
          <TableRow key={index}>
            {Object.entries(item).map(([key, value]) => (
              <TableCell key={`${index}-${key}`}>
                {formatValue(value)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  // Collection statistics for cards
  const stats = getCollectionStats();

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
                  <BreadcrumbPage>Database Collections</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <span className="sm:hidden font-medium">Database Collections</span>
          </div>
          <div className="flex w-full sm:w-auto justify-between sm:ml-auto sm:pr-4 sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {!isMobile && "Refresh"}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-2 sm:p-4 pt-4 sm:pt-6 overflow-x-hidden">
          {/* Collection Tabs */}
          <Tabs 
            defaultValue="users" 
            value={activeCollection}
            onValueChange={(value) => {
              setActiveCollection(value as Collection);
              // Reset to page 1 when changing collections
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-1">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="runner_profiles">Runners</TabsTrigger>
              <TabsTrigger value="marshal_profiles">Marshals</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="event_categories">Categories</TabsTrigger>
              <TabsTrigger value="event_staff">Staff</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            {/* Dashboard Summary Cards */}
            <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">{activeCollection.replace('_', ' ').toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-12" /> : stats.totalItems}</div>
                  <p className="text-xs text-muted-foreground">Total items</p>
                </CardContent>
              </Card>
            </div>

            {/* Collection Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>{activeCollection.replace('_', ' ').toUpperCase()} Data</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : error ? (
                  <div className="text-center py-6 text-red-500">
                    {error}
                  </div>
                ) : collectionData.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No data found for {activeCollection}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <Table>
                        {renderTableHeaders()}
                        {renderTableRows()}
                      </Table>
                    </div>
                    
                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Showing page {pagination.page} of {pagination.totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            {!isMobile && <span className="ml-1">Previous</span>}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                          >
                            {!isMobile && <span className="mr-1">Next</span>}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
