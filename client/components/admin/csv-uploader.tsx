"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface CSVUploaderProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => void
}

export function CSVUploader({ isOpen, onClose, onUpload }: CSVUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file)
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadStatus("uploading")
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
      onUpload(selectedFile)
      setUploadStatus("success")
      setTimeout(() => {
        onClose()
        setSelectedFile(null)
        setUploadStatus("idle")
      }, 1500)
    } catch (error) {
      setUploadStatus("error")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Voter Data</DialogTitle>
          <DialogDescription>Upload a CSV file containing voter information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <Card
            className={`border-2 border-dashed transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop your CSV file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </CardContent>
          </Card>

          {/* Selected File */}
          {selectedFile && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-chart-2" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {uploadStatus === "success" && <CheckCircle className="h-5 w-5 text-chart-3" />}
                  {uploadStatus === "error" && <AlertCircle className="h-5 w-5 text-chart-5" />}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CSV Format Guide */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First row should contain headers</li>
                <li>• Required columns: name, email, phone, address, district</li>
                <li>• Optional columns: date_of_birth, voter_id</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </CardContent>
          </Card>

          {/* Upload Status */}
          {uploadStatus === "uploading" && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Uploading and processing...</p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="text-center py-4 text-chart-3">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Upload successful!</p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="text-center py-4 text-chart-5">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Upload failed. Please try again.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={uploadStatus === "uploading"}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploadStatus === "uploading"}>
              {uploadStatus === "uploading" ? "Uploading..." : "Upload CSV"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
