'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  CheckBadgeIcon, 
  EyeIcon, 
  UserGroupIcon, 
  UsersIcon,
  ChartBarIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  // Mock data for dashboard
  const stats = {
    totalElections: 12,
    activeElections: 2,
    totalObservers: 28,
    totalCandidates: 45,
    totalVoters: 15420,
    systemHealth: 98.5
  };

  const recentElections = [
    {
      id: 1,
      title: 'Student Government Election 2024',
      status: 'active',
      progress: 67,
      endDate: '2024-03-15'
    },
    {
      id: 2,
      title: 'Faculty Senate Election',
      status: 'completed',
      progress: 100,
      endDate: '2024-02-20'
    },
    {
      id: 3,
      title: 'Department Head Elections',
      status: 'upcoming',
      progress: 0,
      endDate: '2024-04-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Election Management System. Monitor ongoing elections and system status.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckBadgeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Elections</p>
                <p className="text-2xl font-bold">{stats.totalElections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <EyeIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Observers</p>
                <p className="text-2xl font-bold">{stats.totalObservers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Candidates</p>
                <p className="text-2xl font-bold">{stats.totalCandidates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Registered Voters</p>
                <p className="text-2xl font-bold">{stats.totalVoters.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Elections */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Elections</CardTitle>
            <CardDescription>
              Overview of recent and upcoming elections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentElections.map((election) => (
                <div key={election.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{election.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(election.status)}>
                        {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        <ClockIcon className="inline h-4 w-4 mr-1" />
                        {election.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-right min-w-0 flex-1 ml-4">
                    <p className="text-sm font-medium">{election.progress}% complete</p>
                    <Progress value={election.progress} className="w-20 h-2 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium">System Health</span>
                </div>
                <span className="text-lg font-bold">{stats.systemHealth}%</span>
              </div>
              <Progress value={stats.systemHealth} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{stats.activeElections}</p>
                  <p className="text-sm text-green-700">Active Elections</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">24/7</p>
                  <p className="text-sm text-blue-700">Uptime</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Database Status</span>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">API Status</span>
                  <span className="text-green-600 font-medium">Operational</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Backup Status</span>
                  <span className="text-green-600 font-medium">Up to date</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}