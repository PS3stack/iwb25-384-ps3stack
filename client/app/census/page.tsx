"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoleLayout } from "@/components/layout/role-layout"
import { censusSidebarItems } from "@/lib/census-navigation"
import {
  FileText,
  Users,
  BarChart3,
  Settings,
  MapPin,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useEffect, useState } from "react"
import SupportTrigger from "@/components/shared/SupportTrigger"

const dashboardstats = [
  {
    title: "Active Projects",
    value: "8",
    change: "+2 this month",
    icon: FileText,
    color: "text-chart-1",
  },
  {
    title: "Data Collectors",
    value: "156",
    change: "+12 this week",
    icon: Users,
    color: "text-chart-2",
  },
  {
    title: "Households Surveyed",
    value: "12,847",
    change: "+1,234 today",
    icon: MapPin,
    color: "text-chart-3",
  },
  {
    title: "Completion Rate",
    value: "78.5%",
    change: "+5.2% this week",
    icon: BarChart3,
    color: "text-chart-4",
  },
]

const activeprojects = [
  {
    id: 1,
    name: "National Population Census 2024",
    status: "Active",
    progress: 78,
    collectors: 45,
    households: 8934,
    deadline: "2024-06-30",
  },
  {
    id: 2,
    name: "Urban Housing Survey",
    status: "Active",
    progress: 92,
    collectors: 23,
    households: 2156,
    deadline: "2024-04-15",
  },
  {
    id: 3,
    name: "Agricultural Census",
    status: "Scheduled",
    progress: 0,
    collectors: 67,
    households: 5678,
    deadline: "2024-08-20",
  },
]

const recentactivities = [
  {
    id: 1,
    type: "project",
    title: "New census project created: Rural Development Survey",
    time: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    type: "collector",
    title: "Data collector Sarah Johnson completed District 12",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "data",
    title: "Bulk household data imported for Project #3",
    time: "6 hours ago",
    status: "completed",
  },
  {
    id: 4,
    type: "system",
    title: "System maintenance scheduled for tonight",
    time: "1 day ago",
    status: "pending",
  },
]

const quickactions = [
  {
    title: "Create Census Project",
    description: "Set up a new census survey project",
    href: "/census/projects/create",
    icon: FileText,
    color: "bg-chart-1",
  },
  {
    title: "Add Data Collector",
    description: "Register a new field data collector",
    href: "/census/collectors/add",
    icon: Users,
    color: "bg-chart-2",
  },
  {
    title: "Import Household Data",
    description: "Upload household data via CSV",
    href: "/census/data/import",
    icon: MapPin,
    color: "bg-chart-3",
  },
  {
    title: "View Analytics",
    description: "Access census reports and analytics",
    href: "/census/monitoring/analytics",
    icon: BarChart3,
    color: "bg-chart-4",
  },
]

export default function CensusDashboard() {
  const [dashboardStats, setDashboardStats] = useState<typeof dashboardstats>([]);
  const [activeProjects, setActiveProjects] = useState<typeof activeprojects>([]);
  const [recentActivities, setRecentActivities] = useState<typeof recentactivities>([]);
  const [quickActions, setQuickActions] = useState<typeof quickactions>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/dashboard");
        // const data = await response.json();
        // setDashboardStats(data.stats);
        // setActiveProjects(data.projects);
        // setRecentActivities(data.activities);
        // setQuickActions(data.actions);
        setDashboardStats(dashboardstats);
        setActiveProjects(activeprojects);
        setRecentActivities(recentactivities);
        setQuickActions(quickactions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <RoleLayout role="census" sidebarItems={censusSidebarItems} currentPath="/census">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Census Management</h1>
            <p className="text-muted-foreground">Oversee census projects and data collection operations</p>
          </div>
          <div className="flex items-center gap-3">
            <SupportTrigger size="sm" />
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Census Settings
            </Button>
          </div>
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
                <CardDescription>Common census management tasks</CardDescription>
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
                <CardDescription>Latest census activities and updates</CardDescription>
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

        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Active Census Projects</span>
              </CardTitle>
              <CardDescription>Current census projects and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge
                          className={
                            project.status === "Active"
                              ? "bg-chart-3 text-white"
                              : project.status === "Scheduled"
                                ? "bg-chart-1 text-white"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <span>{project.collectors} collectors</span>
                        <span>{project.households.toLocaleString()} households</span>
                        <span>Due: {project.deadline}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-chart-2">{project.progress}%</div>
                      <div className="text-sm text-muted-foreground">Complete</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </RoleLayout>
  )
}
