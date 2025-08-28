"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RoleLayout } from "@/components/layout/role-layout"
import { adminSidebarItems } from "@/lib/admin-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, Download, FileText, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { CSVUploader } from "@/components/admin/csv-uploader"

export default function ImportVotersPage() {
  const router = useRouter()
  const [showUploader, setShowUploader] = useState(false)

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent =
      "First Name,Last Name,Email,Phone,Address,District,Date of Birth\nJohn,Doe,john.doe@email.com,+1234567890,123 Main St,District 1,1990-01-01\nJane,Smith,jane.smith@email.com,+1234567891,456 Oak Ave,District 2,1985-05-15"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "voter_import_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <RoleLayout role="admin" sidebarItems={adminSidebarItems} currentPath="/admin/voters/import">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Import Voters</h1>
            <p className="text-muted-foreground">Upload voter data via CSV file</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload CSV File</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Upload Voter Data</p>
                  <p className="text-muted-foreground mb-4">Select a CSV file containing voter information</p>
                  <Button onClick={() => setShowUploader(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Important Notes:</p>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>• Maximum file size: 10MB</li>
                        <li>• Supported format: CSV only</li>
                        <li>• Duplicate emails will be skipped</li>
                        <li>• Invalid data rows will be reported</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Template & Instructions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>CSV Template & Format</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Download the template file to ensure your CSV is formatted correctly:
                  </p>
                  <Button variant="outline" onClick={handleDownloadTemplate} className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV Template
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Required Columns:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-1 rounded">First Name</span>
                      <span className="text-muted-foreground">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-1 rounded">Last Name</span>
                      <span className="text-muted-foreground">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-1 rounded">Email</span>
                      <span className="text-muted-foreground">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-1 rounded">Phone</span>
                      <span className="text-muted-foreground">Optional</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-1 rounded">Address</span>
                      <span className="text-muted-foreground">Optional</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-1 rounded">District</span>
                      <span className="text-muted-foreground">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono bg-muted px-2 py-1 rounded">Date of Birth</span>
                      <span className="text-muted-foreground">Optional</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CSV Uploader Modal */}
        {showUploader && (
          <CSVUploader
            isOpen={showUploader}
            onClose={() => setShowUploader(false)}
            onUpload={(file) => {
              console.log("Uploading voter file:", file)
              setShowUploader(false)
              // Handle successful upload - could redirect or show success message
            }}
          />
        )}
      </div>
    </RoleLayout>
  )
}
