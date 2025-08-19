import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Reports.css';

const Reports = ({ user }) => {
  const [reportType, setReportType] = useState('performance');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Mock report data
  const mockReportData = {
    performance: {
      overall: {
        averageScore: 78.5,
        totalLecturers: 24,
        completedEvaluations: 18,
        pendingEvaluations: 6
      },
      byDepartment: [
        { name: 'Computer Science', score: 82.3, lecturers: 8 },
        { name: 'Information Systems', score: 76.8, lecturers: 7 },
        { name: 'Information Technology', score: 74.2, lecturers: 9 }
      ],
      byCategory: [
        { name: 'Teaching', score: 85.2, weight: 40 },
        { name: 'Research', score: 72.8, weight: 25 },
        { name: 'Service', score: 79.5, weight: 20 },
        { name: 'Administration', score: 76.0, weight: 15 }
      ],
      trends: [
        { period: 'Jan 2024', score: 76.2 },
        { period: 'Feb 2024', score: 77.8 },
        { period: 'Mar 2024', score: 78.5 },
        { period: 'Apr 2024', score: 79.2 },
        { period: 'May 2024', score: 78.1 },
        { period: 'Jun 2024', score: 78.5 }
      ],
      topPerformers: [
        { name: 'Dr. John Smith', score: 88.7, department: 'Computer Science' },
        { name: 'Ms. Comfort Chiwele', score: 82.3, department: 'Computer Science' },
        { name: 'Ms. Kalenga Soneka', score: 80.1, department: 'Information Technology' }
      ]
    },
    kpi: {
      summary: {
        totalKPIs: 12,
        activeKPIs: 10,
        completedKPIs: 8,
        averageCompletion: 75.5
      },
      byCategory: [
        { name: 'Teaching', total: 4, completed: 3, percentage: 75 },
        { name: 'Research', total: 3, completed: 2, percentage: 67 },
        { name: 'Service', total: 3, completed: 2, percentage: 67 },
        { name: 'Administration', total: 2, completed: 1, percentage: 50 }
      ],
      compliance: [
        { department: 'Computer Science', compliance: 85 },
        { department: 'Information Systems', compliance: 72 },
        { department: 'Information Technology', compliance: 68 }
      ]
    },
    individual: {
      lecturer: {
        name: user.role === 'lecturer' ? user.name : 'Mr. Raymose Banda',
        overallScore: 78.5,
        kpiProgress: [
          { kpi: 'Course Delivery', target: 85, current: 78, category: 'teaching' },
          { kpi: 'Research Output', target: 2, current: 1, category: 'research' },
          { kpi: 'Student Supervision', target: 3, current: 2, category: 'service' },
          { kpi: 'Meeting Participation', target: 80, current: 90, category: 'service' }
        ],
        monthlyProgress: [
          { month: 'Jan', score: 72 },
          { month: 'Feb', score: 75 },
          { month: 'Mar', score: 78 },
          { month: 'Apr', score: 76 },
          { month: 'May', score: 80 },
          { month: 'Jun', score: 78.5 }
        ]
      }
    }
  };

  useEffect(() => {
    loadReportData();
  }, [reportType, selectedPeriod, selectedDepartment]);

  const loadReportData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setReportData(mockReportData);
    setLoading(false);
  };

  const exportToPDF = async () => {
    setGeneratingPDF(true);
    
    try {
      const element = document.getElementById('report-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    
    setGeneratingPDF(false);
  };

  const COLORS = ['#11486B', '#1a5a7a', '#4a90a4', '#7bb3c7', '#adc8d6'];

  if (loading) {
    return (
      <div className="reports-container">
        <div className="loading">Loading report data...</div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>Generate and view performance reports</p>
      </div>

      {/* Report Controls */}
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="control-select"
          >
            <option value="performance">Performance Report</option>
            <option value="kpi">KPI Analysis</option>
            {user.role === 'lecturer' && (
              <option value="individual">My Performance</option>
            )}
          </select>
        </div>

        <div className="control-group">
          <label>Time Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="control-select"
          >
            <option value="current">Current Semester</option>
            <option value="previous">Previous Semester</option>
            <option value="yearly">Academic Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {(user.role === 'admin' || user.role === 'supervisor') && (
          <div className="control-group">
            <label>Department:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="control-select"
            >
              <option value="all">All Departments</option>
              <option value="computer-science">Computer Science</option>
              <option value="information-systems">Information Systems</option>
              <option value="information-technology">Information Technology</option>
            </select>
          </div>
        )}

        <div className="control-actions">
          <button 
            className="btn btn-primary"
            onClick={exportToPDF}
            disabled={generatingPDF}
          >
            {generatingPDF ? 'Generating...' : '📄 Export PDF'}
          </button>
          <button className="btn btn-outline">
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="report-content">
        {reportType === 'performance' && reportData && (
          <div className="performance-report">
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <h3>{reportData.performance.overall.averageScore}%</h3>
                  <p>Average Score</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">👥</div>
                <div className="summary-content">
                  <h3>{reportData.performance.overall.totalLecturers}</h3>
                  <p>Total Lecturers</p>
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        {reportType === 'kpi' && reportData && (
          <div className="kpi-report">
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon">📋</div>
                <div className="summary-content">
                  <h3>{reportData.kpi.summary.totalKPIs}</h3>
                  <p>Total KPIs</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">✅</div>
                <div className="summary-content">
                  <h3>{reportData.kpi.summary.completedKPIs}</h3>
                  <p>Completed</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-icon">📈</div>
                <div className="summary-content">
                  <h3>{reportData.kpi.summary.averageCompletion}%</h3>
                  <p>Avg Completion</p>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">KPI Completion by Category</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reportData.kpi.byCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#11486B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">Department Compliance</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reportData.kpi.compliance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="compliance" fill="#27ae60" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'individual' && reportData && (
          <div className="individual-report">
            <div className="report-header">
              <h2>Performance Report: {reportData.individual.lecturer.name}</h2>
              <p>Individual performance analysis</p>
            </div>

            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon">🎯</div>
                <div className="summary-content">
                  <h3>{reportData.individual.lecturer.overallScore}%</h3>
                  <p>Overall Score</p>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">KPI Progress</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reportData.individual.lecturer.kpiProgress.map(kpi => ({
                      name: kpi.kpi,
                      progress: (kpi.current / kpi.target) * 100,
                      target: 100
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="progress" fill="#11486B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3 className="card-title">Monthly Progress</h3>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={reportData.individual.lecturer.monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#11486B" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;