import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowLeft, Shield, Key, AlertTriangle } from 'lucide-react';

const AdminPortal = () => {
  const [credentials, setCredentials] = useState({
    adminId: '',
    password: '',
    twoFactorCode: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual admin login logic
    console.log('Admin login attempt:', credentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
            <p className="text-gray-600">Secure access to election management</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                This is a high-security area. All access attempts are logged and monitored.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminId">Administrator ID</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="adminId"
                    type="text"
                    placeholder="Enter your admin ID"
                    value={credentials.adminId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, adminId: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <Input
                  id="twoFactor"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={credentials.twoFactorCode}
                  onChange={(e) => setCredentials(prev => ({ ...prev, twoFactorCode: e.target.value }))}
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-6">
                <Shield className="w-4 h-4 mr-2" />
                Access Admin Portal
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

            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Admin Capabilities:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create and manage elections</li>
                <li>• User account management</li>
                <li>• System configuration</li>
                <li>• Security and audit controls</li>
                <li>• Result certification</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPortal;