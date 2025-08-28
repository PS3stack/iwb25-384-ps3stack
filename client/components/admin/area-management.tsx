"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit } from "lucide-react"

export function AreaManagement() {
  const [areas] = useState([
    {
      id: "DIST001",
      name: "District 1 - Central",
      description: "Downtown and central business district",
      observers: 45,
      pollingStations: 12,
      status: "Active",
      coordinator: "John Smith",
    },
    {
      id: "DIST002",
      name: "District 2 - North",
      description: "Northern residential areas",
      observers: 38,
      pollingStations: 10,
      status: "Active",
      coordinator: "Sarah Johnson",
    },
    {
      id: "DIST003",
      name: "District 3 - South",
      description: "Southern industrial and residential zones",
      observers: 42,
      pollingStations: 11,
      status: "Setup",
      coordinator: "Michael Brown",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Setup":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Area Management</h3>
          <p className="text-sm text-slate-600">Manage electoral districts and observer assignments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Area
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <Card key={area.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <CardTitle className="text-base">{area.name}</CardTitle>
                    <CardDescription className="text-sm">{area.id}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(area.status)}>{area.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">{area.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{area.observers}</div>
                  <div className="text-xs text-slate-600">Observers</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">{area.pollingStations}</div>
                  <div className="text-xs text-slate-600">Polling Stations</div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Coordinator</div>
                    <div className="text-sm text-slate-600">{area.coordinator}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
