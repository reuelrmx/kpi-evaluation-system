import React, { useState, useEffect } from 'react';
import apiService from '../../utils/api';
import BackButton from '../Common/BackButton';
import './KpiAssignment.css';

export default function DeanKpiAssignment({ user }) {
  const [kpis, setKpis] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    kpiId: '',
    userId: '',
    academicYear: new Date().getFullYear().toString(),
    semester: '1'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kpisData, usersData, assignmentsData] = await Promise.all([
        apiService.getAllKpis(),
        apiService.getAssignableUsers(),
        apiService.getKpiAssignments()
      ]);
      
      console.log('Fetched data:', { kpisData, usersData, assignmentsData });
      setKpis(kpisData);
      setAssignableUsers(usersData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createKpiAssignment(assignmentForm);
      setShowAssignForm(false);
      setAssignmentForm({
        kpiId: '',
        userId: '',
        academicYear: new Date().getFullYear().toString(),
        semester: '1'
      });
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment: ' + (error.message || 'Unknown error'));
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      try {
        await apiService.deleteKpiAssignment(assignmentId);
        await fetchData(); // Refresh data
      } catch (error) {
        console.error('Error removing assignment:', error);
        alert('Error removing assignment: ' + (error.message || 'Unknown error'));
      }
    }
  };

  if (loading) {
    return <div className="p-6">Loading KPI assignments...</div>;
  }

  return (
    <div className="dean-kpi-assignment p-6">
      <BackButton to="/dashboard" label="Back to Dashboard" className="mb-4" />
      <div className="header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🎯 Assign KPIs to HODs</h1>
          <p className="text-gray-600">Manage KPI assignments for Heads of Departments</p>
          {/* Debug info */}
          <div className="text-xs text-gray-400 mt-2">
            Assignable users: {assignableUsers.length} | 
            HODs: {assignableUsers.filter(u => u.role === 'HOD').length}
          </div>
        </div>
        <button
          onClick={() => setShowAssignForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Assign KPI
        </button>
      </div>

      {/* Assignment Form Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Assign KPI to HOD</h2>
            <form onSubmit={handleAssignmentSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">KPI</label>
                <select
                  value={assignmentForm.kpiId}
                  onChange={(e) => setAssignmentForm({...assignmentForm, kpiId: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select KPI</option>
                  {kpis.map(kpi => (
                    <option key={kpi.id} value={kpi.id}>
                      {kpi.title} - {kpi.department?.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">HOD</label>
                <select
                  value={assignmentForm.userId}
                  onChange={(e) => setAssignmentForm({...assignmentForm, userId: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select HOD</option>
                  {assignableUsers.filter(user => user.role === 'HOD').map(user => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || user.FullName} - {user.email || user.Email}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Academic Year</label>
                <input
                  type="text"
                  value={assignmentForm.academicYear}
                  onChange={(e) => setAssignmentForm({...assignmentForm, academicYear: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="2024"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Semester</label>
                <select
                  value={assignmentForm.semester}
                  onChange={(e) => setAssignmentForm({...assignmentForm, semester: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
                >
                  Assign KPI
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Existing Assignments */}
      <div className="assignments-list">
        <h2 className="text-xl font-bold mb-4">📋 Current KPI Assignments</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {assignments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No KPI assignments found. Create your first assignment!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KPI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">{assignment.kpi?.title}</div>
                          <div className="text-sm text-gray-500">{assignment.kpi?.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">{assignment.lecturer?.fullName}</div>
                          <div className="text-sm text-gray-500">{assignment.lecturer?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {assignment.lecturer?.department?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {assignment.academicYear} - Semester {assignment.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️ Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}