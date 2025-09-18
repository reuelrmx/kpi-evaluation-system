
import React, { useState, useEffect } from 'react';
import apiService from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import './Reports.css';


const Reports = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [evaluationsData, setEvaluationsData] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(getDefaultTab(user?.role));
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  function getDefaultTab(role) {
    if (role === 'hod') return 'reports';
    if (role === 'lecturer') return 'performance';
    if (role === 'dean' || role === 'admin') return 'reports';
    return 'reports';
  }

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line
  }, [dateRange, user]);

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    
    // For now, always use mock data to ensure the reports work
    console.log('Loading mock data for user role:', user?.role);
    setMockData();
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    /* TODO: Enable real API calls when backend is ready
    try {
      if (user?.role === 'hod') {
        // Fetch department report and evaluations for HOD
        const [reportRes, evaluationsRes] = await Promise.all([
          apiService.get(`/reports/department?departmentId=${user.departmentId}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`),
          apiService.get('/evaluations/my-department')
        ]);
        setReportData(reportRes.data);
        setEvaluationsData(evaluationsRes.data || []);
      } else if (user?.role === 'lecturer') {
        // Fetch lecturer's performance data
        const performanceRes = await apiService.get(`/reports/my-performance?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
        setPerformanceData(performanceRes.data);
      } else if (user?.role === 'dean' || user?.role === 'admin') {
        // Fetch comprehensive reports for dean/admin
        const reportRes = await apiService.get(`/reports/comprehensive?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
        setReportData(reportRes.data);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to fetch report data.');
      setMockData();
    }
    setLoading(false);
    */
  };

  const setMockData = () => {
    console.log('Setting mock data for role:', user?.role);
    
    if (user?.role === 'hod') {
      setReportData({
        performance: {
          overall: {
            totalEvaluations: 24,
            completedEvaluations: 18,
            avgScore: 85,
            pendingEvaluations: 6
          },
          byDepartment: [
            { name: 'Computer Science', score: 88 },
            { name: 'Information Technology', score: 82 }
          ],
          byCategory: [
            { name: 'Teaching', score: 90 },
            { name: 'Research', score: 85 },
            { name: 'Service', score: 80 },
            { name: 'Administration', score: 85 }
          ],
          trends: [
            { period: 'Q1', score: 82 },
            { period: 'Q2', score: 85 },
            { period: 'Q3', score: 88 },
            { period: 'Q4', score: 85 }
          ],
          topPerformers: [
            { name: 'Dr. John Smith', department: 'CS', score: 95 },
            { name: 'Dr. Sarah Johnson', department: 'IT', score: 92 },
            { name: 'Dr. Michael Brown', department: 'CS', score: 90 }
          ]
        }
      });
      setEvaluationsData([
        { id: 1, lecturerName: 'Dr. John Smith', status: 'completed', score: 95, date: '2024-01-15' },
        { id: 2, lecturerName: 'Dr. Sarah Johnson', status: 'pending', score: null, date: null },
        { id: 3, lecturerName: 'Dr. Michael Brown', status: 'completed', score: 90, date: '2024-01-10' }
      ]);
    } else if (user?.role === 'lecturer') {
      setPerformanceData({
        overallScore: 88,
        categoryScores: {
          teaching: 92,
          research: 85,
          service: 88,
          professional: 85
        },
        evaluations: [
          { evaluator: 'HOD - Dr. Jane Wilson', date: '2024-01-20', score: 90, feedback: 'Excellent performance in teaching and research activities.' },
          { evaluator: 'Dean - Prof. Robert Davis', date: '2024-01-15', score: 86, feedback: 'Good contribution to department service activities.' }
        ],
        kpiProgress: [
          { name: 'Course Delivery', target: 100, achieved: 95, status: 'on-track' },
          { name: 'Research Publications', target: 3, achieved: 2, status: 'attention-needed' },
          { name: 'Student Supervision', target: 5, achieved: 6, status: 'exceeds' }
        ]
      });
    } else if (user?.role === 'dean' || user?.role === 'admin') {
      // Set comprehensive reports for dean and admin
      setReportData({
        performance: {
          overall: {
            totalEvaluations: 124,
            completedEvaluations: 98,
            avgScore: 87,
            pendingEvaluations: 26
          },
          byDepartment: [
            { name: 'Computer Science', score: 88 },
            { name: 'Information Technology', score: 82 },
            { name: 'Information Systems', score: 90 },
            { name: 'Cybersecurity', score: 85 }
          ],
          byCategory: [
            { name: 'Teaching', score: 89 },
            { name: 'Research', score: 86 },
            { name: 'Service', score: 84 },
            { name: 'Administration', score: 88 }
          ],
          trends: [
            { period: 'Q1', score: 84 },
            { period: 'Q2', score: 86 },
            { period: 'Q3', score: 87 },
            { period: 'Q4', score: 87 }
          ],
          topPerformers: [
            { name: 'Dr. Alice Cooper', department: 'IS', score: 96 },
            { name: 'Prof. Bob Wilson', department: 'CS', score: 94 },
            { name: 'Dr. Carol Davis', department: 'Cyber', score: 93 }
          ]
        }
      });
    }
  };
  const renderDateRangeSelector = () => (
    <div className="date-range-selector">
      <div className="date-input-group">
        <label>From:</label>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
          className="date-input"
        />
      </div>
      <div className="date-input-group">
        <label>To:</label>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
          className="date-input"
        />
      </div>
    </div>
  );

  const renderHODReports = () => (
    <>
      {user.role === 'hod' && (
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Department Reports
          </button>
          <button 
            className={`tab-btn ${activeTab === 'evaluations' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluations')}
          >
            Evaluations ({evaluationsData.length})
          </button>
        </div>
      )}
      
      {activeTab === 'reports' && reportData?.performance && (
        <div className="performance-report">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>{reportData.performance.overall.totalEvaluations}</h3>
                <p>Total Evaluations</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">✅</div>
              <div className="summary-content">
                <h3>{reportData.performance.overall.completedEvaluations}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h3>{reportData.performance.overall.avgScore}%</h3>
                <p>Average Score</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">⏳</div>
              <div className="summary-content">
                <h3>{reportData.performance.overall.pendingEvaluations}</h3>
                <p>Pending</p>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="charts-grid">
            <div className="card chart-card">
              <div className="card-header">
                <h3 className="card-title">Performance by Department</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reportData.performance.byDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#11486B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card chart-card">
              <div className="card-header">
                <h3 className="card-title">Performance by Category</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reportData.performance.byCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, score }) => `${name}: ${score}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="score"
                    >
                      {reportData.performance.byCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#11486B', '#8884d8', '#82ca9d', '#ffc658'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card chart-card full-width">
              <div className="card-header">
                <h3 className="card-title">Performance Trend</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.performance.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#11486B" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Top Performers */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Top Performers</h3>
            </div>
            <div className="performers-list">
              {reportData.performance.topPerformers.map((performer, index) => (
                <div key={index} className="performer-item">
                  <div className="performer-rank">#{index + 1}</div>
                  <div className="performer-info">
                    <strong>{performer.name}</strong>
                    <span className="performer-department">{performer.department}</span>
                  </div>
                  <div className="performer-score">{performer.score}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'evaluations' && (
        <div className="evaluations-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lecturer Evaluations</h3>
              <p>Manage and review evaluations for your department lecturers</p>
            </div>
            <div className="evaluations-list">
              {evaluationsData.map(evaluation => (
                <div key={evaluation.id} className="evaluation-item">
                  <div className="evaluation-info">
                    <h4>{evaluation.lecturerName}</h4>
                    <span className="evaluation-date">
                      {evaluation.date ? `Evaluated: ${new Date(evaluation.date).toLocaleDateString()}` : 'Not yet evaluated'}
                    </span>
                  </div>
                  <div className="evaluation-status">
                    {evaluation.status === 'completed' ? (
                      <span className="status-badge completed">Score: {evaluation.score}%</span>
                    ) : (
                      <span className="status-badge pending">Pending Review</span>
                    )}
                  </div>
                  <div className="evaluation-actions">
                    <button className="btn btn-sm btn-primary">
                      {evaluation.status === 'completed' ? 'Review' : 'Evaluate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderLecturerPerformance = () => (
    <div className="lecturer-performance">
      {performanceData && (
        <>
          <div className="performance-overview">
            <div className="overview-card overall-score">
              <h3>Overall Performance</h3>
              <div className="score-circle">
                <span className="score-number">{performanceData.overallScore}%</span>
              </div>
            </div>
            
            <div className="category-scores">
              {Object.entries(performanceData.categoryScores).map(([category, score]) => (
                <div key={category} className="category-card">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${score}%` }}></div>
                    <span className="score-text">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="evaluations-received">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Evaluations</h3>
              </div>
              <div className="evaluations-list">
                {performanceData.evaluations.map((evaluation, index) => (
                  <div key={index} className="evaluation-item">
                    <div className="evaluation-header">
                      <div className="evaluator-info">
                        <h4>{evaluation.evaluator}</h4>
                        <span className="evaluation-date">{new Date(evaluation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="evaluation-score">
                        <span className="score-badge">{evaluation.score}%</span>
                      </div>
                    </div>
                    <div className="evaluation-feedback">
                      <p>{evaluation.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="kpi-progress">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">KPI Progress</h3>
              </div>
              <div className="kpi-list">
                {performanceData.kpiProgress.map((kpi, index) => (
                  <div key={index} className="kpi-item">
                    <div className="kpi-info">
                      <h4>{kpi.name}</h4>
                      <div className="kpi-progress-bar">
                        <div 
                          className="kpi-progress-fill" 
                          style={{ width: `${Math.min((kpi.achieved / kpi.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="kpi-numbers">{kpi.achieved} / {kpi.target}</span>
                    </div>
                    <div className={`kpi-status ${kpi.status}`}>
                      {kpi.status === 'on-track' && '✓'}
                      {kpi.status === 'attention-needed' && '⚠'}
                      {kpi.status === 'exceeds' && '🎯'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="reports-root">
      <div className="reports-header">
        <h1>
          {user.role === 'hod' && 'Department Reports & Evaluations'}
          {user.role === 'lecturer' && 'My Performance Dashboard'}
          {user.role === 'dean' && 'Faculty Reports'}
          {user.role === 'admin' && 'System Reports'}
        </h1>
        {renderDateRangeSelector()}
      </div>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error && !reportData && !performanceData ? (
        <div className="error">{error}</div>
      ) : (
        <div className="reports-content">
          {user.role === 'hod' && renderHODReports()}
          {user.role === 'lecturer' && renderLecturerPerformance()}
          {(user.role === 'dean' || user.role === 'admin') && reportData?.performance && (
            <div className="comprehensive-reports">
              {/* Similar structure to HOD reports but with faculty-wide data */}
              {renderHODReports()}
            </div>
          )}
          
          {!reportData && !performanceData && (
            <div className="no-data">
              <div className="no-data-icon">📊</div>
              <h3>No Data Available</h3>
              <p>Please select a date range to view data.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
