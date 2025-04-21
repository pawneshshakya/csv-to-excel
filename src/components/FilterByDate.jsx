import React, { useState } from "react";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";


const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;
  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;

  date_info.setHours(hours);
  date_info.setMinutes(minutes);
  return date_info;
};

const formatDateTime = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const FilterByDate = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Convert Excel serial date to readable format
      const processedData = data.map((row) => {
        const dateRaw = row["Transaction Time"];
        let date;

        if (!isNaN(dateRaw)) {
          date = excelDateToJSDate(dateRaw);
        } else {
          date = new Date(dateRaw);
        }

        return {
          ...row,
          "Transaction Time": formatDateTime(date),
        };
      });

      setOriginalData(processedData);
      setFilteredData(processedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleFilter = () => {
    const filtered = originalData.filter((row) => {
      const rowDate = row["Transaction Time"].split(" ")[0];
      const selected = new Date(selectedDate).toISOString().slice(0, 10);
      const matchDate = rowDate === selected;
      const matchStatus =
        selectedStatus === "ALL" ||
        row["Transaction Status"] === selectedStatus;
      return matchDate && matchStatus;
    });

    setFilteredData(filtered);
  };

  const headers = [
    { label: "Customer Reference ID", key: "Customer Reference ID" },
    { label: "customer_name", key: "customer_name" },
    { label: "Transaction Amount", key: "Transaction Amount" },
    { label: "merchantTransactionId", key: "merchantTransactionId" },
    { label: "partner_name", key: "partner_name" },
    { label: "Transaction Time", key: "Transaction Time" },
    { label: "Reference Id", key: "Reference Id" },
    { label: "Order Id", key: "Order Id" },
    { label: "Transaction Status", key: "Transaction Status" },
  ];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center m-3 p-4 border rounded shadow bg-white">
      <h2 className="mb-4 text-center text-primary">
        📂 Filter Transactions By Date
      </h2>

      <input
        type="file"
        accept=".csv, .xlsx"
        className="form-control mb-4"
        onChange={handleFileUpload}
      />

      <div className="row w-100 mb-3">
        <div className="col-md-6">
          <label>Select Date</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label>Transaction Status</label>
          <select
            className="form-control"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="USER_DROPPED">USER_DROPPED</option>
            <option value="FAILED">FAILED</option>
            <option value="INCOMPLETE">INCOMPLETE</option>
          </select>
        </div>
      </div>

      <div className="d-flex gap-3 mb-4">
        <button className="btn btn-success" onClick={handleFilter}>
          Apply Filter
        </button>
        {filteredData.length > 0 && (
          <CSVLink
            className="btn btn-primary"
            data={filteredData}
            headers={headers}
            filename="filtered-transactions.csv"
          >
            Download CSV
          </CSVLink>
        )}
      </div>

      <div className="table-responsive w-100">
        {filteredData.length > 0 ? (
          <table className="table table-bordered table-hover text-center">
            <thead className="table-dark">
              <tr>
                <th>Customer Reference ID</th>
                <th>Transaction Amount</th>
                <th>Cashfree Order ID</th>
                <th>Date & Time</th>
                <th>Reference Id</th>
                <th>Order Id</th>
                <th>Transaction Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row["Customer Reference ID"]}</td>
                  <td>{row["Transaction Amount"]}</td>
                  <td>{row["Cashfree Order ID"]}</td>
                  <td>{row["Transaction Time"]}</td>
                  <td>{row["Reference Id"]}</td>
                  <td>{row["Order Id"]}</td>
                  <td>{row["Transaction Status"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted text-center">
            No data to display. Please upload a file and apply filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default FilterByDate;

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { CSVLink } from "react-csv";
// import "bootstrap/dist/css/bootstrap.min.css";

// const FilterByDate = () => {
//   const [originalData, setOriginalData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("ALL");

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const binaryStr = evt.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const worksheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[worksheetName];
//       const data = XLSX.utils.sheet_to_json(worksheet);
//       setOriginalData(data);
//       setFilteredData(data);
//     };

//     reader.readAsBinaryString(file);
//   };

//   const parseExcelDate = (excelDate) => {
//     if (!excelDate) return null;
//     if (!isNaN(excelDate)) {
//       const date = new Date((excelDate - 25569) * 86400 * 1000);
//       return date.toISOString().slice(0, 10);
//     }
//     const date = new Date(excelDate);
//     return isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
//   };

//   const handleFilter = () => {
//     const selected = new Date(selectedDate).toISOString().slice(0, 10);

//     const filtered = originalData.filter((row) => {
//       const rowDate = parseExcelDate(row["Transaction Time"]);
//       const matchDate = rowDate === selected;
//       const matchStatus =
//         selectedStatus === "ALL" ||
//         row["Transaction Status"] === selectedStatus;
//       return matchDate && matchStatus;
//     });

//     setFilteredData(filtered);
//   };

//   const headers = [
//     { label: "Customer Reference ID", key: "Customer Reference ID" },
//     { label: "Customer Name", key: "Customer Name" },
//     { label: "Transaction Amount", key: "Transaction Amount" },
//     { label: "merchantTransactionId", key: "merchantTransactionId" },
//     { label: "partner_name", key: "partner_name" },
//     { label: "Transaction Time", key: "Transaction Time" },
//     { label: "Reference Id", key: "Reference Id" },
//     { label: "Order Id", key: "Order Id" },
//     { label: "Cashfree Order ID", key: "Cashfree Order ID" },
//     { label: "Transaction Status", key: "Transaction Status" },
//   ];

//   return (
//     <div
//       className="container d-flex flex-column align-items-center justify-content-center mt-5 p-4 border rounded shadow bg-white"
//       style={{ maxWidth: "900px" }}
//     >
//       <h2 className="mb-4 text-center text-primary">
//         📁 Filter Transactions By Date
//       </h2>

//       <input
//         type="file"
//         accept=".csv, .xlsx"
//         className="form-control mb-4"
//         onChange={handleFileUpload}
//       />

//       <div className="row w-100 mb-3">
//         <div className="col-md-6 mb-3">
//           <label>Select Date</label>
//           <input
//             type="date"
//             className="form-control"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           />
//         </div>
//         <div className="col-md-6 mb-3">
//           <label>Transaction Status</label>
//           <select
//             className="form-control"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="ALL">All</option>
//             <option value="SUCCESS">SUCCESS</option>
//             <option value="USER_DROPPED">USER_DROPPED</option>
//             <option value="FAILED">FAILED</option>
//             <option value="INCOMPLETE">INCOMPLETE</option>
//           </select>
//         </div>
//       </div>

//       <div className="d-flex gap-3 mb-4">
//         <button className="btn btn-success" onClick={handleFilter}>
//           Apply Filter
//         </button>
//         {filteredData.length > 0 && (
//           <CSVLink
//             className="btn btn-primary"
//             data={filteredData}
//             headers={headers}
//             filename="filtered-transactions.csv"
//           >
//             Download CSV
//           </CSVLink>
//         )}
//       </div>

//       <div className="table-responsive w-100">
//         {filteredData.length > 0 ? (
//           <table className="table table-bordered table-striped text-center">
//             <thead className="table-dark">
//               <tr>
//                 <th>Customer Reference ID</th>
//                 <th>Transaction Amount</th>
//                 <th>Cashfree Order ID</th>
//                 <th>Transaction Time</th>
//                 <th>Reference Id</th>
//                 <th>Order Id</th>
//                 <th>Transaction Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row["Customer Reference ID"]}</td>
//                   <td>{row["Transaction Amount"]}</td>
//                   <td>{row["Cashfree Order ID"]}</td>
//                   <td>{row["Transaction Time"]}</td>
//                   <td>{row["Reference Id"]}</td>
//                   <td>{row["Order Id"]}</td>
//                   <td>{row["Transaction Status"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-muted text-center">
//             No data to display. Please upload a file and apply filters.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterByDate;

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { CSVLink } from "react-csv";
// import "bootstrap/dist/css/bootstrap.min.css";

// const FilterByDate = () => {
//   const [originalData, setOriginalData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("ALL");

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const binaryStr = evt.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const worksheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[worksheetName];
//       const data = XLSX.utils.sheet_to_json(worksheet);

//       setOriginalData(data);
//       setFilteredData(data);
//     };

//     reader.readAsBinaryString(file);
//   };

//   const handleFilter = () => {
//     const filtered = originalData.filter((row) => {
//       const rowDate = new Date(row["Transaction Time"])
//         .toISOString()
//         .slice(0, 10);
//       const selected = new Date(selectedDate).toISOString().slice(0, 10);
//       const matchDate = rowDate === selected;
//       const matchStatus =
//         selectedStatus === "ALL" ||
//         row["Transaction Status"] === selectedStatus;
//       return matchDate && matchStatus;
//     });

//     setFilteredData(filtered);
//   };

//   const headers = [
//     { label: "Customer Reference ID", key: "Customer Reference ID" },
//     { label: "Customer Name", key: "Customer Name" }, // Placeholder if name is present
//     { label: "Transaction Amount", key: "Transaction Amount" },
//     { label: "merchantTransactionId", key: "merchantTransactionId" },
//     { label: "partner_name", key: "partner_name" }, // Placeholder if present
//     { label: "Date", key: "Transaction Time" },
//     { label: "Reference Id", key: "Reference Id" },
//     { label: "Order Id", key: "Order Id" },
//     { label: "Transaction Status", key: "Transaction Status" },
//   ];

//   return (
//     <div
//       className="container d-flex flex-column align-items-center justify-content-center mt-5 p-4 border rounded shadow-sm bg-light"
//       style={{ maxWidth: "800px" }}
//     >
//       <h2 className="mb-4 text-primary">📊 Filter Transactions By Date</h2>

//       <input
//         type="file"
//         accept=".csv, .xlsx"
//         className="form-control mb-3"
//         onChange={handleFileUpload}
//       />

//       <div className="row w-100 mb-3">
//         <div className="col-md-6 mb-2">
//           <label>Select Date</label>
//           <input
//             type="date"
//             className="form-control"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           />
//         </div>
//         <div className="col-md-6 mb-2">
//           <label>Transaction Status</label>
//           <select
//             className="form-control"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="ALL">All</option>
//             <option value="SUCCESS">SUCCESS</option>
//             <option value="USER_DROPPED">USER_DROPPED</option>
//             <option value="FAILED">FAILED</option>
//             <option value="INCOMPLETE">INCOMPLETE</option>
//           </select>
//         </div>
//       </div>

//       <div className="d-flex gap-3 mb-4">
//         <button className="btn btn-success" onClick={handleFilter}>
//           Apply Filter
//         </button>
//         {filteredData.length > 0 && (
//           <CSVLink
//             className="btn btn-primary"
//             data={filteredData}
//             headers={headers}
//             filename="filtered-data.csv"
//           >
//             Download CSV
//           </CSVLink>
//         )}
//       </div>

//       <div className="table-responsive w-100">
//         {filteredData.length > 0 ? (
//           <table className="table table-bordered table-striped text-center">
//             <thead className="table-dark">
//               <tr>
//                 <th>Customer Reference ID</th>
//                 <th>Transaction Amount</th>
//                 <th>Cashfree Order ID</th>
//                 <th>Date</th>
//                 <th>Reference Id</th>
//                 <th>Order Id</th>
//                 <th>Transaction Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row["Customer Reference ID"]}</td>
//                   <td>{row["Transaction Amount"]}</td>
//                   <td>{row["Cashfree Order ID"]}</td>
//                   <td>{row["Transaction Time"]}</td>
//                   <td>{row["Reference Id"]}</td>
//                   <td>{row["Order Id"]}</td>
//                   <td>{row["Transaction Status"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-muted">
//             No data to display. Please upload a file and apply filters.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FilterByDate;

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { CSVLink } from "react-csv";
// import dayjs from "dayjs";

// const FilterByDate = () => {
//   const [originalData, setOriginalData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const data = new Uint8Array(evt.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const parsedData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//       setOriginalData(parsedData);
//       setFilteredData(parsedData); // default display
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleFilter = () => {
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     const filtered = originalData.filter((row) => {
//       const rowDate = new Date(row["Transaction Time"]);
//       const matchDate =
//         (!start || rowDate >= start) && (!end || rowDate <= end);
//       const matchStatus =
//         !statusFilter || row["Transaction Status"] === statusFilter;
//       return matchDate && matchStatus;
//     });

//     setFilteredData(filtered);
//   };

//   const formattedData = filteredData.map((row) => ({
//     "Customer Reference ID": row["Customer Reference ID"],
//     "Customer Name": "", // Add logic if available in the data
//     "Transaction Amount": row["Transaction Amount"],
//     merchantTransactionId: row["Cashfree Order ID"],
//     partner_name: "", // Add logic if available in the data
//     date: row["Transaction Time"],
//     "Reference Id": row["Reference Id"],
//     "Order Id": row["Order Id"],
//     "Transaction Status": row["Transaction Status"],
//   }));

//   return (
//     <div className="container p-4">
//       <h2>Filter Transactions by Date & Status</h2>
//       <input
//         type="file"
//         accept=".csv,.xlsx"
//         onChange={handleFileUpload}
//         className="form-control mb-3"
//       />

//       <div className="row g-3 mb-3">
//         <div className="col">
//           <label>Start Date:</label>
//           <input
//             type="date"
//             className="form-control"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>
//         <div className="col">
//           <label>End Date:</label>
//           <input
//             type="date"
//             className="form-control"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>
//         <div className="col">
//           <label>Transaction Status:</label>
//           <select
//             className="form-control"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="SUCCESS">SUCCESS</option>
//             <option value="USER_DROPPED">USER_DROPPED</option>
//             <option value="FAILED">FAILED</option>
//             <option value="INCOMPLETE">INCOMPLETE</option>
//           </select>
//         </div>
//         <div className="col align-self-end">
//           <button className="btn btn-primary w-100" onClick={handleFilter}>
//             Filter
//           </button>
//         </div>
//       </div>

//       {filteredData.length > 0 && (
//         <>
//           <table className="table table-bordered table-striped">
//             <thead>
//               <tr>
//                 <th>Customer Reference ID</th>
//                 <th>Customer Name</th>
//                 <th>Transaction Amount</th>
//                 <th>Merchant Transaction ID</th>
//                 <th>Partner Name</th>
//                 <th>Date</th>
//                 <th>Reference ID</th>
//                 <th>Order ID</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {formattedData.map((row, idx) => (
//                 <tr key={idx}>
//                   <td>{row["Customer Reference ID"]}</td>
//                   <td>{row["Customer Name"]}</td>
//                   <td>{row["Transaction Amount"]}</td>
//                   <td>{row["merchantTransactionId"]}</td>
//                   <td>{row["partner_name"]}</td>
//                   <td>{row["date"]}</td>
//                   <td>{row["Reference Id"]}</td>
//                   <td>{row["Order Id"]}</td>
//                   <td>{row["Transaction Status"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <CSVLink
//             data={formattedData}
//             filename="filtered_transactions.csv"
//             className="btn btn-success"
//           >
//             Download Filtered Data
//           </CSVLink>
//         </>
//       )}
//     </div>
//   );
// };

// export default FilterByDate;
