import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CsvToExcel from "./components/CsvToExcel";
import FilterByDate from "./components/FilterByDate";
import Navbar from "./components/Navbar";
import FilterAugmontReport from "./components/FilterAugmontReport";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<FilterByDate />} />
        <Route path="/csvtoexcel" element={<CsvToExcel />} />
        <Route path="/augmontreport" element={<FilterAugmontReport />} />
        <Route path="/contact" element={<h2>Contact Us</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
