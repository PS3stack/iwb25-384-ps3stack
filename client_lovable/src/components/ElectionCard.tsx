
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Vote, Eye, Clock } from 'lucide-react';
import { ActiveElection } from '@/types/election';

interface ElectionCardProps {
  election: ActiveElection;
}

const ElectionCard = ({ election }: ElectionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'election' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-md border-white/20 hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                {election.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getStatusColor(election.status)}>
                  {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                </Badge>
                <Badge className={getTypeColor(election.type)}>
                  {election.type.charAt(0).toUpperCase() + election.type.slice(1)}
                </Badge>
                {election.isLiveResults && (
                  <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
                    Live Results
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">{election.description}</p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(election.startDate)} - {formatDate(election.endDate)}</span>
            </div>
            
            {election.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{election.location}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <Vote className="w-4 h-4 mr-2 text-green-600" />
                <div>
                  <span className="font-medium text-gray-900">{election.totalVotes.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">votes</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-900">{election.totalVoters.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">voters</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Turnout</span>
                <span className="font-medium text-gray-900">{election.turnoutPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(election.turnoutPercentage, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            {election.status === 'active' && (
              <Button size="sm" className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Live Monitor
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ElectionCard;
