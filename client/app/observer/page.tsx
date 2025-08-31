"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, Radio, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { use, useEffect, useState } from "react"
import SupportTrigger from "@/components/shared/SupportTrigger"

export default function ObserverDashboard() {
  const observerstats = [
    {
      title: "Active Assignments",
      value: "3",
      description: "Elections currently monitoring",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Reports Submitted",
      value: "12",
      description: "Total observation reports",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Live Monitoring",
      value: "2",
      description: "Real-time election monitoring",
      icon: Radio,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Alerts Raised",
      value: "1",
      description: "Issues reported today",
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  const activeassignments = [
    {
      id: 1,
      election: "Presidential Election 2024",
      location: "District 5, Polling Station 12",
      status: "active",
      startTime: "06:00 AM",
      endTime: "06:00 PM",
    },
    {
      id: 2,
      election: "Local Council Election",
      location: "District 3, Polling Station 8",
      status: "scheduled",
      startTime: "07:00 AM",
      endTime: "05:00 PM",
    },
  ]

  const recentreports = [
    {
      id: 1,
      title: "Polling Station Setup Report",
      election: "Presidential Election 2024",
      timestamp: "2024-01-15 08:30 AM",
      status: "submitted",
    },
    {
      id: 2,
      title: "Voter Turnout Update",
      election: "Presidential Election 2024",
      timestamp: "2024-01-15 12:00 PM",
      status: "submitted",
    },
  ]

  const [recentReports, setRecentReports] = useState<typeof recentreports>([]);
  const [activeAssignments, setActiveAssignments] = useState<typeof activeassignments>([]);
  const [observerStats, setObserverStats] = useState<typeof observerstats>([]);

  useEffect(() => {
     const fetchData = async () => {
       try {
         // const response = await fetch("/api/dashboard");
         // const data = await response.json();
         // setRecentReports(data.recentReports);
         // setActiveAssignments(data.activeAssignments);
         // setObserverStats(data.observerStats);
         setRecentReports(recentreports);
         setActiveAssignments(activeassignments);
         setObserverStats(observerstats);
       } catch (error) {
         console.error("Error fetching dashboard data:", error);
       }
     };
     fetchData();
  },[])
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Observer Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitor elections and submit observation reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <SupportTrigger size="sm" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Eye className="w-4 h-4 mr-1" />
            Certified Observer
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {observerStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Active Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Active Assignments
          </CardTitle>
          <CardDescription>Elections you're currently assigned to monitor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAssignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{assignment.election}</h3>
                    <p className="text-sm text-slate-600">{assignment.location}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {assignment.startTime} - {assignment.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={assignment.status === "active" ? "default" : "secondary"}
                    className={assignment.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {assignment.status === "active" ? (
                      <Radio className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {assignment.status === "active" ? "Live" : "Scheduled"}
                  </Badge>
                  <Button size="sm">{assignment.status === "active" ? "Monitor" : "View Details"}</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Reports
          </CardTitle>
          <CardDescription>Your latest observation reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{report.title}</h4>
                    <p className="text-sm text-slate-600">{report.election}</p>
                    <p className="text-xs text-slate-500">{report.timestamp}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Submitted
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common observer tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <FileText className="w-6 h-6" />
              <span>Submit Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <AlertTriangle className="w-6 h-6" />
              <span>Report Issue</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Radio className="w-6 h-6" />
              <span>Live Updates</span>
            </Button>
            <SupportTrigger variant="button" size="lg" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Users className="w-6 h-6" />
              <span>Contact Support</span>
            </SupportTrigger>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
