"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { adminSidebarItems } from "@/lib/admin-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CSVUploader } from "@/components/admin/csv-uploader"
import { AddVoterForm } from "@/components/admin/add-voter-form"
import { Plus, Search, Upload, Users, UserCheck, UserX, Download } from "lucide-react"
import { electionAPI, apiHelpers } from "@/api/api"
import { useToast } from "@/hooks/use-toast"

interface Voter {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  status?: string
  registrationDate?: string
  district?: string
  election_id?: string
  has_voted?: boolean
  election?: any
}

export default function VotersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploader, setShowUploader] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Get all elections first, then get voters for each
        const electionsResponse = await electionAPI.getAllElections()
        const allVoters: Voter[] = []
        
        // For each election, get its voters
        for (const election of electionsResponse.data) {
          try {
            const votersResponse = await electionAPI.getVotersByElection(election.id)
            const electionVoters = votersResponse.data.map((voter: any) => ({
              ...apiHelpers.formatVoter(voter),
              election: election,
              status: voter.has_voted ? "Voted" : "Active"
            }))
            allVoters.push(...electionVoters)
          } catch (error) {
            console.error(`Error fetching voters for election ${election.id}:`, error)
          }
        }
        
        setVoters(allVoters)
      } catch (error) {
        console.error("Error fetching voters:", error)
        toast({
          title: "Error",
          description: "Failed to fetch voters. Please try again.",
          variant: "destructive",
        })
        // Fallback to empty array if API fails
        setVoters([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  const handleCreateVoter = async (data: any) => {
    try {
      const response = await electionAPI.createVoter(data)
      const newVoter = apiHelpers.formatVoter(response.data)
      setVoters(prev => [...prev, newVoter])
      setShowAddForm(false)
      toast({
        title: "Success",
        description: "Voter created successfully",
      })
    } catch (error) {
      console.error("Error creating voter:", error)
      toast({
        title: "Error",
        description: "Failed to create voter. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteVoter = async (id: string) => {
    try {
      await electionAPI.deleteVoter(id)
      setVoters(prev => prev.filter(voter => voter.id !== id))
      toast({
        title: "Success",
        description: "Voter deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting voter:", error)
      toast({
        title: "Error",
        description: "Failed to delete voter. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredVoters = voters.filter(
    (voter) =>
      voter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.district?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-chart-3 text-white"
      case "Voted":
        return "bg-chart-1 text-white"
      case "Inactive":
        return "bg-chart-5 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate stats
  const totalVoters = voters.length
  const activeVoters = voters.filter(v => v.status === "Active").length
  const votedVoters = voters.filter(v => v.has_voted || v.status === "Voted").length
  const inactiveVoters = voters.filter(v => v.status === "Inactive").length

  if (loading) {
    return (
      <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/voters">
        <div className="p-6 space-y-6">
          <div className="text-center">Loading voters...</div>
        </div>
      </RoleLayout>
    )
  }

  return (
    <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/voters">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Voter Management</h1>
            <p className="text-muted-foreground">Manage voter registrations and data</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowUploader(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Voter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Voters</p>
                  <p className="text-2xl font-bold">{totalVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Voters</p>
                  <p className="text-2xl font-bold">{activeVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="h-4 w-4 text-chart-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Already Voted</p>
                  <p className="text-2xl font-bold">{votedVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{inactiveVoters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Voters Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registered Voters</CardTitle>
                <CardDescription>Manage voter registrations and information</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search voters..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Election</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVoters.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell className="font-medium">{voter.name}</TableCell>
                    <TableCell>{voter.email || "N/A"}</TableCell>
                    <TableCell>{voter.phone || "N/A"}</TableCell>
                    <TableCell>{voter.election?.title || voter.election_id}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(voter.status || "Active")}>
                        {voter.status || "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>{voter.registrationDate || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteVoter(voter.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* CSV Uploader Modal */}
        {showUploader && (
          <CSVUploader
            isOpen={showUploader}
            onClose={() => setShowUploader(false)}
            onUpload={(file) => {
              console.log("Uploading file:", file)
              setShowUploader(false)
            }}
          />
        )}

        {/* Add Voter Form Modal */}
        {showAddForm && (
          <AddVoterForm
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleCreateVoter}
          />
        )}
      </div>
    </RoleLayout>
  )
}
