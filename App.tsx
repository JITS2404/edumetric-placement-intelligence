import React, { useState, useEffect } from 'react';
import PlacementSection from './components/PlacementSection';
import InternshipSection from './components/InternshipSection';
import SettingsPage from './components/SettingsPage';
import StudentRegistration from './components/StudentRegistration';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { getFormulaConfig } from './services/formulaConfig';

enum Tab {
  PLACEMENT = 'placement',
  INTERNSHIP = 'internship',
  STUDENT = 'student'
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PLACEMENT);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getFormulaConfig();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={(email) => { setIsLoggedIn(true); setLoggedInUser(email); }} />;
  }

  if (isSettingsOpen) {
    return <SettingsPage onClose={() => setIsSettingsOpen(false)} loggedInUser={loggedInUser} />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as Tab)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-white/20 px-8 py-6">
          {/* Glass morphism container */}
          <div className="relative z-10 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-center ml-32">
                <div className="text-center">
                <div className="inline-flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Placement Analytics Dashboard
                  </h2>
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Track and analyze student placement performance metrics
                </p>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {activeTab === Tab.PLACEMENT ? <PlacementSection searchQuery={searchQuery} /> : 
           activeTab === Tab.INTERNSHIP ? <InternshipSection /> : <StudentRegistration />}
        </main>
      </div>
    </div>
  );
};

export default App;