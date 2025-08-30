"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { censusSidebarItems } from "@/lib/census-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CensusFormModal } from "@/components/census/census-form-modal"
import { Plus, Search, Edit, Trash2, Eye, Calendar, Users, MapPin, BarChart3 } from "lucide-react"

const mockprojects = [
  {
    id: 1,
    name: "National Population Census 2024",
    description: "Comprehensive population and housing census",
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    collectors: 45,
    households: 8934,
    progress: 78,
    region: "National",
  },
  {
    id: 2,
    name: "Urban Housing Survey",
    description: "Housing conditions and infrastructure survey",
    status: "Active",
    startDate: "2024-02-01",
    endDate: "2024-04-15",
    collectors: 23,
    households: 2156,
    progress: 92,
    region: "Urban Areas",
  },
  {
    id: 3,
    name: "Agricultural Census",
    description: "Agricultural land use and farming practices",
    status: "Scheduled",
    startDate: "2024-05-01",
    endDate: "2024-08-20",
    collectors: 67,
    households: 5678,
    progress: 0,
    region: "Rural Areas",
  },
]

export default function CensusProjectsPage() {
  const [mockProjects, setMockProjects] = useState(mockprojects)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/projects");
        // const data = await response.json();
        // setMockProjects(data.projects);
        setMockProjects(mockprojects);
      } catch (error) {
        console.error("Error fetching projects data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.region.toLowerCase().includes(searchTerm.toLowerCase()),
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
    <RoleLayout role="census" sidebarItems={censusSidebarItems} currentPath="/census/projects">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Census Projects</h1>
            <p className="text-muted-foreground">Create and manage census survey projects</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Collectors</p>
                  <p className="text-2xl font-bold">135</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Households Surveyed</p>
                  <p className="text-2xl font-bold">16,768</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Completion</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Census Projects</CardTitle>
                <CardDescription>Manage your census survey projects</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
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
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Collectors</TableHead>
                  <TableHead>Households</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-chart-2 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{project.startDate}</div>
                        <div className="text-muted-foreground">to {project.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>{project.collectors}</TableCell>
                    <TableCell>{project.households.toLocaleString()}</TableCell>
                    <TableCell>{project.region}</TableCell>
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

        {/* Create Project Modal */}
        <CensusFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => {
            console.log("Census project created:", data)
            setIsCreateModalOpen(false)
          }}
        />
      </div>
    </RoleLayout>
  )
}
