"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ElectionAnalytics } from "@/components/analytics/election-analytics";
import { CensusAnalytics } from "@/components/analytics/census-analytics";
import { BarChart3, Download, RefreshCw } from "lucide-react";
import { RoleLayout } from "@/components/layout/role-layout";
import { adminSidebarItems } from "@/lib/admin-navigation";
import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  interface AnalyticsStat {
    title: string;
    value: string;
    description: string;
    change: string;
    trend: string;
  }
  
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStat[]>([]);
  const analyticsstats = [
    {
      title: "Total Data Points",
      value: "2.4M",
      description: "Across all systems",
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Dashboards",
      value: "15",
      description: "Real-time monitoring",
      change: "+3",
      trend: "up",
    },
    {
      title: "Report Generation",
      value: "98%",
      description: "Success rate",
      change: "+2%",
      trend: "up",
    },
    {
      title: "Data Accuracy",
      value: "99.7%",
      description: "Validation passed",
      change: "+0.1%",
      trend: "up",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/analytics/stats");
        // const data = await response.json();
        // setAnalyticsStats(data);
        setAnalyticsStats(analyticsstats);
      } catch (error) {
        console.error("Error fetching analytics stats:", error);
      }
    };
    fetchData();
  }, []);

  return (

    <RoleLayout
      role="admin"
      sidebarItems={adminSidebarItems}
      currentPath="/admin/analytics"
    >
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Comprehensive data analysis and reporting across all systems.
            </p>
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

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsStats.map((stat, index) => (
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
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Analytics Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              System Analytics
            </CardTitle>
            <CardDescription>
              Detailed analytics and insights for different system modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="elections" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="elections">Elections</TabsTrigger>
                <TabsTrigger value="census">Census</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="elections" className="space-y-6">
                <ElectionAnalytics />
              </TabsContent>

              <TabsContent value="census" className="space-y-6">
                <CensusAnalytics />
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Performance Metrics</CardTitle>
                    <CardDescription>
                      Real-time system performance and resource utilization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-slate-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Performance analytics will be displayed here</p>
                      <p className="text-sm mt-2">
                        Including response times, server load, and user activity
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Automated Reports</CardTitle>
                    <CardDescription>
                      Scheduled and on-demand report generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">
                            Daily Election Summary
                          </h3>
                          <p className="text-sm text-slate-600">
                            Automated daily turnout and activity report
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">
                            Weekly Census Progress
                          </h3>
                          <p className="text-sm text-slate-600">
                            Comprehensive census collection progress report
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">
                            Monthly Analytics Report
                          </h3>
                          <p className="text-sm text-slate-600">
                            Complete system analytics and insights
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
