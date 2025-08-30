"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CensusAnalytics } from "@/components/analytics/census-analytics"
import { BarChart3, Download, RefreshCw, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function CensusAnalyticsPage() {
  const censusstats = [
    {
      title: "Total Households",
      value: "63.4K",
      description: "Registered households",
      change: "+2.1K",
      trend: "up",
    },
    {
      title: "Completion Rate",
      value: "83%",
      description: "Data collection progress",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Active Collectors",
      value: "52",
      description: "Field staff working",
      change: "+3",
      trend: "up",
    },
    {
      title: "Data Quality",
      value: "97.2%",
      description: "Validation passed",
      change: "+0.8%",
      trend: "up",
    },
  ]

  const [censusStats, setCensusStats] = useState<typeof censusstats>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/analytics");
        // const data = await response.json();
        // setCensusStats(data.stats);
        setCensusStats(censusstats);
      } catch (error) {
        console.error("Error fetching census analytics data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Census Analytics</h1>
          <p className="text-slate-600 mt-2">Comprehensive analysis of census data collection and progress.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Census Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {censusStats.map((stat, index) => (
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
                  <div className="text-right">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-2 font-medium">{stat.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Census Data Analytics
          </CardTitle>
          <CardDescription>Detailed insights into census collection progress and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <CensusAnalytics />
        </CardContent>
      </Card>
    </div>
  )
}
