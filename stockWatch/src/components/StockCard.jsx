import React from "react";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock }) => {
  const navigate = useNavigate();

  if (!stock) return null;

  const handleClick = () => {
    // Navigate to the stock details page using the stock symbol
    navigate(`/stock/${stock.symbol}`);
  };

  return (
    <div
      onClick={handleClick}
      className="card mb-1 shadow-sm"
      style={{ fontSize: "0.75rem", lineHeight: "1.2", cursor: "pointer" }}
    >
      <div className="card-body p-1">
        <div className="d-flex justify-content-between">
          <strong>{stock.symbol}</strong>
          <span
            className="text-muted text-end"
            style={{ flex: 1, fontSize: "0.7rem" }}
          >
            {stock.symbolName}
          </span>
        </div>
        <div className="mt-1">
          <span>
            <strong>$</strong>
            {stock.lastPrice} |{" "}
          </span>
          <span style={{ color: stock.priceChange >= 0 ? "green" : "red" }}>
            {stock.priceChange} ({stock.percentChange}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
