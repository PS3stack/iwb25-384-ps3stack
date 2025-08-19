'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function FieldStaffPage() {
  const activeCensuses = [
    {
      id: '1',
      title: 'National Population Census 2024',
      area: 'Downtown District',
      assignedHouseholds: 250,
      completedHouseholds: 180,
      deadline: '2024-06-30',
      status: 'active'
    },
    {
      id: '2',
      title: 'Economic Survey 2024',
      area: 'Residential North',
      assignedHouseholds: 150,
      completedHouseholds: 150,
      deadline: '2024-03-31',
      status: 'completed'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Field Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your assigned census areas and household data collection
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {activeCensuses.map((census, index) => (
          <motion.div
            key={census.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{census.title}</CardTitle>
                  <Badge 
                    className={census.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                    }
                  >
                    {census.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  {census.area}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {Math.round((census.completedHouseholds / census.assignedHouseholds) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(census.completedHouseholds / census.assignedHouseholds) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" />
                      {census.completedHouseholds}/{census.assignedHouseholds} households
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Due {new Date(census.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    disabled={census.status === 'completed'}
                  >
                    {census.status === 'completed' ? 'Completed' : 'Continue Work'}
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {activeCensuses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="text-gray-500">
            <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Active Assignments</h3>
            <p>You don't have any active census assignments at the moment.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}