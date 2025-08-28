"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users, MapPin, Smartphone, Filter } from "lucide-react"
import { AddObserverForm } from "@/components/admin/add-observer-form"
import { ObserverDataTable } from "@/components/admin/observer-data-table"
import { AreaManagement } from "@/components/admin/area-management"
import { DeviceUploader } from "@/components/admin/device-uploader"
import { RoleLayout } from "@/components/layout/role-layout"
import { adminSidebarItems } from "@/lib/admin-navigation"

export default function ObserversPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState("observers")

  const stats = [
    { label: "Total Observers", value: "1,247", icon: Users, color: "text-blue-600" },
    { label: "Active Areas", value: "89", icon: MapPin, color: "text-green-600" },
    { label: "Devices Assigned", value: "1,156", icon: Smartphone, color: "text-purple-600" },
    { label: "Pending Assignments", value: "23", icon: Filter, color: "text-orange-600" },
  ]

  const tabs = [
    { id: "observers", label: "Observers", component: ObserverDataTable },
    { id: "areas", label: "Area Management", component: AreaManagement },
    { id: "devices", label: "Device Management", component: DeviceUploader },
  ]

  return (
    <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/observers">
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Observer Management</h1>
          <p className="text-slate-600 mt-1">Manage election observers, areas, and device assignments</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Observer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input placeholder="Search observers..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {tabs.map((tab) => (
            <div key={tab.id} className={activeTab === tab.id ? "block" : "hidden"}>
              <tab.component />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Add Observer Modal */}
      {showAddForm && <AddObserverForm onClose={() => setShowAddForm(false)} />}
    </div>
    </RoleLayout>
  )
}
