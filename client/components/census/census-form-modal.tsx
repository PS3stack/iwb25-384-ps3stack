"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface CensusFormData {
  name: string
  description: string
  type: string
  startDate: Date | undefined
  endDate: Date | undefined
  region: string
  targetHouseholds: string
  methodology: string
}

interface CensusFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CensusFormData) => void
}

export function CensusFormModal({ isOpen, onClose, onSubmit }: CensusFormModalProps) {
  const [formData, setFormData] = useState<CensusFormData>({
    name: "",
    description: "",
    type: "",
    startDate: undefined,
    endDate: undefined,
    region: "",
    targetHouseholds: "",
    methodology: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      description: "",
      type: "",
      startDate: undefined,
      endDate: undefined,
      region: "",
      targetHouseholds: "",
      methodology: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create New Census Project</DialogTitle>
          <DialogDescription>Set up a new census survey project with all necessary details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Census Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="population">Population Census</SelectItem>
                  <SelectItem value="housing">Housing Survey</SelectItem>
                  <SelectItem value="agricultural">Agricultural Census</SelectItem>
                  <SelectItem value="economic">Economic Survey</SelectItem>
                  <SelectItem value="demographic">Demographic Study</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter project description and objectives"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Target Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="urban">Urban Areas</SelectItem>
                  <SelectItem value="rural">Rural Areas</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="district">District Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetHouseholds">Target Households</Label>
              <Input
                id="targetHouseholds"
                type="number"
                value={formData.targetHouseholds}
                onChange={(e) => setFormData({ ...formData, targetHouseholds: e.target.value })}
                placeholder="Enter target number"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="methodology">Methodology</Label>
            <Select
              value={formData.methodology}
              onValueChange={(value) => setFormData({ ...formData, methodology: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select methodology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="door-to-door">Door-to-Door Survey</SelectItem>
                <SelectItem value="digital">Digital/Online Survey</SelectItem>
                <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                <SelectItem value="sampling">Statistical Sampling</SelectItem>
                <SelectItem value="complete">Complete Enumeration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
