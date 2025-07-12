
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Vote, Calendar, TrendingUp, Eye } from 'lucide-react';
import { electionService } from '@/services/electionService';
import { ElectionMetrics, ActiveElection } from '@/types/election';
import LiveChart from '@/components/LiveChart';
import ElectionCard from '@/components/ElectionCard';
import MetricCard from '@/components/MetricCard';

const Index = () => {
  const [metrics, setMetrics] = useState<ElectionMetrics | null>(null);
  const [activeElections, setActiveElections] = useState<ActiveElection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Uncomment when backend is ready
        // const metricsData = await electionService.getMetrics();
        // const electionsData = await electionService.getActiveElections();
        
        // Using dummy data for now
        const metricsData = electionService.getDummyMetrics();
        const electionsData = electionService.getDummyActiveElections();
        
        setMetrics(metricsData);
        setActiveElections(electionsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up real-time updates (stub)
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SP3 Vote Core
                </h1>
                <p className="text-sm text-gray-600">Election & Census Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/observer-login">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Observer Login
                </Button>
              </Link>
              <Link to="/admin-portal">
                <Button size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Live Election Dashboard</h2>
          
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Active Elections"
                value={metrics.activeElections}
                icon={Calendar}
                color="blue"
                trend="+2 from yesterday"
              />
              <MetricCard
                title="Total Votes Cast"
                value={metrics.totalVotes.toLocaleString()}
                icon={Vote}
                color="green"
                trend="+1,247 today"
              />
              <MetricCard
                title="Registered Voters"
                value={metrics.totalVoters.toLocaleString()}
                icon={Users}
                color="purple"
                trend="98.2% turnout"
              />
              <MetricCard
                title="Live Results"
                value={`${metrics.liveResults}/${metrics.activeElections}`}
                icon={TrendingUp}
                color="orange"
                trend="Real-time updates"
              />
            </div>
          )}
        </motion.section>

        {/* Live Charts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Real-Time Voting Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LiveChart />
            </CardContent>
          </Card>
        </motion.section>

        {/* Active Elections */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Elections & Census</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeElections.map((election, index) => (
              <motion.div
                key={election.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ElectionCard election={election} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Need to Vote or Participate?</h3>
              <p className="mb-6 opacity-90">Enter your election token or access code to participate in ongoing elections or census.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Enter your token or code"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Link to="/election-access">
                  <Button variant="secondary" className="whitespace-nowrap">
                    Access Election
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
