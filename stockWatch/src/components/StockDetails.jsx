import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchStockDetails } from "../api/fetchStock";

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockDetails, setStockDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStockDetails = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStockDetails(symbol);
        setStockDetails(data.body[0]);
      } catch (err) {
        setError("Failed to load stock details.");
        console.error("Error fetching stock details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStockDetails();
  }, [symbol]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatNumber = (num) =>
    num !== null && num !== undefined
      ? typeof num === "number"
        ? num.toLocaleString()
        : num
      : "--";

  if (isLoading) {
    return <div className="text-center py-5">Loading stock details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const s = stockDetails;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={handleBack}>
        &larr; Back
      </button>

      {/* Top Stock Overview */}
      <div className="card shadow p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="mb-2">
            {s?.longName || s?.symbolName} ({s?.symbol})
          </h2>
          <div>
            <button className="btn btn-outline-primary btn-sm me-2">
              Add to Watch List
            </button>
            <button className="btn btn-outline-primary btn-sm me-2">
              Add to My Portfolio
            </button>
          </div>
        </div>
        <div className="mt-3">
          <h3 className="fw-bold">{formatNumber(s?.regularMarketPrice)}</h3>
          <p className="mb-1 text-danger">
            {formatNumber(s?.regularMarketChange)} (
            {(s?.regularMarketChangePercent || 0).toFixed(2)}%)
          </p>
          <p className="mb-1 text-muted">
            At close:{" "}
            {new Date(s?.regularMarketTime * 1000).toLocaleString("en-US", {
              timeZone: "America/New_York",
            })}
          </p>
          <p className="mb-0 text-success">
            {formatNumber(s?.postMarketPrice)} (
            {formatNumber(s?.postMarketChange)} /{" "}
            {(s?.postMarketChangePercent || 0).toFixed(2)}%)
          </p>
          <p className="text-muted">
            After hours:{" "}
            {s?.postMarketTime
              ? new Date(s.postMarketTime * 1000).toLocaleString("en-US", {
                  timeZone: "America/New_York",
                })
              : "--"}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="card shadow p-4">
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Previous Close</strong>
              <br />
              {formatNumber(s?.regularMarketPreviousClose)}
            </p>
            <p>
              <strong>Open</strong>
              <br />
              {formatNumber(s?.regularMarketOpen)}
            </p>
            <p>
              <strong>Bid</strong>
              <br />
              {`${formatNumber(s?.bid)} x ${formatNumber(s?.bidSize)}`}
            </p>
            <p>
              <strong>Ask</strong>
              <br />
              {`${formatNumber(s?.ask)} x ${formatNumber(s?.askSize)}`}
            </p>
            <p>
              <strong>Day's Range</strong>
              <br />
              {s?.regularMarketDayRange || "--"}
            </p>
            <p>
              <strong>52 Week Range</strong>
              <br />
              {s?.fiftyTwoWeekRange || "--"}
            </p>
            <p>
              <strong>Volume</strong>
              <br />
              {formatNumber(s?.regularMarketVolume)}
            </p>
            <p>
              <strong>Avg. Volume</strong>
              <br />
              {formatNumber(s?.averageDailyVolume3Month)}
            </p>
          </div>

          <div className="col-md-6">
            <p>
              <strong>Market Cap (intraday)</strong>
              <br />
              {formatNumber(s?.marketCap)}
            </p>
            <p>
              <strong>Beta (5Y Monthly)</strong>
              <br />
              {formatNumber(s?.beta)}
            </p>
            <p>
              <strong>PE Ratio (TTM)</strong>
              <br />
              {formatNumber(s?.trailingPE)}
            </p>
            <p>
              <strong>EPS (TTM)</strong>
              <br />
              {formatNumber(s?.epsTrailingTwelveMonths)}
            </p>
            <p>
              <strong>Earnings Date</strong>
              <br />
              {s?.earningsTimestamp
                ? new Date(s.earningsTimestamp * 1000).toLocaleDateString()
                : "--"}
            </p>
            <p>
              <strong>Forward Dividend & Yield</strong>
              <br />
              --
            </p>
            <p>
              <strong>Ex-Dividend Date</strong>
              <br />
              --
            </p>
            <p>
              <strong>1y Target Est</strong>
              <br />
              --
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
