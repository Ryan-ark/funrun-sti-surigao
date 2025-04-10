"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  LayoutDashboard
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

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@funrunsti.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Funrun STI Surigao",
      logo: GalleryVerticalEnd,
      plan: "Monitoring",
    }
  ],
  navMain: [
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
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isMobile, setIsMobile] = useState(false)
  
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
  
  return (
    <Sidebar 
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="shadow-sm"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
