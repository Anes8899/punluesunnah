"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  BookText,
  GraduationCap,
  HandHeart,
  Heart,
  LayoutDashboard,
  Library,
  MessageSquareQuote,
  Mic,
  Moon,
  ScrollText,
  Sparkles,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const overview = [{ title: "Dashboard", href: "/", icon: LayoutDashboard }]

const content = [
  { title: "Aqidah", href: "/aqidah", icon: BookOpen },
  { title: "Akhlaq", href: "/akhlaq", icon: Heart },
  { title: "Duas", href: "/duas", icon: HandHeart },
  { title: "Hadith", href: "/hadith", icon: ScrollText },
  { title: "Khutbah", href: "/khutbah", icon: Mic },
  { title: "Prayer", href: "/prayer", icon: Moon },
  { title: "Quran", href: "/quran", icon: BookText },
  { title: "Tazkiyah", href: "/tazkiyah", icon: Sparkles },
  { title: "Ustaz", href: "/ustaz", icon: GraduationCap },
]

function NavGroup({
  label,
  items,
}: {
  label: string
  items: typeof content
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(({ title, href, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                isActive={href === "/" ? pathname === "/" : pathname.startsWith(href)}
                tooltip={title}
                render={<Link href={href} />}
              >
                <Icon />
                <span>{title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <MessageSquareQuote />
              <span className="font-semibold">Punluesunnah Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Overview" items={overview} />
        <NavGroup label="Content" items={content} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
