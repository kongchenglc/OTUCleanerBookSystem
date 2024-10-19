// MainPage.jsx
import React, { useState } from "react";
import Header from "./Header";
import FilterSection from "./FilterSection";
import JobGrid from "./JobGrid";
import "./MainPage.css";

const MainPage = () => {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="main-page">
      <Header />
      <div className="content">
        <FilterSection onFilterChange={handleFilterChange} />
        <JobGrid filters={filters} />
      </div>
    </div>
  );
};

export default MainPage;
