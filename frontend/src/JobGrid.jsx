// JobGrid.jsx
import React, { useState, useEffect } from "react";
import "./JobGrid.css";

const JobGrid = ({ filters }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?._id;

  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

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
        setAllJobs(result.data || []);
        setFilteredJobs(result.data || []);
      } catch (error) {
        console.error("Detailed Error:", error);
      }
    };

    fetchJobs();
  }, [userId]);

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

    const bookingData = {
      landlordId: "landlord-id-here",
      cleanerId: userId,
      service: {
        serviceId: selectedJob._id,
        name: selectedJob.name,
        rate: selectedJob.basePrice,
      },
      bookingDate: new Date().toISOString(),
      totalPrice: selectedJob.basePrice,
      specialInstructions: "Add any special instructions here",
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/booking/createBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        console.log("Booking created successfully");
        alert("Booking created successfully");
      } else {
        const errorText = await response.text();
        console.error("Failed to create booking:", errorText);
        alert(`Failed to create booking: ${errorText}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(`Error creating booking: ${error.message}`);
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
