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
import { electionAPI, apiHelpers } from "@/api/api"
import { useToast } from "@/hooks/use-toast"

interface Election {
  id: string
  title: string
  description?: string
  isActive: boolean
  start_time: string
  end_time: string
  is_public: boolean
  startDate: string
  endDate: string
  candidates?: any[]
  voters?: any[]
}

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true)
        const response = await electionAPI.getAllElections()
        const formattedElections = response.data.map(apiHelpers.formatElection)
        setElections(formattedElections)
      } catch (error) {
        console.error("Error fetching elections:", error)
        toast({
          title: "Error",
          description: "Failed to fetch elections. Please try again.",
          variant: "destructive",
        })
        // Fallback to mock data if API fails
        setElections([])
      } finally {
        setLoading(false)
      }
    }
    fetchElections()
  }, [toast])

  const handleCreateElection = async (data: any) => {
    try {
      const response = await electionAPI.createElection(data)
      const newElection = apiHelpers.formatElection(response.data)
      setElections(prev => [...prev, newElection])
      setIsCreateModalOpen(false)
      toast({
        title: "Success",
        description: "Election created successfully",
      })
    } catch (error) {
      console.error("Error creating election:", error)
      toast({
        title: "Error",
        description: "Failed to create election. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteElection = async (id: string) => {
    try {
      await electionAPI.deleteElection(id)
      setElections(prev => prev.filter(election => election.id !== id))
      toast({
        title: "Success",
        description: "Election deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting election:", error)
      toast({
        title: "Error", 
        description: "Failed to delete election. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredElections = elections.filter(
    (election) =>
      election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (election: Election) => {
    if (election.isActive) {
      return "bg-chart-3 text-white"
    } else {
      const now = new Date()
      const startTime = new Date(election.start_time)
      if (now < startTime) {
        return "bg-chart-1 text-white" // Scheduled
      } else {
        return "bg-chart-2 text-white" // Completed
      }
    }
  }

  const getStatusText = (election: Election) => {
    if (election.isActive) return "Active"
    const now = new Date()
    const startTime = new Date(election.start_time)
    return now < startTime ? "Scheduled" : "Completed"
  }

  // Calculate stats
  const activeElections = elections.filter(e => e.isActive).length
  const totalCandidates = elections.reduce((sum, e) => sum + (e.candidates?.length || 0), 0)
  const totalVoters = elections.reduce((sum, e) => sum + (e.voters?.length || 0), 0)

  if (loading) {
    return (
      <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/elections">
        <div className="p-6 space-y-6">
          <div className="text-center">Loading elections...</div>
        </div>
      </RoleLayout>
    )
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
                  <p className="text-2xl font-bold">{activeElections}</p>
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
                  <p className="text-2xl font-bold">{totalCandidates}</p>
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
                  <p className="text-2xl font-bold">{totalVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Elections</p>
                  <p className="text-2xl font-bold">{elections.length}</p>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Public</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredElections.map((election) => (
                  <TableRow key={election.id}>
                    <TableCell className="font-medium">{election.title}</TableCell>
                    <TableCell>{election.description || 'No description'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(election)}>
                        {getStatusText(election)}
                      </Badge>
                    </TableCell>
                    <TableCell>{election.startDate}</TableCell>
                    <TableCell>{election.endDate}</TableCell>
                    <TableCell>{election.is_public ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteElection(election.id)}
                        >
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
          onSubmit={handleCreateElection}
        />
      </div>
    </RoleLayout>
  )
}
