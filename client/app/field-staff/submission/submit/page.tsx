"use client"

import { useState } from "react"
import { RoleLayout } from "@/components/layout/role-layout"
import { fieldStaffSidebarItems } from "@/lib/field-staff-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { HouseholdDataForm } from "@/components/field-staff/household-data-form"
import { Upload, CheckCircle, AlertTriangle } from "lucide-react"

export default function DataSubmissionPage() {
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  const handleSubmit = async (data: any) => {
    setSubmissionStatus("submitting")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Submitting household data:", data)
      setSubmissionStatus("success")
      setTimeout(() => setSubmissionStatus("idle"), 3000)
    } catch (error) {
      setSubmissionStatus("error")
      setTimeout(() => setSubmissionStatus("idle"), 3000)
    }
  }

  return (
    <RoleLayout role="field-staff" sidebarItems={fieldStaffSidebarItems} currentPath="/field-staff/submission/submit">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Submission</h1>
            <p className="text-muted-foreground">Submit collected household survey data</p>
          </div>
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-chart-1" />
            <span className="text-sm text-muted-foreground">
              {submissionStatus === "submitting" && "Submitting..."}
              {submissionStatus === "success" && "Submitted Successfully"}
              {submissionStatus === "error" && "Submission Failed"}
              {submissionStatus === "idle" && "Ready to Submit"}
            </span>
          </div>
        </div>

        {/* Status Messages */}
        {submissionStatus === "success" && (
          <Card className="border-chart-3 bg-chart-3/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-chart-3" />
                <span className="font-medium text-chart-3">Data submitted successfully!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {submissionStatus === "error" && (
          <Card className="border-chart-5 bg-chart-5/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-chart-5" />
                <span className="font-medium text-chart-5">Submission failed. Please try again.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Household Data Form */}
        <HouseholdDataForm onSubmit={handleSubmit} isSubmitting={submissionStatus === "submitting"} />
      </div>
    </RoleLayout>
  )
}
