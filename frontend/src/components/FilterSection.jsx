// FilterSection.jsx
import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    price: "",
    area: "",
    workHours: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="filter-section">
      <div className="filter-title">Filter</div>
      <div className="filter-option">
        <label>Price: </label>
        <select name="price" onChange={handleChange}>
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="filter-option">
        <label>Area: </label>
        <input
          type="text"
          name="area"
          placeholder="e.g. Downtown"
          onChange={handleChange}
        />
      </div>
      <div className="filter-option">
        <label>Work Hours: </label>
        <input
          type="number"
          name="workHours"
          placeholder="e.g. 5"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FilterSection;
