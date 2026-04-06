import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Department, InternshipInputs, InternshipMetrics } from '../types';
import { calculateInternshipScore } from '../services/formulas';

const InternshipSection: React.FC = () => {
  const [isCalculated, setIsCalculated] = useState(false);
  const [activeDept, setActiveDept] = useState<Department>(Department.ENGINEERING);
  const [showFormula, setShowFormula] = useState(false);
  const [allDeptScores, setAllDeptScores] = useState<Record<Department, number>>({} as Record<Department, number>);
  
  const [inputs, setInputs] = useState<InternshipInputs>({
    department: Department.ENGINEERING,
    n1: 0, s1: 0, nc1: 0,
    n2: 0, s2: 0,
    n3: 0, s3: 0, nc3: 0,
    n4: 0, s4: 0, nc4: 0
  });

  const [metrics, setMetrics] = useState<InternshipMetrics>({
    componentA: 0, componentB: 0, componentC: 0, componentD: 0, totalScore: 0
  });

  useEffect(() => {
    setMetrics(calculateInternshipScore({ ...inputs, department: activeDept }));
  }, [inputs, activeDept]);

  useEffect(() => {
    if (isCalculated) {
      const scores: Record<Department, number> = {} as Record<Department, number>;
      Object.values(Department).forEach(dept => {
        const score = calculateInternshipScore({ ...inputs, department: dept });
        scores[dept] = score.totalScore;
      });
      setAllDeptScores(scores);
    }
  }, [isCalculated, inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleDeptChange = (dept: Department) => {
    setActiveDept(dept);
    setInputs(prev => ({ ...prev, department: dept }));
  };

  const handleCalculate = () => {
    setIsCalculated(true);
  };

  const handleEdit = () => {
    setIsCalculated(false);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

  const getPieData = () => {
    const data = [
      { name: activeDept === Department.ENGINEERING ? 'Year II (A)' : activeDept === Department.ARTS ? 'Year II (A)' : 'Year I/II (A)', value: metrics.componentA },
      { name: activeDept === Department.ENGINEERING ? 'Year III (B)' : activeDept === Department.ARTS ? 'Year III (B)' : 'Conversion (B)', value: metrics.componentB },
    ];
    if (activeDept !== Department.PG) {
        data.push({ name: activeDept === Department.ENGINEERING ? 'Year IV (C)' : 'Conversion (C)', value: metrics.componentC });
    }
    if (activeDept === Department.ENGINEERING) {
        data.push({ name: 'Conversion (D)', value: metrics.componentD });
    }
    return data;
  };

  const pieData = getPieData();

  // --- VIEW 1: INPUT FORM ---
  if (!isCalculated) {
    return (
      <div className="h-full w-full p-8 bg-gray-50">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Internship Data Entry</h2>
          <p className="text-sm text-gray-600 mt-2">Select department and enter student internship counts.</p>
        </div>

        <div className="flex space-x-3 mb-8">
            {Object.values(Department).map((dept) => (
              <button
                key={dept}
                onClick={() => handleDeptChange(dept)}
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition ${
                  activeDept === dept
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {dept}
              </button>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
            {/* Engineering Inputs */}
            {activeDept === Department.ENGINEERING && (
              <>
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
                    <div className="font-bold text-sm text-cyan-700 mb-4">2ND YEAR (TARGET 10%)</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Interns (N2)</label>
                        <input type="number" name="n2" value={inputs.n2 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Strength (S2)</label>
                        <input type="number" name="s2" value={inputs.s2 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                      </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                    <div className="font-bold text-sm text-emerald-700 mb-4">3RD YEAR (TARGET 20%)</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Interns (N3)</label>
                        <input type="number" name="n3" value={inputs.n3 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Strength (S3)</label>
                        <input type="number" name="s3" value={inputs.s3 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                      </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                    <div className="font-bold text-sm text-purple-700 mb-4">4TH YEAR (TARGET 30%)</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Interns (N4)</label>
                        <input type="number" name="n4" value={inputs.n4 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Strength (S4)</label>
                        <input type="number" name="s4" value={inputs.s4 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                      </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                    <div className="font-bold text-sm text-orange-700 mb-4">CONVERSION (TARGET 50%)</div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Converted to Placement (NC4)</label>
                      <input type="number" name="nc4" value={inputs.nc4 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                    </div>
                </div>
              </>
            )}

            {/* Arts Inputs */}
            {activeDept === Department.ARTS && (
               <>
               <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
                   <div className="font-bold text-sm text-cyan-700 mb-4">2ND YEAR (TARGET 20%)</div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-semibold text-gray-700 mb-2">Interns (N2)</label>
                       <input type="number" name="n2" value={inputs.n2 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                     </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-700 mb-2">Strength (S2)</label>
                       <input type="number" name="s2" value={inputs.s2 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                     </div>
                   </div>
               </div>
               <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
                   <div className="font-bold text-sm text-emerald-700 mb-4">3RD YEAR (TARGET 30%)</div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-semibold text-gray-700 mb-2">Interns (N3)</label>
                       <input type="number" name="n3" value={inputs.n3 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                     </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-700 mb-2">Strength (S3)</label>
                       <input type="number" name="s3" value={inputs.s3 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                     </div>
                   </div>
               </div>
               <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
                   <div className="font-bold text-sm text-purple-700 mb-4">CONVERSION</div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-2">Converted (NC3)</label>
                     <input type="number" name="nc3" value={inputs.nc3 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                   </div>
               </div>
             </>
            )}

            {/* PG Inputs */}
            {activeDept === Department.PG && (
               <>
               <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
                   <div className="font-bold text-sm text-cyan-700 mb-4">YEAR 1/2 (TARGET 30%)</div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-semibold text-gray-700 mb-2">Interns (N1)</label>
                       <input type="number" name="n1" value={inputs.n1 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                     </div>
                     <div>
                       <label className="block text-xs font-semibold text-gray-700 mb-2">Strength (S1)</label>
                       <input type="number" name="s1" value={inputs.s1 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                     </div>
                   </div>
               </div>
               <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                   <div className="font-bold text-sm text-orange-700 mb-4">CONVERSION</div>
                   <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-2">Converted (NC1)</label>
                     <input type="number" name="nc1" value={inputs.nc1 || ''} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                   </div>
               </div>
             </>
            )}

        </div>
        <div className="pt-8 flex justify-end">
          <button 
            onClick={handleCalculate}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            Calculate Internship Score →
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD ---
  return (
    <div className="h-full w-full p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar Actions */}
      <div className="lg:col-span-3 space-y-4">
        <button 
            onClick={handleEdit}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition mb-4"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Edit Data
        </button>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Department</h3>
            <div className="text-2xl font-bold text-gray-800">{activeDept}</div>
        </div>
      </div>

      {/* Visualization */}
      <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Main Score */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white shadow-lg flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium opacity-90">Overall Internship Score</h3>
                    <p className="text-sm opacity-75">Based on {activeDept} criteria</p>
                </div>
                <div 
                    className="text-5xl font-bold cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setShowFormula(true)}
                    title="Click to see formula breakdown"
                >
                    {metrics.totalScore.toFixed(2)}
                </div>
            </div>

            {/* Formula Modal */}
            {showFormula && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowFormula(false)}>
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Formula Breakdown - {activeDept}</h3>
                            <button onClick={() => setShowFormula(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            {activeDept === Department.ENGINEERING && (
                                <>
                                    <div className="flex justify-between p-3 bg-cyan-50 rounded">
                                        <span>Year II (A): (10 × {inputs.n2}/{inputs.s2}) × 25</span>
                                        <span className="font-bold">{metrics.componentA.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-emerald-50 rounded">
                                        <span>Year III (B): (5 × {inputs.n3}/{inputs.s3}) × 25</span>
                                        <span className="font-bold">{metrics.componentB.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-purple-50 rounded">
                                        <span>Year IV (C): (3.33 × {inputs.n4}/{inputs.s4}) × 25</span>
                                        <span className="font-bold">{metrics.componentC.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-orange-50 rounded">
                                        <span>Conversion (D): (2 × {inputs.nc4}/{inputs.n4}) × 25</span>
                                        <span className="font-bold">{metrics.componentD.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                            {activeDept === Department.ARTS && (
                                <>
                                    <div className="flex justify-between p-3 bg-cyan-50 rounded">
                                        <span>Year II (A): (5 × {inputs.n2}/{inputs.s2}) × 33.33</span>
                                        <span className="font-bold">{metrics.componentA.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-emerald-50 rounded">
                                        <span>Year III (B): (3.33 × {inputs.n3}/{inputs.s3}) × 33.33</span>
                                        <span className="font-bold">{metrics.componentB.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-purple-50 rounded">
                                        <span>Conversion (C): (2 × {inputs.nc3}/{inputs.n3}) × 33.33</span>
                                        <span className="font-bold">{metrics.componentC.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                            {activeDept === Department.PG && (
                                <>
                                    <div className="flex justify-between p-3 bg-cyan-50 rounded">
                                        <span>Year I/II (A): (3.33 × {inputs.n1}/{inputs.s1}) × 50</span>
                                        <span className="font-bold">{metrics.componentA.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-orange-50 rounded">
                                        <span>Conversion (B): (2 × {inputs.nc1}/{inputs.n1}) × 50</span>
                                        <span className="font-bold">{metrics.componentB.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between p-3 bg-indigo-100 rounded font-bold text-base border-t-2 border-indigo-300 mt-2">
                                <span>Total Score</span>
                                <span>{metrics.totalScore.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Department Comparison */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Department Scores</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={Object.entries(allDeptScores).map(([dept, score]) => ({ name: dept, score }))} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{fontSize: 11}} />
                                <YAxis />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {Object.keys(allDeptScores).map((dept, index) => (
                                        <Cell key={`bar-${index}`} fill={dept === activeDept ? '#6366f1' : '#94a3b8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Pie Chart Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Contribution Breakdown</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Component Scores */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Component Scores (Points)</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pieData} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" hide />
                                <YAxis />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipSection;