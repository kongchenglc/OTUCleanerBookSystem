// JobGrid.jsx
import React, { useState, useEffect } from "react";
import "./JobGrid.css";

const JobGrid = ({ filters }) => {
  const allJobs = [
    { id: 1, name: "Job 1", price: "low", area: "Downtown", workHours: 5 },
    { id: 2, name: "Job 2", price: "low", area: "Downtown", workHours: 8 },
    { id: 3, name: "Job 3", price: "low", area: "Downtown", workHours: 4 },
    { id: 4, name: "Job 4", price: "medium", area: "Suburb", workHours: 5 },
    { id: 5, name: "Job 5", price: "medium", area: "Suburb", workHours: 4 },
    { id: 6, name: "Job 6", price: "medium", area: "Suburb", workHours: 8 },
    { id: 7, name: "Job 7", price: "high", area: "Downtown", workHours: 5 },
    { id: 8, name: "Job 8", price: "high", area: "Downtown", workHours: 4 },
    { id: 9, name: "Job 9", price: "high", area: "Downtown", workHours: 8 },
    
  ];

  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  useEffect(() => {
    let updatedJobs = allJobs.filter((job) => {
      return (
        (filters.price ? job.price === filters.price : true) &&
        (filters.area ? job.area.toLowerCase().includes(filters.area.toLowerCase()) : true) &&
        (filters.workHours ? job.workHours <= filters.workHours : true)
      );
    });
    setFilteredJobs(updatedJobs);
  }, [filters]);

  return (
    <div className="job-grid">
      {filteredJobs.map((job) => (
        <div key={job.id} className="job-card">
          {job.name}
        </div>
      ))}
    </div>
  );
};

export default JobGrid;
