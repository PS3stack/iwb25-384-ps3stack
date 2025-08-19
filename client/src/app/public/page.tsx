'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/common/stat-card';
import { BarChart } from '@/components/common/charts/bar-chart';
import { PieChart } from '@/components/common/charts/pie-chart';
import { LineChart } from '@/components/common/charts/line-chart';
import { 
  UsersIcon, 
  HomeIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function PublicDashboardPage() {
  const stats = [
    {
      title: 'Total Population',
      value: '2.5M',
      change: 2.1,
      trend: 'up' as const,
      icon: UsersIcon
    },
    {
      title: 'Households',
      value: '850K',
      change: 1.8,
      trend: 'up' as const,
      icon: HomeIcon
    },
    {
      title: 'Employment Rate',
      value: '94.2%',
      change: 0.5,
      trend: 'up' as const,
      icon: BriefcaseIcon
    },
    {
      title: 'Education Level',
      value: '87%',
      change: -0.2,
      trend: 'down' as const,
      icon: AcademicCapIcon
    }
  ];

  const populationData = [
    { name: '0-18', value: 450000 },
    { name: '19-35', value: 680000 },
    { name: '36-55', value: 820000 },
    { name: '56-70', value: 380000 },
    { name: '70+', value: 170000 }
  ];

  const educationData = [
    { name: 'Primary', value: 15 },
    { name: 'Secondary', value: 35 },
    { name: 'Higher Ed', value: 40 },
    { name: 'Graduate', value: 10 }
  ];

  const employmentTrend = [
    { name: '2019', value: 91.2 },
    { name: '2020', value: 88.5 },
    { name: '2021', value: 90.1 },
    { name: '2022', value: 92.8 },
    { name: '2023', value: 93.7 },
    { name: '2024', value: 94.2 }
  ];

  const archivedCensuses = [
    {
      id: '1',
      title: 'National Census 2020',
      date: '2020-04-01',
      responses: '2.3M',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Economic Survey 2023',
      date: '2023-01-15',
      responses: '1.8M',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Housing Census 2022',
      date: '2022-06-01',
      responses: '850K',
      status: 'completed'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          National Census & Statistics Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore comprehensive demographic data, census results, and statistical insights 
          about our nation's population and economy.
        </p>
      </motion.div>

      {/* Key Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5" />
              Population by Age Group
            </CardTitle>
            <CardDescription>
              Distribution of population across different age demographics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={populationData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Education Levels</CardTitle>
            <CardDescription>
              Educational attainment distribution among adults
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={educationData} height={300} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Employment Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Employment Rate Trend</CardTitle>
            <CardDescription>
              Employment rate changes over the past 5 years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={employmentTrend} height={300} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Previous Censuses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Previous Census Archives
            </CardTitle>
            <CardDescription>
              Historical census data and survey results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {archivedCensuses.map((census, index) => (
                <motion.div
                  key={census.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{census.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Date: {new Date(census.date).toLocaleDateString()}</p>
                        <p>Responses: {census.responses}</p>
                        <p className="text-green-600 font-medium">✓ {census.status}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}