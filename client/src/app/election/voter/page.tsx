'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SurveyForm } from '@/components/shared/survey-form';
import { voterIdSchema } from '@/lib/schemas/election-schemas';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

type VotingStep = 'identification' | 'ballot' | 'confirmation' | 'success';

export default function VoterPage() {
  const [currentStep, setCurrentStep] = useState<VotingStep>('identification');
  const [voterData, setVoterData] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const candidates = [
    {
      id: '1',
      name: 'John Smith',
      party: 'Democratic Party',
      position: 'Mayor',
      photo: '/api/placeholder/150/150'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      party: 'Republican Party',
      position: 'Mayor',
      photo: '/api/placeholder/150/150'
    },
    {
      id: '3',
      name: 'Michael Brown',
      party: 'Independent',
      position: 'Mayor',
      photo: '/api/placeholder/150/150'
    }
  ];

  const handleIdentification = async (result: any) => {
    // Mock voter verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVoterData(result);
    setCurrentStep('ballot');
  };

  const handleVoteSubmission = async () => {
    if (!selectedCandidate) return;
    
    // Mock vote submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep('success');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'identification':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Voter Identification</CardTitle>
                <CardDescription>
                  Please provide your voter information to access the ballot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SurveyForm
                  schema={voterIdSchema}
                  onComplete={handleIdentification}
                />
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'ballot':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Official Ballot - Mayor Election 2024</CardTitle>
                <CardDescription>
                  Select one candidate for Mayor. Your vote is private and secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {candidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedCandidate === candidate.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <UserIcon className="h-10 w-10 text-gray-400" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{candidate.name}</h3>
                          <Badge variant="outline" className="mb-2">
                            {candidate.party}
                          </Badge>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                          {selectedCandidate === candidate.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="mt-3"
                            >
                              <CheckCircleIcon className="h-6 w-6 text-blue-600 mx-auto" />
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('identification')}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep('confirmation')}
                    disabled={!selectedCandidate}
                  >
                    Review Vote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'confirmation':
        const selected = candidates.find(c => c.id === selectedCandidate);
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Confirm Your Vote</CardTitle>
                <CardDescription>
                  Please review your selection before submitting your vote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Your Selection</h3>
                  <div className="space-y-2">
                    <p className="text-xl font-bold">{selected?.name}</p>
                    <Badge>{selected?.party}</Badge>
                    <p className="text-gray-600">for {selected?.position}</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Once you submit your vote, it cannot be changed. 
                    Please ensure your selection is correct.
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('ballot')}
                  >
                    Back to Ballot
                  </Button>
                  <Button 
                    onClick={handleVoteSubmission}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Vote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-2xl mx-auto text-center">
              <CardContent className="p-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-green-800 mb-4">
                  Vote Successfully Submitted!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Thank you for participating in the democratic process. 
                  Your vote has been recorded securely.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    Vote submitted at {new Date().toLocaleString()}
                  </div>
                </div>
                
                <Button onClick={() => window.location.reload()}>
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Online Voting System
          </h1>
          <p className="text-gray-600">
            Secure, transparent, and accessible voting for all eligible citizens
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}