'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import {
  HomeIcon,
  CheckBadgeIcon,
  EyeIcon,
  UserGroupIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Elections', href: '/elections', icon: CheckBadgeIcon },
  { name: 'Observers', href: '/observers', icon: EyeIcon },
  { name: 'Candidates', href: '/candidates', icon: UserGroupIcon },
  { name: 'Voters', href: '/voters', icon: UsersIcon },
  { name: 'Monitoring', href: '/monitoring', icon: ChartBarIcon },
  { name: 'Results', href: '/results', icon: DocumentChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <CheckBadgeIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-semibold">Election Manager</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}