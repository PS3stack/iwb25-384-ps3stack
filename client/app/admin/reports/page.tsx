"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RoleLayout } from "@/components/layout/role-layout"
import { adminSidebarItems } from "@/lib/admin-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Calendar, BarChart3, Users, Vote, Eye, Filter, RefreshCw } from "lucide-react"

const reportTypes = [
  {
    id: "election-summary",
    title: "Election Summary Report",
    description: "Comprehensive overview of election results and statistics",
    icon: Vote,
    category: "Election",
    lastGenerated: "2024-01-15",
    status: "Ready",
  },
  {
    id: "voter-turnout",
    title: "Voter Turnout Analysis",
    description: "Detailed analysis of voter participation by district",
    icon: Users,
    category: "Analytics",
    lastGenerated: "2024-01-14",
    status: "Ready",
  },
  {
    id: "observer-activity",
    title: "Observer Activity Report",
    description: "Summary of observer assignments and monitoring activities",
    icon: Eye,
    category: "Monitoring",
    lastGenerated: "2024-01-13",
    status: "Generating",
  },
  {
    id: "system-audit",
    title: "System Audit Log",
    description: "Complete audit trail of system activities and changes",
    icon: FileText,
    category: "System",
    lastGenerated: "2024-01-12",
    status: "Ready",
  },
  {
    id: "demographic-analysis",
    title: "Demographic Analysis",
    description: "Voter demographics and participation patterns",
    icon: BarChart3,
    category: "Analytics",
    lastGenerated: "2024-01-11",
    status: "Ready",
  },
  {
    id: "compliance-report",
    title: "Compliance Report",
    description: "Election compliance and regulatory adherence summary",
    icon: FileText,
    category: "Compliance",
    lastGenerated: "2024-01-10",
    status: "Ready",
  },
]

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const categories = ["all", ...Array.from(new Set(reportTypes.map((r) => r.category)))]
  const statuses = ["all", "Ready", "Generating", "Error"]

  const filteredReports = reportTypes.filter((report) => {
    const categoryMatch = selectedCategory === "all" || report.category === selectedCategory
    const statusMatch = selectedStatus === "all" || report.status === selectedStatus
    return categoryMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-chart-3 text-white"
      case "Generating":
        return "bg-chart-1 text-white"
      case "Error":
        return "bg-chart-5 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleDownloadReport = (reportId: string) => {
    console.log("Downloading report:", reportId)
    // Implement download logic
  }

  const handleGenerateReport = (reportId: string) => {
    console.log("Generating report:", reportId)
    // Implement generation logic
  }

  return (
    <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/reports">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate and download system reports</p>
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{reportTypes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Ready to Download</p>
                  <p className="text-2xl font-bold">{reportTypes.filter((r) => r.status === "Ready").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Generating</p>
                  <p className="text-2xl font-bold">{reportTypes.filter((r) => r.status === "Generating").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => {
            const Icon = report.icon
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Category: {report.category}</span>
                      <span>Last: {report.lastGenerated}</span>
                    </div>
                    <div className="flex space-x-2">
                      {report.status === "Ready" && (
                        <Button size="sm" onClick={() => handleDownloadReport(report.id)} className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateReport(report.id)}
                        className="flex-1"
                        disabled={report.status === "Generating"}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${report.status === "Generating" ? "animate-spin" : ""}`} />
                        {report.status === "Generating" ? "Generating..." : "Regenerate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </RoleLayout>
  )
}
