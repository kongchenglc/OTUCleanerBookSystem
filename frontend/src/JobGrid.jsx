import React, { useState, useEffect } from "react";
import "./JobGrid.css";

const JobGrid = ({ filters }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?._id;

  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from the backend and filter by status
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/services/getAllServices`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error fetching jobs:", errorText);
          throw new Error(`Error fetching jobs: ${errorText}`);
        }

        const result = await response.json();
        // Filter jobs by status "waiting cleaner"
        const waitingCleanerJobs = result.data.filter((job) => job.status === "waiting cleaner");
        setAllJobs(waitingCleanerJobs);
        setFilteredJobs(waitingCleanerJobs);
      } catch (error) {
        console.error("Detailed Error:", error);
      }
    };

    fetchJobs();
  }, [userId]);

  // Filter jobs based on user input
  useEffect(() => {
    const updatedJobs = allJobs.filter((job) => {
      const titleMatch = filters.title
        ? job.name.toLowerCase().includes(filters.title.toLowerCase())
        : true;

      const minPriceMatch = filters.minPrice
        ? job.basePrice >= parseFloat(filters.minPrice)
        : true;

      const maxPriceMatch = filters.maxPrice
        ? job.basePrice <= parseFloat(filters.maxPrice)
        : true;

      const durationMatch = filters.duration
        ? parseInt(job.duration) <= parseInt(filters.duration)
        : true;

      return titleMatch && minPriceMatch && maxPriceMatch && durationMatch;
    });

    setFilteredJobs(updatedJobs);
  }, [filters, allJobs]);

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const handleGetJob = async () => {
    if (!selectedJob) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/services/${selectedJob._id}/choose`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        console.log("Job status updated to 'in progress'");
        alert("Job has been successfully claimed and is now in progress.");
        // Optionally refresh job list after successful action
        setAllJobs(allJobs.filter((job) => job._id !== selectedJob._id));
        setFilteredJobs(filteredJobs.filter((job) => job._id !== selectedJob._id));
        setSelectedJob(null);
      } else {
        const errorText = await response.text();
        console.error("Failed to update job status:", errorText);
        alert(`Failed to update job status: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      alert(`Error updating job status: ${error.message}`);
    }
  };

  return (
    <div className="job-grid">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <div
            key={job._id}
            className={`job-card ${selectedJob?._id === job._id ? "selected" : ""}`}
            onClick={() => handleJobClick(job)}
          >
            <h3>{job.name}</h3>
            <p>{job.description}</p>
            <p>Price: {job.basePrice}</p>
            <p>Duration: {job.duration} hours</p>
            {selectedJob?._id === job._id && (
              <button className="get-job-button" onClick={handleGetJob}>
                Get Job
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
};

export default JobGrid;
