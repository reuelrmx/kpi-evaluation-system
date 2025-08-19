import React, { useState, useEffect } from 'react';
import './KPIManagement.css';

const KPIManagement = ({ user }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [kpis, setKpis] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingKPI, setEditingKPI] = useState(null);

  const [newKPI, setNewKPI] = useState({
    title: '',
    description: '',
    weight: '',
    category: 'teaching',
    targetValue: '',
    unit: 'percentage'
  });

  // Mock data
  const mockLecturers = [
    { id: 1, name: 'Mr. Raymose Banda', department: 'Computer Science' },
    { id: 2, name: 'Ms. Comfort Chiwele', department: 'Computer Science' },
    { id: 3, name: 'Mr. Ruel Mumba', department: 'Information Systems' },
    { id: 4, name: 'Ms. Kalenga Soneka', department: 'Information Technology' }
  ];

  const mockKPIs = [
    {
      id: 1,
      title: 'Publish Research Papers',
      description: 'Publish at least 2 peer-reviewed papers per year',
      weight: 20,
      category: 'research',
      targetValue: 2,
      unit: 'papers',
      assignedTo: [1, 2]
    },
    {
      id: 2,
      title: 'Course Delivery',
      description: 'Deliver assigned courses effectively',
      weight: 40,
      category: 'teaching',
      targetValue: 85,
      unit: 'percentage',
      assignedTo: [1, 3, 4]
    },
    {
      id: 3,
      title: 'Student Supervision',
      description: 'Supervise postgraduate students',
      weight: 15,
      category: 'service',
      targetValue: 3,
      unit: 'students',
      assignedTo: [2, 3]
    },
    {
      id: 4,
      title: 'Departmental Meetings',
      description: 'Participate in departmental meetings',
      weight: 10,
      category: 'service',
      targetValue: 80,
      unit: 'percentage',
      assignedTo: [1, 2, 3, 4]
    }
  ];

  useEffect(() => {
    setKpis(mockKPIs);
    setLecturers(mockLecturers);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewKPI(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateKPI = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const kpi = {
        id: Date.now(),
        ...newKPI,
        weight: parseInt(newKPI.weight),
        targetValue: parseFloat(newKPI.targetValue),
        assignedTo: []
      };
      
      setKpis(prev => [...prev, kpi]);
      setNewKPI({
        title: '',
        description: '',
        weight: '',
        category: 'teaching',
        targetValue: '',
        unit: 'percentage'
      });
      setLoading(false);
      alert('KPI created successfully!');
    }, 1000);
  };

  const handleEditKPI = (kpi) => {
    setEditingKPI(kpi);
    setNewKPI({
      title: kpi.title,
      description: kpi.description,
      weight: kpi.weight.toString(),
      category: kpi.category,
      targetValue: kpi.targetValue.toString(),
      unit: kpi.unit
    });
    setShowModal(true);
  };

  const handleUpdateKPI = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setKpis(prev => prev.map(kpi => 
        kpi.id === editingKPI.id 
          ? {
              ...kpi,
              ...newKPI,
              weight: parseInt(newKPI.weight),
              targetValue: parseFloat(newKPI.targetValue)
            }
          : kpi
      ));
      
      setShowModal(false);
      setEditingKPI(null);
      setNewKPI({
        title: '',
        description: '',
        weight: '',
        category: 'teaching',
        targetValue: '',
        unit: 'percentage'
      });
      setLoading(false);
      alert('KPI updated successfully!');
    }, 1000);
  };

  const handleDeleteKPI = (kpiId) => {
    if (window.confirm('Are you sure you want to delete this KPI?')) {
      setKpis(prev => prev.filter(kpi => kpi.id !== kpiId));
    }
  };

  const handleAssignKPI = (kpiId, lecturerId) => {
    setKpis(prev => prev.map(kpi => 
      kpi.id === kpiId 
        ? {
            ...kpi,
            assignedTo: kpi.assignedTo.includes(lecturerId) 
              ? kpi.assignedTo.filter(id => id !== lecturerId)
              : [...kpi.assignedTo, lecturerId]
          }
        : kpi
    ));
  };

  const getLecturerNames = (assignedIds) => {
    return assignedIds
      .map(id => lecturers.find(l => l.id === id)?.name)
      .filter(Boolean)
      .join(', ');
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

  return (
    <div className="kpi-management-container">
      <div className="page-header">
        <h1>KPI Management</h1>
        <p>Create, manage, and assign Key Performance Indicators</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create KPI
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage KPIs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'assign' ? 'active' : ''}`}
          onClick={() => setActiveTab('assign')}
        >
          Assign KPIs
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Create New KPI</h2>
            </div>
            
            <form onSubmit={handleCreateKPI}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">KPI Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newKPI.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter KPI title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={newKPI.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="teaching">Teaching</option>
                    <option value="research">Research</option>
                    <option value="service">Service</option>
                    <option value="administration">Administration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Weight (%)</label>
                  <input
                    type="number"
                    name="weight"
                    value={newKPI.weight}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter weight percentage"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Value</label>
                  <input
                    type="number"
                    name="targetValue"
                    value={newKPI.targetValue}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter target value"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select
                    name="unit"
                    value={newKPI.unit}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="papers">Papers</option>
                    <option value="students">Students</option>
                    <option value="courses">Courses</option>
                    <option value="hours">Hours</option>
                    <option value="projects">Projects</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={newKPI.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Enter detailed description of the KPI"
                  rows="4"
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Existing KPIs</h2>
            </div>

            <div className="kpi-grid">
              {kpis.map(kpi => (
                <div key={kpi.id} className="kpi-card">
                  <div className="kpi-header">
                    <div className="kpi-title">{kpi.title}</div>
                    <div 
                      className="kpi-category"
                      style={{ backgroundColor: getCategoryColor(kpi.category) }}
                    >
                      {kpi.category}
                    </div>
                  </div>
                  
                  <p className="kpi-description">{kpi.description}</p>
                  
                  <div className="kpi-details">
                    <div className="kpi-detail">
                      <strong>Weight:</strong> {kpi.weight}%
                    </div>
                    <div className="kpi-detail">
                      <strong>Target:</strong> {kpi.targetValue} {kpi.unit}
                    </div>
                    <div className="kpi-detail">
                      <strong>Assigned to:</strong> {kpi.assignedTo.length} lecturers
                    </div>
                  </div>

                  <div className="kpi-actions">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleEditKPI(kpi)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteKPI(kpi.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'assign' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Assign KPIs to Lecturers</h2>
            </div>

            <div className="assignment-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>KPI</th>
                    <th>Category</th>
                    <th>Weight</th>
                    <th>Assigned Lecturers</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.map(kpi => (
                    <tr key={kpi.id}>
                      <td>
                        <div className="kpi-info">
                          <strong>{kpi.title}</strong>
                          <small>{kpi.description}</small>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="category-badge"
                          style={{ backgroundColor: getCategoryColor(kpi.category) }}
                        >
                          {kpi.category}
                        </span>
                      </td>
                      <td>{kpi.weight}%</td>
                      <td>
                        <div className="assigned-lecturers">
                          {kpi.assignedTo.length > 0 ? (
                            <span>{getLecturerNames(kpi.assignedTo)}</span>
                          ) : (
                            <span className="no-assignments">No assignments</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="lecturer-checkboxes">
                          {lecturers.map(lecturer => (
                            <label key={lecturer.id} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={kpi.assignedTo.includes(lecturer.id)}
                                onChange={() => handleAssignKPI(kpi.id, lecturer.id)}
                              />
                              <span className="lecturer-name">{lecturer.name}</span>
                            </label>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit KPI</h3>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowModal(false);
                  setEditingKPI(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleUpdateKPI}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">KPI Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newKPI.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={newKPI.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="teaching">Teaching</option>
                    <option value="research">Research</option>
                    <option value="service">Service</option>
                    <option value="administration">Administration</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Weight (%)</label>
                  <input
                    type="number"
                    name="weight"
                    value={newKPI.weight}
                    onChange={handleInputChange}
                    className="form-input"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Value</label>
                  <input
                    type="number"
                    name="targetValue"
                    value={newKPI.targetValue}
                    onChange={handleInputChange}
                    className="form-input"
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select
                    name="unit"
                    value={newKPI.unit}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="papers">Papers</option>
                    <option value="students">Students</option>
                    <option value="courses">Courses</option>
                    <option value="hours">Hours</option>
                    <option value="projects">Projects</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={newKPI.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditingKPI(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update KPI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIManagement;