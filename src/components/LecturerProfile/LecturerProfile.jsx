import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './LecturerProfile.css';

const LecturerProfile = ({ user }) => {
  const { id } = useParams();
  const [lecturer, setLecturer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Mock lecturer data
  const mockLecturerData = {
    1: {
      id: 1,
      name: 'Mr. Raymose Banda',
      email: 'rbanda@cbu.ac.zm',
      phone: '+260-97-1234567',
      department: 'Computer Science',
      position: 'Lecturer',
      joinDate: '2020-03-15',
      officeLocation: 'CS-204',
      status: 'active',
      bio: 'Experienced lecturer in Computer Science with expertise in software engineering and database systems.',
      qualifications: ['MSc Computer Science - University of Zambia', 'BSc Information Technology - CBU'],
      researchInterests: ['Software Engineering', 'Database Systems', 'Web Development'],
      assignedKPIs: [
        {
          id: 1,
          title: 'Course Delivery',
          category: 'teaching',
          weight: 40,
          target: 85,
          current: 78,
          status: 'in_progress'
        },
        {
          id: 2,
          title: 'Research Publications',
          category: 'research',
          weight: 20,
          target: 2,
          current: 1,
          status: 'in_progress'
        },
        {
          id: 3,
          title: 'Student Supervision',
          category: 'service',
          weight: 15,
          target: 3,
          current: 2,
          status: 'completed'
        },
        {
          id: 4,
          title: 'Departmental Meetings',
          category: 'service',
          weight: 10,
          target: 80,
          current: 90,
          status: 'completed'
        }
      ],
      performanceHistory: [
        { period: 'Jan 2024', score: 72 },
        { period: 'Feb 2024', score: 75 },
        { period: 'Mar 2024', score: 78 },
        { period: 'Apr 2024', score: 76 },
        { period: 'May 2024', score: 80 },
        { period: 'Jun 2024', score: 78 }
      ],
      recentActivities: [
        {
          id: 1,
          type: 'submission',
          description: 'Submitted quarterly workplan',
          date: '2024-06-15',
          status: 'completed'
        },
        {
          id: 2,
          type: 'evaluation',
          description: 'Performance evaluation completed',
          date: '2024-06-10',
          status: 'completed'
        },
        {
          id: 3,
          type: 'kpi_update',
          description: 'Updated KPI progress',
          date: '2024-06-05',
          status: 'completed'
        }
      ]
    }
  };

  useEffect(() => {
    const fetchLecturerData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const lecturerData = mockLecturerData[parseInt(id)];
      if (lecturerData) {
        setLecturer(lecturerData);
      }
      setLoading(false);
    };

    fetchLecturerData();
  }, [id]);

  if (loading) {
    return (
      <div className="lecturer-profile-container">
        <div className="loading">Loading lecturer profile...</div>
      </div>
    );
  }

  if (!lecturer) {
    return (
      <div className="lecturer-profile-container">
        <div className="error">Lecturer not found</div>
      </div>
    );
  }

  const getKPIStatusBadge = (status) => {
    const statusMap = {
      completed: { label: 'Completed', class: 'badge-success' },
      in_progress: { label: 'In Progress', class: 'badge-warning' },
      not_started: { label: 'Not Started', class: 'badge-danger' }
    };
    
    const statusInfo = statusMap[status] || statusMap.not_started;
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

  const calculateOverallScore = () => {
    const totalWeight = lecturer.assignedKPIs.reduce((sum, kpi) => sum + kpi.weight, 0);
    const weightedScore = lecturer.assignedKPIs.reduce((sum, kpi) => {
      const progress = (kpi.current / kpi.target) * 100;
      return sum + (progress * kpi.weight / 100);
    }, 0);
    return Math.round((weightedScore / totalWeight) * 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="lecturer-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {lecturer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div className="profile-info">
          <h1 className="lecturer-name">{lecturer.name}</h1>
          <p className="lecturer-position">{lecturer.position}</p>
          <p className="lecturer-department">{lecturer.department}</p>
          <div className="contact-info">
            <span className="contact-item">📧 {lecturer.email}</span>
            <span className="contact-item">📞 {lecturer.phone}</span>
            <span className="contact-item">🏢 {lecturer.officeLocation}</span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">{calculateOverallScore()}%</span>
            <span className="stat-label">Overall Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{lecturer.assignedKPIs.length}</span>
            <span className="stat-label">Total KPIs</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {lecturer.assignedKPIs.filter(kpi => kpi.status === 'completed').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'kpis' ? 'active' : ''}`}
          onClick={() => setActiveTab('kpis')}
        >
          KPIs & Performance
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Recent Activities
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="overview-grid">
              {/* Performance Chart */}
              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">Performance Trend</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={lecturer.performanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#11486B" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KPI Progress */}
              <div className="card kpi-summary-card">
                <div className="card-header">
                  <h3 className="card-title">KPI Progress Summary</h3>
                </div>
                <div className="kpi-progress-list">
                  {lecturer.assignedKPIs.map(kpi => (
                    <div key={kpi.id} className="kpi-progress-item">
                      <div className="kpi-info">
                        <span className="kpi-title">{kpi.title}</span>
                        <span className="kpi-progress">{kpi.current}/{kpi.target}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%`,
                            backgroundColor: getCategoryColor(kpi.category)
                          }}
                        />
                      </div>
                      {getKPIStatusBadge(kpi.status)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="quick-actions">
                {user.role === 'lecturer' && user.id === lecturer.id && (
                  <>
                    <button className="action-btn">
                      <span className="action-icon">📝</span>
                      Update Progress
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">📄</span>
                      Submit Workplan
                    </button>
                  </>
                )}
                {(user.role === 'admin' || user.role === 'supervisor') && (
                  <>
                    <button className="action-btn">
                      <span className="action-icon">📊</span>
                      Assign KPI
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">✅</span>
                      Evaluate Performance
                    </button>
                    <button className="action-btn">
                      <span className="action-icon">📄</span>
                      Generate Report
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kpis' && (
          <div className="kpis-content">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Key Performance Indicators</h3>
              </div>
              <div className="kpi-details-grid">
                {lecturer.assignedKPIs.map(kpi => (
                  <div key={kpi.id} className="kpi-detail-card">
                    <div className="kpi-card-header">
                      <h4 className="kpi-card-title">{kpi.title}</h4>
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(kpi.category) }}
                      >
                        {kpi.category}
                      </span>
                    </div>
                    
                    <div className="kpi-metrics">
                      <div className="metric">
                        <span className="metric-label">Weight</span>
                        <span className="metric-value">{kpi.weight}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Target</span>
                        <span className="metric-value">{kpi.target}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Current</span>
                        <span className="metric-value">{kpi.current}</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Progress</span>
                        <span className="metric-value">
                          {Math.round((kpi.current / kpi.target) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="kpi-progress-bar">
                      <div 
                        className="kpi-progress-fill"
                        style={{ 
                          width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%`,
                          backgroundColor: getCategoryColor(kpi.category)
                        }}
                      />
                    </div>

                    <div className="kpi-status">
                      {getKPIStatusBadge(kpi.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance by Category Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Performance by Category</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={lecturer.assignedKPIs.map(kpi => ({
                    name: kpi.title,
                    progress: Math.round((kpi.current / kpi.target) * 100),
                    target: 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#11486B" />
                    <Bar dataKey="target" fill="#e0e0e0" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="activities-content">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activities</h3>
              </div>
              <div className="activity-timeline">
                {lecturer.recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-date">
                      {formatDate(activity.date)}
                    </div>
                    <div className="activity-content">
                      <div className="activity-icon">
                        {activity.type === 'submission' && '📤'}
                        {activity.type === 'evaluation' && '📊'}
                        {activity.type === 'kpi_update' && '🔄'}
                      </div>
                      <div className="activity-description">
                        {activity.description}
                      </div>
                      <span className={`badge ${activity.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="profile-grid">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Personal Information</h3>
                </div>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Full Name:</span>
                    <span className="detail-value">{lecturer.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{lecturer.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{lecturer.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{lecturer.department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Position:</span>
                    <span className="detail-value">{lecturer.position}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Office Location:</span>
                    <span className="detail-value">{lecturer.officeLocation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Join Date:</span>
                    <span className="detail-value">{formatDate(lecturer.joinDate)}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Biography</h3>
                </div>
                <p className="bio-text">{lecturer.bio}</p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Qualifications</h3>
                </div>
                <ul className="qualifications-list">
                  {lecturer.qualifications.map((qualification, index) => (
                    <li key={index} className="qualification-item">
                      🎓 {qualification}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Research Interests</h3>
                </div>
                <div className="research-interests">
                  {lecturer.researchInterests.map((interest, index) => (
                    <span key={index} className="interest-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerProfile;