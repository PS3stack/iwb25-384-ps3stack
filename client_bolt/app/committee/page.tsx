'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { electionsAPI } from '@/lib/api/elections';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Users,
  Eye,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function CommitteeDashboard() {
  const { state } = useAuth();
  const router = useRouter();
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.isAuthenticated || !['committee', 'observer'].includes(state.user?.role || '')) {
      router.push('/committee/login');
      return;
    }
    loadData();
  }, [state.isAuthenticated, state.user, router]);

  const loadData = async () => {
    try {
      const electionsData = await electionsAPI.getActiveElections();
      setElections(electionsData.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!state.isAuthenticated || !['committee', 'observer'].includes(state.user?.role || '')) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const activeElections = elections.filter(e => e.status === 'active');
  const totalVoters = activeElections.reduce((sum, e) => sum + e.total_eligible_voters, 0);
  const totalVotes = activeElections.reduce((sum, e) => sum + e.votes_cast, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {state.user?.role === 'observer' ? 'Observer' : 'Committee'} Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor voting activity and manage voter access
                </p>
              </div>
              <div className="flex gap-3">
                {state.user?.role === 'committee' && (
                  <Button onClick={() => router.push('/committee/tokens')}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Issue Token
                  </Button>
                )}
                <Button variant="outline" onClick={() => router.push('/committee/monitor')}>
                  <Eye className="mr-2 h-4 w-4" />
                  Monitor Live
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Committee Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Tokens Issued Today"
              value="1,245"
              icon={UserCheck}
              color="blue"
              change="+89 in last hour"
              changeType="increase"
            />
            <MetricCard
              title="Active Voters"
              value={totalVoters}
              icon={Users}
              color="green"
              change="Across all elections"
              changeType="neutral"
            />
            <MetricCard
              title="Votes Monitored"
              value={totalVotes}
              icon={Eye}
              color="purple"
              change="Real-time count"
              changeType="neutral"
            />
            <MetricCard
              title="System Status"
              value="Online"
              icon={Activity}
              color="green"
              change="All systems operational"
              changeType="neutral"
            />
          </div>

          {/* Active Elections Monitor */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Elections Monitor</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeElections.map((election) => (
                <Card key={election.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{election.title}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-green-600">Live</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Eligible Voters:</span>
                          <div className="font-medium">{election.total_eligible_voters.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Votes Cast:</span>
                          <div className="font-medium">{election.votes_cast.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          Monitor Live
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '2 min ago', event: 'Token VT-2024-ABC123 issued for Presidential Election', type: 'token' },
                    { time: '5 min ago', event: 'Voter verification completed for ID: ****4567', type: 'verification' },
                    { time: '7 min ago', event: 'Vote confirmation received', type: 'vote' },
                    { time: '12 min ago', event: 'IP restriction alert: Unauthorized access blocked', type: 'alert' },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        item.type === 'token' ? 'bg-blue-500' :
                        item.type === 'verification' ? 'bg-green-500' :
                        item.type === 'vote' ? 'bg-purple-500' :
                        'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{item.event}</p>
                        <span className="text-xs text-gray-500">{item.time}</span>
                      </div>
                      {item.type === 'alert' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}