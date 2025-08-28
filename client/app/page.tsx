"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Vote, Eye, BarChart3, Shield, ChevronRight, Building2, FileText, Globe } from "lucide-react"

const userRoles = [
  {
    id: "admin",
    title: "System Administrator",
    description: "Manage elections, users, and system settings",
    icon: Shield,
    color: "bg-primary",
    features: ["Election Management", "User Administration", "System Monitoring", "Results Publishing"],
  },
  {
    id: "census",
    title: "Census Manager",
    description: "Oversee census projects and data collection",
    icon: FileText,
    color: "bg-accent",
    features: ["Census Projects", "Data Collector Management", "Progress Monitoring", "Report Generation"],
  },
  {
    id: "field-staff",
    title: "Field Staff",
    description: "Conduct on-ground data collection activities",
    icon: Users,
    color: "bg-chart-2",
    features: ["Household Management", "Data Submission", "Assignment Tracking", "Mobile Access"],
  },
  {
    id: "observer",
    title: "Election Observer",
    description: "Monitor election processes and ensure transparency",
    icon: Eye,
    color: "bg-chart-3",
    features: ["Process Monitoring", "Report Submission", "Real-time Updates", "Transparency Tools"],
  },
  {
    id: "voter",
    title: "Voter",
    description: "Cast votes and access election information",
    icon: Vote,
    color: "bg-chart-4",
    features: ["Voter Identification", "Secure Voting", "Ballot Access", "Vote Confirmation"],
  },
  {
    id: "public",
    title: "Public Access",
    description: "View public information and statistics",
    icon: Globe,
    color: "bg-chart-5",
    features: ["Public Dashboard", "Election Results", "Census Data", "Transparency Reports"],
  },
]

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Election & Census Management</h1>
                <p className="text-sm text-muted-foreground">Professional Government System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <motion.h2
            className="text-3xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Select Your Role
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Choose your role to access the appropriate tools and features for election and census management.
          </motion.p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userRoles.map((role, index) => {
            const Icon = role.icon
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedRole === role.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${role.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <ChevronRight
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          selectedRole === role.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>

                  {selectedRole === role.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-foreground">Key Features:</h4>
                          <ul className="space-y-1">
                            {role.features.map((feature, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button
                            className="w-full mt-4"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Navigate to role-specific dashboard
                              window.location.href = `/${role.id}`
                            }}
                          >
                            Access {role.title}
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">12</div>
                  <div className="text-sm text-muted-foreground">Active Elections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">8</div>
                  <div className="text-sm text-muted-foreground">Census Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-3">1,247</div>
                  <div className="text-sm text-muted-foreground">Registered Voters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-4">98.5%</div>
                  <div className="text-sm text-muted-foreground">System Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
