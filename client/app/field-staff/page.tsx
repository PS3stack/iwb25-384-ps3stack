"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RoleLayout } from "@/components/layout/role-layout"
import { fieldStaffSidebarItems } from "@/lib/field-staff-navigation"
import { FileText, Users, MapPin, CheckCircle, Clock, AlertTriangle, TrendingUp, Home, Upload } from "lucide-react"
import { useEffect, useState } from "react"

const dashboardstats = [
  {
    title: "Assigned Households",
    value: "245",
    change: "+12 this week",
    icon: Home,
    color: "text-chart-1",
  },
  {
    title: "Completed Surveys",
    value: "189",
    change: "+23 today",
    icon: CheckCircle,
    color: "text-chart-3",
  },
  {
    title: "Pending Submissions",
    value: "56",
    change: "Due this week",
    icon: Clock,
    color: "text-chart-4",
  },
  {
    title: "Completion Rate",
    value: "77.1%",
    change: "+3.2% this week",
    icon: TrendingUp,
    color: "text-chart-2",
  },
]

const activecensusProjects = [
  {
    id: 1,
    name: "National Population Census 2024",
    description: "Comprehensive population and housing census",
    status: "Active",
    assignedHouseholds: 245,
    completedHouseholds: 189,
    deadline: "2024-06-30",
    region: "District 5, Zone A",
  },
  {
    id: 2,
    name: "Urban Housing Survey",
    description: "Housing conditions and infrastructure survey",
    status: "Active",
    assignedHouseholds: 67,
    completedHouseholds: 45,
    deadline: "2024-04-15",
    region: "Urban Central",
  },
]

const recentactivities = [
  {
    id: 1,
    type: "submission",
    title: "Submitted household data for Block 15",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "assignment",
    title: "New household assignment received",
    time: "4 hours ago",
    status: "active",
  },
  {
    id: 3,
    type: "survey",
    title: "Completed survey for Household #H-2024-1567",
    time: "6 hours ago",
    status: "completed",
  },
  {
    id: 4,
    type: "reminder",
    title: "Deadline reminder: 15 households due tomorrow",
    time: "1 day ago",
    status: "pending",
  },
]

const quickactions = [
  {
    title: "Submit Household Data",
    description: "Submit collected household survey data",
    href: "/field-staff/submission/submit",
    icon: Upload,
    color: "bg-chart-1",
  },
  {
    title: "View Assignments",
    description: "Check assigned households and areas",
    href: "/field-staff/households/assigned",
    icon: Home,
    color: "bg-chart-2",
  },
  {
    title: "Manage Households",
    description: "Update household information",
    href: "/field-staff/households/manage",
    icon: Users,
    color: "bg-chart-3",
  },
  {
    title: "View My Areas",
    description: "Check assigned geographical areas",
    href: "/field-staff/areas",
    icon: MapPin,
    color: "bg-chart-4",
  },
]

export default function FieldStaffDashboard() {
  const [dashboardStats, setDashboardStats] = useState<typeof dashboardstats>([]);
  const [activeCensusProjects, setActiveCensusProjects] = useState<typeof activecensusProjects>([]);
  const [recentActivities, setRecentActivities] = useState<typeof recentactivities>([]);
  const [quickActions, setQuickActions] = useState<typeof quickactions>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/dashboard");
        // const data = await response.json();
        // setDashboardStats(data.dashboardStats);
        // setActiveCensusProjects(data.activeCensusProjects);
        // setRecentActivities(data.recentActivities);
        // setQuickActions(data.quickActions);
        setDashboardStats(dashboardstats);
        setActiveCensusProjects(activecensusProjects);
        setRecentActivities(recentactivities);
        setQuickActions(quickactions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <RoleLayout role="field-staff" sidebarItems={fieldStaffSidebarItems} currentPath="/field-staff">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Field Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage your data collection assignments and submissions</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Collector ID</div>
            <div className="font-medium">FS-2024-0156</div>
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
                <CardDescription>Common field staff tasks</CardDescription>
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
                <CardDescription>Your latest field activities</CardDescription>
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

        {/* Active Census Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Active Census Projects</span>
              </CardTitle>
              <CardDescription>Census projects you are currently working on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCensusProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge className="bg-chart-3 text-white">{project.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <span>Region: {project.region}</span>
                        <span>Due: {project.deadline}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-chart-2">
                        {project.completedHouseholds}/{project.assignedHouseholds}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((project.completedHouseholds / project.assignedHouseholds) * 100)}% Complete
                      </div>
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
