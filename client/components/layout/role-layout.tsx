"use client"

import type React from "react"

import { RoleSidebar } from "./role-sidebar"

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
  children?: SidebarItem[]
}

interface RoleLayoutProps {
  role: string
  sidebarItems: SidebarItem[]
  currentPath?: string
  children: React.ReactNode
}

export function RoleLayout({ role, sidebarItems, currentPath, children }: RoleLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <RoleSidebar role={role} items={sidebarItems} currentPath={currentPath} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
