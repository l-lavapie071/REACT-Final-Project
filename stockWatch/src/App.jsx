import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StockViewer from "./components/StockViewer";
import StockCard from "./components/StockCard";
import StockNewsItem from "./components/StockNewsItem";
import { fetchMostActiveStocks, fetchStockNews } from "./api/fetchStock";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mostActiveStocks, setMostActiveStocks] = useState([]);
  const [stockNews, setStockNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Fetch Most Active Stocks
  useEffect(() => {
    const loadMostActive = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMostActiveStocks();
        console.log("Most Active Stocks Data:", data);
        if (data.body && data.body.length > 0) {
          setMostActiveStocks(data.body); // Update the state with most active stocks
        } else {
          setError("No active stocks found.");
        }
      } catch (err) {
        setError("Failed to load most active stocks.");
        console.error("Error fetching most active stocks:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMostActive();
  }, []); // Run only on initial mount

  // Fetch Stock News only after Most Active Stocks are loaded
  useEffect(() => {
    if (mostActiveStocks.length > 0) {
      const loadStockNews = async () => {
        try {
          setIsLoading(true);
          // Extract symbols and join with space
          //console.log(mostActiveStocks);
          //const mostActive = JSON.parse(mostActiveStocks);

          //const tickers = mostActive.map((stock) => stock.symbol).join(" ");
          const tickers = ["NVDA", "TSLA", "PLTR"];
          console.log(tickers);

          const newsData = await fetchStockNews(tickers);
          console.log("Stock News Data:", newsData.body);
          setStockNews(newsData.body);
        } catch (err) {
          setError("Failed to load stock news.");
          console.error("Error fetching stock news:", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadStockNews();
    }
  }, [mostActiveStocks]); // Trigger this effect when mostActiveStocks changes

  return (
    <>
      <Header />
      <div className="container py-2">
        <SearchBar onSearch={handleSearch} />

        <div className="row mt-3">
          {/* Search Section */}
          <div className="col-lg-6 mb-3">
            <div className="p-3 rounded bg-white border h-100">
              <h5 className="mb-2">Search Result</h5>
              {searchQuery ? (
                <StockViewer symbol={searchQuery} />
              ) : (
                <p className="text-secondary small mb-0">
                  Search for a stock symbol or company name.
                </p>
              )}
            </div>
          </div>

          {/* Popular Stock Section */}
          <div className="col-lg-6 mb-3">
            <div className="p-3 rounded bg-light border h-100">
              <h5 className="mb-3">Popular Stocks</h5>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div className="row">
                  {mostActiveStocks.slice(0, 6).map((stock) => (
                    <div
                      className="col-sm-6 col-md-6 col-lg-6 mb-2"
                      key={stock.symbol}
                    >
                      <StockCard stock={stock} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock News Section */}
        <div className="p-3 rounded bg-white border mt-4">
          <h5 className="mb-3">Latest Stock News</h5>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div
              id="stockNewsCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {stockNews ? (
                  stockNews.map((newsItem, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={newsItem.title}
                    >
                      <StockNewsItem newsItem={newsItem} />
                    </div>
                  ))
                ) : (
                  <div className="carousel-item active">
                    <p>No news available.</p>
                  </div>
                )}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#stockNewsCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#stockNewsCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
