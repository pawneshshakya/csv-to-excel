import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Container,
  Form,
  Button,
  Table,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

const CsvToExcel = () => {
  const [csvText, setCsvText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!csvText.trim()) {
      setFilteredData([]);
      return;
    }

    try {
      setError(null);

      const lines = csvText.trim().split("\n");
      const headers = lines[0].split(",");

      const rows = lines.slice(1).map((line) => {
        const values = line.split(",");
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim();
          return obj;
        }, {});
      });

      const filtered = rows.map((row) => ({
        CustomerRefNo: row.CustomerRefNo,
        Name: row.Name,
        TotalAmount: row.TotalAmount,
        TransactionID: row.TransactionID,
        partner_name: "",
        TransactionDateTime: `${row.TransactionDate},${row.TransactionTime}`,
        RRN: row.RRN,
        PampOrderId: row.PampOrderId,
        refinery: "MMTC",
      }));

      setFilteredData(filtered);
    } catch (err) {
      setError("Invalid CSV format! Please check your input.");
      setFilteredData([]);
    }
  }, [csvText]);

  const handleDownload = () => {
    if (filteredData.length === 0) {
      setError("No data to download!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "MMTC_Transaction_Report.xlsx");
  };

  return (
    <div className="my-3">
      <div className="justify-content-center">
        <div className="p-4 m-3 border rounded shadow bg-white">
          <h2 className="mb-4 text-center text-primary">
            CSV to Filtered Excel Converter
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Paste your CSV data below</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Paste your CSV data here..."
                style={{ fontFamily: "monospace" }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="success" onClick={handleDownload}>
                Download Filtered Excel
              </Button>
            </div>
          </Form>

          {filteredData.length > 0 && (
            <>
              <h4 className="mb-4 text-center text-primary">
                Filtered Data Preview
              </h4>
              <table className="table table-bordered table-hover text-center">
                <thead className="table-dark">
                  <tr>
                    <th>CustomerRefNo</th>
                    <th>Name</th>
                    <th>TotalAmount</th>
                    <th>TransactionID</th>
                    <th>partner_name</th>
                    <th>TransactionDateTime</th>
                    <th>RRN</th>
                    <th>PampOrderId</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.CustomerRefNo}</td>
                      <td>{row.Name}</td>
                      <td>{row.TotalAmount}</td>
                      <td>{row.TransactionID}</td>
                      <td>{row.partner_name}</td>
                      <td>{row.TransactionDateTime}</td>
                      <td>{row.RRN}</td>
                      <td>{row.PampOrderId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvToExcel;

// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { Container, Form, Button, Table, Alert } from "react-bootstrap";

// const CsvToExcel = () => {
//   const [csvText, setCsvText] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [error, setError] = useState(null);

//   // Parse CSV text and update filteredData
//   useEffect(() => {
//     if (!csvText.trim()) {
//       setFilteredData([]);
//       return;
//     }

//     try {
//       setError(null);

//       const lines = csvText.trim().split("\n");
//       const headers = lines[0].split(",");

//       const rows = lines.slice(1).map((line) => {
//         const values = line.split(",");
//         return headers.reduce((obj, header, index) => {
//           obj[header.trim()] = values[index]?.trim();
//           return obj;
//         }, {});
//       });

//       const filtered = rows.map((row) => ({
//         CustomerRefNo: row.CustomerRefNo,
//         Name: row.Name,
//         TotalAmount: row.TotalAmount,
//         TransactionID: row.TransactionID,
//         partner_name: "",
//         TransactionDateTime: `${row.TransactionDate},${row.TransactionTime}`,
//         RRN: row.RRN,
//         PampOrderId: row.PampOrderId,
//         refinery: "MMTC",
//       }));

//       setFilteredData(filtered);
//     } catch (err) {
//       setError("Invalid CSV format! Please check your input.");
//       setFilteredData([]);
//     }
//   }, [csvText]);

//   const handleDownload = () => {
//     if (filteredData.length === 0) {
//       setError("No data to download!");
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(filteredData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const data = new Blob([excelBuffer], {
//       type: "application/octet-stream",
//     });

//     saveAs(data, "MMTC_Transaction_Report.xlsx");
//   };

//   return (
//     <div className="d-flex flex-column align-items-center justify-content-center m-3 p-4 border rounded shadow bg-white">
//       <h2 className="mb-4 text-center text-primary">
//         CSV to Filtered Excel Converter
//       </h2>

//       {error && <Alert variant="danger">{error}</Alert>}

//       <Form>
//         <Form.Group className="mb-3">
//           <Form.Label>Paste your CSV data</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={8}
//             value={csvText}
//             onChange={(e) => setCsvText(e.target.value)}
//             placeholder="Paste your CSV data here..."
//             style={{ fontFamily: "monospace" }}
//           />
//         </Form.Group>
//         <div className="d-grid">
//           <Button variant="success" onClick={handleDownload}>
//             Download Filtered Excel
//           </Button>
//         </div>
//       </Form>

//       {filteredData.length > 0 && (
//         <>
//           <h4 className="mt-5">Filtered Data Preview</h4>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>CustomerRefNo</th>
//                 <th>Name</th>
//                 <th>TotalAmount</th>
//                 <th>TransactionID</th>
//                 <th>partner_name</th>
//                 <th>TransactionDateTime</th>
//                 <th>RRN</th>
//                 <th>PampOrderId</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.CustomerRefNo}</td>
//                   <td>{row.Name}</td>
//                   <td>{row.TotalAmount}</td>
//                   <td>{row.TransactionID}</td>
//                   <td>{row.partner_name}</td>
//                   <td>{row.TransactionDateTime}</td>
//                   <td>{row.RRN}</td>
//                   <td>{row.PampOrderId}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </>
//       )}
//     </div>
//   );
// };

// export default CsvToExcel;

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const CsvToExcel = () => {
//   const [csvText, setCsvText] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   const handleDownload = () => {
//     try {
//       const lines = csvText.trim().split("\n");
//       const headers = lines[0].split(",");
//       const rows = lines.slice(1).map((line) => {
//         const values = line.split(",");
//         return headers.reduce((obj, header, index) => {
//           obj[header.trim()] = values[index]?.trim();
//           return obj;
//         }, {});
//       });

//       const filtered = rows.map((row) => ({
//         CustomerRefNo: row.CustomerRefNo,
//         Name: row.Name,
//         TotalAmount: row.TotalAmount,
//         TransactionID: row.TransactionID,
//         partner_name: partner_name,
//         TransactionDateTime: `${row.TransactionDate},${row.TransactionTime}`,
//         RRN: row.RRN,
//         PampOrderId: row.PampOrderId,
//         refinery: "MMTC",
//       }));

//       setFilteredData(filtered); // Show in UI

//       const worksheet = XLSX.utils.json_to_sheet(filtered);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered");

//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       const data = new Blob([excelBuffer], {
//         type: "application/octet-stream",
//       });

//       saveAs(data, "Filtered_Transaction_Report.xlsx");
//     } catch (error) {
//       alert("Invalid CSV format!");
//       console.error(error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
//       <h2>CSV to Filtered Excel Converter</h2>
//       <textarea
//         rows="10"
//         value={csvText}
//         onChange={(e) => setCsvText(e.target.value)}
//         placeholder="Paste your CSV data here..."
//         style={{ width: "100%", padding: "10px", fontFamily: "monospace" }}
//       />
//       <button
//         onClick={handleDownload}
//         style={{ marginTop: "10px", padding: "10px 20px" }}
//       >
//         Download Filtered Excel
//       </button>

//       {filteredData.length > 0 && (
//         <div style={{ marginTop: "30px" }}>
//           <h3>Filtered Data:</h3>
//           <table border="1" cellPadding="5" style={{ width: "100%" }}>
//             <thead>
//               <tr>
//                 <th>CustomerRefNo</th>
//                 <th>Name</th>
//                 <th>TotalAmount</th>
//                 <th>TransactionID</th>
//                 <th>partner_name</th>
//                 <th>TransactionDateTime</th>
//                 <th>RRN</th>
//                 <th>PampOrderId</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.CustomerRefNo}</td>
//                   <td>{row.Name}</td>
//                   <td>{row.TotalAmount}</td>
//                   <td>{row.TransactionID}</td>
//                   <td>{row.partner_name}</td>
//                   <td>{row.TransactionDateTime}</td>
//                   <td>{row.RRN}</td>
//                   <td>{row.PampOrderId}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CsvToExcel;

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const CsvToExcel = () => {
//   const [csvText, setCsvText] = useState("");

//   const handleDownload = () => {
//     try {
//       const lines = csvText.trim().split("\n");
//       const headers = lines[0].split(",");
//       const rows = lines.slice(1).map((line) => {
//         const values = line.split(",");
//         return headers.reduce((obj, header, index) => {
//           obj[header.trim()] = values[index]?.trim();
//           return obj;
//         }, {});
//       });

//       const worksheet = XLSX.utils.json_to_sheet(rows);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       const data = new Blob([excelBuffer], {
//         type: "application/octet-stream",
//       });

//       saveAs(data, "Transaction_Report.xlsx");
//     } catch (error) {
//       alert("Invalid CSV format!");
//       console.error(error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
//       <h2>CSV to Excel Converter</h2>
//       <textarea
//         rows="10"
//         value={csvText}
//         onChange={(e) => setCsvText(e.target.value)}
//         placeholder="Paste your CSV data here..."
//         style={{ width: "100%", padding: "10px", fontFamily: "monospace" }}
//       />
//       <button
//         onClick={handleDownload}
//         style={{ marginTop: "10px", padding: "10px 20px" }}
//       >
//         Download Excel
//       </button>
//     </div>
//   );
// };

// export default CsvToExcel;
