// JobGrid.jsx
import React, { useState, useEffect } from "react";
import "./JobGrid.css";

const JobGrid = ({ filters }) => {
  const allJobs = [
    { id: 1, name: "Job 1", price: "low", area: "Downtown", workHours: 5 },
    { id: 2, name: "Job 2", price: "medium", area: "Suburb", workHours: 8 },
    { id: 3, name: "Job 3", price: "high", area: "Downtown", workHours: 4 },
    // ... 添加更多的 job 数据
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
