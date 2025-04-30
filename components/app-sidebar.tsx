"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Settings,
  Users,
  Calendar,
  ClipboardList,
  Medal,
  User
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isMobile, setIsMobile] = useState(false)
  const { data: session } = useSession()
  const userRole = session?.user?.role || "Guest"
  
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 1024)
      }
      
      // Initial check
      checkIsMobile()
      
      // Add event listener
      window.addEventListener("resize", checkIsMobile)
      
      // Clean up
      return () => window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  // User data for NavUser component
  const userData = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "guest@example.com",
    avatar: "/avatars/admin.jpg", // Default avatar since session.user.image doesn't exist
  }

  // Teams data for TeamSwitcher component
  const teamsData = [
    {
      name: "Funrun STI Surigao",
      logo: GalleryVerticalEnd,
      plan: userRole,
    }
  ]

  // Define common navigation items
  const commonNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        }
      ],
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: User,
      items: [
        {
          title: "Settings",
          url: "/profile/settings",
        }
      ],
    }
  ]

  // Define admin-specific navigation items
  const adminNavItems = [
    ...commonNavItems,
    {
      title: "Admin",
      url: "/admin",
      icon: Settings,
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        }
      ],
    },
    {
      title: "Events",
      url: "/admin/events",
      icon: Calendar,
      items: [
        {
          title: "Manage Events",
          url: "/admin/events",
        },
        {
          title: "Categories",
          url: "/admin/events/categories",
        }
      ],
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
      items: [
        {
          title: "Manage Users",
          url: "/admin/users",
        }
      ],
    }
  ]

  // Define runner-specific navigation items
  const runnerNavItems = [
    ...commonNavItems,
    {
      title: "Runner",
      url: "/runner",
      icon: Medal,
      items: [
        {
          title: "Dashboard",
          url: "/runner",
        }
      ],
    },
    {
      title: "Events",
      url: "/runner/events",
      icon: Calendar,
      items: [
        {
          title: "My Events",
          url: "/runner/events",
        },
        {
          title: "Results",
          url: "/runner/events/results",
        }
      ],
    }
  ]

  // Define marshal-specific navigation items
  const marshalNavItems = [
    ...commonNavItems,
    {
      title: "Marshal",
      url: "/marshal",
      icon: ClipboardList,
      items: [
        {
          title: "Dashboard",
          url: "/marshal",
        }
      ],
    },
    {
      title: "Events",
      url: "/marshal/events",
      icon: Calendar,
      items: [
        {
          title: "Managed Events",
          url: "/marshal/events",
        },
        {
          title: "Record Results",
          url: "/marshal/events/record",
        }
      ],
    }
  ]

  // Select navigation items based on user role
  let navItems = commonNavItems
  
  if (userRole === "Admin") {
    navItems = adminNavItems
  } else if (userRole === "Runner") {
    navItems = runnerNavItems
  } else if (userRole === "Marshal") {
    navItems = marshalNavItems
  }
  
  return (
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="shadow-sm"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={teamsData} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
