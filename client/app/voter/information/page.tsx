"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Mail, Edit, CheckCircle } from "lucide-react"

export default function VoterInformation() {
  const voterInfo = {
    fullName: "John Michael Smith",
    dateOfBirth: "1985-03-15",
    nationalId: "ID123456789",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Apt 4B, Springfield, IL 62701",
    registrationDate: "2020-09-15",
    pollingStation: "Springfield Elementary School - Gym",
    district: "District 5",
    status: "Active",
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Voter Information</h1>
          <p className="text-slate-600 mt-2">View and manage your voter registration details.</p>
        </div>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Verified
        </Badge>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Your registered personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={voterInfo.fullName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID</Label>
              <Input id="nationalId" value={voterInfo.nationalId} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" value={voterInfo.dateOfBirth} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationDate">Registration Date</Label>
              <Input id="registrationDate" value={voterInfo.registrationDate} readOnly />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Edit className="w-4 h-4" />
              Request Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Your contact details for election notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={voterInfo.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={voterInfo.phone} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Residential Address</Label>
            <Input id="address" value={voterInfo.address} />
          </div>
          <div className="flex justify-end">
            <Button className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Update Contact Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voting Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Voting Location
          </CardTitle>
          <CardDescription>Your assigned polling station and district</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="district">Electoral District</Label>
              <Input id="district" value={voterInfo.district} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Registration Status</Label>
              <Input id="status" value={voterInfo.status} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pollingStation">Polling Station</Label>
            <Input id="pollingStation" value={voterInfo.pollingStation} readOnly />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <MapPin className="w-4 h-4" />
              View Map
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
