"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { adminSidebarItems } from "@/lib/admin-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ElectionFormModal } from "@/components/admin/election-form-modal"
import { Plus, Search, Edit, Trash2, Eye, Calendar, Users, MapPin } from "lucide-react"

const mockelections = [
  {
    id: 1,
    title: "Presidential Election 2024",
    type: "Presidential",
    status: "Active",
    startDate: "2024-03-15",
    endDate: "2024-03-15",
    candidates: 4,
    voters: 1247,
    location: "National",
  },
  {
    id: 2,
    title: "City Council Election",
    type: "Local",
    status: "Scheduled",
    startDate: "2024-04-20",
    endDate: "2024-04-20",
    candidates: 8,
    voters: 892,
    location: "City Center",
  },
  {
    id: 3,
    title: "School Board Election",
    type: "Educational",
    status: "Completed",
    startDate: "2024-02-10",
    endDate: "2024-02-10",
    candidates: 6,
    voters: 456,
    location: "District 5",
  },
]

export default function ElectionsPage() {
  const [mockElections, setMockElections] = useState(mockelections)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)


  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/elections");
        // const data = await response.json();
        // setMockElections(data);
        setMockElections(mockelections);
      } catch (error) {
        console.error("Error fetching elections:", error);
      }
    };
    fetchData();
  }, []);

  const filteredElections = mockElections.filter(
    (election) =>
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-chart-3 text-white"
      case "Scheduled":
        return "bg-chart-1 text-white"
      case "Completed":
        return "bg-chart-2 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/elections">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Election Management</h1>
            <p className="text-muted-foreground">Create and manage elections</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Election
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Elections</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidates</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Registered Voters</p>
                  <p className="text-2xl font-bold">2,595</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Locations</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Elections Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Elections</CardTitle>
                <CardDescription>Manage your election campaigns</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search elections..."
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
                  <TableHead>Election Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Voters</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredElections.map((election) => (
                  <TableRow key={election.id}>
                    <TableCell className="font-medium">{election.title}</TableCell>
                    <TableCell>{election.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(election.status)}>{election.status}</Badge>
                    </TableCell>
                    <TableCell>{election.startDate}</TableCell>
                    <TableCell>{election.candidates}</TableCell>
                    <TableCell>{election.voters}</TableCell>
                    <TableCell>{election.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Election Modal */}
        <ElectionFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => {
            console.log("Election created:", data)
            setIsCreateModalOpen(false)
          }}
        />
      </div>
    </RoleLayout>
  )
}
