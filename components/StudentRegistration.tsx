import React, { useState, useEffect } from 'react';

const StudentRegistration: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [degrees, setDegrees] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', register_id: '', dob: '', gender: '', department: '', degree: '', year: '',
    mobile: '', email: '', address: '', company: '', package: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/departments').then(r => r.json()).then(setDepartments).catch(console.error);
    fetch('http://localhost:3001/api/degrees').then(r => r.json()).then(setDegrees).catch(console.error);
    fetch('http://localhost:3001/api/companies').then(r => r.json()).then(setCompanies).catch(console.error);
    fetch('http://localhost:3001/api/students').then(r => r.json()).then(setStudents).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.register_id) {
      alert('Please fill in Name and Register ID');
      return;
    }
    
    const submitData = { ...formData };
    if (formData.dob && formData.dob.includes('-')) {
      const [day, month, year] = formData.dob.split('-');
      submitData.dob = `${year}-${month}-${day}`;
    }
    
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:3001/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        setStudents(students.map(s => s.id === editingId ? updated : s));
        setEditingId(null);
        alert('Student updated successfully!');
      } else {
        const res = await fetch('http://localhost:3001/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        if (!res.ok) throw new Error('Failed to add student');
        const newStudent = await res.json();
        setStudents([newStudent, ...students]);
        alert('Student added successfully!');
      }
      setFormData({ name: '', register_id: '', dob: '', gender: '', department: '', degree: '', year: '', mobile: '', email: '', address: '', company: '', package: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error: Make sure the backend server is running on http://localhost:3001');
    }
  };

  const studentsPerPage = 10;
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const currentStudents = students.slice((currentPage - 1) * studentsPerPage, currentPage * studentsPerPage);
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Student Registration</h2>
              <p className="text-gray-600">Add comprehensive student details for placement tracking</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
            </svg>
            {showForm ? 'Close Form' : 'Add Student'}
          </button>
        </div>
        
        {showForm && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Register Number</label>
                <input type="text" value={formData.register_id} onChange={(e) => setFormData({...formData, register_id: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Student ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input 
                  type="text" 
                  value={formData.dob} 
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^\d]/g, '');
                    if (value.length > 2) {
                      const day = value.slice(0, 2);
                      if (parseInt(day) > 31) return;
                      value = day + '-' + value.slice(2);
                    }
                    if (value.length > 5) {
                      const month = value.slice(3, 5);
                      if (parseInt(month) > 12) return;
                      value = value.slice(0, 5) + '-' + value.slice(5, 9);
                    }
                    setFormData({...formData, dob: value});
                  }} 
                  className="w-full p-3 border border-gray-300 rounded-lg" 
                  placeholder="DD-MM-YYYY (e.g., 15-08-2000)"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Academic Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <select value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">Select Degree</option>
                  {degrees.map(deg => <option key={deg.id} value={deg.name}>{deg.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">Select Department</option>
                  {departments.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">Select Year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  {!['MBA', 'MCA', 'M.E.', 'M.Tech', 'M.Sc', 'M.A.'].includes(formData.degree) && <option value="3">3</option>}
                  {!['B.A.', 'B.Sc', 'B.Com', 'MBA', 'MCA', 'M.E.', 'M.Tech', 'M.Sc', 'M.A.'].includes(formData.degree) && <option value="4">4</option>}
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value.slice(0, 10)})} maxLength={10} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="XXXXXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="student@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg" rows={3} placeholder="Enter address"></textarea>
              </div>
            </div>
          </div>

          {/* Placement Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Placement Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <select value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="">Select Company</option>
                  {companies.map(comp => <option key={comp.id} value={comp.name}>{comp.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package (LPA)</label>
                <div className="relative">
                  <input type="number" value={formData.package} onChange={(e) => setFormData({...formData, package: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg pr-8" placeholder="0.0" step="0.1" />
                  <span className="absolute right-3 top-3 text-gray-500">₹</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => {
            setFormData({ name: '', register_id: '', dob: '', gender: '', department: '', degree: '', year: '', mobile: '', email: '', address: '', company: '', package: '' });
            setEditingId(null);
            setShowForm(false);
          }} type="button" className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleSubmit} type="button" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingId ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
            </svg>
            {editingId ? 'Update Student' : 'Add Student'}
          </button>
        </div>
        </>
        )}

        {!showForm && students.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Register ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">DOB</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Degree</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Year</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Package</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors duration-150 group">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-medium">{student.register_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.dob ? new Date(student.dob).toLocaleDateString('en-GB') : student.dob}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.gender === 'Male' ? 'bg-blue-100 text-blue-700' :
                        student.gender === 'Female' ? 'bg-pink-100 text-pink-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{student.gender}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{student.department}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{student.degree}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{student.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.mobile}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{student.address}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">{student.company}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-bold text-xs shadow-md">₹{student.package} LPA</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setEditingId(student.id);
                          let dobFormatted = student.dob;
                          if (student.dob && student.dob.includes('-')) {
                            const date = new Date(student.dob);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            dobFormatted = `${day}-${month}-${year}`;
                          }
                          setFormData({
                            name: student.name,
                            register_id: student.register_id,
                            dob: dobFormatted,
                            gender: student.gender,
                            department: student.department,
                            degree: student.degree,
                            year: student.year,
                            mobile: student.mobile,
                            email: student.email,
                            address: student.address,
                            company: student.company,
                            package: student.package
                          });
                          setShowForm(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={async () => {
                          await fetch(`http://localhost:3001/api/students/${student.id}`, { method: 'DELETE' });
                          setStudents(students.filter(s => s.id !== student.id));
                        }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
              <div className="text-sm text-gray-600">Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, students.length)} of {students.length} students</div>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRegistration;