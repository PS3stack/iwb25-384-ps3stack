'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SurveyForm } from '@/components/shared/survey-form';
import { pollingOfficialLoginSchema } from '@/lib/schemas/election-schemas';
import { 
  UserIcon, 
  MapPinIcon, 
  UsersIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function PollingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [officialData, setOfficialData] = useState<any>(null);

  const handleLogin = async (result: any) => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOfficialData(result);
    setIsLoggedIn(true);
  };

  const mockPollingData = {
    stationName: 'Central Community Center',
    address: '123 Main Street, Downtown',
    totalVoters: 1250,
    checkedInVoters: 847,
    currentHour: new Date().getHours(),
    peakHours: [8, 12, 17],
    incidents: 2,
    lastUpdate: new Date().toLocaleTimeString()
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Polling Official Login</CardTitle>
              <CardDescription>
                Please authenticate to access the polling station dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SurveyForm
                schema={pollingOfficialLoginSchema}
                onComplete={handleLogin}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Polling Station Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {officialData?.officialId} - {mockPollingData.stationName}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          Station Active
        </Badge>
      </motion.div>

      {/* Station Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Voters Checked In</p>
                <p className="text-2xl font-bold">{mockPollingData.checkedInVoters}</p>
                <p className="text-xs text-gray-500">
                  of {mockPollingData.totalVoters} registered
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Turnout Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((mockPollingData.checkedInVoters / mockPollingData.totalVoters) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Time</p>
                <p className="text-2xl font-bold">{mockPollingData.lastUpdate}</p>
                <p className="text-xs text-gray-500">Last updated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Incidents</p>
                <p className="text-2xl font-bold">{mockPollingData.incidents}</p>
                <p className="text-xs text-gray-500">Reported today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Station Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Station Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">{mockPollingData.stationName}</p>
              <p className="text-sm text-gray-600">{mockPollingData.address}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Registered Voters:</span>
                <span className="font-medium">{mockPollingData.totalVoters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Checked In:</span>
                <span className="font-medium">{mockPollingData.checkedInVoters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="font-medium">
                  {mockPollingData.totalVoters - mockPollingData.checkedInVoters}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(mockPollingData.checkedInVoters / mockPollingData.totalVoters) * 100}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common polling station management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <UsersIcon className="mr-2 h-4 w-4" />
              Check In Voter
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ClockIcon className="mr-2 h-4 w-4" />
              View Hourly Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              End of Day Report
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest voter check-ins and station updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '14:32', action: 'Voter checked in', details: 'ID: V789012' },
                { time: '14:28', action: 'Voter checked in', details: 'ID: V456789' },
                { time: '14:15', action: 'Incident reported', details: 'Equipment issue resolved' },
                { time: '14:02', action: 'Voter checked in', details: 'ID: V123456' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.details}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}