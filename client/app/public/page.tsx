"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Vote, Users, BarChart3, Calendar, TrendingUp, MapPin, Clock } from "lucide-react"

export default function PublicDashboard() {
  const electionStats = [
    {
      title: "Active Elections",
      value: "2",
      description: "Currently ongoing elections",
      icon: Vote,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Registered Voters",
      value: "2.4M",
      description: "Total registered voters",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Polling Stations",
      value: "1,250",
      description: "Active polling locations",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Turnout Rate",
      value: "68%",
      description: "Average voter turnout",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  const activeElections = [
    {
      id: 1,
      title: "Presidential Election 2024",
      date: "2024-11-05",
      status: "active",
      turnout: 45,
      totalVoters: 2400000,
      description: "National presidential election",
    },
    {
      id: 2,
      title: "Local Council Elections",
      date: "2024-12-15",
      status: "upcoming",
      turnout: 0,
      totalVoters: 890000,
      description: "Municipal council representatives",
    },
  ]

  const recentResults = [
    {
      id: 1,
      title: "State Governor Election",
      date: "2024-10-15",
      winner: "Sarah Johnson",
      turnout: 72,
      status: "completed",
    },
    {
      id: 2,
      title: "Senate District 3",
      date: "2024-09-20",
      winner: "Michael Chen",
      turnout: 68,
      status: "completed",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Election & Census Portal</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Transparent access to election results, voter information, and census data for all citizens.
          </p>
        </motion.div>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Vote className="w-4 h-4 mr-1" />2 Active Elections
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1" />
            Real-time Updates
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {electionStats.map((stat, index) => {
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

      {/* Active Elections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Current Elections
          </CardTitle>
          <CardDescription>Live election monitoring and upcoming elections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeElections.map((election) => (
              <motion.div
                key={election.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{election.title}</h3>
                    <p className="text-sm text-slate-600">{election.description}</p>
                    <p className="text-xs text-slate-500 mt-1">Date: {new Date(election.date).toLocaleDateString()}</p>
                  </div>
                  <Badge
                    variant={election.status === "active" ? "default" : "secondary"}
                    className={election.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {election.status === "active" ? "Live" : "Upcoming"}
                  </Badge>
                </div>

                {election.status === "active" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Voter Turnout</span>
                      <span>
                        {election.turnout}% ({((election.totalVoters * election.turnout) / 100 / 1000000).toFixed(1)}M
                        of {(election.totalVoters / 1000000).toFixed(1)}M)
                      </span>
                    </div>
                    <Progress value={election.turnout} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="outline">
                    {election.status === "active" ? "View Live Results" : "View Details"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Election Results
          </CardTitle>
          <CardDescription>Completed elections and their outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{result.title}</h4>
                    <p className="text-sm text-slate-600">Winner: {result.winner}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(result.date).toLocaleDateString()} • {result.turnout}% turnout
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Results
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Common public information and services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Vote className="w-6 h-6" />
              <span>Find My Polling Station</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Users className="w-6 h-6" />
              <span>Voter Registration</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Calendar className="w-6 h-6" />
              <span>Election Calendar</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <BarChart3 className="w-6 h-6" />
              <span>Census Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
