import React, { useState, useEffect } from 'react';
import './WorkplanSubmission.css';
import apiService from '../../utils/api';

const WorkplanSubmission = ({ user }) => {
  const [assignedWorkplans, setAssignedWorkplans] = useState([]);
  const [standardWorkplans, setStandardWorkplans] = useState([]);
  const [assignedByMe, setAssignedByMe] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const [assignedKPIs, setAssignedKPIs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(getDefaultTab(user?.role));
  
  function getDefaultTab(role) {
    switch (role) {
      case 'Dean':
      case 'HOD':
        return 'assign'; // Supervisors see assignment tab first
      case 'Lecturer':
      default:
        return 'assigned'; // Subordinates see their assignments first
    }
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Always fetch KPIs for the user
      const kpis = await apiService.getMyKpis();
      setAssignedKPIs(Array.isArray(kpis) ? kpis : []);

      // Fetch assigned workplans for the current user
      const myAssignments = await apiService.getMyWorkplanAssignments();
      setAssignedWorkplans(Array.isArray(myAssignments) ? myAssignments : []);

      // If user is supervisor (Dean or HOD), fetch additional data
      if (user.role === 'Dean' || user.role === 'HOD') {
        // Fetch standard workplans available for assignment
        const standardWorkplansList = await apiService.getStandardWorkplansForAssignment();
        setStandardWorkplans(Array.isArray(standardWorkplansList) ? standardWorkplansList : []);

        // Fetch assignments made by this user
        const assignmentsByMe = await apiService.getWorkplanAssignmentsByMe();
        setAssignedByMe(Array.isArray(assignmentsByMe) ? assignmentsByMe : []);

        // Fetch subordinates based on role
        if (user.role === 'Dean') {
          const hods = await apiService.getHODs();
          setSubordinates(Array.isArray(hods) ? hods : []);
        } else if (user.role === 'HOD' && user.departmentId) {
          const lecturers = await apiService.getDepartmentLecturers(user.departmentId);
          setSubordinates(Array.isArray(lecturers) ? lecturers : []);
        }
      }
    } catch (err) {
      console.error('Error fetching workplan data:', err);
      setError('Failed to load workplan data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignWorkplan = async (standardWorkplanId, assigneeIds, notes = '') => {
    setLoading(true);
    setError('');
    
    try {
      if (assigneeIds.length === 1) {
        // Single assignment
        await apiService.assignWorkplan({
          standardWorkplanId,
          assigneeId: assigneeIds[0],
          assignmentNotes: notes
        });
        alert('Workplan assigned successfully!');
      } else {
        // Bulk assignment
        const result = await apiService.bulkAssignWorkplan({
          standardWorkplanId,
          assigneeIds,
          assignmentNotes: notes
        });
        alert(`Workplan assigned to ${result.assignedCount} users. ${result.errors?.length ? result.errors.length + ' errors occurred.' : ''}`);
      }
      
      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Error assigning workplan:', err);
      setError('Failed to assign workplan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (assignmentId, status, progress, notes = '') => {
    setLoading(true);
    setError('');
    
    try {
      await apiService.updateWorkplanAssignmentStatus(assignmentId, {
        status,
        progress,
        notes
      });
      
      alert('Status updated successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;
    
    setLoading(true);
    setError('');
    
    try {
      await apiService.removeWorkplanAssignment(assignmentId);
      alert('Assignment removed successfully!');
      await fetchData();
    } catch (err) {
      console.error('Error removing assignment:', err);
      setError('Failed to remove assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { label: 'Approved', class: 'badge-success' },
      pending: { label: 'Pending Review', class: 'badge-warning' },
      rejected: { label: 'Needs Revision', class: 'badge-danger' }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      teaching: '#11486B',
      research: '#e74c3c',
      service: '#27ae60',
      administration: '#f39c12'
    };
    return colors[category] || '#11486B';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="workplan-container">
      <div className="page-header">
        <h1>My Workplan</h1>
        <p>Plan and track your academic activities and KPIs</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Workplan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'kpis' ? 'active' : ''}`}
          onClick={() => setActiveTab('kpis')}
        >
          My KPIs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Submission History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'create' && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Create New Workplan</h2>
              <p>Plan your activities for the academic period</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid basic-info">
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <select
                    name="academicYear"
                    value={workplan.academicYear}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="2024/2025">2024/2025</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Period</label>
                  <select
                    name="semester"
                    value={workplan.semester}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="first">First Term</option>
                    <option value="second">Second Term</option>
                    <option value="third">Third Term</option>
                    <option value="academic">Academic Year</option>
                  </select>
                </div>
              </div>

              <div className="activities-section">
                <div className="form-group">
                  <label className="form-label">Teaching Activities</label>
                  <textarea
                    name="teachingActivities"
                    value={workplan.teachingActivities}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="Describe your planned teaching activities, courses to be delivered, and teaching methods..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Research Activities</label>
                  <textarea
                    name="researchActivities"
                    value={workplan.researchActivities}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="Outline your research projects, publications planned, conferences to attend..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Activities</label>
                  <textarea
                    name="serviceActivities"
                    value={workplan.serviceActivities}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="Detail your service contributions, committee memberships, student supervision..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Administrative Activities</label>
                  <textarea
                    name="administrativeActivities"
                    value={workplan.administrativeActivities}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="List any administrative roles or responsibilities..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Development</label>
                  <textarea
                    name="professionalDevelopment"
                    value={workplan.professionalDevelopment}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Describe planned professional development activities, training, certifications..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Objectives</label>
                  <textarea
                    name="objectives"
                    value={workplan.objectives}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="State your main objectives for this academic period..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expected Outcomes</label>
                  <textarea
                    name="expectedOutcomes"
                    value={workplan.expectedOutcomes}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="Describe the expected outcomes and deliverables..."
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Workplan'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all fields?')) {
                      setWorkplan({
                        academicYear: '2024/2025',
                        semester: 'first',
                        teachingActivities: '',
                        researchActivities: '',
                        serviceActivities: '',
                        administrativeActivities: '',
                        professionalDevelopment: '',
                        objectives: '',
                        expectedOutcomes: ''
                      });
                    }
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'kpis' && (
          <div className="kpis-section">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">My Assigned KPIs</h2>
                <p>Key Performance Indicators assigned to you</p>
              </div>

              <div className="kpis-grid">
                {assignedKPIs.map(kpi => (
                  <div key={kpi.id} className="kpi-card">
                    <div className="kpi-header">
                      <h3 className="kpi-title">{kpi.title}</h3>
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(kpi.category) }}
                      >
                        {kpi.category}
                      </span>
                    </div>
                    
                    <p className="kpi-description">{kpi.description}</p>
                    
                    <div className="kpi-metrics">
                      <div className="metric">
                        <span className="metric-label">Weight</span>
                        <span className="metric-value">{kpi.weight}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Target</span>
                        <span className="metric-value">{kpi.targetValue} {kpi.unit}</span>
                      </div>
                    </div>

                    <div className="kpi-actions">
                      <button className="btn btn-sm btn-outline">
                        Update Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">KPI Performance Summary</h3>
              </div>
              
              <div className="performance-summary">
                <div className="summary-grid">
                  <div className="summary-card">
                    <span className="summary-number">{assignedKPIs.length}</span>
                    <span className="summary-label">Total KPIs</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-number">{assignedKPIs.filter(k => k.category === 'teaching').length}</span>
                    <span className="summary-label">Lecturing</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-number">{assignedKPIs.filter(k => k.category === 'research').length}</span>
                    <span className="summary-label">Research</span>
                  </div>
                  <div className="summary-card">
                    <span className="summary-number">{assignedKPIs.filter(k => k.category === 'service').length}</span>
                    <span className="summary-label">Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Workplan Submission History</h2>
                <p>View your previously submitted workplans</p>
              </div>

              {submittedWorkplans.length > 0 ? (
                <div className="history-list">
                  {submittedWorkplans.map(submission => (
                    <div key={submission.id} className="history-item">
                      <div className="history-header">
                        <div className="history-info">
                          <h3 className="history-title">
                            {submission.academicYear} - {submission.semester} Semester
                          </h3>
                          <p className="history-date">
                            Submitted: {formatDate(submission.submissionDate)}
                          </p>
                        </div>
                        <div className="history-status">
                          {getStatusBadge(submission.status)}
                        </div>
                      </div>

                      {submission.feedback && (
                        <div className="history-feedback">
                          <h4>Supervisor Feedback:</h4>
                          <p>{submission.feedback}</p>
                        </div>
                      )}

                      <div className="history-actions">
                        <button className="btn btn-sm btn-outline">
                          View Details
                        </button>
                        <button className="btn btn-sm btn-secondary">
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history">
                  <div className="no-history-icon">📄</div>
                  <h3>No Submissions Yet</h3>
                  <p>Your workplan submissions will appear here once you submit them.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkplanSubmission;