// FilterSection.jsx
import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    title: "",
    minPrice: "",
    maxPrice: "",
    duration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="filter-section">
      <div className="filter-title">Filter</div>

      <div className="filter-option">
        <label>Job Title: </label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Cleaning"
          onChange={handleChange}
        />
      </div>

      <div className="filter-option">
        <label>Price Range: </label>
        <div className="price-range">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            onChange={handleChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="filter-option">
        <label>Duration (hours): </label>
        <input
          type="number"
          name="duration"
          placeholder="e.g. 3"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FilterSection;
