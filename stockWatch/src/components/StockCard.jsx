import React from "react";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock }) => {
  const navigate = useNavigate();

  if (!stock) return null;

  const handleClick = () => {
    navigate(`/stock/${stock.symbol}`);
  };

  // Fallback-friendly data resolution
  const name =
    stock.longName ||
    stock.displayName ||
    stock.symbolName ||
    stock.shortName ||
    "Unnamed Company";

  const price =
    stock.regularMarketPrice ??
    stock.lastPrice ??
    stock.postMarketPrice ??
    "N/A";

  const priceChange =
    stock.regularMarketChange ??
    stock.priceChange ??
    stock.postMarketChange ??
    0;

  const percentChange =
    stock.regularMarketChangePercent ??
    stock.percentChange ??
    stock.postMarketChangePercent ??
    0;

  const bid = stock.bid ?? "—";
  const ask = stock.ask ?? "—";

  return (
    <div
      onClick={handleClick}
      className="card mb-1 shadow-sm"
      style={{ fontSize: "0.75rem", lineHeight: "1.2", cursor: "pointer" }}
    >
      <div className="card-body p-2">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{stock.symbol}</strong>
            <div className="text-muted small">{name}</div>
          </div>
          <div className="text-end">
            <div>
              <strong>
                ${typeof price === "number" ? price.toFixed(2) : price}
              </strong>
            </div>
            <div style={{ color: priceChange >= 0 ? "green" : "red" }}>
              {typeof priceChange === "number"
                ? priceChange.toFixed(2)
                : priceChange}{" "}
              (
              {typeof percentChange === "number"
                ? percentChange.toFixed(2)
                : percentChange}
              %)
            </div>
          </div>
        </div>
        <div className="mt-2 small text-muted d-flex justify-content-between">
          <span>Bid: ${typeof bid === "number" ? bid.toFixed(2) : bid}</span>
          <span>Ask: ${typeof ask === "number" ? ask.toFixed(2) : ask}</span>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
