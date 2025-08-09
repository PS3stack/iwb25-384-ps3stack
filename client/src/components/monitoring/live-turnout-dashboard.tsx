'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TurnoutData } from '../../lib/types';
import { turnoutApi } from '../../lib/mock-api';
import { UsersIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';

export function LiveTurnoutDashboard() {
  const [turnoutData, setTurnoutData] = useState<TurnoutData | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTurnoutData = async () => {
      try {
        const response = await turnoutApi.getLiveTurnout();
        if (response.success) {
          const newData = response.data;
          setTurnoutData(newData);
          
          // Add to historical data for chart
          setHistoricalData(prev => [
            ...prev.slice(-20), // Keep last 20 data points
            {
              time: new Date(newData.timestamp).toLocaleTimeString(),
              turnout: newData.turnoutPercentage,
              votes: newData.totalVotes
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch turnout data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnoutData();
    const interval = setInterval(fetchTurnoutData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading || !turnoutData) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold">{turnoutData.totalVotes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Turnout Rate</p>
                <p className="text-2xl font-bold">{turnoutData.turnoutPercentage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Eligible Voters</p>
                <p className="text-2xl font-bold">{turnoutData.totalEligible.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm font-bold">
                  {new Date(turnoutData.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Turnout Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Turnout Progress</CardTitle>
          <CardDescription>Real-time voting progress across all areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={turnoutData.turnoutPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{turnoutData.totalVotes} votes cast</span>
              <span>{turnoutData.totalEligible} eligible voters</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Turnout Over Time</CardTitle>
            <CardDescription>Real-time turnout percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="turnout" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Turnout by Area</CardTitle>
            <CardDescription>Voting progress in each area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turnoutData.areaBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="areaName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Area Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Area Performance</CardTitle>
          <CardDescription>Detailed breakdown by voting area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {turnoutData.areaBreakdown.map((area) => (
              <div key={area.areaId} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{area.areaName}</h4>
                  <p className="text-sm text-gray-600">{area.votes} of {area.eligible} votes</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{area.percentage.toFixed(1)}%</p>
                  <Progress value={area.percentage} className="w-24 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}