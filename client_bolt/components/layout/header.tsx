'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useTenant } from '@/context/tenant-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, Vote } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const { state, logout } = useAuth();
  const { tenant } = useTenant();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'committee': return 'bg-blue-500';
      case 'observer': return 'bg-green-500';
      case 'census_officer': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleDashboard = (role: string) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'committee': 
      case 'observer': return '/committee';
      case 'census_officer': return '/census';
      default: return '/';
    }
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {tenant?.name || 'SP3 Vote Core'}
              </h1>
              <p className="text-xs text-gray-500">Election & Census System</p>
            </div>
          </Link>

          {/* Navigation and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Public Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Live Dashboard
              </Link>
              {!state.isAuthenticated && (
                <>
                  <Link 
                    href="/admin/login" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Admin Login
                  </Link>
                  <Link 
                    href="/committee/login" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Committee Login
                  </Link>
                  <Link 
                    href="/census/login" 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Census Login
                  </Link>
                </>
              )}
            </nav>

            {/* User Menu */}
            {state.isAuthenticated && state.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`text-white ${getRoleColor(state.user.role)}`}>
                        {state.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{state.user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{state.user.role.replace('_', ' ')}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href={getRoleDashboard(state.user.role)} className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/voter">Vote</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}