import React, { useEffect, useState } from "react";
import { fetchStockQuote } from "../api/fetchStock";
import StockDataTable from "./StockDataTable";

function StockViewer({ symbol }) {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!symbol) return;

    const getStockData = async () => {
      setLoading(true);
      setError("");
      setStockData([]);

      try {
        const response = await fetchStockQuote(symbol);
        const stocks = response.body;
        if (Array.isArray(stocks) && stocks.length > 0) {
          setStockData(stocks);
        } else {
          setError("No valid stock data available.");
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    getStockData();
  }, [symbol]);

  if (loading) return <p>Loading stock data...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!stockData || stockData.length === 0) return null;

  return <StockDataTable data={stockData} />;
}

export default StockViewer;
