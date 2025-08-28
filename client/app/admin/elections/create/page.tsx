"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RoleLayout } from "@/components/layout/role-layout"
import { adminSidebarItems } from "@/lib/admin-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, MapPin, Settings } from "lucide-react"

export default function CreateElectionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    allowEarlyVoting: false,
    allowAbsenteeVoting: false,
    requireVoterID: true,
    maxVotersPerLocation: "",
    electionOfficials: "",
    observerAccess: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating election with data:", formData)
    // Here you would typically send the data to your API
    router.push("/admin/elections")
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/elections/create">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Election</h1>
            <p className="text-muted-foreground">Set up a new election campaign</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>Enter the fundamental details about this election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Election Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Presidential Election 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Election Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select election type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presidential">Presidential</SelectItem>
                      <SelectItem value="parliamentary">Parliamentary</SelectItem>
                      <SelectItem value="local">Local Government</SelectItem>
                      <SelectItem value="municipal">Municipal</SelectItem>
                      <SelectItem value="school-board">School Board</SelectItem>
                      <SelectItem value="referendum">Referendum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Provide a brief description of this election..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Schedule & Location</span>
              </CardTitle>
              <CardDescription>Set the timing and location details for the election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Primary Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., City Hall, District 5, National"
                />
              </div>
            </CardContent>
          </Card>

          {/* Voting Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Voting Configuration</span>
              </CardTitle>
              <CardDescription>Configure voting rules and accessibility options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxVoters">Max Voters per Location</Label>
                  <Input
                    id="maxVoters"
                    type="number"
                    value={formData.maxVotersPerLocation}
                    onChange={(e) => handleInputChange("maxVotersPerLocation", e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officials">Election Officials</Label>
                  <Input
                    id="officials"
                    value={formData.electionOfficials}
                    onChange={(e) => handleInputChange("electionOfficials", e.target.value)}
                    placeholder="Comma-separated list of officials"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="earlyVoting"
                    checked={formData.allowEarlyVoting}
                    onCheckedChange={(checked) => handleInputChange("allowEarlyVoting", checked as boolean)}
                  />
                  <Label htmlFor="earlyVoting">Allow Early Voting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="absenteeVoting"
                    checked={formData.allowAbsenteeVoting}
                    onCheckedChange={(checked) => handleInputChange("allowAbsenteeVoting", checked as boolean)}
                  />
                  <Label htmlFor="absenteeVoting">Allow Absentee Voting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="voterID"
                    checked={formData.requireVoterID}
                    onCheckedChange={(checked) => handleInputChange("requireVoterID", checked as boolean)}
                  />
                  <Label htmlFor="voterID">Require Voter ID</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="observerAccess"
                    checked={formData.observerAccess}
                    onCheckedChange={(checked) => handleInputChange("observerAccess", checked as boolean)}
                  />
                  <Label htmlFor="observerAccess">Allow Observer Access</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Election</Button>
          </div>
        </form>
      </div>
    </RoleLayout>
  )
}
