"use client"

import { useEffect, useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { fieldStaffSidebarItems } from "@/lib/field-staff-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { AssignedHouseholdsTable } from "@/components/field-staff/assigned-households-table"
import { Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const mockhouseholds = [
  {
    id: "H-2024-1567",
    address: "123 Main Street, Block A",
    familyName: "Johnson Family",
    members: 4,
    status: "Completed",
    assignedDate: "2024-01-15",
    completedDate: "2024-01-18",
    priority: "Normal",
    notes: "Cooperative family, complete data collected",
  },
  {
    id: "H-2024-1568",
    address: "456 Oak Avenue, Block A",
    familyName: "Smith Family",
    members: 6,
    status: "In Progress",
    assignedDate: "2024-01-15",
    completedDate: null,
    priority: "High",
    notes: "Partial data collected, follow-up needed",
  },
  {
    id: "H-2024-1569",
    address: "789 Pine Street, Block B",
    familyName: "Rodriguez Family",
    members: 3,
    status: "Pending",
    assignedDate: "2024-01-20",
    completedDate: null,
    priority: "Normal",
    notes: "Initial contact made, survey scheduled",
  },
  {
    id: "H-2024-1570",
    address: "321 Elm Drive, Block B",
    familyName: "Chen Family",
    members: 5,
    status: "Not Contacted",
    assignedDate: "2024-01-22",
    completedDate: null,
    priority: "Low",
    notes: "New assignment, contact pending",
  },
]

export default function AssignedHouseholdsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [mockHouseholds, setMockHouseholds] = useState(mockhouseholds)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/households");
        // const data = await response.json();
        // setMockHouseholds(data.households);
        setMockHouseholds(mockhouseholds);
      } catch (error) {
        console.error("Error fetching households data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredHouseholds = mockHouseholds.filter(
    (household) =>
      household.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusStats = () => {
    const completed = mockHouseholds.filter((h) => h.status === "Completed").length
    const inProgress = mockHouseholds.filter((h) => h.status === "In Progress").length
    const pending = mockHouseholds.filter((h) => h.status === "Pending").length
    const notContacted = mockHouseholds.filter((h) => h.status === "Not Contacted").length
    return { completed, inProgress, pending, notContacted }
  }

  const stats = getStatusStats()

  return (
    <RoleLayout role="field-staff" sidebarItems={fieldStaffSidebarItems} currentPath="/field-staff/households/assigned">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assigned Households</h1>
            <p className="text-muted-foreground">View and manage your household assignments</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Assigned</div>
            <div className="text-2xl font-bold text-chart-1">{mockHouseholds.length}</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-chart-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-chart-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Not Contacted</p>
                  <p className="text-2xl font-bold">{stats.notContacted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Households Table */}
        <AssignedHouseholdsTable
          households={filteredHouseholds}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
    </RoleLayout>
  )
}
