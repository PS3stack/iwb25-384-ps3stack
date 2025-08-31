"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { Users, TrendingUp, MapPin } from "lucide-react"

const collectionProgress = [
  { date: "Jan 1", households: 1200, completed: 850, target: 1000 },
  { date: "Jan 8", households: 2400, completed: 1800, target: 2000 },
  { date: "Jan 15", households: 3600, completed: 2950, target: 3200 },
  { date: "Jan 22", households: 4800, completed: 4100, target: 4500 },
  { date: "Jan 29", households: 6000, completed: 5200, target: 5800 },
]

const regionData = [
  { region: "North", households: 12500, completed: 10200, percentage: 82 },
  { region: "South", households: 15800, completed: 13100, percentage: 83 },
  { region: "East", households: 9200, completed: 7400, percentage: 80 },
  { region: "West", households: 11600, completed: 9800, percentage: 85 },
  { region: "Central", households: 14200, completed: 11900, percentage: 84 },
]

const collectorPerformance = [
  { week: "Week 1", collectors: 45, avgHouseholds: 12 },
  { week: "Week 2", collectors: 48, avgHouseholds: 15 },
  { week: "Week 3", collectors: 52, avgHouseholds: 18 },
  { week: "Week 4", collectors: 50, avgHouseholds: 20 },
]

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
  households: {
    label: "Total Households",
    color: "hsl(var(--chart-3))",
  },
  collectors: {
    label: "Active Collectors",
    color: "hsl(var(--chart-4))",
  },
  avgHouseholds: {
    label: "Avg Households/Day",
    color: "hsl(var(--chart-5))",
  },
}

export function CensusAnalytics() {
  return (
    <div className="space-y-6">
      {/* Collection Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Census Collection Progress
          </CardTitle>
          <CardDescription>Household data collection progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={collectionProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="var(--color-completed)"
                fill="var(--color-completed)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="target"
                stackId="2"
                stroke="var(--color-target)"
                fill="var(--color-target)"
                fillOpacity={0.3}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Regional Performance
            </CardTitle>
            <CardDescription>Completion rates by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="percentage" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Collector Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Collector Performance
            </CardTitle>
            <CardDescription>Active collectors and productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={collectorPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="collectors"
                  stroke="var(--color-collectors)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-collectors)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgHouseholds"
                  stroke="var(--color-avgHouseholds)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-avgHouseholds)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
