'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Vote, 
  Eye, 
  EyeOff, 
  Shield,
  TrendingUp 
} from 'lucide-react';

interface ElectionCardProps {
  election: {
    id: string;
    title: string;
    type: string;
    status: string;
    total_eligible_voters: number;
    votes_cast: number;
    live_results: boolean;
    ip_restricted: boolean;
    candidates?: Array<{ name: string; votes: number }>;
  };
  onViewDetails?: (id: string) => void;
}

export function ElectionCard({ election, onViewDetails }: ElectionCardProps) {
  const turnoutPercentage = (election.votes_cast / election.total_eligible_voters) * 100;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {election.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(election.status)} text-white`}
                >
                  {election.status.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {election.type}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {election.live_results ? (
                <Eye className="h-4 w-4 text-green-600" title="Live Results" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" title="Delayed Results" />
              )}
              {election.ip_restricted && (
                <Shield className="h-4 w-4 text-blue-600" title="IP Restricted" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Voting Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Voter Turnout</span>
              <span className="font-medium">{turnoutPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={turnoutPercentage} className="h-2" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Eligible</div>
                <div className="font-medium">{election.total_eligible_voters.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-xs text-gray-500">Votes Cast</div>
                <div className="font-medium">{election.votes_cast.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Leading Candidate (if results available) */}
          {election.candidates && election.candidates.length > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Leading</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">{election.candidates[0].name}</div>
                <div className="text-gray-500">
                  {election.candidates[0].votes.toLocaleString()} votes
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onViewDetails?.(election.id)}
            >
              View Details
            </Button>
            {election.status === 'active' && (
              <Button size="sm" className="flex-1">
                Monitor Live
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}