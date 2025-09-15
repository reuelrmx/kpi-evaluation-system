// src/components/HODDashboard/HODWorkplanReview.jsx
import React, { useState } from "react";
import { Card, CardContent } from "../common/Card";
import { Button } from "../common/Button";          

const HODWorkplanReview = () => {
  const [selectedWorkplan, setSelectedWorkplan] = useState(null);

  const mockWorkplans = [
    { id: 1, lecturer: "John Doe", title: "AI Research Plan", status: "Pending" },
    { id: 2, lecturer: "Jane Smith", title: "Cybersecurity Curriculum", status: "Approved" },
  ];

  const handleReview = (workplan) => {
    setSelectedWorkplan(workplan);
  };

  const handleApprove = () => {
    if (selectedWorkplan) {
      alert(`Workplan "${selectedWorkplan.title}" approved ✅`);
      setSelectedWorkplan(null);
    }
  };

  const handleReject = () => {
    if (selectedWorkplan) {
      alert(`Workplan "${selectedWorkplan.title}" rejected ❌`);
      setSelectedWorkplan(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Workplan Review</h2>
      <div className="grid gap-4">
        {mockWorkplans.map((workplan) => (
          <Card key={workplan.id}>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Lecturer:</strong> {workplan.lecturer}</p>
                  <p><strong>Title:</strong> {workplan.title}</p>
                  <p><strong>Status:</strong> {workplan.status}</p>
                </div>
                <Button onClick={() => handleReview(workplan)}>Review</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedWorkplan && (
        <div className="mt-6 p-4 border rounded-lg shadow bg-gray-50">
          <h3 className="font-semibold mb-2">
            Reviewing: {selectedWorkplan.title}
          </h3>
          <div className="flex gap-3">
            <Button onClick={handleApprove} className="bg-green-600 text-white">
              Approve
            </Button>
            <Button onClick={handleReject} className="bg-red-600 text-white">
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODWorkplanReview;
