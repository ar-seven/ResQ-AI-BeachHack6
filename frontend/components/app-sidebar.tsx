import { Calendar, Home, Inbox, Search, Settings,User,Info,MessageSquareWarning } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuBadge
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useGetUserDetails } from "@/utils/hooks/user";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/protected/",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/protected/chat",
    icon: MessageSquareWarning,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "My Profile",
    url: "/protected/details",
    icon: User, // Assuming you have a User icon imported
  },
  {
    title: "Details",
    url: "#",
    icon: Info, // Assuming you have an Info icon imported
  },
]

export function AppSidebar() {
  const { data:userDetails } = useGetUserDetails();
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {/* <a href={item.url}>
                      
                      <span>{item.title}</span>
                    </a> */}
                    <Link href={item.url}> <item.icon /> {item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      {userDetails && <NavUser user={userDetails} />}
    </Sidebar>
  )
}
