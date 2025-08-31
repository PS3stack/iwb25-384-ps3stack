"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Vote, X } from "lucide-react"

interface VoteConfirmationModalProps {
  selections: Record<string, string>
  elections: any[]
  onConfirm: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function VoteConfirmationModal({ selections, elections, onConfirm, onCancel, isSubmitting = false }: VoteConfirmationModalProps) {
  const getSelectedCandidate = (electionId: string, candidateId: string) => {
    const election = elections.find((e) => e.id.toString() === electionId)
    return election?.candidates.find((c: any) => c.id === candidateId)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-blue-600">
                <Vote className="w-5 h-5 mr-2" />
                Confirm Your Vote
              </CardTitle>
              <CardDescription>Please review your selections before submitting</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Once you submit your ballot, your vote cannot be changed. Please review your selections carefully.
                  </p>
                </div>
              </div>
            </div>

            {/* Vote Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Your Vote Summary</h3>
              {elections
                .filter((election) => selections[election.id.toString()]) // Only show elections with selections
                .map((election) => {
                const selectedCandidateId = selections[election.id.toString()]
                const selectedCandidate = getSelectedCandidate(election.id.toString(), selectedCandidateId)

                return (
                  <div key={election.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-slate-900">{election.title}</h4>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    </div>
                    {selectedCandidate && (
                      <div className="flex items-center space-x-3 bg-slate-50 rounded-lg p-3">
                        <img
                          src={selectedCandidate.photo || "/placeholder.svg"}
                          alt={selectedCandidate.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-slate-900">{selectedCandidate.name}</div>
                          <div className="text-sm text-slate-600">{selectedCandidate.party}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Ready to Submit</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    You have made selections for all {elections.length} elections on your ballot.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Go Back to Review
              </Button>
              <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                <Vote className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit My Vote'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
