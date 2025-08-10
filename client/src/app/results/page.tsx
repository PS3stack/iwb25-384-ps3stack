'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { PublishResultsButton } from '../../components/results/publish-results-button';
import { ReportDownloader } from '../../components/results/report-downloader';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

export default function ResultsPage() {
  const mockElectionId = 'election-1';
  
  // Mock results data
  const results = {
    totalVotes: 2456,
    totalEligible: 3200,
    turnoutPercentage: 76.75,
    status: 'completed',
    candidates: [
      { name: 'Jane Smith', party: 'Progressive Party', votes: 1234, percentage: 50.2 },
      { name: 'John Doe', party: 'Conservative Party', votes: 987, percentage: 40.2 },
      { name: 'Alice Johnson', party: 'Independent', votes: 235, percentage: 9.6 }
    ]
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Election Results</h1>
          <p className="text-muted-foreground">
            View final results, publish outcomes, and generate reports
          </p>
        </div>
        <div className="flex gap-2">
          <PublishResultsButton electionId={mockElectionId} />
        </div>
      </div>

      {/* Results Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Votes Cast</p>
              <p className="text-3xl font-bold">{results.totalVotes.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Voter Turnout</p>
              <p className="text-3xl font-bold">{results.turnoutPercentage}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                Completed
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Results */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Results</CardTitle>
          <CardDescription>
            Final vote counts and percentages for all candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.candidates.map((candidate, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">{candidate.party}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{candidate.votes.toLocaleString()} votes</p>
                    <p className="text-sm text-gray-600">{candidate.percentage}%</p>
                  </div>
                </div>
                <Progress value={candidate.percentage} className="h-2" />
                {index === 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800">Winner</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Section */}
      <ReportDownloader electionId={mockElectionId} />
    </div>
  );
}