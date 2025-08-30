"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { VoteConfirmationModal } from "@/components/voter/vote-confirmation-modal"
import { Vote, Award, Clock, CheckCircle } from "lucide-react"

const mockelections = [
  {
    id: 1,
    title: "City Council Election 2024",
    description: "Select your representative for the city council",
    candidates: [
      {
        id: 1,
        name: "Alice Johnson",
        party: "Democratic Party",
        photo: "/professional-woman-diverse.png",
        platform: "Focus on infrastructure and education funding",
      },
      {
        id: 2,
        name: "Robert Smith",
        party: "Republican Party",
        photo: "/professional-man.png",
        platform: "Economic development and tax reduction",
      },
      {
        id: 3,
        name: "Maria Garcia",
        party: "Independent",
        photo: "/professional-woman-diverse.png",
        platform: "Environmental protection and community engagement",
      },
    ],
  },
  {
    id: 2,
    title: "School Board Election 2024",
    description: "Choose your school board representative",
    candidates: [
      {
        id: 4,
        name: "David Wilson",
        party: "Non-partisan",
        photo: "/professional-man.png",
        platform: "Improving educational outcomes and teacher support",
      },
      {
        id: 5,
        name: "Sarah Chen",
        party: "Non-partisan",
        photo: "/professional-woman-diverse.png",
        platform: "Technology integration and student wellness",
      },
    ],
  },
]

const [mockElections, setMockElections] = useState<typeof mockelections>([])

useEffect(() => {
  const fetchData = async () => {
    try {
      // const response = await fetch("/api/elections");
      // const data = await response.json();
      // setMockElections(data.elections);
      setMockElections(mockelections);
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };
  fetchData();
}, [])

export default function BallotPage() {
  const [selections, setSelections] = useState<Record<number, number>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes

  const handleVoteSelection = (electionId: number, candidateId: number) => {
    setSelections((prev) => ({
      ...prev,
      [electionId]: candidateId,
    }))
  }

  const handleSubmitVote = () => {
    setShowConfirmation(true)
  }

  const isAllElectionsVoted = mockElections.every((election) => selections[election.id])

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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
              <div className="text-right">
                <div className="flex items-center text-blue-100 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Time Remaining
                </div>
                <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
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
                  Progress: {Object.keys(selections).length} of {mockElections.length} elections completed
                </div>
                <div className="w-48 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(Object.keys(selections).length / mockElections.length) * 100}%` }}
                  />
                </div>
              </div>
              {isAllElectionsVoted && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready to Submit
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Elections */}
        {mockElections.map((election, index) => (
          <motion.div
            key={election.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${selections[election.id] ? "ring-2 ring-green-500" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-blue-600" />
                      {election.title}
                    </CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                  </div>
                  {selections[election.id] && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Selected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selections[election.id]?.toString() || ""}
                  onValueChange={(value) => handleVoteSelection(election.id, Number.parseInt(value))}
                >
                  <div className="space-y-4">
                    {election.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <RadioGroupItem value={candidate.id.toString()} id={`candidate-${candidate.id}`} />
                        <img
                          src={candidate.photo || "/placeholder.svg"}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <Label htmlFor={`candidate-${candidate.id}`} className="cursor-pointer">
                            <div className="font-semibold text-slate-900">{candidate.name}</div>
                            <div className="text-sm text-slate-600">{candidate.party}</div>
                            <div className="text-sm text-slate-500 mt-1">{candidate.platform}</div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
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
                Please review your selections above. Once submitted, your vote cannot be changed.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="lg">
                  Review Selections
                </Button>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitVote}
                  disabled={!isAllElectionsVoted}
                >
                  <Vote className="w-4 h-4 mr-2" />
                  Submit Ballot
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vote Confirmation Modal */}
        {showConfirmation && (
          <VoteConfirmationModal
            selections={selections}
            elections={mockElections}
            onConfirm={() => {
              console.log("Vote submitted:", selections)
              setShowConfirmation(false)
              // Redirect to success page
            }}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </div>
    </div>
  )
}
