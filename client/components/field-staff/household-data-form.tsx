"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Home, Users, MapPin } from "lucide-react"

interface HouseholdMember {
  name: string
  age: string
  gender: string
  relationship: string
  occupation: string
  education: string
}

interface HouseholdFormData {
  householdId: string
  address: string
  headOfHousehold: string
  phoneNumber: string
  email: string
  householdSize: string
  housingType: string
  ownershipStatus: string
  monthlyIncome: string
  utilities: string[]
  members: HouseholdMember[]
  additionalNotes: string
}

interface HouseholdDataFormProps {
  onSubmit: (data: HouseholdFormData) => void
  isSubmitting: boolean
}

export function HouseholdDataForm({ onSubmit, isSubmitting }: HouseholdDataFormProps) {
  const [formData, setFormData] = useState<HouseholdFormData>({
    householdId: "",
    address: "",
    headOfHousehold: "",
    phoneNumber: "",
    email: "",
    householdSize: "",
    housingType: "",
    ownershipStatus: "",
    monthlyIncome: "",
    utilities: [],
    members: [
      {
        name: "",
        age: "",
        gender: "",
        relationship: "Head",
        occupation: "",
        education: "",
      },
    ],
    additionalNotes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addMember = () => {
    setFormData({
      ...formData,
      members: [
        ...formData.members,
        {
          name: "",
          age: "",
          gender: "",
          relationship: "",
          occupation: "",
          education: "",
        },
      ],
    })
  }

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      setFormData({
        ...formData,
        members: formData.members.filter((_, i) => i !== index),
      })
    }
  }

  const updateMember = (index: number, field: keyof HouseholdMember, value: string) => {
    const updatedMembers = formData.members.map((member, i) => (i === index ? { ...member, [field]: value } : member))
    setFormData({ ...formData, members: updatedMembers })
  }

  const handleUtilityChange = (utility: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, utilities: [...formData.utilities, utility] })
    } else {
      setFormData({ ...formData, utilities: formData.utilities.filter((u) => u !== utility) })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Household Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Household Information</span>
          </CardTitle>
          <CardDescription>Basic household details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="householdId">Household ID</Label>
              <Input
                id="householdId"
                value={formData.householdId}
                onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                placeholder="Enter household ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headOfHousehold">Head of Household</Label>
              <Input
                id="headOfHousehold"
                value={formData.headOfHousehold}
                onChange={(e) => setFormData({ ...formData, headOfHousehold: e.target.value })}
                placeholder="Enter head of household name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete address"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Housing Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Housing Details</span>
          </CardTitle>
          <CardDescription>Housing type, ownership, and utilities information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="householdSize">Household Size</Label>
              <Input
                id="householdSize"
                type="number"
                value={formData.householdSize}
                onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                placeholder="Number of members"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="housingType">Housing Type</Label>
              <Select
                value={formData.housingType}
                onValueChange={(value) => setFormData({ ...formData, housingType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select housing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownershipStatus">Ownership Status</Label>
              <Select
                value={formData.ownershipStatus}
                onValueChange={(value) => setFormData({ ...formData, ownershipStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ownership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Household Income Range</Label>
            <Select
              value={formData.monthlyIncome}
              onValueChange={(value) => setFormData({ ...formData, monthlyIncome: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1000">Under $1,000</SelectItem>
                <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                <SelectItem value="over-10000">Over $10,000</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Available Utilities (Check all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Electricity", "Water", "Gas", "Internet", "Cable TV", "Landline", "Sewage", "Garbage Collection"].map(
                (utility) => (
                  <div key={utility} className="flex items-center space-x-2">
                    <Checkbox
                      id={utility}
                      checked={formData.utilities.includes(utility)}
                      onCheckedChange={(checked) => handleUtilityChange(utility, checked as boolean)}
                    />
                    <Label htmlFor={utility} className="text-sm">
                      {utility}
                    </Label>
                  </div>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Household Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Household Members</span>
          </CardTitle>
          <CardDescription>Information about all household members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.members.map((member, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Member {index + 1}</h4>
                {formData.members.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeMember(index)}>
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => updateMember(index, "name", e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={member.age}
                    onChange={(e) => updateMember(index, "age", e.target.value)}
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={member.gender} onValueChange={(value) => updateMember(index, "gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Relationship to Head</Label>
                  <Select
                    value={member.relationship}
                    onValueChange={(value) => updateMember(index, "relationship", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Head">Head</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Other Relative">Other Relative</SelectItem>
                      <SelectItem value="Non-Relative">Non-Relative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input
                    value={member.occupation}
                    onChange={(e) => updateMember(index, "occupation", e.target.value)}
                    placeholder="Enter occupation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={member.education} onValueChange={(value) => updateMember(index, "education", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-formal">No Formal Education</SelectItem>
                      <SelectItem value="primary">Primary School</SelectItem>
                      <SelectItem value="secondary">Secondary School</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="university">University</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addMember} className="w-full bg-transparent">
            Add Another Member
          </Button>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>Any additional observations or comments</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            placeholder="Enter any additional notes or observations..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline">
          Save Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Household Data"}
        </Button>
      </div>
    </form>
  )
}
