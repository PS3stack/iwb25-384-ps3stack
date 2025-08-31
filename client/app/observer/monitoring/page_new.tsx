"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle, CheckCircle, Radio } from "lucide-react"
import { useEffect, useState } from "react"
import { electionAPI, apiHelpers } from "@/api/api"
import { useToast } from "@/hooks/use-toast"

interface Election {
  id: string
  title: string
  location?: string
  status?: string
  start_time: string
  current_time?: string
  voter_turnout?: number
  total_voters?: number
  issues?: number
  last_update?: string
  isActive: boolean
}

interface ChecklistItem {
  item: string
  status: "completed" | "in-progress" | "pending"
}

export default function ElectionMonitoring() {
  const [activeElections, setActiveElections] = useState<Election[]>([])
  const [monitoringChecklist, setMonitoringChecklist] = useState<ChecklistItem[]>([
    { item: "Polling station setup complete", status: "completed" },
    { item: "Ballot boxes sealed and secured", status: "completed" },
    { item: "Voting materials verified", status: "completed" },
    { item: "Staff credentials checked", status: "completed" },
    { item: "Opening procedures followed", status: "completed" },
    { item: "Voter accessibility confirmed", status: "in-progress" },
    { item: "Security measures in place", status: "pending" },
  ])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await electionAPI.getAllElections()
        const formattedElections = response.data
          .map(apiHelpers.formatElection)
          .filter((election: Election) => election.isActive || new Date(election.start_time) > new Date())
          .map((election: Election) => ({
            ...election,
            location: "District 5, Polling Station 12", // Mock location since not in API
            voter_turnout: Math.random() * 80, // Mock turnout data
            total_voters: 1250, // Mock total voters
            issues: 0,
            last_update: "2 minutes ago",
            current_time: election.isActive ? new Date().toLocaleTimeString() : "Not Started"
          }))
        
        setActiveElections(formattedElections)
      } catch (error) {
        console.error("Error fetching elections:", error)
        toast({
          title: "Error",
          description: "Failed to fetch election data. Please try again.",
          variant: "destructive",
        })
        setActiveElections([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">Loading monitoring data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Election Monitoring</h1>
          <p className="text-slate-600 mt-2">Real-time monitoring of assigned polling stations.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Radio className="w-4 h-4" />
          Start Live Monitoring
        </Button>
      </div>

      {/* Active Elections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeElections.map((election, index) => (
          <motion.div
            key={election.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{election.title}</CardTitle>
                  <Badge
                    variant={election.isActive ? "default" : "secondary"}
                    className={election.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {election.isActive ? (
                      <Radio className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {election.isActive ? "Live" : "Scheduled"}
                  </Badge>
                </div>
                <CardDescription>{election.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Start Time</p>
                    <p className="text-lg font-semibold">{new Date(election.start_time).toLocaleTimeString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Current Time</p>
                    <p className="text-lg font-semibold">{election.current_time}</p>
                  </div>
                </div>

                {election.isActive && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Voter Turnout</span>
                        <span>
                          {Math.round(election.voter_turnout || 0)}% ({Math.round(((election.total_voters || 0) * (election.voter_turnout || 0)) / 100)}{" "}
                          of {election.total_voters || 0})
                        </span>
                      </div>
                      <Progress value={election.voter_turnout || 0} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">No Issues Reported</span>
                      </div>
                      <span className="text-xs text-slate-500">Last update: {election.last_update}</span>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    {election.isActive ? "View Details" : "Prepare Monitoring"}
                  </Button>
                  <Button size="sm" variant="outline">
                    <AlertTriangle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Monitoring Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Monitoring Checklist
          </CardTitle>
          <CardDescription>Standard observation procedures for polling station monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monitoringChecklist.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      item.status === "completed"
                        ? "bg-green-100"
                        : item.status === "in-progress"
                          ? "bg-blue-100"
                          : "bg-slate-100"
                    }`}
                  >
                    {item.status === "completed" && <CheckCircle className="w-3 h-3 text-green-600" />}
                    {item.status === "in-progress" && <Clock className="w-3 h-3 text-blue-600" />}
                  </div>
                  <span className={`text-sm ${item.status === "completed" ? "text-slate-900" : "text-slate-600"}`}>
                    {item.item}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.status === "completed"
                      ? "text-green-600 border-green-200"
                      : item.status === "in-progress"
                        ? "text-blue-600 border-blue-200"
                        : "text-slate-600 border-slate-200"
                  }
                >
                  {item.status === "completed" ? "Complete" : item.status === "in-progress" ? "In Progress" : "Pending"}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
