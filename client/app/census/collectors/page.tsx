"use client"

import { useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { censusSidebarItems } from "@/lib/census-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddCollectorForm } from "@/components/census/add-collector-form"
import { Plus, Search, Users, UserCheck, MapPin, Calendar } from "lucide-react"

const mockCollectors = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@census.gov",
    phone: "+1234567890",
    region: "District 1",
    status: "Active",
    assignedHouseholds: 245,
    completedHouseholds: 189,
    joinDate: "2024-01-15",
    experience: "Senior",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@census.gov",
    phone: "+1234567891",
    region: "District 2",
    status: "Active",
    assignedHouseholds: 198,
    completedHouseholds: 156,
    joinDate: "2024-01-20",
    experience: "Intermediate",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@census.gov",
    phone: "+1234567892",
    region: "District 3",
    status: "Inactive",
    assignedHouseholds: 167,
    completedHouseholds: 134,
    joinDate: "2024-01-10",
    experience: "Junior",
  },
]

export default function CollectorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredCollectors = mockCollectors.filter(
    (collector) =>
      collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collector.experience.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-chart-3 text-white" : "bg-chart-5 text-white"
  }

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "Senior":
        return "bg-chart-1 text-white"
      case "Intermediate":
        return "bg-chart-2 text-white"
      case "Junior":
        return "bg-chart-4 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <RoleLayout role="census" sidebarItems={censusSidebarItems} currentPath="/census/collectors">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Collectors</h1>
            <p className="text-muted-foreground">Manage field data collection staff</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Collector
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Collectors</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Collectors</p>
                  <p className="text-2xl font-bold">134</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Households</p>
                  <p className="text-2xl font-bold">203</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">82%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collectors Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Data Collectors</CardTitle>
                <CardDescription>Manage field staff and their assignments</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search collectors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollectors.map((collector) => (
                  <TableRow key={collector.id}>
                    <TableCell className="font-medium">{collector.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{collector.email}</div>
                        <div className="text-muted-foreground">{collector.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>{collector.region}</TableCell>
                    <TableCell>
                      <Badge className={getExperienceColor(collector.experience)}>{collector.experience}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(collector.status)}>{collector.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {collector.completedHouseholds}/{collector.assignedHouseholds}
                        </div>
                        <div className="text-muted-foreground">
                          {Math.round((collector.completedHouseholds / collector.assignedHouseholds) * 100)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{collector.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Collector Form Modal */}
        {showAddForm && (
          <AddCollectorForm
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={(data) => {
              console.log("Adding collector:", data)
              setShowAddForm(false)
            }}
          />
        )}
      </div>
    </RoleLayout>
  )
}
