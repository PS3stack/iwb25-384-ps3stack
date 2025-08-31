"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, User, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function VoterDashboard() {
  const voterstats = [
    {
      title: "Registration Status",
      value: "Verified",
      description: "Your voter registration is active",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Upcoming Elections",
      value: "2",
      description: "Elections you can participate in",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Voting History",
      value: "5",
      description: "Elections you've participated in",
      icon: Vote,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Actions",
      value: "1",
      description: "Items requiring your attention",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  const upcomingelections = [
    {
      id: 1,
      title: "Presidential Election 2024",
      date: "2024-11-05",
      status: "upcoming",
      description: "National presidential election",
    },
    {
      id: 2,
      title: "Local Council Election",
      date: "2024-12-15",
      status: "upcoming",
      description: "Municipal council representatives",
    },
  ]

  const [voterStats, setVoterStats] = useState<typeof voterstats>(voterstats)
  const [upcomingElections, setUpcomingElections] = useState<typeof upcomingelections>(upcomingelections)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/voter");
        // const data = await response.json();
        // setVoterStats(data.voterStats);
        // setUpcomingElections(data.upcomingElections);
        setVoterStats(voterstats);
        setUpcomingElections(upcomingelections);
      } catch (error) {
        console.error("Error fetching voter data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Voter Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your voting information and upcoming elections.</p>
        </div>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Verified Voter
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {voterStats.map((stat, index) => {
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

      {/* Upcoming Elections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Elections
          </CardTitle>
          <CardDescription>Elections you're eligible to participate in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingElections.map((election) => (
              <motion.div
                key={election.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Vote className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{election.title}</h3>
                    <p className="text-sm text-slate-600">{election.description}</p>
                    <p className="text-xs text-slate-500 mt-1">Date: {new Date(election.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Upcoming
                  </Badge>
                  <Button size="sm">View Details</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <User className="w-6 h-6" />
              <span>Update Information</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Vote className="w-6 h-6" />
              <span>View Sample Ballot</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
              <Calendar className="w-6 h-6" />
              <span>Election Calendar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
