"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle, CheckCircle, Radio } from "lucide-react"

export default function ElectionMonitoring() {
  const activeElections = [
    {
      id: 1,
      title: "Presidential Election 2024",
      location: "District 5, Polling Station 12",
      status: "active",
      startTime: "06:00 AM",
      currentTime: "10:30 AM",
      voterTurnout: 45,
      totalVoters: 1250,
      issues: 0,
      lastUpdate: "2 minutes ago",
    },
    {
      id: 2,
      title: "Local Council Election",
      location: "District 3, Polling Station 8",
      status: "scheduled",
      startTime: "07:00 AM",
      currentTime: "Not Started",
      voterTurnout: 0,
      totalVoters: 890,
      issues: 0,
      lastUpdate: "Scheduled for tomorrow",
    },
  ]

  const monitoringChecklist = [
    { item: "Polling station setup complete", status: "completed" },
    { item: "Ballot boxes sealed and secured", status: "completed" },
    { item: "Voting materials verified", status: "completed" },
    { item: "Staff credentials checked", status: "completed" },
    { item: "Opening procedures followed", status: "completed" },
    { item: "Voter accessibility confirmed", status: "in-progress" },
    { item: "Security measures in place", status: "pending" },
  ]

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
                    variant={election.status === "active" ? "default" : "secondary"}
                    className={election.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {election.status === "active" ? (
                      <Radio className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {election.status === "active" ? "Live" : "Scheduled"}
                  </Badge>
                </div>
                <CardDescription>{election.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Start Time</p>
                    <p className="text-lg font-semibold">{election.startTime}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600">Current Time</p>
                    <p className="text-lg font-semibold">{election.currentTime}</p>
                  </div>
                </div>

                {election.status === "active" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Voter Turnout</span>
                        <span>
                          {election.voterTurnout}% ({Math.round((election.totalVoters * election.voterTurnout) / 100)}{" "}
                          of {election.totalVoters})
                        </span>
                      </div>
                      <Progress value={election.voterTurnout} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">No Issues Reported</span>
                      </div>
                      <span className="text-xs text-slate-500">Last update: {election.lastUpdate}</span>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    {election.status === "active" ? "View Details" : "Prepare Monitoring"}
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
