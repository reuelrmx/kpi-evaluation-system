import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../utils/api';
import './LecturerList.css';

const LecturerList = ({ user }) => {
  const [lecturers, setLecturers] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [availableKpis, setAvailableKpis] = useState([]);
  const [kpiAssignments, setKpiAssignments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [assignmentForm, setAssignmentForm] = useState({
    kpiId: '',
    academicYear: '',
    semester: ''
  });

  const [evaluationForm, setEvaluationForm] = useState({
    kpiId: '',
    score: '',
    comments: ''
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    officeLocation: ''
  });

  useEffect(() => {
    const fetchLecturers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = apiService.getAuthToken();
        if (!token) throw new Error('Not authenticated.');

        const response = await apiService.getLecturers();
        if (!response || !Array.isArray(response)) {
          setLecturers([]);
          setFilteredLecturers([]);
          return;
        }

        const transformedLecturers = response.map(lecturer => ({
          id: lecturer.id,
          name: lecturer.fullName,
          email: lecturer.email,
          department: lecturer.department || 'Unassigned',
          position: 'Lecturer',
          joinDate: '2020-01-01',
          assignedKPIs: 0,
          completedKPIs: 0,
          averageScore: 0,
          status: 'active',
          lastEvaluation: null,
          phone: lecturer.phone || 'N/A',
          officeLocation: lecturer.officeLocation || 'N/A',
          departmentId: lecturer.departmentId
        }));

        setLecturers(transformedLecturers);
        setFilteredLecturers(transformedLecturers);
      } catch (error) {
        console.error(error);
        setError('Failed to load lecturers.');
        setLecturers([]);
        setFilteredLecturers([]);
      }
      setLoading(false);
    };

    fetchLecturers();
  }, []);

  useEffect(() => {
    let filtered = lecturers.filter(lecturer => {
      const matchesSearch =
        lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === 'all' || lecturer.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'score':
          return b.averageScore - a.averageScore;
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate);
        default:
          return 0;
      }
    });

    setFilteredLecturers(filtered);
  }, [lecturers, searchTerm, selectedDepartment, sortBy]);

  const getStatusBadge = status => {
    const statusMap = {
      active: { label: 'Active', class: 'badge-success' },
      on_leave: { label: 'On Leave', class: 'badge-warning' },
      inactive: { label: 'Inactive', class: 'badge-danger' }
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getPerformanceColor = score => {
    if (score >= 85) return '#27ae60';
    if (score >= 70) return '#f39c12';
    return '#e74c3c';
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDepartments = () => [...new Set(lecturers.map(l => l.department))].filter(Boolean).sort();

  const handleRefresh = () => window.location.reload();

  /** Assign KPI */
  const handleOpenAssignModal = async lecturer => {
    try {
      setSelectedLecturer(lecturer);
      const kpis = await apiService.getAllKpis();
      setAvailableKpis(kpis);
      setShowAssignModal(true);
      setAssignmentForm({
        kpiId: '',
        academicYear: new Date().getFullYear().toString(),
        semester: '1'
      });
    } catch (error) {
      setError('Failed to load available KPIs');
    }
  };

  const handleAssignKPI = async e => {
    e.preventDefault();
    if (!assignmentForm.kpiId) return alert('Please select a KPI');

    setSubmitting(true);
    try {
      await apiService.createKpiAssignment({
        kpiId: parseInt(assignmentForm.kpiId),
        lecturerId: selectedLecturer.id, // ✅ Fixed from userId
        academicYear: assignmentForm.academicYear,
        semester: assignmentForm.semester
      });
      setShowAssignModal(false);
      alert('KPI assigned successfully!');
      setSelectedLecturer(null);
    } catch (error) {
      console.error(error);
      alert('Failed to assign KPI: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  /** Evaluate KPI */
  const handleOpenEvaluateModal = async lecturer => {
    try {
      setSelectedLecturer(lecturer);
      const assignments = await apiService.getKpiAssignmentsByLecturer(lecturer.id);
      setKpiAssignments(Array.isArray(assignments) ? assignments : []);
      if (!assignments || assignments.length === 0)
        return alert('No KPI assignments found for this lecturer');
      setShowEvaluateModal(true);
      setEvaluationForm({ kpiId: assignments[0]?.kpi?.id || '', score: '', comments: '' });
    } catch (error) {
      alert('Failed to load lecturer KPI assignments');
    }
  };

  const handleEvaluate = async e => {
    e.preventDefault();
    if (!evaluationForm.kpiId || !evaluationForm.score)
      return alert('Please fill in all required fields');
    if (evaluationForm.score < 0 || evaluationForm.score > 100)
      return alert('Score must be between 0-100');

    setSubmitting(true);
    try {
      await apiService.createEvaluation({
        lecturerId: selectedLecturer.id,
        kpiId: parseInt(evaluationForm.kpiId),
        score: parseFloat(evaluationForm.score),
        comments: evaluationForm.comments
      });
      setShowEvaluateModal(false);
      alert('Evaluation submitted successfully!');
      setSelectedLecturer(null);
    } catch (error) {
      alert('Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  /** Edit Lecturer */
  const handleOpenEditModal = lecturer => {
    setSelectedLecturer(lecturer);
    setEditForm({
      name: lecturer.name,
      email: lecturer.email,
      department: lecturer.department,
      phone: lecturer.phone,
      officeLocation: lecturer.officeLocation
    });
    setShowEditModal(true);
  };

  const handleEditLecturer = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.updateLecturer(selectedLecturer.id, editForm);
      setLecturers(prev =>
        prev.map(l => (l.id === selectedLecturer.id ? { ...l, ...editForm } : l))
      );
      setShowEditModal(false);
      alert('Lecturer updated successfully!');
      setSelectedLecturer(null);
    } catch (error) {
      alert('Failed to update lecturer');
    } finally {
      setSubmitting(false);
    }
  };

  /** Delete Lecturer */
  const handleDeleteLecturer = async lecturer => {
    if (!window.confirm(`Are you sure you want to delete ${lecturer.name}?`)) return;
    try {
      await apiService.deleteLecturer(lecturer.id);
      setLecturers(prev => prev.filter(l => l.id !== lecturer.id));
      alert('Lecturer deleted successfully!');
    } catch (error) {
      alert('Failed to delete lecturer');
    }
  };

  if (loading) return <div className="loading">Loading lecturers...</div>;
  if (error)
    return (
      <div className="error">
        {error} <button onClick={handleRefresh}>Retry</button>
      </div>
    );

  return (
    <div className="lecturers-container">
      <h2>Lecturers</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, department..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
          <option value="all">All Departments</option>
          {getDepartments().map(dep => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="department">Sort by Department</option>
          <option value="score">Sort by Performance</option>
          <option value="joinDate">Sort by Join Date</option>
        </select>
      </div>

      <div className="lecturers-grid">
        {filteredLecturers.map(lecturer => (
          <div className="lecturer-card" key={lecturer.id}>
            <h3>{lecturer.name}</h3>
            <p>{lecturer.email}</p>
            <p>{lecturer.department}</p>
            <p>{getStatusBadge(lecturer.status)}</p>
            <p>
              Average Score:{' '}
              <span style={{ color: getPerformanceColor(lecturer.averageScore) }}>
                {lecturer.averageScore}
              </span>
            </p>

            <div className="lecturer-actions">
              {user?.role === 'hod' && (
                <>
                  <button onClick={() => handleOpenAssignModal(lecturer)}>Assign KPI</button>
                  <button onClick={() => handleOpenEvaluateModal(lecturer)}>Evaluate</button>
                  <button onClick={() => handleOpenEditModal(lecturer)}>Edit</button>
                  <button onClick={() => handleDeleteLecturer(lecturer)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Assign KPI to {selectedLecturer.name}</h3>
            <form onSubmit={handleAssignKPI}>
              <select
                value={assignmentForm.kpiId}
                onChange={e => setAssignmentForm(prev => ({ ...prev, kpiId: e.target.value }))}
              >
                <option value="">Select KPI</option>
                {availableKpis.map(kpi => (
                  <option key={kpi.id} value={kpi.id}>
                    {kpi.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Academic Year"
                value={assignmentForm.academicYear}
                onChange={e => setAssignmentForm(prev => ({ ...prev, academicYear: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Semester"
                value={assignmentForm.semester}
                onChange={e => setAssignmentForm(prev => ({ ...prev, semester: e.target.value }))}
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Assigning...' : 'Assign'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEvaluateModal && (
        <div className="modal-overlay" onClick={() => setShowEvaluateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Evaluate {selectedLecturer.name}</h3>
            <form onSubmit={handleEvaluate}>
              <select
                value={evaluationForm.kpiId}
                onChange={e => setEvaluationForm(prev => ({ ...prev, kpiId: e.target.value }))}
              >
                <option value="">Select KPI</option>
                {kpiAssignments.map(a => (
                  <option key={a.kpi.id} value={a.kpi.id}>
                    {a.kpi.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Score (0-100)"
                value={evaluationForm.score}
                onChange={e => setEvaluationForm(prev => ({ ...prev, score: e.target.value }))}
              />
              <textarea
                placeholder="Comments"
                value={evaluationForm.comments}
                onChange={e => setEvaluationForm(prev => ({ ...prev, comments: e.target.value }))}
              ></textarea>
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Edit Lecturer: {selectedLecturer.name}</h3>
            <form onSubmit={handleEditLecturer}>
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Department"
                value={editForm.department}
                onChange={e => setEditForm(prev => ({ ...prev, department: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Phone"
                value={editForm.phone}
                onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Office Location"
                value={editForm.officeLocation}
                onChange={e => setEditForm(prev => ({ ...prev, officeLocation: e.target.value }))}
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerList;
