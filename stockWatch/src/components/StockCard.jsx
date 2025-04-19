import React from "react";
import { useNavigate } from "react-router-dom";

const StockCard = ({ stock, averagePrice, quantity }) => {
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

  const bid = stock.bid ?? null;
  const ask = stock.ask ?? null;

  // Calculate total holdings and earnings
  const totalHoldings =
    typeof quantity === "number" && typeof price === "number"
      ? quantity * price
      : 0;

  const earnings =
    typeof quantity === "number" &&
    typeof price === "number" &&
    typeof averagePrice === "number"
      ? (price - averagePrice) * quantity
      : 0;

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
                : percentChange}{" "}
              %)
            </div>
          </div>
        </div>

        {/* Show Quantity, Average Price, Total Holdings, and Earnings if available */}
        <div className="mt-2 small text-muted">
          {quantity && (
            <div>
              <strong>Quantity:</strong> {quantity}
            </div>
          )}
          {averagePrice && (
            <div>
              <strong>Average Price:</strong> ${averagePrice.toFixed(2)}
            </div>
          )}
          {totalHoldings > 0 && (
            <div>
              <strong>Total Holdings:</strong> ${totalHoldings.toFixed(2)}
            </div>
          )}
          {typeof earnings === "number" && quantity && averagePrice && (
            <div style={{ color: earnings >= 0 ? "green" : "red" }}>
              <strong>{earnings >= 0 ? "Profit" : "Loss"}:</strong> $
              {Math.abs(earnings).toFixed(2)}
            </div>
          )}
        </div>

        {/* Only show Bid and Ask if they are available */}
        <div className="mt-2 small text-muted d-flex justify-content-between">
          {bid && (
            <span>Bid: ${typeof bid === "number" ? bid.toFixed(2) : bid}</span>
          )}
          {ask && (
            <span>Ask: ${typeof ask === "number" ? ask.toFixed(2) : ask}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockCard;
