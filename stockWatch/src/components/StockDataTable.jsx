import React from "react";
import { useNavigate } from "react-router-dom";

const StockQuoteTable = ({ data }) => {
  const navigate = useNavigate();

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const handleRowClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="table-responsive mb-3">
      <table
        className="table table-bordered table-sm bg-light text-dark"
        style={{ fontSize: "0.75rem", cursor: "pointer" }}
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
            <tr
              key={stock.symbol}
              onClick={() => handleRowClick(stock.symbol)}
              style={{ transition: "background 0.2s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1f1f1")
              }
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              <td>{stock.symbol}</td>
              <td>{stock.longname || stock.shortname}</td>
              <td>{stock.typeDisp || stock.quoteType}</td>
              <td>{stock.exchDisp || stock.exchange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockQuoteTable;
