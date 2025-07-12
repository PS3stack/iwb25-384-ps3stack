import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Vote, ArrowLeft, Hash, Info } from 'lucide-react';

const ElectionAccess = () => {
  const [accessCode, setAccessCode] = useState('');

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual election access logic
    console.log('Election access attempt with code:', accessCode);
  };

  const dummyElections = [
    { id: 'CITY2024', name: 'City Council Election 2024', status: 'Active' },
    { id: 'CENSUS2024', name: 'Population Census 2024', status: 'Active' },
    { id: 'SCHOOL2024', name: 'School Board Election', status: 'Upcoming' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-white/80 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Election Access</CardTitle>
            <p className="text-gray-600">Enter your election token or access code</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccess} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessCode">Election Token / Access Code</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Enter your token or code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="pl-10 uppercase tracking-wide"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Format: ELECTION-YEAR (e.g., CITY2024, CENSUS2024)
                </p>
              </div>

              <Button type="submit" className="w-full mt-6">
                <Vote className="w-4 h-4 mr-2" />
                Access Election
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2 mb-3">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <h4 className="font-semibold text-sm text-blue-900">Currently Active Elections:</h4>
              </div>
              <div className="space-y-2">
                {dummyElections.map((election) => (
                  <div key={election.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{election.name}</span>
                    <div className="flex items-center space-x-2">
                      <code className="bg-white px-2 py-1 rounded text-xs font-mono">{election.id}</code>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        election.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {election.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Don't have an access code?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Contact your election administrator or check your eligibility notification.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Request Access Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ElectionAccess;