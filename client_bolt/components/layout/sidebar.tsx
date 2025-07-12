'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Vote,
  Settings,
  FileText,
  Shield,
  PlusCircle,
  Eye,
  Home,
  UserCheck,
  MapPin
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const getNavigationItems = (role: string) => {
  switch (role) {
    case 'admin':
      return [
        { href: '/admin', icon: Home, label: 'Dashboard' },
        { href: '/admin/elections', icon: Vote, label: 'Elections' },
        { href: '/admin/elections/create', icon: PlusCircle, label: 'Create Election' },
        { href: '/admin/users', icon: Users, label: 'Manage Users' },
        { href: '/admin/audit', icon: Shield, label: 'Audit Trail' },
        { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
      ];
    case 'committee':
    case 'observer':
      return [
        { href: '/committee', icon: Home, label: 'Dashboard' },
        { href: '/committee/tokens', icon: UserCheck, label: 'Issue Tokens' },
        { href: '/committee/voters', icon: Users, label: 'Manage Voters' },
        { href: '/committee/monitor', icon: Eye, label: 'Monitor Voting' },
        { href: '/committee/reports', icon: FileText, label: 'Reports' },
      ];
    case 'census_officer':
      return [
        { href: '/census', icon: Home, label: 'Dashboard' },
        { href: '/census/households', icon: Users, label: 'Household Count' },
        { href: '/census/districts', icon: MapPin, label: 'District Stats' },
        { href: '/census/reports', icon: BarChart3, label: 'Reports' },
      ];
    default:
      return [];
  }
};

export function Sidebar({ className }: SidebarProps) {
  const { state } = useAuth();
  const pathname = usePathname();

  if (!state.isAuthenticated || !state.user) {
    return null;
  }

  const navigationItems = getNavigationItems(state.user.role);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "bg-white border-r border-gray-200 w-64 min-h-screen p-4",
        className
      )}
    >
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-blue-600 text-white"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Role Badge */}
      <div className="mt-8 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          Current Role
        </div>
        <div className="text-sm font-medium text-gray-900 capitalize">
          {state.user.role.replace('_', ' ')}
        </div>
        {state.user.district && (
          <div className="text-xs text-gray-500 mt-1">
            District: {state.user.district}
          </div>
        )}
      </div>
    </motion.div>
  );
}