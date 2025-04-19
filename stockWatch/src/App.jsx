import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import StockViewer from "./components/StockViewer";
import StockCard from "./components/StockCard";
import StockNewsItem from "./components/StockNewsItem";
import StockDetails from "./components/StockDetails";
import { fetchMostActiveStocks, fetchStockNews } from "./api/fetchStock";
import "./App.css";
import WatchList from "./components/WatchList";
import Portfolio from "./components/Portfolio";
import ChatBox from "./components/ChatBox";

function MainContent({
  searchQuery,
  handleSearch,
  mostActiveStocks,
  isLoading,
  error,
  stockNews,
}) {
  return (
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
                {mostActiveStocks.slice(0, 8).map((stock) => (
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
        ) : stockNews && stockNews.length > 0 ? (
          <div className="stock-news-slider">
            <Swiper
              className="custom-swiper"
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
            >
              {stockNews.map((newsItem) => (
                <SwiperSlide key={newsItem.title}>
                  <StockNewsItem newsItem={newsItem} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <p>No news available.</p>
        )}
      </div>
    </div>
  );
}

function AppWrapper() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mostActiveStocks, setMostActiveStocks] = useState([]);
  const [stockNews, setStockNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const isStockDetailPage = location.pathname.startsWith("/stock/");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const loadMostActive = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMostActiveStocks();
        if (data.body && data.body.length > 0) {
          setMostActiveStocks(data.body);
        } else {
          setError("No active stocks found.");
        }
      } catch (err) {
        setError("Failed to load most active stocks.");
      } finally {
        setIsLoading(false);
      }
    };

    if (location.pathname === "/") {
      loadMostActive();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (mostActiveStocks.length > 0) {
      const loadStockNews = async () => {
        try {
          setIsLoading(true);
          const tickers = mostActiveStocks.map((stock) => stock.symbol);
          const newsData = await fetchStockNews(tickers);
          setStockNews(newsData.body);
        } catch (err) {
          setError("Failed to load stock news.");
        } finally {
          setIsLoading(false);
        }
      };

      loadStockNews();
    }
  }, [mostActiveStocks]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            !isStockDetailPage && (
              <MainContent
                searchQuery={searchQuery}
                handleSearch={handleSearch}
                mostActiveStocks={mostActiveStocks}
                isLoading={isLoading}
                error={error}
                stockNews={stockNews}
              />
            )
          }
        />
        <Route path="/stock/:symbol" element={<StockDetails />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/chat" element={<ChatBox />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
