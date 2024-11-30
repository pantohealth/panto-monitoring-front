import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown,Users, Monitor, Building2, Activity, LogOut,  Layers3, LayoutDashboard} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/auth';

const navigation = [
  { name: 'User Management', href: '/dashboard/users', icon: Users },
  { name: 'Devices', href: '/dashboard/devices', icon: Monitor },
  { name: 'Company', href: '/dashboard/company', icon: Building2 },
  { name: 'Server Health', href: '/dashboard/health', icon: Activity },
  { 
    name: 'Widgets', 
    href: '/dashboard/widgets', 
    icon:  Layers3 ,
    subItems: [
      { name: 'Data to Server Log', href: '/dashboard/widgets/server-log' },
      { name: 'System Log', href: '/dashboard/widgets/system-log' },
      { name: 'Device on Train', href: '/dashboard/widgets/train-device' }
    ]
  },
  {
    name: 'Admin Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
    subItems: [
      { name: 'Customer Bugs', href: '/dashboard/admin/bugs' },
      { name: 'Simulation Requests', href: '/dashboard/admin/simulations' },
      { name: 'Data Management', href: '/dashboard/admin/data' },
      { name: 'User Journey Logs', href: '/dashboard/admin/journey' },
      { name: 'Developer Report', href: '/dashboard/admin/developer' },
      { name: 'Warning Page', href: '/dashboard/admin/warnings' }
    ]
  },
 
];

interface SidebarProps {
  isOpen: boolean,
}

export function Sidebar({isOpen}:SidebarProps) {
  
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenDashboard, setIsDropdownOpenDashboard] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  
  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully');
  };

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className={`${isOpen ? 'fixed' : 'hidden'} md:flex flex-col md:overflow-auto overflow-scroll h-full w-64 bg-gray-900`}>
    
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold text-white">Panto Admin</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <>
                <button
                  onClick={() =>{
                    toggleExpand(item.name)
                    if(item.name === 'Widgets') setIsDropdownOpen(!isDropdownOpen)
                    if(item.name === 'Admin Dashboard') setIsDropdownOpenDashboard(!isDropdownOpenDashboard)
                  }}
                  className={cn(
                    'w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.name}
                  {(item.name === "Widgets" || item.name === 'Admin Dashboard') && 
                  <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform duration-200',
                        item.name === 'Widgets' && isDropdownOpen && 'transform rotate-180',
                        item.name === 'Admin Dashboard' && isDropdownOpenDashboard && 'transform rotate-180',
                      )}/>}
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="ml-8 space-y-1">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        to={subItem.href}
                        className={({ isActive }) =>
                          cn(
                            'block px-2 py-2 text-sm font-medium rounded-md',
                            isActive
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          )
                        }
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
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
            )}
          </div>
        ))}
      </nav>
      <div className="flex-shrink-0 flex w-full border-t border-gray-800 p-4 md:mb-0 mb-12 mt-auto">
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