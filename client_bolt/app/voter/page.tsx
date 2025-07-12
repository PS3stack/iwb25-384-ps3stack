'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { votingAPI } from '@/lib/api/voting';
import { Vote, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function VoterPage() {
  const [token, setToken] = useState('');
  const [electionData, setElectionData] = useState<any>(null);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateToken = async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await votingAPI.validateToken(token);
      if (response.data.valid) {
        // Load election data
        const mockElectionData = {
          id: response.data.election_id,
          title: 'Presidential Election 2024',
          candidates: [
            { id: 'c1', name: 'John Doe', party: 'Progressive Party' },
            { id: 'c2', name: 'Jane Smith', party: 'Democratic Alliance' },
            { id: 'c3', name: 'Robert Wilson', party: 'Independent' },
          ]
        };
        setElectionData(mockElectionData);
      } else {
        setError('Invalid or expired token. Please contact election officials.');
      }
    } catch (err) {
      setError('Error validating token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitVote = async () => {
    if (!selectedCandidate || !token) return;
    
    setLoading(true);
    try {
      const response = await votingAPI.castVote(token, { candidate_id: selectedCandidate });
      setConfirmation(response.data);
      setVoteSubmitted(true);
    } catch (err) {
      setError('Error submitting vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (voteSubmitted && confirmation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Vote Successfully Submitted!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Your vote has been recorded securely and anonymously.
            </p>

            <Card className="text-left">
              <CardHeader>
                <CardTitle>Vote Confirmation Receipt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Confirmation ID</Label>
                  <div className="font-mono text-lg">{confirmation.confirmation_id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Receipt Hash</Label>
                  <div className="font-mono text-sm text-gray-700">{confirmation.receipt_hash}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Timestamp</Label>
                  <div>{new Date().toLocaleString()}</div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please save this confirmation for your records. Your vote cannot be traced back to your identity.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Button 
              className="mt-8" 
              onClick={() => window.location.reload()}
            >
              Vote in Another Election
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Vote className="h-10 w-10 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Secure Voting Portal
          </h1>
          <p className="text-gray-600">
            Enter your voting token to access your ballot
          </p>
        </motion.div>

        {!electionData ? (
          <Card>
            <CardHeader>
              <CardTitle>Enter Voting Token</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="token">Voting Token</Label>
                <Input
                  id="token"
                  placeholder="VT-2024-XXXXXXXXX"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <p className="text-sm text-gray-500">
                  Enter the token provided by election officials
                </p>
              </div>

              <Button 
                onClick={validateToken} 
                disabled={!token || loading}
                className="w-full"
              >
                {loading ? 'Validating...' : 'Access Ballot'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5" />
                  {electionData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Select one candidate below. Your vote is anonymous and cannot be changed once submitted.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Select Your Candidate:</Label>
                  {electionData.candidates.map((candidate: any) => (
                    <div
                      key={candidate.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedCandidate === candidate.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCandidate(candidate.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedCandidate === candidate.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedCandidate === candidate.id && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.party}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={submitVote}
                  disabled={!selectedCandidate || loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Submitting Vote...' : 'Submit Vote'}
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}