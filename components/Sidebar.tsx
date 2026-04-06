import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSettingsClick: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onSettingsClick, onLogout }) => {
  return (
    <div className="w-64 bg-[#1a2332] border-r border-[#2a3442] flex flex-col py-6">
      {/* Logo */}
      <div className="px-6 mb-8">
        <img src="/favicon.png" alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
      </div>

      {/* Main Menu Label */}
      <div className="px-6 mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</h3>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col px-3">
        <button
          onClick={() => onTabChange('placement')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
            activeTab === 'placement' 
              ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
              : 'text-gray-400 hover:bg-[#2a3442] hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">Placement Data</span>
        </button>
        
        <button
          onClick={() => onTabChange('internship')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
            activeTab === 'internship' 
              ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
              : 'text-gray-400 hover:bg-[#2a3442] hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-sm font-medium">Internship Data</span>
        </button>
        
        <button
          onClick={() => onTabChange('student')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 ${
            activeTab === 'student' 
              ? 'bg-blue-600 text-white border-r-4 border-blue-400' 
              : 'text-gray-400 hover:bg-[#2a3442] hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm font-medium">Student Registration</span>
        </button>
      </nav>

      {/* Settings */}
      <div className="px-3">
        <button
          onClick={onSettingsClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:bg-[#2a3442] hover:text-white w-full mb-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">Settings</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:bg-red-900/30 hover:text-red-400 w-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;