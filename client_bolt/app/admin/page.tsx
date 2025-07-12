'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ElectionCard } from '@/components/dashboard/election-card';
import { Button } from '@/components/ui/button';
import { electionsAPI } from '@/lib/api/elections';
import { motion } from 'framer-motion';
import {
  Vote,
  Users,
  Shield,
  Activity,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const { state } = useAuth();
  const router = useRouter();
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.isAuthenticated || state.user?.role !== 'admin') {
      router.push('/admin/login');
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

  if (!state.isAuthenticated || state.user?.role !== 'admin') {
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
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, {state.user?.name}
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => router.push('/admin/elections/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Election
                </Button>
                <Button variant="outline" onClick={() => router.push('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Admin Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Elections"
              value={elections.length}
              icon={Vote}
              color="blue"
              change="+2 this month"
              changeType="increase"
            />
            <MetricCard
              title="Total Registered Voters"
              value="25,840"
              icon={Users}
              color="green"
              change="+1,234 this week"
              changeType="increase"
            />
            <MetricCard
              title="System Security Score"
              value="98.5%"
              icon={Shield}
              color="purple"
              change="All systems operational"
              changeType="neutral"
            />
            <MetricCard
              title="Active Sessions"
              value="156"
              icon={Activity}
              color="yellow"
              change="Real-time count"
              changeType="neutral"
            />
          </div>

          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start"
                onClick={() => router.push('/admin/elections/create')}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Create New Election</span>
                  </div>
                  <p className="text-sm text-gray-600">Set up a new voting process</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start"
                onClick={() => router.push('/admin/users')}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Manage Users</span>
                  </div>
                  <p className="text-sm text-gray-600">Add or modify user accounts</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 justify-start"
                onClick={() => router.push('/admin/reports')}
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">View Reports</span>
                  </div>
                  <p className="text-sm text-gray-600">Analytics and insights</p>
                </div>
              </Button>
            </div>
          </section>

          {/* Elections Management */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Election Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {elections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  onViewDetails={(id) => router.push(`/admin/elections/${id}`)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}