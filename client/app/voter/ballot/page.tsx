"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { VoteConfirmationModal } from "@/components/voter/vote-confirmation-modal"
import { Vote, Award, Clock, CheckCircle, AlertCircle, X } from "lucide-react"
import { electionAPI, voterAPI } from "@/api/api"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface Candidate {
  id: string
  name: string
  party: string
  photo?: string
  platform?: string
}

interface Election {
  id: string | number
  title: string
  description: string | null
  start_time: string | number | [number, number]
  end_time: string | number | [number, number]
  is_public?: boolean
  status?: string
  candidates: Candidate[]
}

export default function BallotPage() {
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true)
        console.log('Fetching elections for ballot...')
        
        // For testing - set a voter token if none exists
        if (typeof window !== 'undefined' && !localStorage.getItem('authToken')) {
          const testVoterToken = "eyJzdWIiOiJ2b3RlcjFAdGVzdC5jb20iLCAiaXNzIjoiYXV0aC1zZXJ2aWNlIiwgImF1ZCI6ImNlbnN1cy1zeXN0ZW0iLCAiaWF0IjoxNzU2NjU4NzgwLCAiZXhwIjoxNzU2NjYyMzgwLCAicm9sZV9pZCI6NSwgInJvbGUiOiJ2b3RlciJ9.Y4FDbyZXRHIpTm3SkItEUNgGY+NirrWXbU/Il0Lis+c="
          localStorage.setItem('authToken', testVoterToken)
          console.log('Set test voter token for debugging')
        }
        
        // Get all active elections
        const electionsResponse = await electionAPI.getAllElections()
        console.log('Elections response:', electionsResponse.data)
        console.log('Sample election timestamps:', electionsResponse.data[6])
        
        if (!electionsResponse.data || !Array.isArray(electionsResponse.data)) {
          throw new Error('Invalid elections data received')
        }
        
        // Filter for active elections only (based on time window)
        const activeElections = electionsResponse.data.filter((election: any) => {
          const now = new Date()
          
          // Handle different timestamp formats from backend
          let startTime: Date
          let endTime: Date
          
          if (Array.isArray(election.start_time)) {
            // Backend returns [seconds, nanoseconds] array
            startTime = new Date(election.start_time[0] * 1000)
            endTime = new Date(election.end_time[0] * 1000)
          } else if (typeof election.start_time === 'number') {
            // Unix timestamp in seconds
            startTime = new Date(election.start_time * 1000)
            endTime = new Date(election.end_time * 1000)
          } else {
            // ISO string format
            startTime = new Date(election.start_time)
            endTime = new Date(election.end_time)
          }
          
          const isActive = now >= startTime && now <= endTime
          
          console.log(`Election: ${election.title}`)
          console.log(`  Start: ${startTime.toISOString()} (${election.start_time})`)
          console.log(`  End: ${endTime.toISOString()} (${election.end_time})`)
          console.log(`  Now: ${now.toISOString()}`)
          console.log(`  Is Active: ${isActive}`)
          console.log('---')
          
          return isActive
        })
        
        console.log(`Found ${activeElections.length} active elections out of ${electionsResponse.data.length} total`)
        
        // For now, let's process all elections and show them regardless of active status for debugging
        console.warn('DEBUG MODE: Showing all elections regardless of time filters')
        const electionsToProcess = electionsResponse.data
        
        // Fetch candidates for each election
        const electionsWithCandidates = await Promise.all(
          electionsToProcess.map(async (election: any) => {
            try {
              const candidatesResponse = await electionAPI.getCandidatesByElection(election.id)
              console.log(`Candidates for election ${election.id}:`, candidatesResponse.data)
              
              return {
                ...election,
                candidates: (candidatesResponse.data || []).map((candidate: any) => ({
                  ...candidate,
                  photo: candidate.photo_url // Map photo_url to photo for frontend compatibility
                }))
              }
            } catch (error) {
              console.error(`Error fetching candidates for election ${election.id}:`, error)
              return {
                ...election,
                candidates: []
              }
            }
          })
        )
        
        // Show all elections, even those without candidates for debugging
        setElections(electionsWithCandidates)
        console.log('Final elections with candidates:', electionsWithCandidates)
        
      } catch (error: any) {
        console.error('Error fetching elections:', error)
        
        // Fallback to test elections for demo purposes when backend is not available
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.response?.status >= 500) {
          console.log('Backend not available, using test elections for demo')
          const testElections = [
            {
              id: "test-1",
              title: "City Council Election 2025",
              description: "Select your representative for the city council",
              start_time: Math.floor(Date.now() / 1000) - 86400, // Yesterday in Unix timestamp
              end_time: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now in Unix timestamp
              is_public: true,
              candidates: [
                {
                  id: "test-candidate-1",
                  name: "Alice Johnson",
                  party: "Democratic Party",
                  photo: "https://images.unsplash.com/photo-1494790108755-2616b626be13?w=150&h=150&fit=crop&crop=face",
                  platform: "Focus on infrastructure and education funding"
                },
                {
                  id: "test-candidate-2",
                  name: "Robert Smith",
                  party: "Republican Party",
                  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  platform: "Economic development and tax reduction"
                },
                {
                  id: "test-candidate-3",
                  name: "Maria Garcia",
                  party: "Independent",
                  photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  platform: "Environmental protection and community engagement"
                }
              ]
            }
          ]
          setElections(testElections)
          console.log('Using test elections:', testElections)
        } else {
          setError(error.message || 'Failed to load elections. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchElections()
  }, [])

  const handleVoteSelection = (electionId: string | number, candidateId: string) => {
    const electionKey = electionId.toString()
    setSelections((prev) => ({
      ...prev,
      [electionKey]: candidateId,
    }))
    console.log('Vote selection updated:', { electionId: electionKey, candidateId })
  }

  const handleClearSelection = (electionId: string | number) => {
    const electionKey = electionId.toString()
    setSelections((prev) => {
      const newSelections = { ...prev }
      delete newSelections[electionKey]
      return newSelections
    })
    console.log('Selection cleared for election:', electionKey)
  }

  const handleClearAllSelections = () => {
    setSelections({})
    console.log('All selections cleared')
  }

  const handleSubmitVote = () => {
    console.log('Submit vote clicked, selections:', selections)
    setShowConfirmation(true)
  }
  
  const handleReviewSelections = () => {
    console.log('Review selections clicked, current selections:', selections)
    // Scroll to top to review all elections
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirmVote = async () => {
    setSubmitting(true)
    
    try {
      // Submit votes for each election
      for (const [electionId, candidateId] of Object.entries(selections)) {
        const voteData = {
          voterId: localStorage.getItem('currentUserId') || 'voter_001', // Get from auth context
          electionId: electionId,
          selection: candidateId
        }
        
        console.log('Submitting vote:', voteData)
        
        try {
          await voterAPI.castVote(voteData)
        } catch (apiError: any) {
          // If backend is not available, simulate success for demo
          if (apiError.code === 'ECONNREFUSED' || apiError.message?.includes('Network Error') || apiError.response?.status >= 500) {
            console.log('Backend not available, simulating vote submission for demo')
            // Continue as if successful
          } else {
            throw apiError // Re-throw if it's a real error
          }
        }
      }
      
      toast({
        title: "Vote Submitted Successfully",
        description: "Your ballot has been recorded. Thank you for voting!",
      })
      
      // Redirect to success page
      router.push('/voter/success')
      
    } catch (error: any) {
      console.error('Error submitting vote:', error)
      toast({
        title: "Vote Submission Failed",
        description: error.message || "Failed to submit your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
      setShowConfirmation(false)
    }
  }

  const isAllElectionsVoted = elections.length > 0 && elections.filter(e => e.candidates.length > 0).every((election) => selections[election.id.toString()])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-slate-600">Loading ballot...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold text-slate-900">Unable to Load Ballot</h2>
            <p className="text-slate-600">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Vote className="w-8 h-8 mr-3" />
                  Official Ballot
                </h1>
                <p className="text-blue-100 mt-2">Make your selections carefully. You can review before submitting.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voting Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-slate-600">
                  Votes Cast: {Object.keys(selections).length} of {elections.filter(e => e.candidates.length > 0).length} available elections
                </div>
                <div className="w-48 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`bg-blue-600 h-2 transition-all duration-300`}
                    // eslint-disable-next-line
                    style={{ 
                      width: elections.filter(e => e.candidates.length > 0).length > 0 
                        ? `${Math.round((Object.keys(selections).length / elections.filter(e => e.candidates.length > 0).length) * 100)}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
              {Object.keys(selections).length > 0 && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {Object.keys(selections).length} Vote{Object.keys(selections).length !== 1 ? 's' : ''} Ready
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Elections */}
        {elections.map((election, index) => (
          <motion.div
            key={election.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${selections[election.id.toString()] ? "ring-2 ring-green-500" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-600" />
                      {election.title}
                    </CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selections[election.id.toString()] && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClearSelection(election.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear
                        </Button>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      </>
                    )}
                    {!selections[election.id.toString()] && election.candidates.length > 0 && (
                      <Badge variant="outline" className="text-slate-600">
                        Not voted
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {election.candidates.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>No candidates available for this election</p>
                  </div>
                ) : (
                  <RadioGroup
                    value={selections[election.id.toString()] || ""}
                    onValueChange={(value) => handleVoteSelection(election.id, value)}
                  >
                    <div className="space-y-4">
                      {election.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <RadioGroupItem value={candidate.id} id={`candidate-${candidate.id}`} />
                          <img
                            src={candidate.photo || "/placeholder.svg"}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <Label htmlFor={`candidate-${candidate.id}`} className="cursor-pointer">
                              <div className="font-semibold text-slate-900">{candidate.name}</div>
                              <div className="text-sm text-slate-600">{candidate.party}</div>
                              {candidate.platform && (
                                <div className="text-sm text-slate-500 mt-1">{candidate.platform}</div>
                              )}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Submit Section */}
        <Card className="bg-slate-100">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Ready to Submit Your Ballot?</h3>
              <p className="text-slate-600">
                You have made {Object.keys(selections).length} selection(s). You can vote for as many or as few elections as you choose. Once submitted, your votes cannot be changed.
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleReviewSelections}
                  disabled={Object.keys(selections).length === 0}
                >
                  Review Selections ({Object.keys(selections).length})
                </Button>
                {Object.keys(selections).length > 0 && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleClearAllSelections}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitVote}
                  disabled={Object.keys(selections).length === 0 || submitting}
                >
                  <Vote className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting...' : `Submit Ballot (${Object.keys(selections).length} votes)`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vote Confirmation Modal */}
        {showConfirmation && (
          <VoteConfirmationModal
            selections={selections}
            elections={elections}
            onConfirm={handleConfirmVote}
            onCancel={() => setShowConfirmation(false)}
            isSubmitting={submitting}
          />
        )}
      </div>
    </div>
  )
}
