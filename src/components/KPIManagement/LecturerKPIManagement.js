import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './KPIManagement.css';

// You can import mock data or receive it as props if needed
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

const getCategoryColor = (category) => {
  const colors = {
    teaching: '#11486B',
    research: '#e74c3c',
    service: '#27ae60',
    administration: '#f39c12'
  };
  return colors[category] || '#11486B';
};

const LecturerKPIManagement = () => {
  const { lecturerId } = useParams();
  const [lecturer, setLecturer] = useState(null);
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    // Fetch lecturer and KPIs (replace with API calls if needed)
    const foundLecturer = mockLecturers.find(l => l.id === parseInt(lecturerId));
    setLecturer(foundLecturer);

    // Filter KPIs assigned to this lecturer
    const assignedKPIs = mockKPIs.filter(kpi => kpi.assignedTo.includes(parseInt(lecturerId)));
    setKpis(assignedKPIs);
  }, [lecturerId]);

  if (!lecturer) {
    return <div className="kpi-management-container"><p>Lecturer not found.</p></div>;
  }

  return (
    <div className="kpi-management-container">
      <div className="page-header">
        <h1>KPI Management for {lecturer.name}</h1>
        <p>Department: {lecturer.department}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Assigned KPIs</h2>
        </div>
        {kpis.length === 0 ? (
          <div className="no-assignments">No KPIs assigned to this lecturer.</div>
        ) : (
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerKPIManagement;