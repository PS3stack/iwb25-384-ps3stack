"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, MapPin, Phone, Mail } from "lucide-react"

export function ObserverDataTable() {
  const [observers] = useState([
    {
      id: "OBS001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      area: "District 1 - Central",
      role: "Senior Observer",
      status: "Active",
      experience: "Experienced",
      lastActive: "2024-01-15",
    },
    {
      id: "OBS002",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      area: "District 2 - North",
      role: "Regular Observer",
      status: "Active",
      experience: "Intermediate",
      lastActive: "2024-01-14",
    },
    {
      id: "OBS003",
      name: "Michael Brown",
      email: "m.brown@email.com",
      phone: "+1 (555) 345-6789",
      area: "District 3 - South",
      role: "Trainee Observer",
      status: "Training",
      experience: "Beginner",
      lastActive: "2024-01-13",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Training":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Senior Observer":
        return "bg-blue-100 text-blue-800"
      case "Regular Observer":
        return "bg-purple-100 text-purple-800"
      case "Trainee Observer":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Observer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observers.map((observer) => (
              <TableRow key={observer.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{observer.name}</div>
                    <div className="text-sm text-slate-500">{observer.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="w-3 h-3 mr-1 text-slate-400" />
                      {observer.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-3 h-3 mr-1 text-slate-400" />
                      {observer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                    {observer.area}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(observer.role)}>{observer.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(observer.status)}>{observer.status}</Badge>
                </TableCell>
                <TableCell>{observer.experience}</TableCell>
                <TableCell>{observer.lastActive}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
