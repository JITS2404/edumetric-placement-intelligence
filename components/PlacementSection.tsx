import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { PlacementInputs, PlacementMetrics } from '../types';
import { fetchStudents, fetchPlacementStats } from '../api/students';
import { getFormulaConfigSync } from '../services/formulaConfig';

interface Student {
  name: string;
  registerId: string;
  department: string;
  degree: string;
  year: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  permanentAddress: string;
  currentAddress: string;
  package: number;
  company: string;
}

interface PlacementSectionProps {
  searchQuery?: string;
}

const PlacementSection: React.FC<PlacementSectionProps> = ({ searchQuery = '' }) => {
  const [isCalculated, setIsCalculated] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [showFormula, setShowFormula] = useState(false);
  const [showKpiModal, setShowKpiModal] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({ 
    name: '', registerId: '', department: '', degree: '', year: '', 
    dob: '', gender: '', mobile: '', email: '', permanentAddress: '', 
    currentAddress: '', package: '', company: '' 
  });

  const [inputs, setInputs] = useState<PlacementInputs>({
    totalEnrolled: 0,
    totalPlaced: 0,
    averageSalary: 0,
    lastYearPlacedPercent: 0,
    lastYearAvgSalary: 0,
    offers1: 0,
    offers2: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleStudentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      const dobRegex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/;
      const match = value.replace(/[^\d\/]/g, '').match(dobRegex);
      if (match) {
        let formatted = match[1];
        if (match[2]) formatted += '/' + match[2];
        if (match[3]) formatted += '/' + match[3].slice(0, 4);
        setStudentForm(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setStudentForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddStudent = () => {
    if (studentForm.name && studentForm.registerId && studentForm.department) {
      setStudents(prev => [...prev, { 
        ...studentForm,
        package: parseFloat(studentForm.package) || 0
      }]);
      setStudentForm({ 
        name: '', registerId: '', department: '', degree: '', year: '', 
        dob: '', gender: '', mobile: '', email: '', permanentAddress: '', 
        currentAddress: '', package: '', company: '' 
      });
    }
  };

  const handleCalculate = async () => {
    try {
      const data = await fetchStudents();
      const mappedData = data.map((s: any) => ({
        name: s.name,
        registerId: s.register_id,
        department: s.department,
        degree: s.degree,
        year: s.year,
        dob: s.dob,
        gender: s.gender,
        mobile: s.mobile,
        email: s.email,
        permanentAddress: s.address,
        currentAddress: s.address,
        package: parseFloat(s.package) || 0,
        company: s.company
      }));
      setStudents(mappedData.sort((a, b) => b.package - a.package));
      setIsCalculated(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      generateStudentData();
      setIsCalculated(true);
    }
  };

  const generateStudentData = () => {
    const departments = ['COMPUTER SCIENCE', 'INFORMATION TECH', 'CSE - AI/ML', 'CSE - CYBER SECURITY', 'ELECTRICAL', 'MECHANICAL'];
    const companies = ['ACCENTURE', 'CAPGEMINI', 'TCS', 'WIPRO', 'INFOSYS', 'COGNIZANT', 'LEARNING ROUTES', 'DNG INDIA', 'KNACK TECH'];
    const names = ['Aadarsh Tushar', 'Aadesh Jain', 'Aadita Khan', 'Aadita Prakash', 'Aakash Agarwal', 'Aarav Kumar', 'Abhishek Sharma', 'Aditya Singh'];
    
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const studentList: Student[] = [];
    const numStudents = Math.min(inputs.totalPlaced, 50);
    
    for (let i = 0; i < numStudents; i++) {
      studentList.push({
        name: names[i % names.length] + (i > 7 ? ` ${Math.floor(i/8)}` : ''),
        registerId: `REG${2024}${String(i + 1).padStart(3, '0')}`,
        department: departments[Math.floor(Math.random() * departments.length)],
        degree: 'B.Tech',
        year: years[Math.floor(Math.random() * years.length)],
        dob: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/2002`,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        mobile: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
        permanentAddress: 'Sample Address',
        currentAddress: 'Current Address',
        package: parseFloat((Math.random() * (inputs.averageSalary * 1.5 - 2) + 2).toFixed(2)),
        company: companies[Math.floor(Math.random() * companies.length)]
      });
    }
    
    setStudents(studentList.sort((a, b) => b.package - a.package));
  };

  const handleEdit = () => {
    setIsCalculated(false);
  };

  if (!isCalculated) {
    const hasAnyInput = inputs.totalEnrolled > 0 || inputs.totalPlaced > 0 || inputs.averageSalary > 0;
    
    return (
      <div className="h-full w-full p-8">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100">

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="pb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      Current Batch Statistics
                    </h3>
                  </div>

                  {!hasAnyInput && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 animate-[fadeIn_0.5s_ease-in]">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Start by entering your data</p>
                          <p className="text-xs text-blue-700 mt-1">Fill in the current batch statistics to calculate placement scores</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Students</label>
                      <input
                        type="number"
                        name="totalEnrolled"
                        value={inputs.totalEnrolled || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:shadow-lg transition-all bg-gray-50 hover:bg-white hover:border-gray-300"
                        placeholder="e.g. 120"
                        min="0"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Students Placed</label>
                      <input
                        type="number"
                        name="totalPlaced"
                        value={inputs.totalPlaced || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:shadow-lg transition-all bg-gray-50 hover:bg-white hover:border-gray-300"
                        placeholder="e.g. 95"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        Remaining Students
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Auto-calculated</span>
                      </label>
                      <input
                        type="number"
                        value={(inputs.totalEnrolled - inputs.totalPlaced) || ''}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Average Salary Package (LPA)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          name="averageSalary"
                          value={inputs.averageSalary || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:shadow-lg transition-all bg-gray-50 hover:bg-white hover:border-gray-300"
                          placeholder="e.g. 4.5"
                          min="0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse"></div>
                      <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Historical Data</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Last Year Placed %</label>
                        <input
                          type="number"
                          name="lastYearPlacedPercent"
                          value={inputs.lastYearPlacedPercent || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none focus:shadow-lg transition-all bg-gray-50 hover:bg-white hover:border-gray-300 text-sm"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Last Year Avg Salary</label>
                        <input
                          type="number"
                          step="0.1"
                          name="lastYearAvgSalary"
                          value={inputs.lastYearAvgSalary || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none focus:shadow-lg transition-all bg-gray-50 hover:bg-white hover:border-gray-300 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1 w-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full animate-pulse"></div>
                      <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider">Offer Details</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Students w/ 1 Offer</label>
                        <input
                          type="number"
                          name="offers1"
                          value={inputs.offers1 || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none focus:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-white hover:border-amber-300 shadow-sm text-sm"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Students w/ 2+ Offers</label>
                        <input
                          type="number"
                          name="offers2"
                          value={inputs.offers2 || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none focus:shadow-lg transition-all bg-gradient-to-br from-gray-50 to-white hover:border-amber-300 shadow-sm text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <div className="relative p-1 rounded-2xl bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 backdrop-blur-xl border-2 border-white/60 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                  <button
                    onClick={handleCalculate}
                    className="relative group bg-white/50 backdrop-blur-2xl border border-white/80 hover:bg-white/70 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold py-4 px-10 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-purple-600 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg">Calculate Placement Score</span>
                      <svg className="w-6 h-6 text-pink-600 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }

  const categoryDegreeMap: Record<string, string[]> = {
    'Engineering': ['B.Tech', 'B.E.'],
    'Arts': ['B.A.', 'B.Com', 'B.Sc'],
    'PG': ['M.Tech', 'M.E.', 'MBA', 'MCA', 'M.Sc', 'M.A.']
  };

  const filteredStudents = students.filter(s => {
    const categoryMatch = selectedCategory === 'All' || 
      (categoryDegreeMap[selectedCategory] && categoryDegreeMap[selectedCategory].includes(s.degree));
    const searchMatch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch &&
      (selectedBranch === 'All' || s.department === selectedBranch) &&
      (selectedCompany === 'All' || s.company === selectedCompany) &&
      (selectedDegree === 'All' || s.degree === selectedDegree) &&
      searchMatch;
  });
  
  const allDegrees = [...new Set(students.map(s => s.degree))].sort();
  const degreeDepartments = selectedDegree === 'All' 
    ? [...new Set(students.map(s => s.department))]
    : [...new Set(students.filter(s => s.degree === selectedDegree).map(s => s.department))];
  const branches = selectedCategory === 'PG' 
    ? [...new Set(filteredStudents.map(s => s.degree))].sort()
    : [...new Set(filteredStudents.map(s => s.department))].sort();
  const companies = [...new Set(filteredStudents.map(s => s.company))];
  
  const branchData = branches.map(branch => ({
    name: branch.split(' ').slice(-1)[0],
    value: selectedCategory === 'PG' 
      ? filteredStudents.filter(s => s.degree === branch).length
      : filteredStudents.filter(s => s.department === branch).length
  }));
  
  const companyData = companies.map(company => ({
    name: company,
    value: filteredStudents.filter(s => s.company === company).length
  }));
  
  const branchPackageData = branches.map(branch => {
    const branchStudents = selectedCategory === 'PG'
      ? filteredStudents.filter(s => s.degree === branch)
      : filteredStudents.filter(s => s.department === branch);
    return {
      name: branch.split(' ').slice(-1)[0],
      package: branchStudents.length > 0 ? branchStudents.reduce((sum, s) => sum + s.package, 0) / branchStudents.length : 0
    };
  });
  
  const companyHiringData = companies.map(company => ({
    name: company,
    count: filteredStudents.filter(s => s.company === company).length
  })).sort((a, b) => b.count - a.count);
  
  const maxPackage = students.length > 0 ? Math.max(...students.map(s => s.package)) : 0;
  const minPackage = students.length > 0 ? Math.min(...students.map(s => s.package)) : 0;
  
  const departmentScoreData = branches.map(branch => {
    const deptStudents = selectedCategory === 'PG'
      ? filteredStudents.filter(s => s.degree === branch)
      : filteredStudents.filter(s => s.department === branch);
    const totalDeptStudents = selectedCategory === 'PG'
      ? students.filter(s => s.degree === branch).length
      : students.filter(s => s.department === branch).length;
    const placedCount = deptStudents.length;
    const totalPlaced = inputs.totalPlaced || filteredStudents.length;
    
    // Placement Rate Score (0-50 points)
    const placementRate = totalDeptStudents > 0 ? (placedCount / totalDeptStudents) * 100 : 0;
    const placementScore = Math.min(placementRate / 2, 50);
    
    // Dream Placement Score: Based on offers (1 offer = 5 points, 2+ offers = 10 points)
    const deptRatio = totalPlaced > 0 ? placedCount / totalPlaced : 0;
    const deptWith1Offer = Math.round((inputs.offers1 || 0) * deptRatio);
    const deptWith2Offers = Math.round((inputs.offers2 || 0) * deptRatio);
    const dreamScore = Math.min((deptWith1Offer * 5) + (deptWith2Offers * 10), 10);
    
    // Average package score (0-10 points)
    const avgPackage = placedCount > 0 ? deptStudents.reduce((sum, s) => sum + s.package, 0) / placedCount : 0;
    const packageScore = Math.min(avgPackage, 10);
    
    const score = placementScore + dreamScore + packageScore;
    return {
      name: branch.split(' ').slice(-1)[0],
      score: isNaN(score) ? 0 : parseFloat(score.toFixed(2))
    };
  }).sort((a, b) => b.score - a.score);
  
  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleEdit}
                  className="bg-white/40 backdrop-blur-xl text-blue-700 rounded-2xl p-3 hover:bg-white/60 transition-all hover:scale-105 border border-white/60"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Campus Placement Analytics</h1>
                  <p className="text-gray-500 text-sm mt-1">Real-time Performance Dashboard</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex gap-4">
                <div className="bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-xl rounded-2xl px-6 py-4 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 min-w-[160px] border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                    <div className="text-xs font-medium opacity-90">Total Students</div>
                  </div>
                  <div className="text-3xl font-bold">{inputs.totalEnrolled}</div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl px-6 py-4 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 min-w-[160px] border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                    </svg>
                    <div className="text-xs font-medium opacity-90">Highest Package</div>
                  </div>
                  <div className="text-3xl font-bold">₹{maxPackage.toFixed(2)} LPA</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/90 to-purple-600/90 backdrop-blur-xl rounded-2xl px-6 py-4 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 min-w-[160px] border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/>
                    </svg>
                    <div className="text-xs font-medium opacity-90">Average Package</div>
                  </div>
                  <div className="text-3xl font-bold">₹{inputs.averageSalary.toFixed(2)} LPA</div>
                </div>
                
                <div onClick={() => setShowKpiModal('placementRate')} className="bg-gradient-to-br from-orange-500/90 to-orange-600/90 backdrop-blur-xl rounded-2xl px-6 py-4 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 min-w-[160px] border border-white/20 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <div className="text-xs font-medium opacity-90">Placement Rate</div>
                  </div>
                  <div className="text-3xl font-bold">{((inputs.totalPlaced / inputs.totalEnrolled) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
          <div className="max-w-[1600px] mx-auto space-y-6">
            <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-white/60 backdrop-blur-xl text-blue-700 border border-white/60'
                      : 'bg-white/40 backdrop-blur-xl text-gray-700 border border-white/40 hover:bg-white/60'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('Engineering')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === 'Engineering'
                      ? 'bg-white/60 backdrop-blur-xl text-blue-700 border border-white/60'
                      : 'bg-white/40 backdrop-blur-xl text-gray-700 border border-white/40 hover:bg-white/60'
                  }`}
                >
                  Engineering
                </button>
                <button
                  onClick={() => setSelectedCategory('Arts')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === 'Arts'
                      ? 'bg-white/60 backdrop-blur-xl text-blue-700 border border-white/60'
                      : 'bg-white/40 backdrop-blur-xl text-gray-700 border border-white/40 hover:bg-white/60'
                  }`}
                >
                  Arts
                </button>
                <button
                  onClick={() => setSelectedCategory('PG')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === 'PG'
                      ? 'bg-white/60 backdrop-blur-xl text-blue-700 border border-white/60'
                      : 'bg-white/40 backdrop-blur-xl text-gray-700 border border-white/40 hover:bg-white/60'
                  }`}
                >
                  PG
                </button>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-gray-900 font-bold text-lg">Filters</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-700 text-sm font-semibold mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                    Degree
                  </label>
                  <select
                    value={selectedDegree}
                    onChange={(e) => {
                      setSelectedDegree(e.target.value);
                      setSelectedBranch('All');
                    }}
                    className="w-full bg-white/60 backdrop-blur-md border-2 border-white/40 text-gray-900 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white/80 focus:outline-none transition-all shadow-sm"
                  >
                    <option value="All">All Degrees</option>
                    {allDegrees.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-semibold mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                    Department
                  </label>
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-white/60 backdrop-blur-md border-2 border-white/40 text-gray-900 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white/80 focus:outline-none transition-all shadow-sm"
                  >
                    <option value="All">All Departments</option>
                    {(selectedCategory === 'PG' ? branches : degreeDepartments.sort()).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-semibold mb-2 block flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                    </svg>
                    Company
                  </label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full bg-white/60 backdrop-blur-md border-2 border-white/40 text-gray-900 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:bg-white/80 focus:outline-none transition-all shadow-sm"
                  >
                    <option value="All">All Companies</option>
                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 font-bold text-lg">Department Distribution</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">By Students</span>
                  </div>
                  {branchData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={branchData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={false}>
                            {branchData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: '#ffffff', backdropFilter: 'blur(20px)'}} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {branchData.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                            <span className="truncate">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-[180px] flex items-center justify-center text-gray-400">No data available</div>
                  )}
                </div>
                
                <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 font-bold text-lg">Top Recruiters</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">By Placements</span>
                  </div>
                  {companyData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={companyData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={false}>
                            {companyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: 'rgba(0, 0, 0, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', color: '#ffffff', backdropFilter: 'blur(20px)'}} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {companyData.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                            <span className="truncate">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-[180px] flex items-center justify-center text-gray-400">No data available</div>
                  )}
                </div>
              </div>

            </div>

              <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition-all hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-bold text-lg">Average Package by Department</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">In LPA</span>
                </div>
                {branchPackageData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={branchPackageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12, fontWeight: 500}} angle={-45} textAnchor="end" height={80} />
                      <YAxis tick={{fill: '#6b7280', fontSize: 12}} />
                      <Tooltip contentStyle={{backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '12px'}} />
                      <Bar dataKey="package" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-gray-400">No data available</div>
                )}
              </div>

              <div className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition-all hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-bold text-lg">Department Placement Score</h3>
                  <button onClick={() => setShowFormula(!showFormula)} className="text-xs text-gray-700 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">Based on Formula</button>
                </div>
                {showFormula && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg text-xs text-gray-700 space-y-2">
                    <p className="font-semibold text-blue-900">Department Score Formula:</p>
                    <p><strong>Placement Rate (0-50):</strong> (Placed / Total Students) × 50</p>
                    <p><strong>Dream Score (0-10):</strong> 1 offer = 5 pts | 2+ offers = 10 pts</p>
                    <p><strong>Package Score (0-10):</strong> Average Package (LPA)</p>
                    <p><strong>Total (Max 70):</strong> Placement + Dream + Package</p>
                  </div>
                )}
                {departmentScoreData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={departmentScoreData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} />
                      <YAxis domain={[0, 75]} tick={{fill: '#6b7280', fontSize: 12}} />
                      <Tooltip contentStyle={{backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '12px'}} />
                      <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-gray-400">No data available</div>
                )}
              </div>
              
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-4 bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 font-bold text-lg">Gender Distribution</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Placements</span>
                  </div>
                  {(() => {
                    const maleCount = filteredStudents.filter(s => s.gender === 'Male').length;
                    const femaleCount = filteredStudents.filter(s => s.gender === 'Female').length;
                    const otherCount = filteredStudents.filter(s => s.gender === 'Other').length;
                    const total = maleCount + femaleCount + otherCount;
                    return total > 0 ? (
                      <div className="space-y-6 mt-8">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Male</span>
                            <span className="text-sm font-bold text-blue-600">{maleCount} ({((maleCount/total)*100).toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all" style={{width: `${(maleCount/total)*100}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Female</span>
                            <span className="text-sm font-bold text-pink-600">{femaleCount} ({((femaleCount/total)*100).toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-4 rounded-full transition-all" style={{width: `${(femaleCount/total)*100}%`}}></div>
                          </div>
                        </div>
                        {otherCount > 0 && (
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Other</span>
                              <span className="text-sm font-bold text-purple-600">{otherCount} ({((otherCount/total)*100).toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all" style={{width: `${(otherCount/total)*100}%`}}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-[280px] flex items-center justify-center text-gray-400">No data available</div>
                    );
                  })()}
                </div>
                <div className="col-span-4 bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 font-bold text-lg">Top Performers</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Highest Packages</span>
                  </div>
                  <div className="space-y-1">
                    <div className="grid grid-cols-12 gap-3 text-xs text-gray-500 font-semibold pb-3 border-b-2 border-gray-100">
                      <div className="col-span-1">#</div>
                      <div className="col-span-5">Student Name</div>
                      <div className="col-span-3">Package</div>
                      <div className="col-span-3">Company</div>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto space-y-1">
                      {filteredStudents.slice(0, 10).map((student, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-3 items-center text-sm py-3 hover:bg-blue-50 rounded-lg px-2 transition-colors group">
                          <div className="col-span-1">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                              idx === 1 ? 'bg-gray-100 text-gray-700' :
                              idx === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-50 text-blue-600'
                            }`}>{idx + 1}</span>
                          </div>
                          <div className="col-span-5 font-medium text-gray-900 truncate">{student.name}</div>
                          <div className="col-span-3 font-bold text-emerald-600">₹{student.package.toFixed(2)}</div>
                          <div className="col-span-3 text-xs text-gray-600 truncate">{student.company}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              
                <div className="col-span-4 bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 hover:shadow-2xl transition-all hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 font-bold text-lg">Hiring Trends</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Total Offers</span>
                  </div>
                  {companyHiringData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={companyHiringData.slice(0, 8)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                        <XAxis type="number" tick={{fill: '#6b7280', fontSize: 12}} />
                        <YAxis type="category" dataKey="name" tick={{fill: '#6b7280', fontSize: 11, fontWeight: 500}} width={100} />
                        <Tooltip contentStyle={{backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '12px'}} />
                        <Bar dataKey="count" fill="url(#companyGradient)" radius={[0, 8, 8, 0]} />
                        <defs>
                          <linearGradient id="companyGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-gray-400">No data available</div>
                  )}
                </div>
        </div>
      </div>
      
      {showKpiModal && (() => {
        const config = getFormulaConfigSync();
        const formula = config.placementRate?.formula || '(Total Placed / Total Enrolled) × 100';
        const description = config.placementRate?.description;
        return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowKpiModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Placement Rate Calculation</h3>
              <button onClick={() => setShowKpiModal(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-orange-900 mb-2">Formula:</p>
                <p className="text-sm text-orange-800 font-mono">{formula}</p>
                {description && (
                  <p className="text-xs text-orange-700 mt-2 italic">{description}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Students Placed</span>
                  <span className="text-lg font-bold text-gray-900">{inputs.totalPlaced}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Students Enrolled</span>
                  <span className="text-lg font-bold text-gray-900">{inputs.totalEnrolled}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-100 rounded-lg border-2 border-orange-300">
                  <span className="text-sm font-semibold text-orange-900">Placement Rate</span>
                  <span className="text-2xl font-bold text-orange-600">{((inputs.totalPlaced / inputs.totalEnrolled) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};

export default PlacementSection;