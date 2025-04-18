import React, { useEffect, useState } from "react";
import { fetchStockDetails } from "../api/fetchStock";
import StockCard from "./StockCard";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(stored);
  }, []);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const details = await Promise.all(
          watchlist.map(async (symbol) => {
            const data = await fetchStockDetails(symbol);
            console.log(data.body[0]);
            return data.body[0];
          })
        );
        setStockDetails(details);
      } catch (err) {
        console.error("Error fetching watchlist data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (watchlist.length > 0) {
      loadDetails();
    } else {
      setLoading(false);
    }
  }, [watchlist]);

  if (loading)
    return <div className="text-center mt-4">Loading watchlist...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Watchlist</h3>
      {stockDetails.length === 0 ? (
        <p>No stocks in watchlist.</p>
      ) : (
        <div className="row">
          {stockDetails.map((stock) => (
            <div className="col-sm-6 col-md-6 col-lg-6 mb-2" key={stock.symbol}>
              <StockCard stock={stock} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;
