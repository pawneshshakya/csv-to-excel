import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Helper function to convert Excel date serial number to readable format
const convertExcelDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor((total_seconds - hours * 3600) / 60);

  date_info.setHours(hours);
  date_info.setMinutes(minutes);
  date_info.setSeconds(seconds);

  return date_info.toLocaleString("en-US"); // Format: 4/19/2025, 10:41:30 PM
};

const FilterAugmontReport = () => {
  const [filteredData, setFilteredData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const transformedData = data.map((row) => ({
        customerRefNo: "",
        customer_name: row["Account Name"] || "",
        amount: row["Total Amount"] || "",
        merchantTransactionId: row["Merchant Transaction Id"] || "",
        partner_name: "",
        date:
          typeof row["Buy Date"] === "number"
            ? convertExcelDate(row["Buy Date"])
            : row["Buy Date"] || "",
        payment_id: "",
        order_id: "",
      }));

      setFilteredData(transformedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredData");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    const buffer = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < wbout.length; i++) {
      view[i] = wbout.charCodeAt(i) & 0xff;
    }

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Augmont_Filtered_Data.xlsx");
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center m-3 p-4 border rounded shadow bg-white">
      <h2 className="mb-4 text-center text-primary">Filter Augmont Report</h2>

      <input
        type="file"
        accept=".xlsx, .csv"
        onChange={handleFileUpload}
        className="form-control mb-4"
      />

      {filteredData.length > 0 && (
        <>
          <button onClick={handleDownload} className="btn btn-success mb-3">
            Download Filtered Data
          </button>

          <div style={{ overflowX: "auto", width: "100%" }}>
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>customerRefNo</th>
                  <th>customer_name</th>
                  <th>amount</th>
                  <th>merchantTransactionId</th>
                  <th>partner_name</th>
                  <th>date</th>
                  <th>payment_id</th>
                  <th>order_id</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.customerRefNo}</td>
                    <td>{row.customer_name}</td>
                    <td>{row.amount}</td>
                    <td>{row.merchantTransactionId}</td>
                    <td>{row.partner_name}</td>
                    <td>{row.date}</td>
                    <td>{row.payment_id}</td>
                    <td>{row.order_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterAugmontReport;

// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const FilterAugmontReport = () => {
//   const [filteredData, setFilteredData] = useState([]);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const bstr = evt.target.result;
//       const wb = XLSX.read(bstr, { type: "binary" });

//       const sheetName = wb.SheetNames[0];
//       const sheet = wb.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(sheet);

//       const transformedData = data.map((row) => ({
//         customerRefNo: "",
//         customer_name: row["Account Name"] || "",
//         amount: row["Total Amount"] || "",
//         merchantTransactionId: row["Merchant Transaction Id"] || "",
//         partner_name: "",
//         date: row["Buy Date"] || "",
//         payment_id: "",
//         order_id: "",
//       }));

//       setFilteredData(transformedData);
//     };

//     reader.readAsBinaryString(file);
//   };

//   const handleDownload = () => {
//     const ws = XLSX.utils.json_to_sheet(filteredData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "FilteredData");

//     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

//     const buffer = new ArrayBuffer(wbout.length);
//     const view = new Uint8Array(buffer);
//     for (let i = 0; i < wbout.length; i++) {
//       view[i] = wbout.charCodeAt(i) & 0xff;
//     }

//     const blob = new Blob([buffer], { type: "application/octet-stream" });
//     saveAs(blob, "Augmont_Filtered_Data.xlsx");
//   };

//   return (
//     <div className="d-flex flex-column align-items-center justify-content-center m-3 p-4 border rounded shadow bg-white">
//       <h2 className="mb-4 text-center text-primary">Filter Augmont Report</h2>
//       <input
//         type="file"
//         accept=".xlsx, .csv"
//         onChange={handleFileUpload}
//         className="form-control mb-4"
//       />

//       {filteredData.length > 0 && (
//         <>
//           <div className="d-flex">
//             <button onClick={handleDownload} className="btn btn-success mb-3">
//               Download Filtered Data
//             </button>
//           </div>

//           <div style={{ overflowX: "auto", width: "100%" }}>
//             <table className="table table-bordered table-hover text-center">
//               <thead className="table-dark">
//                 <tr>
//                   <th>customerRefNo</th>
//                   <th>customer_name</th>
//                   <th>amount</th>
//                   <th>merchantTransactionId</th>
//                   <th>partner_name</th>
//                   <th>date</th>
//                   <th>payment_id</th>
//                   <th>order_id</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((row, index) => (
//                   <tr key={index}>
//                     <td>{row.customerRefNo}</td>
//                     <td>{row.customer_name}</td>
//                     <td>{row.amount}</td>
//                     <td>{row.merchantTransactionId}</td>
//                     <td>{row.partner_name}</td>
//                     <td>{row.date}</td>
//                     <td>{row.payment_id}</td>
//                     <td>{row.order_id}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default FilterAugmontReport;
