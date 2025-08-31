"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ElectionAnalytics } from "@/components/analytics/election-analytics";
import { Vote, Download, RefreshCw, TrendingUp } from "lucide-react";
import { RoleLayout } from "@/components/layout/role-layout";
import { adminSidebarItems } from "@/lib/admin-navigation";
import { useState, useEffect } from "react";

export default function ElectionAnalyticsPage() {
  const [electionStats, setElectionStats] = useState<{
    title: string;
    value: string;
    description: string;
    change: string;
    trend: string;
  }[]>([]);
  const electionstats = [
    {
      title: "Active Elections",
      value: "2",
      description: "Currently running",
      change: "+1",
      trend: "up",
    },
    {
      title: "Total Turnout",
      value: "68%",
      description: "Average across elections",
      change: "+3%",
      trend: "up",
    },
    {
      title: "Polling Stations",
      value: "1,250",
      description: "Active locations",
      change: "+50",
      trend: "up",
    },
    {
      title: "Registered Voters",
      value: "2.4M",
      description: "Eligible to vote",
      change: "+12K",
      trend: "up",
    },
  ];
  useEffect(() => {
      const fetchData = async () => {
          try {
            // const response = await fetch("/api/elections/stats");
            // const data = await response.json();
            // setElectionStats(data);
            setElectionStats(electionstats);
          } catch (error) {
            console.error("Error fetching election stats:", error);
          }
      };
      fetchData();
  }, [])

  return (
    <RoleLayout
      role="admin"
      sidebarItems={adminSidebarItems}
      currentPath="/admin/analytics/elections"
    >
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Election Analytics
            </h1>
            <p className="text-slate-600 mt-2">
              Detailed analysis of election performance and voter engagement.
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

        {/* Election Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {electionStats.map((stat, index) => (
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
                        <Vote className="w-5 h-5 text-blue-600" />
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

        {/* Analytics Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Election Performance Analytics
            </CardTitle>
            <CardDescription>
              Comprehensive insights into election turnout, demographics, and
              performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ElectionAnalytics />
          </CardContent>
        </Card>
      </div>
    </RoleLayout>
  );
}
