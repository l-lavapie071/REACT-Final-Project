import React, { useState, useEffect } from "react";
import { fetchStockDetails } from "../api/fetchStock";
import StockCard from "./StockCard";
import SearchBar from "./SearchBar";
import "bootstrap/dist/css/bootstrap.min.css";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState({}); // Store input values for editing

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("portfolio")) || [];
    setPortfolio(stored);
  }, []);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const detailPromises = portfolio.map((item) =>
          fetchStockDetails(item.symbol)
            .then((res) => ({
              ...item,
              ...res.body?.[0],
            }))
            .catch((err) => {
              console.error(`Failed to fetch ${item.symbol}:`, err);
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

    if (portfolio.length > 0) {
      loadDetails();
    } else {
      setLoading(false);
    }
  }, [portfolio]);

  const handleAdd = async (symbol) => {
    if (portfolio.some((item) => item.symbol === symbol)) {
      alert(`${symbol} is already in your Portfolio`);
      return;
    }

    try {
      const data = await fetchStockDetails(symbol);
      const stockInfo = data.body?.[0];

      if (!stockInfo) {
        alert(`Invalid stock symbol: ${symbol}`);
        return;
      }

      const quantity = prompt(`Enter quantity of shares for ${symbol}:`);
      const avgPrice = prompt(`Enter average purchase price for ${symbol}:`);

      if (!quantity || isNaN(quantity) || !avgPrice || isNaN(avgPrice)) {
        alert("Invalid input. Quantity and price must be numbers.");
        return;
      }

      const newStock = {
        symbol,
        quantity: parseFloat(quantity),
        averagePrice: parseFloat(avgPrice),
      };

      const updatedPortfolio = [...portfolio, newStock];
      localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
      setPortfolio(updatedPortfolio);
    } catch (error) {
      console.error(`Error validating symbol ${symbol}:`, error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleUpdate = (symbol) => {
    const updatedPortfolio = portfolio.map((stock) => {
      if (stock.symbol === symbol) {
        const updates = editable[symbol] || {};
        return {
          ...stock,
          quantity: parseFloat(updates.quantity) || stock.quantity,
          averagePrice: parseFloat(updates.averagePrice) || stock.averagePrice,
        };
      }
      return stock;
    });

    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
    setPortfolio(updatedPortfolio);
    alert(`Updated ${symbol}`);
  };

  const handleChange = (symbol, field, value) => {
    setEditable((prev) => ({
      ...prev,
      [symbol]: {
        ...prev[symbol],
        [field]: value,
      },
    }));
  };

  const handleDelete = (symbol) => {
    // Remove stock from portfolio
    const updatedPortfolio = portfolio.filter(
      (stock) => stock.symbol !== symbol
    );

    // Update localStorage with the updated portfolio
    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));

    // Remove stock from stockDetails as well
    const updatedStockDetails = stockDetails.filter(
      (stock) => stock.symbol !== symbol
    );

    // Update state for both portfolio and stockDetails
    setPortfolio(updatedPortfolio);
    setStockDetails(updatedStockDetails);

    alert(`Deleted ${symbol} from portfolio.`);
  };

  // Calculate total holdings, gain, and loss
  const totalHoldings = stockDetails.reduce((acc, stock) => {
    const saved = portfolio.find((s) => s.symbol === stock.symbol);

    const quantity = saved?.quantity || 0;
    const currentPrice = stock?.regularMarketPrice || 0;
    return acc + quantity * currentPrice;
  }, 0);

  // Calculate total gain, loss, and gain percentage
  const totalGainLoss = stockDetails.reduce((acc, stock) => {
    const saved = portfolio.find((s) => s.symbol === stock.symbol);
    const quantity = saved?.quantity || 0;
    const currentPrice = stock?.regularMarketPrice || 0;
    const averagePrice = saved?.averagePrice || 0;

    const gainLoss = (currentPrice - averagePrice) * quantity;
    return acc + gainLoss;
  }, 0);

  // Calculate total percentage gain/loss
  const totalPercentageGainLoss = stockDetails.reduce((acc, stock) => {
    const saved = portfolio.find((s) => s.symbol === stock.symbol);
    const quantity = saved?.quantity || 0;
    const currentPrice = stock?.regularMarketPrice || 0;
    const averagePrice = saved?.averagePrice || 0;

    const gainLossPercentage = averagePrice
      ? ((currentPrice - averagePrice) / averagePrice) * 100
      : 0;
    return acc + gainLossPercentage * quantity;
  }, 0);

  const percentageGainLoss = (totalGainLoss / totalHoldings) * 100;

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
      <h3 className="mb-3">My Stock Portfolio</h3>
      <SearchBar
        onSearch={handleAdd}
        buttonLabel="Add to Portfolio"
        placeholder="Enter stock symbol"
      />

      {stockDetails.length === 0 ? (
        <p>Your portfolio is empty.</p>
      ) : (
        <>
          <h5 className="text-end text-success mb-3">
            Total Portfolio Value: ${totalHoldings.toFixed(2)}
          </h5>

          {/* Total Gain/Loss Section */}
          <div className="text-end mb-3">
            <h5 className={totalGainLoss >= 0 ? "text-success" : "text-danger"}>
              Total Gain/Loss: ${totalGainLoss.toFixed(2)} (
              {percentageGainLoss.toFixed(2)}%)
            </h5>
          </div>

          <div className="row">
            {stockDetails.map((stock) => {
              const saved = portfolio.find((s) => s.symbol === stock.symbol);
              const inputs = editable[stock.symbol] || {};

              return (
                <div
                  className="col-sm-4 col-md-4 col-lg-4 mb-3 d-flex align-items-start"
                  key={stock.symbol}
                >
                  <div className="flex-grow-1">
                    <StockCard
                      stock={stock}
                      averagePrice={saved?.averagePrice}
                      quantity={saved?.quantity}
                    />
                  </div>

                  <div className="ms-3 d-flex flex-column align-items-end gap-2">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Qty"
                      style={{ width: "80px" }}
                      value={inputs.quantity ?? saved?.quantity ?? ""}
                      onChange={(e) =>
                        handleChange(stock.symbol, "quantity", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Price"
                      style={{ width: "80px" }}
                      value={inputs.averagePrice ?? saved?.averagePrice ?? ""}
                      onChange={(e) =>
                        handleChange(
                          stock.symbol,
                          "averagePrice",
                          e.target.value
                        )
                      }
                    />
                    <div className="d-flex gap-2 align-items-center">
                      <button
                        className="btn btn-sm btn-success fs-5"
                        onClick={() => handleUpdate(stock.symbol)}
                      >
                        <i className="bi bi-save fs-5"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger fs-5"
                        onClick={() => handleDelete(stock.symbol)}
                      >
                        <i className="bi bi-trash fs-5"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
