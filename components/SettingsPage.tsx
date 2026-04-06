import React, { useState, useEffect } from 'react';
import FormulaSettings from './FormulaSettings';
import UserManagement from './UserManagement';

interface SettingsPageProps {
  onClose: () => void;
  loggedInUser: string;
}

const CollegeLog: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [degrees, setDegrees] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [newDept, setNewDept] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [editingDept, setEditingDept] = useState<any>(null);
  const [editingDegree, setEditingDegree] = useState<any>(null);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [searchDegree, setSearchDegree] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [searchCompany, setSearchCompany] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/departments').then(r => r.json()).then(setDepartments).catch(e => console.error('Dept fetch error:', e));
    fetch('http://localhost:3001/api/degrees').then(r => r.json()).then(setDegrees).catch(e => console.error('Degree fetch error:', e));
    fetch('http://localhost:3001/api/companies').then(r => r.json()).then(setCompanies).catch(e => console.error('Company fetch error:', e));
  }, []);

  const addDepartment = async () => {
    if (newDept.trim()) {
      if (departments.some(d => d.name.toLowerCase() === newDept.trim().toLowerCase())) {
        alert('This department already exists!');
        return;
      }
      try {
        const res = await fetch('http://localhost:3001/api/departments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDept.trim(), code: newDept.trim().toUpperCase() })
        });
        const data = await res.json();
        if (res.ok) {
          setDepartments([...departments, data]);
          setNewDept('');
        } else {
          console.error('Error:', data);
          alert('Error adding department: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Error adding department. Check console.');
      }
    }
  };

  const addDegree = async () => {
    if (newDegree.trim()) {
      if (degrees.some(d => d.name.toLowerCase() === newDegree.trim().toLowerCase())) {
        alert('This degree already exists!');
        return;
      }
      const res = await fetch('http://localhost:3001/api/degrees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDegree.trim() })
      });
      const data = await res.json();
      setDegrees([...degrees, data]);
      setNewDegree('');
    }
  };

  const addCompany = async () => {
    if (newCompany.trim()) {
      if (companies.some(c => c.name.toLowerCase() === newCompany.trim().toLowerCase())) {
        alert('This company already exists!');
        return;
      }
      const res = await fetch('http://localhost:3001/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCompany.trim() })
      });
      const data = await res.json();
      setCompanies([...companies, data]);
      setNewCompany('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">College Log Management</h3>
          <p className="text-gray-600">Manage departments, degrees, and companies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Degrees</h4>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input type="text" value={searchDegree} onChange={(e) => setSearchDegree(e.target.value)} placeholder="Search degrees..." className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 mb-2" />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                placeholder="Add new degree"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <button onClick={addDegree} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                Add
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {degrees.filter(d => d.name.toLowerCase().includes(searchDegree.toLowerCase())).map((degree) => (
                <div key={degree.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  {editingDegree?.id === degree.id ? (
                    <input value={editingDegree.name} onChange={(e) => setEditingDegree({...editingDegree, name: e.target.value})} className="flex-1 px-2 py-1 border rounded" />
                  ) : (
                    <span className="text-gray-800 font-medium">{degree.name}</span>
                  )}
                  <div className="flex gap-1">
                    {editingDegree?.id === degree.id ? (
                      <button onClick={async () => {
                        await fetch(`http://localhost:3001/api/degrees/${degree.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: editingDegree.name })
                        });
                        setDegrees(degrees.map(d => d.id === degree.id ? editingDegree : d));
                        setEditingDegree(null);
                      }} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    ) : (
                      <button onClick={() => setEditingDegree(degree)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    <button onClick={async () => {
                      await fetch(`http://localhost:3001/api/degrees/${degree.id}`, { method: 'DELETE' });
                      setDegrees(degrees.filter(d => d.id !== degree.id));
                    }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Departments</h4>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input type="text" value={searchDept} onChange={(e) => setSearchDept(e.target.value)} placeholder="Search departments..." className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2" />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="Add new department"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button onClick={addDepartment} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                Add
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {departments.filter(d => d.name.toLowerCase().includes(searchDept.toLowerCase())).map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  {editingDept?.id === dept.id ? (
                    <input value={editingDept.name} onChange={(e) => setEditingDept({...editingDept, name: e.target.value})} className="flex-1 px-2 py-1 border rounded" />
                  ) : (
                    <span className="text-gray-800 font-medium">{dept.name}</span>
                  )}
                  <div className="flex gap-1">
                    {editingDept?.id === dept.id ? (
                      <button onClick={async () => {
                        await fetch(`http://localhost:3001/api/departments/${dept.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: editingDept.name, code: editingDept.name.toUpperCase() })
                        });
                        setDepartments(departments.map(d => d.id === dept.id ? editingDept : d));
                        setEditingDept(null);
                      }} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    ) : (
                      <button onClick={() => setEditingDept(dept)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    <button onClick={async () => {
                      await fetch(`http://localhost:3001/api/departments/${dept.id}`, { method: 'DELETE' });
                      setDepartments(departments.filter(d => d.id !== dept.id));
                    }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">Companies</h4>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <input type="text" value={searchCompany} onChange={(e) => setSearchCompany(e.target.value)} placeholder="Search companies..." className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 mb-2" />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Add new company"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <button onClick={addCompany} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
                Add
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {companies.filter(c => c.name.toLowerCase().includes(searchCompany.toLowerCase())).map((company) => (
                <div key={company.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  {editingCompany?.id === company.id ? (
                    <input value={editingCompany.name} onChange={(e) => setEditingCompany({...editingCompany, name: e.target.value})} className="flex-1 px-2 py-1 border rounded" />
                  ) : (
                    <span className="text-gray-800 font-medium">{company.name}</span>
                  )}
                  <div className="flex gap-1">
                    {editingCompany?.id === company.id ? (
                      <button onClick={async () => {
                        await fetch(`http://localhost:3001/api/companies/${company.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: editingCompany.name })
                        });
                        setCompanies(companies.map(c => c.id === company.id ? editingCompany : c));
                        setEditingCompany(null);
                      }} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    ) : (
                      <button onClick={() => setEditingCompany(company)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    <button onClick={async () => {
                      await fetch(`http://localhost:3001/api/companies/${company.id}`, { method: 'DELETE' });
                      setCompanies(companies.filter(c => c.id !== company.id));
                    }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, loggedInUser }) => {
  const [selectedCard, setSelectedCard] = useState<'none' | 'formula' | 'user' | 'college'>('none');

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Manage formulas and user access</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {selectedCard === 'none' && (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-3 gap-6">
                <button
                  onClick={() => setSelectedCard('formula')}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all group"
                >
                  <div className="bg-gray-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Formula Settings</h3>
                  <p className="text-gray-600 text-sm">Configure calculation formulas and parameters</p>
                </button>

                <button
                  onClick={() => setSelectedCard('user')}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all group"
                >
                  <div className="bg-gray-700 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-600 text-sm">Manage user access and permissions</p>
                </button>

                <button
                  onClick={() => setSelectedCard('college')}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all group"
                >
                  <div className="bg-gray-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">College Log</h3>
                  <p className="text-gray-600 text-sm">Manage departments, degrees & companies</p>
                </button>
              </div>
            </div>
          )}

          {selectedCard === 'formula' && <FormulaSettings onBack={() => setSelectedCard('none')} />}
          {selectedCard === 'user' && <UserManagement onBack={() => setSelectedCard('none')} loggedInUser={loggedInUser} />}
          {selectedCard === 'college' && <CollegeLog onBack={() => setSelectedCard('none')} />}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
