"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Activity, Zap, Server } from "lucide-react"

const systemPerformance = [
  { time: "00:00", responseTime: 120, cpuUsage: 45, memoryUsage: 62, activeUsers: 1200 },
  { time: "04:00", responseTime: 95, cpuUsage: 38, memoryUsage: 58, activeUsers: 800 },
  { time: "08:00", responseTime: 180, cpuUsage: 72, memoryUsage: 78, activeUsers: 3200 },
  { time: "12:00", responseTime: 220, cpuUsage: 85, memoryUsage: 82, activeUsers: 4500 },
  { time: "16:00", responseTime: 195, cpuUsage: 78, memoryUsage: 75, activeUsers: 3800 },
  { time: "20:00", responseTime: 145, cpuUsage: 55, memoryUsage: 68, activeUsers: 2100 },
]

const apiPerformance = [
  { endpoint: "/api/elections", requests: 15420, avgResponse: 145, errors: 12 },
  { endpoint: "/api/voters", requests: 8930, avgResponse: 98, errors: 5 },
  { endpoint: "/api/census", requests: 12340, avgResponse: 167, errors: 8 },
  { endpoint: "/api/observers", requests: 4560, avgResponse: 112, errors: 2 },
  { endpoint: "/api/reports", requests: 2180, avgResponse: 234, errors: 1 },
]

const chartConfig = {
  responseTime: {
    label: "Response Time (ms)",
    color: "hsl(var(--chart-1))",
  },
  cpuUsage: {
    label: "CPU Usage (%)",
    color: "hsl(var(--chart-2))",
  },
  memoryUsage: {
    label: "Memory Usage (%)",
    color: "hsl(var(--chart-3))",
  },
  activeUsers: {
    label: "Active Users",
    color: "hsl(var(--chart-4))",
  },
  requests: {
    label: "Total Requests",
    color: "hsl(var(--chart-5))",
  },
}

export function PerformanceAnalytics() {
  return (
    <div className="space-y-6">
      {/* System Performance Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Performance Metrics
          </CardTitle>
          <CardDescription>Real-time system performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={systemPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="var(--color-responseTime)"
                strokeWidth={2}
                dot={{ fill: "var(--color-responseTime)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="cpuUsage"
                stroke="var(--color-cpuUsage)"
                strokeWidth={2}
                dot={{ fill: "var(--color-cpuUsage)", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="memoryUsage"
                stroke="var(--color-memoryUsage)"
                strokeWidth={2}
                dot={{ fill: "var(--color-memoryUsage)", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Active Users
            </CardTitle>
            <CardDescription>User activity throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <AreaChart data={systemPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="var(--color-activeUsers)"
                  fill="var(--color-activeUsers)"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* API Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              API Performance
            </CardTitle>
            <CardDescription>Request volume by endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={apiPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="endpoint" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="requests" fill="var(--color-requests)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
