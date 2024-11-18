import { X } from 'lucide-react';

import { Sidebar } from './Sidebar';


interface MobileSidebarProps {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
}

const MobileSidebar = ({isOpen,setIsOpen}:MobileSidebarProps) => {
    return (
        <div>
        <div className="flex justify-end">
            
            <div onClick={() => setIsOpen(false)} className="cursor-pointer p-2">
                <svg className='w-6 h-6 text-white '>
                    <X/>
                </svg>
            </div>

            </div>
               {
                isOpen && <Sidebar isOpen={isOpen}/>
               } 
            </div>
    );
};

export default MobileSidebar;