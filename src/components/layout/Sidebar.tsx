import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, Monitor, Building2, Activity, AlertTriangle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'User Management', href: '/dashboard/users', icon: Users },
  { name: 'Devices', href: '/dashboard/devices', icon: Monitor },
  { name: 'Company', href: '/dashboard/company', icon: Building2 },
  { name: 'Server Health', href: '/dashboard/health', icon: Activity },
  { name: 'Warnings', href: '/dashboard/warnings', icon: AlertTriangle },
];

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold text-white">Panto Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )
            }
          >
            <item.icon
              className="mr-3 h-5 w-5 flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
        <button
          className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}