import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";
import apiService from "../../utils/api";

// 🔹 Format backend response into the same shape as mock data
const formatDashboardData = (backendData) => {
  return {
    stats: {
      totalLecturers: backendData.lecturerCount,
      totalKPIs: backendData.kpiCount,
      completedEvaluations: backendData.evaluationCount,
      pendingEvaluations: backendData.pending || 0,
      averageScore: backendData.avgScore || 0,
    },
    performanceData: backendData.performance
      ? backendData.performance.map((p) => ({
          name: p.month,
          score: p.score,
        }))
      : [],
    recentActivity: backendData.recentEvaluations
      ? backendData.recentEvaluations.map((ev, i) => ({
          id: i + 1,
          action: `Lecturer #${ev.lecturerId} scored ${ev.score}`,
          time: ev.date,
          type: "complete",
        }))
      : [],
  };
};

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [myKpiAssignments, setMyKpiAssignments] = useState([]);
  const [workplansSubmittedToMe, setWorkplansSubmittedToMe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch general dashboard data
        const data = await apiService.getDashboard();
        const formatted = formatDashboardData(data);
        setStats(formatted.stats);
        setPerformanceData(formatted.performanceData);
        setRecentActivity(formatted.recentActivity);
        
        // Fetch Dean-specific data if user is Dean
        if (user && user.role === 'dean') {
          const assignments = await apiService.getMyKpiAssignments();
          setMyKpiAssignments(assignments);
          
          const workplans = await apiService.getWorkplansSubmittedToMe();
          setWorkplansSubmittedToMe(workplans);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const getActivityIcon = (type) => {
    switch (type) {
      case "create":
        return "➕";
      case "complete":
        return "✅";
      case "submit":
        return "📤";
      case "update":
        return "🔄";
      case "assign":
        return "📋";
      case "approve":
        return "👍";
      default:
        return "📄";
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container p-6">
      {/* Header */}
      <div className="dashboard-header mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-gray-600">
            Here’s your performance overview and recent activity.
          </p>
        </div>
        <div className="text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="stat-card bg-white p-4 rounded-xl shadow">
          <div className="text-2xl">👥</div>
          <h3 className="text-lg font-bold">{stats.totalLecturers}</h3>
          <p>Total Lecturers</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-xl shadow">
          <div className="text-2xl">📊</div>
          <h3 className="text-lg font-bold">{stats.totalKPIs}</h3>
          <p>Total KPIs</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-xl shadow">
          <div className="text-2xl">✅</div>
          <h3 className="text-lg font-bold">{stats.completedEvaluations}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card bg-white p-4 rounded-xl shadow">
          <div className="text-2xl">⏳</div>
          <h3 className="text-lg font-bold">{stats.pendingEvaluations}</h3>
          <p>Pending</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-content grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="card bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Performance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#11486B"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="card bg-white p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="activity-list space-y-2">
            {recentActivity.length === 0 ? (
              <p>No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="activity-item flex items-center space-x-3 border-b pb-2"
                >
                  <div className="activity-icon text-xl">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p>{activity.action}</p>
                    <span className="text-sm text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Dean-specific sections */}
      {user && user.role === 'dean' && (
        <>
          {/* My KPI Assignments */}
          <div className="card bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">📋 My KPI Assignments</h2>
            <div className="overflow-x-auto">
              {myKpiAssignments.length === 0 ? (
                <p className="text-gray-500">No KPI assignments found</p>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">KPI Title</th>
                      <th className="text-left py-2 px-4">Description</th>
                      <th className="text-left py-2 px-4">Weight</th>
                      <th className="text-left py-2 px-4">Academic Year</th>
                      <th className="text-left py-2 px-4">Semester</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myKpiAssignments.map((assignment) => (
                      <tr key={assignment.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{assignment.kpi?.title}</td>
                        <td className="py-2 px-4">{assignment.kpi?.description}</td>
                        <td className="py-2 px-4">{(assignment.kpi?.weight * 100).toFixed(1)}%</td>
                        <td className="py-2 px-4">{assignment.academicYear}</td>
                        <td className="py-2 px-4">{assignment.semester}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          {/* Workplans Submitted to Me */}
          <div className="card bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">📤 Workplans Submitted to Me</h2>
            <div className="overflow-x-auto">
              {workplansSubmittedToMe.length === 0 ? (
                <p className="text-gray-500">No workplans submitted to you</p>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">From</th>
                      <th className="text-left py-2 px-4">Period</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Submitted At</th>
                      <th className="text-left py-2 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workplansSubmittedToMe.map((workplan) => (
                      <tr key={workplan.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{workplan.lecturer?.fullName}</td>
                        <td className="py-2 px-4">
                          {new Date(workplan.periodStart).toLocaleDateString()} - {new Date(workplan.periodEnd).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            workplan.status === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                            workplan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            workplan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {workplan.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">{new Date(workplan.submittedAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-2">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Quick Actions */}
      <div className="card bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="quick-actions flex flex-wrap gap-4">
          {user && (user.role === 'admin' || user.role === 'hod' || user.role === 'dean') && (
            <Link to="/lecturers" className="action-btn px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
              👥 Manage Lecturers
            </Link>
          )}
          {user && (user.role === 'admin' || user.role === 'hod' || user.role === 'dean') && (
            <Link to="/kpi-management" className="action-btn px-4 py-2 bg-green-600 text-white rounded-lg shadow">
              📊 Manage KPIs
            </Link>
          )}
          {user && user.role === 'dean' && (
            <Link to="/assign-kpis" className="action-btn px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">
              🎯 Assign KPIs to HODs
            </Link>
          )}
          <Link to="/workplan" className="action-btn px-4 py-2 bg-yellow-600 text-white rounded-lg shadow">
            📝 {user && user.role === 'dean' ? 'Submit Workplan to Admin' : 'My Workplan'}
          </Link>
          <Link to="/reports" className="action-btn px-4 py-2 bg-purple-600 text-white rounded-lg shadow">
            📄 Generate Report
          </Link>
        </div>
      </div>
    </div>
  );
}
