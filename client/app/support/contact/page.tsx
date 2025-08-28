"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, Phone, Mail } from "lucide-react"

export default function ContactSupport() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Contact Support</h1>
        <p className="text-slate-600 mt-2">Submit a support ticket and we'll get back to you as soon as possible.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Submit Support Ticket
              </CardTitle>
              <CardDescription>Provide details about your issue and we'll help you resolve it</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter your first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter your last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter your email address" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Issue Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voter-registration">Voter Registration</SelectItem>
                    <SelectItem value="election-process">Election Process</SelectItem>
                    <SelectItem value="observer-support">Observer Support</SelectItem>
                    <SelectItem value="technical-issue">Technical Issue</SelectItem>
                    <SelectItem value="account-access">Account Access</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Issue affecting work</SelectItem>
                    <SelectItem value="high">High - Urgent issue</SelectItem>
                    <SelectItem value="critical">Critical - System down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about your issue, including any error messages and steps to reproduce the problem."
                  rows={6}
                />
              </div>

              <Button className="w-full flex items-center gap-2">
                <Send className="w-4 h-4" />
                Submit Support Ticket
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
              <CardDescription>Alternative contact methods for urgent issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone Support</h3>
                  <p className="text-sm text-slate-600">+1 (800) 123-4567</p>
                  <p className="text-xs text-slate-500">Mon-Fri, 8AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-slate-600">support@elections.gov</p>
                  <p className="text-xs text-slate-500">Response within 2 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-slate-600">Available 24/7</p>
                  <p className="text-xs text-slate-500">Instant responses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
              <CardDescription>Expected response times by priority level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Critical</span>
                <span className="text-sm text-slate-600">15 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">High</span>
                <span className="text-sm text-slate-600">1 hour</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Medium</span>
                <span className="text-sm text-slate-600">4 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Low</span>
                <span className="text-sm text-slate-600">24 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
