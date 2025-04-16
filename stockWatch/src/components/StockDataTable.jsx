import React from "react";

const StockQuoteTable = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="table-responsive mb-3">
      <table
        className="table table-bordered table-sm bg-light text-dark"
        style={{ fontSize: "0.75rem" }}
      >
        <thead className="table-secondary">
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Type</th>
            <th>Exchange</th>
          </tr>
        </thead>
        <tbody>
          {data.map((stock) => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.longname || stock.shortname}</td>
              <td>{stock.typeDisp || stock.quoteType}</td>
              <td>{stock.exchDisp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockQuoteTable;
