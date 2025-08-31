"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Home, Settings, LogOut, User, Bell } from "lucide-react"

interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
  children?: SidebarItem[]
}

interface RoleSidebarProps {
  role: string
  items: SidebarItem[]
  currentPath?: string
}

export function RoleSidebar({ role, items, currentPath = "" }: RoleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const Icon = item.icon
    const isExpanded = expandedItems.includes(item.id)
    const isActive = currentPath === item.href
    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.id}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start h-10 px-3 ${level > 0 ? "ml-4" : ""}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              window.location.href = item.href
            }
          }}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="ml-2 truncate">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              )}
            </>
          )}
        </Button>

        {hasChildren && isExpanded && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 space-y-1"
          >
            {item.children?.map((child) => renderSidebarItem(child, level + 1))}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-sidebar-foreground" />
              <span className="font-medium text-sidebar-foreground capitalize">{role}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-10 px-3"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="ml-2">Home</span>}
            </Button>

            <Separator className="my-2" />

            {items.map((item) => renderSidebarItem(item))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-2 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3"
            onClick={() => (window.location.href = `/${role}/settings`)}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>

          <Button variant="ghost" className="w-full justify-start h-10 px-3">
            <Bell className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="ml-2">Notifications</span>}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 text-destructive hover:text-destructive"
            onClick={() => (window.location.href = "/")}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
