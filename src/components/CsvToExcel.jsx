import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CsvToExcel = () => {
  const [csvText, setCsvText] = useState("");

  const handleDownload = () => {
    try {
      const lines = csvText.trim().split("\n");
      const headers = lines[0].split(",");
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim();
          return obj;
        }, {});
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const data = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(data, "Transaction_Report.xlsx");
    } catch (error) {
      alert("Invalid CSV format!");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>CSV to Excel Converter</h2>
      <textarea
        rows="10"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        placeholder="Paste your CSV data here..."
        style={{ width: "100%", padding: "10px", fontFamily: "monospace" }}
      />
      <button
        onClick={handleDownload}
        style={{ marginTop: "10px", padding: "10px 20px" }}
      >
        Download Excel
      </button>
    </div>
  );
};

export default CsvToExcel;
