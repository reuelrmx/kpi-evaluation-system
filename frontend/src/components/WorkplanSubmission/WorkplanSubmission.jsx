import React, { useState } from "react";
import "./WorkplanSubmission.css";

const WorkplanSubmission = ({ user }) => {
  const [workplan, setWorkplan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workplan.trim()) {
      alert("Please enter your workplan before submitting.");
      return;
    }

    if (user.role === "lecturer") {
      alert("Workplan submitted to HOD successfully!");
    } else if (user.role === "hod") {
      alert("Workplan submitted to Dean successfully!");
    } else {
      alert("Only lecturers and HODs can submit workplans.");
    }

    setWorkplan("");
  };

  return (
    <div className="workplan-submission-container">
      <h2>Workplan Submission</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={workplan}
          onChange={(e) => setWorkplan(e.target.value)}
          placeholder="Enter your workplan here..."
        />
        <button type="submit">Submit Workplan</button>
      </form>
    </div>
  );
};

export default WorkplanSubmission;
