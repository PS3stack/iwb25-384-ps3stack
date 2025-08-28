"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Eye, MapPin, Users, Calendar } from "lucide-react"

interface Household {
  id: string
  address: string
  familyName: string
  members: number
  status: string
  assignedDate: string
  completedDate: string | null
  priority: string
  notes: string
}

interface AssignedHouseholdsTableProps {
  households: Household[]
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function AssignedHouseholdsTable({ households, searchTerm, onSearchChange }: AssignedHouseholdsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-chart-3 text-white"
      case "In Progress":
        return "bg-chart-1 text-white"
      case "Pending":
        return "bg-chart-4 text-white"
      case "Not Contacted":
        return "bg-chart-5 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-chart-5 text-white"
      case "Normal":
        return "bg-chart-2 text-white"
      case "Low":
        return "bg-chart-4 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Household Assignments</CardTitle>
            <CardDescription>Manage your assigned households and their survey status</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search households..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
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
              <TableHead>Household ID</TableHead>
              <TableHead>Family & Address</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {households.map((household) => (
              <TableRow key={household.id}>
                <TableCell className="font-medium">{household.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{household.familyName}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {household.address}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    {household.members}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(household.status)}>{household.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(household.priority)}>{household.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                      Assigned: {household.assignedDate}
                    </div>
                    {household.completedDate && (
                      <div className="flex items-center text-chart-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        Completed: {household.completedDate}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground max-w-32 truncate" title={household.notes}>
                    {household.notes}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Edit/Survey">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
