import React, { useState, useEffect } from "react";
import { fetchStockDetails } from "../api/fetchStock";
import StockCard from "./StockCard";
import SearchBar from "./SearchBar";
import "bootstrap/dist/css/bootstrap.min.css";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // Get the watchlist list from local storage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(stored);
  }, [refresh]);

  useEffect(() => {
    if (watchlist.length === 0) {
      setStockDetails([]);
      setLoading(false);
      return;
    }

    const loadDetails = async () => {
      setLoading(true);
      try {
        const detailPromises = watchlist.map((symbol) =>
          fetchStockDetails(symbol)
            .then((res) => res.body?.[0])
            .catch((err) => {
              console.error(`Failed to fetch ${symbol}:`, err);
              return null;
            })
        );

        const results = await Promise.all(detailPromises);
        const validResults = results.filter((res) => res !== null);
        setStockDetails(validResults);
      } catch (err) {
        console.error("Error loading stock details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [watchlist]);

  const handleAdd = async (symbol) => {
    if (!watchlist.includes(symbol)) {
      try {
        const data = await fetchStockDetails(symbol);
        const dataResult = data.body[0] || null;
        if (!data) {
          alert(`Could not fetch details for ${symbol}. Try again later.`);
          return;
        }

        watchlist.push(symbol);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert(`${symbol} added to Watchlist`);
        setRefresh(!refresh); // Trigger component re-render
      } catch (err) {
        alert(`An error occurred while fetching data for ${symbol}`);
        console.error(err);
      }
    } else {
      alert(`${symbol} is already in your Watchlist`);
    }
  };

  // Handle delete functionality with confirmation
  const handleDelete = (symbol) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${symbol} from your Watchlist?`
    );
    if (confirmed) {
      const updatedWatchlist = watchlist.filter(
        (stockSymbol) => stockSymbol !== symbol
      );
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      setWatchlist(updatedWatchlist);
      alert(`${symbol} removed from Watchlist`);
    }
  };

  // Spinner while loading watchlist details
  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Watchlist</h3>
      <SearchBar
        onSearch={handleAdd}
        buttonLabel="Add"
        placeholder="Enter stock symbol"
      />

      {stockDetails.length === 0 ? (
        <p>No stocks in watchlist.</p>
      ) : (
        <div className="row">
          {stockDetails.map((stock) => (
            <div className="col-sm-6 col-md-3 col-lg-3 mb-2" key={stock.symbol}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="flex-grow-1">
                  <StockCard stock={stock} />
                </div>
                <button
                  className="btn btn-danger btn-sm p-1"
                  onClick={() => handleDelete(stock.symbol)}
                >
                  <i className="bi bi-trash"></i>{" "}
                  {/* Trash icon for deletion */}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;
