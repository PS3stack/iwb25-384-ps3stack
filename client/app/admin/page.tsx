"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoleLayout } from "@/components/layout/role-layout"
import { adminSidebarItems } from "@/lib/admin-navigation"
import {
  Users,
  Vote,
  Eye,
  BarChart3,
  Settings,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"

const dashboardstats = [
  {
    title: "Active Elections",
    value: "12",
    change: "+2 from last month",
    icon: Vote,
    color: "text-chart-1",
  },
  {
    title: "Registered Voters",
    value: "1,247",
    change: "+156 this week",
    icon: Users,
    color: "text-chart-2",
  },
  {
    title: "Active Observers",
    value: "89",
    change: "+12 today",
    icon: Eye,
    color: "text-chart-3",
  },
  {
    title: "System Uptime",
    value: "99.8%",
    change: "Last 30 days",
    icon: BarChart3,
    color: "text-chart-4",
  },
]

const recentactivities = [
  {
    id: 1,
    type: "election",
    title: "New election created: City Council 2024",
    time: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    type: "observer",
    title: "Observer John Doe assigned to District 5",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "voter",
    title: "Bulk voter registration completed",
    time: "6 hours ago",
    status: "completed",
  },
  {
    id: 4,
    type: "system",
    title: "System maintenance scheduled",
    time: "1 day ago",
    status: "pending",
  },
]

const quickactions = [
  {
    title: "Create Election",
    description: "Set up a new election with candidates and settings",
    href: "/admin/elections/create",
    icon: Vote,
    color: "bg-chart-1",
  },
  {
    title: "Add Observer",
    description: "Register a new election observer",
    href: "/admin/observers/add",
    icon: Eye,
    color: "bg-chart-2",
  },
  {
    title: "Import Voters",
    description: "Upload voter data via CSV",
    href: "/admin/voters/import",
    icon: Users,
    color: "bg-chart-3",
  },
  {
    title: "View Reports",
    description: "Access system reports and analytics",
    href: "/admin/reports",
    icon: FileText,
    color: "bg-chart-4",
  },
]

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<{
    title: string;
    value: string;
    change: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[]>([]);
  const [recentActivities, setRecentActivities] = useState<{
    id: number;
    type: string;
    title: string;
    time: string;
    status: string;
  }[]>([]);
  const [quickActions, setQuickActions] = useState<{
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/dashboard");
        // const data = await response.json();
        // setDashboardStats(data.stats);
        // setRecentActivities(data.activities);
        // setQuickActions(data.actions);
        setDashboardStats(dashboardstats);
        setRecentActivities(recentactivities);
        setQuickActions(quickactions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage elections, users, and system operations</p>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <div
                      key={action.title}
                      className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => (window.location.href = action.href)}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {activity.status === "completed" && <CheckCircle className="h-4 w-4 text-chart-3" />}
                      {activity.status === "active" && <Clock className="h-4 w-4 text-chart-1" />}
                      {activity.status === "pending" && <AlertTriangle className="h-4 w-4 text-chart-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "secondary"
                          : activity.status === "active"
                            ? "default"
                            : "outline"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>System Health</span>
              </CardTitle>
              <CardDescription>Current system status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-3">Operational</div>
                  <div className="text-sm text-muted-foreground">Database Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">Fast</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">Secure</div>
                  <div className="text-sm text-muted-foreground">Security Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </RoleLayout>
  )
}
