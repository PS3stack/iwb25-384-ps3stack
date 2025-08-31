"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Smartphone, Download, CheckCircle, AlertCircle, Clock } from "lucide-react"

export function DeviceUploader() {
  const [devices] = useState([
    {
      id: "DEV001",
      serialNumber: "TAB-2024-001",
      model: "Samsung Galaxy Tab A8",
      assignedTo: "John Smith",
      area: "District 1",
      status: "Active",
      lastSync: "2024-01-15 14:30",
      batteryLevel: 85,
    },
    {
      id: "DEV002",
      serialNumber: "TAB-2024-002",
      model: "iPad Air 5th Gen",
      assignedTo: "Sarah Johnson",
      area: "District 2",
      status: "Syncing",
      lastSync: "2024-01-15 13:45",
      batteryLevel: 92,
    },
    {
      id: "DEV003",
      serialNumber: "TAB-2024-003",
      model: "Samsung Galaxy Tab A8",
      assignedTo: "Michael Brown",
      area: "District 3",
      status: "Offline",
      lastSync: "2024-01-14 16:20",
      batteryLevel: 23,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Syncing":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "Offline":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Syncing":
        return "bg-yellow-100 text-yellow-800"
      case "Offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-600"
    if (level > 20) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Device Management</h3>
          <p className="text-sm text-slate-600">Manage observer devices and data synchronization</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Config
          </Button>
        </div>
      </div>

      {/* Device Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Devices</p>
                <p className="text-2xl font-bold text-slate-900">156</p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-green-600">142</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Syncing</p>
                <p className="text-2xl font-bold text-yellow-600">8</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Offline</p>
                <p className="text-2xl font-bold text-red-600">6</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Table */}
      <Card>
        <CardHeader>
          <CardTitle>Device Inventory</CardTitle>
          <CardDescription>Monitor and manage all observer devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{device.model}</div>
                        <div className="text-sm text-slate-500">{device.serialNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{device.assignedTo}</div>
                        <div className="text-sm text-slate-500">{device.area}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(device.status)}
                        <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{device.lastSync}</TableCell>
                    <TableCell>
                      <div className={`font-medium ${getBatteryColor(device.batteryLevel)}`}>
                        {device.batteryLevel}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
