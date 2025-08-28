"use client"

import { useState } from "react"
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

const mockVoters = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    address: "123 Main St, City",
    status: "Active",
    registrationDate: "2024-01-15",
    district: "District 1",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1234567891",
    address: "456 Oak Ave, City",
    status: "Active",
    registrationDate: "2024-01-20",
    district: "District 2",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1234567892",
    address: "789 Pine St, City",
    status: "Inactive",
    registrationDate: "2024-01-10",
    district: "District 1",
  },
]

export default function VotersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploader, setShowUploader] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredVoters = mockVoters.filter(
    (voter) =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.district.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-chart-3 text-white" : "bg-chart-5 text-white"
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
                  <p className="text-2xl font-bold">1,247</p>
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
                  <p className="text-2xl font-bold">1,156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="h-4 w-4 text-chart-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Inactive Voters</p>
                  <p className="text-2xl font-bold">91</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">156</p>
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
                  <TableHead>District</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVoters.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell className="font-medium">{voter.name}</TableCell>
                    <TableCell>{voter.email}</TableCell>
                    <TableCell>{voter.phone}</TableCell>
                    <TableCell>{voter.district}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(voter.status)}>{voter.status}</Badge>
                    </TableCell>
                    <TableCell>{voter.registrationDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
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
            onSubmit={(data) => {
              console.log("Adding voter:", data)
              setShowAddForm(false)
            }}
          />
        )}
      </div>
    </RoleLayout>
  )
}
