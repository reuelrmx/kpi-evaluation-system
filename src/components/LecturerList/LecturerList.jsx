import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LecturerList.css';

const LecturerList = ({ user }) => {
  const [lecturers, setLecturers] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  // Mock lecturer data
  const mockLecturers = [
    {
      id: 1,
      name: 'Mr. Raymose Banda',
      email: 'rbanda@cbu.ac.zm',
      department: 'Computer Science',
      position: 'Lecturer',
      joinDate: '2020-03-15',
      assignedKPIs: 4,
      completedKPIs: 3,
      averageScore: 78.5,
      status: 'active',
      lastEvaluation: '2024-06-15',
      phone: '+260-97-1234567',
      officeLocation: 'CS-204'
    },
    {
      id: 2,
      name: 'Ms. Comfort Chiwele',
      email: 'cchiwele@cbu.ac.zm',
      department: 'Computer Science',
      position: 'Senior Lecturer',
      joinDate: '2018-08-20',
      assignedKPIs: 5,
      completedKPIs: 4,
      averageScore: 82.3,
      status: 'active',
      lastEvaluation: '2024-06-10',
      phone: '+260-97-2345678',
      officeLocation: 'CS-205'
    },
    {
      id: 3,
      name: 'Mr. Ruel Mumba',
      email: 'rmumba@cbu.ac.zm',
      department: 'Information Systems',
      position: 'Lecturer',
      joinDate: '2019-01-10',
      assignedKPIs: 3,
      completedKPIs: 2,
      averageScore: 75.8,
      status: 'active',
      lastEvaluation: '2024-05-28',
      phone: '+260-97-3456789',
      officeLocation: 'IS-301'
    },
    {
      id: 4,
      name: 'Ms. Kalenga Soneka',
      email: 'ksoneka@cbu.ac.zm',
      department: 'Information Technology',
      position: 'Assistant Lecturer',
      joinDate: '2021-09-05',
      assignedKPIs: 3,
      completedKPIs: 3,
      averageScore: 80.1,
      status: 'active',
      lastEvaluation: '2024-06-20',
      phone: '+260-97-4567890',
      officeLocation: 'IT-102'
    },
    {
      id: 5,
      name: 'Dr. John Smith',
      email: 'jsmith@cbu.ac.zm',
      department: 'Computer Science',
      position: 'Associate Professor',
      joinDate: '2015-02-12',
      assignedKPIs: 6,
      completedKPIs: 5,
      averageScore: 88.7,
      status: 'active',
      lastEvaluation: '2024-06-05',
      phone: '+260-97-5678901',
      officeLocation: 'CS-301'
    },
    {
      id: 6,
      name: 'Ms. Sarah Johnson',
      email: 'sjohnson@cbu.ac.zm',
      department: 'Information Systems',
      position: 'Lecturer',
      joinDate: '2020-11-18',
      assignedKPIs: 4,
      completedKPIs: 2,
      averageScore: 72.4,
      status: 'on_leave',
      lastEvaluation: '2024-04-15',
      phone: '+260-97-6789012',
      officeLocation: 'IS-205'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchLecturers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLecturers(mockLecturers);
      setFilteredLecturers(mockLecturers);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDepartments = () => {
    const departments = [...new Set(lecturers.map(l => l.department))];
    return departments.sort();
  };

  if (loading) {
    return (
      <div className="lecturer-list-container">
        <div className="loading">Loading lecturers...</div>
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
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>Showing {filteredLecturers.length} of {lecturers.length} lecturers</p>
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
                    {lecturer.averageScore}%
                  </span>
                  <span className="metric-label">Avg Score</span>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(lecturer.completedKPIs / lecturer.assignedKPIs) * 100}%`,
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
              {(user.role === 'admin' || user.role === 'supervisor') && (
                <>
                  <button className="btn btn-outline btn-sm">
                    Assign KPIs
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    Evaluate
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredLecturers.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No lecturers found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default LecturerList;