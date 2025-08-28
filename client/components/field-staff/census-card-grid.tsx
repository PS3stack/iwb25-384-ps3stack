"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Calendar, MapPin, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface CensusProject {
  id: number
  name: string
  description: string
  status: string
  startDate: string
  endDate: string
  assignedHouseholds: number
  completedHouseholds: number
  region: string
  priority: string
  methodology: string
}

interface CensusCardGridProps {
  censusProjects: CensusProject[]
  selectedCensus: number | null
  onSelectCensus: (id: number) => void
}

export function CensusCardGrid({ censusProjects, selectedCensus, onSelectCensus }: CensusCardGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-chart-3 text-white"
      case "Scheduled":
        return "bg-chart-1 text-white"
      case "Completed":
        return "bg-chart-2 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-chart-5 text-white"
      case "Medium":
        return "bg-chart-4 text-white"
      case "Low":
        return "bg-chart-2 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4" />
      case "Scheduled":
        return <Clock className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {censusProjects.map((project, index) => {
        const progress = Math.round((project.completedHouseholds / project.assignedHouseholds) * 100)
        const isSelected = selectedCensus === project.id
        const StatusIcon = () => getStatusIcon(project.status)

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? "ring-2 ring-chart-1 border-chart-1" : ""
              }`}
              onClick={() => onSelectCensus(project.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-chart-1" />
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(project.status)}>
                        <StatusIcon />
                        <span className="ml-1">{project.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>{project.priority}</Badge>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
                <CardDescription className="text-sm">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.completedHouseholds} completed</span>
                    <span>{project.assignedHouseholds} total</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Region:</span>
                    <span className="font-medium">{project.region}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-medium">{project.methodology}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full ${isSelected ? "bg-chart-1 hover:bg-chart-1/90" : ""}`}
                  variant={isSelected ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isSelected) {
                      window.location.href = "/field-staff/households/assigned"
                    } else {
                      onSelectCensus(project.id)
                    }
                  }}
                >
                  {isSelected ? "View Assignments" : "Select Project"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
