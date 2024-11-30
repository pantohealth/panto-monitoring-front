import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AlignJustify, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

import { Sidebar } from './Sidebar';
import MobileSidebar from './MobileSidebar';
import { useAuthStore } from '../../store/auth';

export function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully');
  };


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  }

  return (
    <div>
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen}/>
      <div
        className={`fixed md:hidden  inset-y-0 left-0 z-40 w-64 bg-gray-900 shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
      >
        <MobileSidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen}/>
      </div>
      <main className="flex-1 overflow-auto">
        <div onClick={toggleSidebar} className='md:hidden flex text-zinc-950-500 mt-6 px-4'><AlignJustify/></div>
        <div className="py-2">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            
          <div className="flex-shrink-0 flex justify-end p-1">
          <button
            className="flex md:w-[10%] w-[100%] items-center py-2 pt-8 md:pt-2 md:p-2 text-md font-medium 
            rounded-md md:hover:bg-slate-500/10 text-gray-800 transition-all"
            onClick={handleLogout}
          >
            <LogOut className="mr-1 md:mr-2 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            Logout
          </button>
          </div>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
    <div onClick={() => setSidebarOpen(false)} className={`${isSidebarOpen ? "overlay--visible" : "hidden"} overlay`}></div>
    </div>
  );
}