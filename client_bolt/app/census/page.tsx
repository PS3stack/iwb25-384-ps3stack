'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MetricCard } from '@/components/dashboard/metric-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { censusAPI } from '@/lib/api/census';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  MapPin,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

export default function CensusDashboard() {
  const { state } = useAuth();
  const router = useRouter();
  const [censusData, setCensusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.isAuthenticated || state.user?.role !== 'census_officer') {
      router.push('/census/login');
      return;
    }
    loadData();
  }, [state.isAuthenticated, state.user, router]);

  const loadData = async () => {
    try {
      const data = await censusAPI.getCensusData();
      setCensusData(data.data[0]); // Use first census
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!state.isAuthenticated || state.user?.role !== 'census_officer') {
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

  const completionRate = censusData ? (censusData.completed_count / censusData.total_households) * 100 : 0;
  const userDistrict = state.user?.district || 'District A';
  const districtData = censusData?.districts.find((d: any) => d.name === userDistrict);
  const districtCompletion = districtData ? (districtData.completed / districtData.households) * 100 : 0;

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
                  Census Dashboard
                </h1>
                <p className="text-gray-600">
                  Population count for {userDistrict}
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => router.push('/census/households')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Household Count
                </Button>
                <Button variant="outline" onClick={() => router.push('/census/reports')}>
                  View Reports
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Census Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Households"
              value={censusData?.total_households || 0}
              icon={Home}
              color="blue"
              change="Target count"
              changeType="neutral"
            />
            <MetricCard
              title="Completed Counts"
              value={censusData?.completed_count || 0}
              icon={CheckCircle}
              color="green"
              change={`${completionRate.toFixed(1)}% complete`}
              changeType="increase"
            />
            <MetricCard
              title="My District Progress"
              value={`${districtCompletion.toFixed(1)}%`}
              icon={MapPin}
              color="purple"
              change={`${districtData?.completed || 0}/${districtData?.households || 0} households`}
              changeType="neutral"
            />
            <MetricCard
              title="Active Officers"
              value={censusData?.grama_officers || 0}
              icon={Users}
              color="yellow"
              change="Currently working"
              changeType="neutral"
            />
          </div>

          {/* District Progress */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">District Progress Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {censusData?.districts.map((district: any) => (
                <Card key={district.name} className={`hover:shadow-lg transition-shadow ${
                  district.name === userDistrict ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{district.name}</span>
                      {district.name === userDistrict && (
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Your District
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{((district.completed / district.households) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={(district.completed / district.households) * 100} 
                        className="h-2"
                      />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Total Households:</span>
                          <div className="font-medium">{district.households}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <div className="font-medium">{district.completed}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Census Activity */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Census Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '15 min ago', event: 'Household count submitted for Block 23', households: 12, district: userDistrict },
                    { time: '1 hour ago', event: 'Census form completed for Street 45', households: 8, district: userDistrict },
                    { time: '2 hours ago', event: 'Data verification completed', households: 15, district: userDistrict },
                    { time: '3 hours ago', event: 'New area assignment received', households: 20, district: userDistrict },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.event}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{item.time}</span>
                          <span>{item.households} households</span>
                          <span>{item.district}</span>
                        </div>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
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