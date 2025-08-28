"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, Users, MapPin } from "lucide-react"

const turnoutData = [
  { time: "06:00", turnout: 0, target: 0 },
  { time: "08:00", turnout: 12, target: 15 },
  { time: "10:00", turnout: 28, target: 30 },
  { time: "12:00", turnout: 45, target: 50 },
  { time: "14:00", turnout: 58, target: 65 },
  { time: "16:00", turnout: 68, target: 75 },
  { time: "18:00", turnout: 72, target: 85 },
]

const districtData = [
  { district: "District 1", votes: 45000, turnout: 68 },
  { district: "District 2", votes: 52000, turnout: 72 },
  { district: "District 3", votes: 38000, turnout: 65 },
  { district: "District 4", votes: 41000, turnout: 70 },
  { district: "District 5", votes: 47000, turnout: 69 },
]

const demographicData = [
  { name: "18-29", value: 22, fill: "hsl(var(--chart-1))" },
  { name: "30-44", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "45-59", value: 25, fill: "hsl(var(--chart-3))" },
  { name: "60+", value: 25, fill: "hsl(var(--chart-4))" },
]

const chartConfig = {
  turnout: {
    label: "Actual Turnout",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target Turnout",
    color: "hsl(var(--chart-2))",
  },
  votes: {
    label: "Total Votes",
    color: "hsl(var(--chart-3))",
  },
}

export function ElectionAnalytics() {
  return (
    <div className="space-y-6">
      {/* Real-time Turnout Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Real-time Voter Turnout
          </CardTitle>
          <CardDescription>Hourly voter turnout vs. projected targets</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={turnoutData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="turnout"
                stroke="var(--color-turnout)"
                strokeWidth={3}
                dot={{ fill: "var(--color-turnout)", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-target)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "var(--color-target)", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              District Performance
            </CardTitle>
            <CardDescription>Votes and turnout by district</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="votes" fill="var(--color-votes)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Demographic Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Voter Demographics
            </CardTitle>
            <CardDescription>Turnout by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
