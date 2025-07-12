'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ElectionCard } from '@/components/dashboard/election-card';
import { ElectionChart } from '@/components/charts/election-chart';
import { electionsAPI } from '@/lib/api/elections';
import { 
  Vote, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const [elections, setElections] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [electionsData] = await Promise.all([
        electionsAPI.getActiveElections(),
      ]);
      
      setElections(electionsData.data);
      
      // Calculate metrics from elections data
      const totalVotes = electionsData.data.reduce((sum: number, e: any) => sum + e.votes_cast, 0);
      const totalEligible = electionsData.data.reduce((sum: number, e: any) => sum + e.total_eligible_voters, 0);
      const turnoutRate = totalEligible > 0 ? (totalVotes / totalEligible) * 100 : 0;
      
      setMetrics({
        activeElections: electionsData.data.length,
        totalVotes: totalVotes,
        turnoutRate: turnoutRate.toFixed(1),
        activeVoters: 234 // Simulated real-time count
      });
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SP3 Vote Core - Live Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time election and census monitoring system
          </p>
        </motion.div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Active Elections"
              value={metrics.activeElections}
              icon={Vote}
              color="blue"
              change="+2 from yesterday"
              changeType="increase"
            />
            <MetricCard
              title="Total Votes Cast"
              value={metrics.totalVotes}
              icon={Users}
              color="green"
              change="+1,234 in last hour"
              changeType="increase"
            />
            <MetricCard
              title="Voter Turnout"
              value={`${metrics.turnoutRate}%`}
              icon={TrendingUp}
              color="yellow"
              change="+2.3% from last update"
              changeType="increase"
            />
            <MetricCard
              title="Active Voters Online"
              value={metrics.activeVoters}
              icon={Activity}
              color="purple"
              change="Live count"
              changeType="neutral"
            />
          </div>
        )}

        {/* Active Elections */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Active Elections</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {elections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onViewDetails={(id) => console.log('View election:', id)}
              />
            ))}
          </div>
        </section>

        {/* Results Charts */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Live Results</h2>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {elections
              .filter(e => e.live_results && e.candidates)
              .map((election) => (
                <ElectionChart
                  key={election.id}
                  title={election.title}
                  data={election.candidates.map((c: any) => ({
                    name: c.name,
                    votes: c.votes,
                    party: c.party
                  }))}
                />
              ))}
          </div>
        </section>

        {/* Live Feed */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Activity Feed</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              {[
                { time: '2 min ago', event: 'New vote cast in Presidential Election 2024', type: 'vote' },
                { time: '5 min ago', event: 'Token issued for voter verification', type: 'token' },
                { time: '7 min ago', event: 'Local Council Election turnout reached 60%', type: 'milestone' },
                { time: '12 min ago', event: 'Census data submitted for District A', type: 'census' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'vote' ? 'bg-blue-500' :
                    item.type === 'token' ? 'bg-green-500' :
                    item.type === 'milestone' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.event}</p>
                  </div>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}