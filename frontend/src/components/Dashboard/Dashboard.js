import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - In real app, this would come from API
  const mockData = {
    admin: {
      stats: {
        totalLecturers: 24,
        totalKPIs: 12,
        completedEvaluations: 18,
        pendingEvaluations: 6,
        averageScore: 78.5
      },
      performanceData: [
        { name: 'Jan', score: 75 },
        { name: 'Feb', score: 80 },
        { name: 'Mar', score: 78 },
        { name: 'Apr', score: 82 },
        { name: 'May', score: 85 },
        { name: 'Jun', score: 79 }
      ],
      recentActivity: [
        { id: 1, action: 'New KPI created: Research Output', time: '2 hours ago', type: 'create' },
        { id: 2, action: 'Evaluation completed for Dr. Smith', time: '4 hours ago', type: 'complete' },
        { id: 3, action: 'Workplan submitted by Mr. Banda', time: '1 day ago', type: 'submit' },
        { id: 4, action: 'KPI updated: Teaching Effectiveness', time: '2 days ago', type: 'update' }
      ]
    },
    supervisor: {
      stats: {
        assignedLecturers: 8,
        totalKPIs: 10,
        completedEvaluations: 6,
        pendingEvaluations: 2,
        averageScore: 81.2
      },
      performanceData: [
        { name: 'Jan', score: 78 },
        { name: 'Feb', score: 82 },
        { name: 'Mar', score: 80 },
        { name: 'Apr', score: 84 },
        { name: 'May', score: 83 },
        { name: 'Jun', score: 81 }
      ],
      recentActivity: [
        { id: 1, action: 'Evaluation completed for Mr. Banda', time: '1 hour ago', type: 'complete' },
        { id: 2, action: 'KPI assigned to Ms. Chiwele', time: '3 hours ago', type: 'assign' },
        { id: 3, action: 'Workplan approved for Dr. Johnson', time: '1 day ago', type: 'approve' }
      ]
    },
    lecturer: {
      stats: {
        assignedKPIs: 6,
        completedTasks: 4,
        pendingTasks: 2,
        currentScore: 76.8,
        lastEvaluation: '2 weeks ago'
      },
      performanceData: [
        { name: 'Teaching', score: 85, target: 80 },
        { name: 'Research', score: 70, target: 75 },
        { name: 'Service', score: 80, target: 70 },
        { name: 'Admin', score: 75, target: 65 }
      ],
      recentActivity: [
        { id: 1, action: 'Workplan submitted successfully', time: '2 days ago', type: 'submit' },
        { id: 2, action: 'New KPI assigned: Student Supervision', time: '1 week ago', type: 'assign' },
        { id: 3, action: 'Performance evaluation completed', time: '2 weeks ago', type: 'complete' }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = mockData[user.role] || mockData.lecturer;
      setStats(data.stats);
      setPerformanceData(data.performanceData);
      setRecentActivity(data.recentActivity);
      setLoading(false);
    };

    fetchData();
  }, [user.role]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create': return '➕';
      case 'complete': return '✅';
      case 'submit': return '📤';
      case 'update': return '🔄';
      case 'assign': return '📋';
      case 'approve': return '👍';
      default: return '📄';
    }
  };

  const COLORS = ['#11486B', '#1a5a7a', '#4a90a4', '#7bb3c7'];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.name}!</h1>
          <p>Here's your performance overview and recent activities.</p>
        </div>
        <div className="current-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {user.role === 'admin' && (
          <>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.totalLecturers}</h3>
                <p>Total Lecturers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.totalKPIs}</h3>
                <p>Total KPIs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.completedEvaluations}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{stats.pendingEvaluations}</h3>
                <p>Pending</p>
              </div>
            </div>
          </>
        )}

        {user.role === 'supervisor' && (
          <>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.assignedLecturers}</h3>
                <p>Assigned Lecturers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.totalKPIs}</h3>
                <p>Active KPIs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.completedEvaluations}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>{stats.averageScore}%</h3>
                <p>Average Score</p>
              </div>
            </div>
          </>
        )}

        {user.role === 'lecturer' && (
          <>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{stats.assignedKPIs}</h3>
                <p>Assigned KPIs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.completedTasks}</h3>
                <p>Completed Tasks</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>{stats.pendingTasks}</h3>
                <p>Pending Tasks</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>{stats.currentScore}%</h3>
                <p>Current Score</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Performance Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <h2 className="card-title">
              {user.role === 'lecturer' ? 'My Performance by Category' : 'Performance Trends'}
            </h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              {user.role === 'lecturer' ? (
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#11486B" name="Current Score" />
                  <Bar dataKey="target" fill="#7bb3c7" name="Target Score" />
                </BarChart>
              ) : (
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#11486B" strokeWidth={3} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card activity-card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="quick-actions">
          {user.role === 'admin' && (
            <>
              <Link to="/lecturers" className="action-btn">
                <span className="action-icon">👥</span>
                <span>Manage Lecturers</span>
              </Link>
              <Link to="/kpi-management" className="action-btn">
                <span className="action-icon">📊</span>
                <span>Create KPI</span>
              </Link>
              <Link to="/reports" className="action-btn">
                <span className="action-icon">📄</span>
                <span>Generate Report</span>
              </Link>
            </>
          )}
          
          {user.role === 'supervisor' && (
            <>
              <Link to="/lecturers" className="action-btn">
                <span className="action-icon">👥</span>
                <span>View Lecturers</span>
              </Link>
              <Link to="/kpi-management" className="action-btn">
                <span className="action-icon">📋</span>
                <span>Assign KPIs</span>
              </Link>
              <Link to="/reports" className="action-btn">
                <span className="action-icon">📄</span>
                <span>View Reports</span>
              </Link>
            </>
          )}
          
          {user.role === 'lecturer' && (
            <>
              <Link to="/workplan" className="action-btn">
                <span className="action-icon">📝</span>
                <span>My Workplan</span>
              </Link>
              <Link to="/reports" className="action-btn">
                <span className="action-icon">📊</span>
                <span>My Performance</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;