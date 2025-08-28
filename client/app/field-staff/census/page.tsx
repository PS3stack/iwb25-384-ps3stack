"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RoleLayout } from "@/components/layout/role-layout"
import { fieldStaffSidebarItems } from "@/lib/field-staff-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CensusCardGrid } from "@/components/field-staff/census-card-grid"
import { CheckCircle } from "lucide-react"

const availableCensus = [
  {
    id: 1,
    name: "National Population Census 2024",
    description:
      "Comprehensive population and housing census covering demographic data, housing conditions, and socioeconomic indicators.",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    assignedHouseholds: 245,
    completedHouseholds: 189,
    region: "District 5, Zone A",
    priority: "High",
    methodology: "Door-to-Door Survey",
  },
  {
    id: 2,
    name: "Urban Housing Survey",
    description: "Detailed survey of housing conditions, infrastructure access, and living standards in urban areas.",
    status: "Active",
    startDate: "2024-02-01",
    endDate: "2024-04-15",
    assignedHouseholds: 67,
    completedHouseholds: 45,
    region: "Urban Central",
    priority: "Medium",
    methodology: "Digital Survey",
  },
  {
    id: 3,
    name: "Agricultural Census",
    description: "Survey of agricultural land use, farming practices, and rural economic activities.",
    status: "Scheduled",
    startDate: "2024-05-01",
    endDate: "2024-08-20",
    assignedHouseholds: 156,
    completedHouseholds: 0,
    region: "Rural Districts",
    priority: "Low",
    methodology: "Hybrid Approach",
  },
]

export default function CensusSelectionPage() {
  const [selectedCensus, setSelectedCensus] = useState<number | null>(1)

  return (
    <RoleLayout role="field-staff" sidebarItems={fieldStaffSidebarItems} currentPath="/field-staff/census">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Active Census Selection</h1>
            <p className="text-muted-foreground">Select and manage your active census projects</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Current Active</div>
            <div className="font-medium text-chart-1">National Population Census 2024</div>
          </div>
        </div>

        {/* Current Selection Summary */}
        {selectedCensus && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="border-chart-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-chart-3" />
                  <span>Currently Active Project</span>
                </CardTitle>
                <CardDescription>Your primary census assignment</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const current = availableCensus.find((c) => c.id === selectedCensus)
                  if (!current) return null
                  const progress = Math.round((current.completedHouseholds / current.assignedHouseholds) * 100)
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{current.name}</h3>
                        <Badge className="bg-chart-3 text-white">{current.status}</Badge>
                      </div>
                      <p className="text-muted-foreground">{current.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-chart-1">{current.completedHouseholds}</div>
                          <div className="text-sm text-muted-foreground">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-chart-2">{current.assignedHouseholds}</div>
                          <div className="text-sm text-muted-foreground">Assigned</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-chart-3">{progress}%</div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-chart-4">
                            {current.assignedHouseholds - current.completedHouseholds}
                          </div>
                          <div className="text-sm text-muted-foreground">Remaining</div>
                        </div>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Census Cards Grid */}
        <CensusCardGrid
          censusProjects={availableCensus}
          selectedCensus={selectedCensus}
          onSelectCensus={setSelectedCensus}
        />

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Overall Statistics</CardTitle>
              <CardDescription>Your performance across all census projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">3</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">468</div>
                  <div className="text-sm text-muted-foreground">Total Households</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-3">234</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-4">50%</div>
                  <div className="text-sm text-muted-foreground">Overall Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </RoleLayout>
  )
}
