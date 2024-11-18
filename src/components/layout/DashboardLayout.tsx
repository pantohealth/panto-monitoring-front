import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AlignJustify } from 'lucide-react';

import { Sidebar } from './Sidebar';
import MobileSidebar from './MobileSidebar';

export function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

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
        <div className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
    <div onClick={() => setSidebarOpen(false)} className={`${isSidebarOpen ? "overlay--visible" : "hidden"} overlay`}></div>
    </div>
  );
}