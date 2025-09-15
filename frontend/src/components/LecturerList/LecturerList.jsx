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
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [availableKpis, setAvailableKpis] = useState([]);
  const [kpiAssignments, setKpiAssignments] = useState([]);
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
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    
    const fetchLecturers = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Check if user is authenticated
        const token = apiService.getAuthToken();
        if (!token) {
          throw new Error('Not authenticated. Please log in again.');
        }

        console.log('Fetching lecturers with token:', token ? 'Token exists' : 'No token');
        
        // Call real API endpoint
        const response = await apiService.getLecturers();
        console.log('API Response:', response);
        
        // Handle empty response
        if (!response || !Array.isArray(response)) {
          console.log('Invalid response format:', response);
          setLecturers([]);
          setFilteredLecturers([]);
          return;
        }
        
        // Transform API data to match component expectations
        const transformedLecturers = response.map(lecturer => ({
          id: lecturer.id,
          name: lecturer.fullName,
          email: lecturer.email,
          department: lecturer.department || 'Unassigned',
          position: 'Lecturer', // Default position since API doesn't provide this
          joinDate: '2020-01-01', // Default date - you can get this from user creation date
          assignedKPIs: 0, // Will be populated by KPI assignments API later
          completedKPIs: 0, // Will be populated by evaluations API later
          averageScore: 0, // Will be calculated from evaluations
          status: 'active', // Default status
          lastEvaluation: null,
          phone: 'N/A', // Not available in current API
          officeLocation: 'N/A', // Not available in current API
          departmentId: lecturer.departmentId
        }));
        
        setLecturers(transformedLecturers);
        setFilteredLecturers(transformedLecturers);
      } catch (error) {
        console.error('Error fetching lecturers:', error);
        setError('Failed to load lecturers. Please try again.');
        
        // Fallback to empty array on error
        setLecturers([]);
        setFilteredLecturers([]);
      }
      
      setLoading(false);
    };

    fetchLecturers();
  }, []);

  useEffect(() => {
    // Filter and sort lecturers based on search, department, and sort criteria
    let filtered = lecturers.filter(lecturer => {
      const matchesSearch = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lecturer.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || lecturer.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    // Sort lecturers
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

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: 'Active', class: 'badge-success' },
      on_leave: { label: 'On Leave', class: 'badge-warning' },
      inactive: { label: 'Inactive', class: 'badge-danger' }
    };
    
    const statusInfo = statusMap[status] || statusMap.active;
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPerformanceColor = (score) => {
    if (score >= 85) return '#27ae60';
    if (score >= 70) return '#f39c12';
    return '#e74c3c';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDepartments = () => {
    const departments = [...new Set(lecturers.map(l => l.department))].filter(dept => dept);
    return departments.sort();
  };

  const handleRefresh = () => {
    window.location.reload(); // Simple refresh - you can make this more elegant
  };

  // Handle Assign KPI Modal
  const handleOpenAssignModal = async (lecturer) => {
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

  const handleAssignKPI = async (e) => {
    e.preventDefault();
    if (!assignmentForm.kpiId) {
      alert('Please select a KPI');
      return;
    }

    setSubmitting(true);
    try {
      await apiService.createKpiAssignment({
        kpiId: parseInt(assignmentForm.kpiId),
        userId: selectedLecturer.id,
        academicYear: assignmentForm.academicYear,
        semester: assignmentForm.semester
      });
      
      setShowAssignModal(false);
      alert('KPI assigned successfully!');
      setSelectedLecturer(null);
    } catch (error) {
      alert('Failed to assign KPI: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Evaluate Modal
  const handleOpenEvaluateModal = async (lecturer) => {
    try {
      setSelectedLecturer(lecturer);
      // Fetch KPI assignments for this lecturer
      const assignments = await apiService.getKpiAssignmentsByLecturer(lecturer.id);
      setKpiAssignments(Array.isArray(assignments) ? assignments : []);
      
      if (!assignments || assignments.length === 0) {
        alert('No KPI assignments found for this lecturer');
        return;
      }
      
      setShowEvaluateModal(true);
      setEvaluationForm({
        kpiId: assignments[0]?.kpi?.id || '',
        score: '',
        comments: ''
      });
    } catch (error) {
      alert('Failed to load lecturer KPI assignments: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!evaluationForm.kpiId || !evaluationForm.score) {
      alert('Please fill in all required fields');
      return;
    }

    if (evaluationForm.score < 0 || evaluationForm.score > 100) {
      alert('Score must be between 0 and 100');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiService.createEvaluation({
        lecturerId: selectedLecturer.id,
        kpiId: parseInt(evaluationForm.kpiId),
        score: parseFloat(evaluationForm.score),
        comments: evaluationForm.comments
      });
      if (!res || typeof res !== 'object') {
        alert('Failed to submit evaluation: The server did not return a valid response.');
        return;
      }
      setShowEvaluateModal(false);
      alert('Evaluation submitted successfully!');
      setSelectedLecturer(null);
    } catch (error) {
      alert('Failed to submit evaluation: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="lecturer-list-container">
        <div className="loading">Loading lecturers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lecturer-list-container">
        <div className="error-message">
          <h3>❌ Error Loading Lecturers</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lecturer-list-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Lecturer Management</h1>
          <p>View and manage all lecturers in the School of ICT</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{lecturers.filter(l => l.status === 'active').length}</span>
            <span className="stat-label">Active Lecturers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{getDepartments().length}</span>
            <span className="stat-label">Departments</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search lecturers by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="department-filter">Department:</label>
            <select
              id="department-filter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Departments</option>
              {getDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-filter">Sort by:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="department">Department</option>
              <option value="score">Performance Score</option>
              <option value="joinDate">Join Date</option>
            </select>
          </div>

          <button onClick={handleRefresh} className="btn btn-outline btn-sm">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {filteredLecturers.length} of {lecturers.length} lecturers</p>
        {lecturers.length === 0 && !loading && (
          <p className="note">
            ℹ️ No lecturers found. Create some test lecturer accounts using the registration API.
          </p>
        )}
      </div>

      {/* Lecturers Grid/List */}
      <div className="lecturers-grid">
        {filteredLecturers.map(lecturer => (
          <div key={lecturer.id} className="lecturer-card">
            <div className="lecturer-header">
              <div className="lecturer-avatar">
                {lecturer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="lecturer-basic-info">
                <h3 className="lecturer-name">{lecturer.name}</h3>
                <p className="lecturer-position">{lecturer.position}</p>
                <p className="lecturer-department">{lecturer.department}</p>
              </div>
              <div className="lecturer-status">
                {getStatusBadge(lecturer.status)}
              </div>
            </div>

            <div className="lecturer-details">
              <div className="detail-row">
                <span className="detail-label">📧 Email:</span>
                <span className="detail-value">{lecturer.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📞 Phone:</span>
                <span className="detail-value">{lecturer.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🏢 Office:</span>
                <span className="detail-value">{lecturer.officeLocation}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📅 Joined:</span>
                <span className="detail-value">{formatDate(lecturer.joinDate)}</span>
              </div>
            </div>

            <div className="lecturer-performance">
              <div className="performance-metrics">
                <div className="metric">
                  <span className="metric-value">{lecturer.assignedKPIs}</span>
                  <span className="metric-label">Assigned KPIs</span>
                </div>
                <div className="metric">
                  <span className="metric-value">{lecturer.completedKPIs}</span>
                  <span className="metric-label">Completed</span>
                </div>
                <div className="metric">
                  <span 
                    className="metric-value score"
                    style={{ color: getPerformanceColor(lecturer.averageScore) }}
                  >
                    {lecturer.averageScore || 'N/A'}
                  </span>
                  <span className="metric-label">Avg Score</span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: lecturer.assignedKPIs > 0 ? `${(lecturer.completedKPIs / lecturer.assignedKPIs) * 100}%` : '0%',
                    backgroundColor: getPerformanceColor(lecturer.averageScore)
                  }}
                />
              </div>
              
              <div className="last-evaluation">
                Last evaluation: {formatDate(lecturer.lastEvaluation)}
              </div>
            </div>

            <div className="lecturer-actions">
              <Link 
                to={`/lecturer/${lecturer.id}`}
                className="btn btn-primary btn-sm"
              >
                View Profile
              </Link>
              {(user.role === 'admin' || user.role === 'hod') && (
                <>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleOpenAssignModal(lecturer)}
                  >
                    Assign KPIs
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenEvaluateModal(lecturer)}
                  >
                    Evaluate
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLecturers.length === 0 && lecturers.length > 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No lecturers found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Assign KPI Modal */}
      {showAssignModal && selectedLecturer && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign KPI to {selectedLecturer.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAssignModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAssignKPI} className="modal-form">
              <div className="form-group">
                <label htmlFor="kpi-select" className="form-label">Select KPI *</label>
                <select
                  id="kpi-select"
                  value={assignmentForm.kpiId}
                  onChange={(e) => setAssignmentForm({...assignmentForm, kpiId: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">-- Select a KPI --</option>
                  {availableKpis.map(kpi => (
                    <option key={kpi.id} value={kpi.id}>
                      {kpi.title} (Weight: {kpi.weight})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="academic-year" className="form-label">Academic Year *</label>
                  <input
                    type="text"
                    id="academic-year"
                    value={assignmentForm.academicYear}
                    onChange={(e) => setAssignmentForm({...assignmentForm, academicYear: e.target.value})}
                    className="form-input"
                    placeholder="2024"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="semester" className="form-label">Semester *</label>
                  <select
                    id="semester"
                    value={assignmentForm.semester}
                    onChange={(e) => setAssignmentForm({...assignmentForm, semester: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAssignModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Assigning...' : 'Assign KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluate Performance Modal */}
      {showEvaluateModal && selectedLecturer && (
        <div className="modal-overlay" onClick={() => setShowEvaluateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Evaluate {selectedLecturer.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEvaluateModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEvaluate} className="modal-form">
              <div className="form-group">
                <label htmlFor="eval-kpi-select" className="form-label">Select KPI to Evaluate *</label>
                <select
                  id="eval-kpi-select"
                  value={evaluationForm.kpiId}
                  onChange={(e) => setEvaluationForm({...evaluationForm, kpiId: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">-- Select a KPI --</option>
                  {kpiAssignments.map(assignment => (
                    <option key={assignment.kpi?.id} value={assignment.kpi?.id}>
                      {assignment.kpi?.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="score" className="form-label">Score (0-100) *</label>
                <input
                  type="number"
                  id="score"
                  min="0"
                  max="100"
                  step="0.1"
                  value={evaluationForm.score}
                  onChange={(e) => setEvaluationForm({...evaluationForm, score: e.target.value})}
                  className="form-input"
                  placeholder="Enter score between 0-100"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="comments" className="form-label">Comments</label>
                <textarea
                  id="comments"
                  value={evaluationForm.comments}
                  onChange={(e) => setEvaluationForm({...evaluationForm, comments: e.target.value})}
                  className="form-textarea"
                  rows="4"
                  placeholder="Enter evaluation comments (optional)"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowEvaluateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerList;