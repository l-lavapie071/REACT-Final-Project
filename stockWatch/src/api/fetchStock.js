
export const fetchStockQuote = async (symbol) => {
  const cleanedSymbol = symbol.trim().toUpperCase();
  const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/search?search=${cleanedSymbol}`;
  const apiKey = import.meta.env.VITE_ALPHA_API_KEY;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      //"X-RapidAPI-Key": "a183e3f8fbmsh88a0b7800897231p183d3ejsn311f31d0e8e1",
      //"X-RapidAPI-Key": "68ccbe0c74msh7292dfc8f894f45p1c500djsn626db8f2cce7",
      "X-RapidAPI-Key": "e7f598b7bcmsh2a060b4ba8f0210p14177cjsn77fb1b708d90",
      "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com"
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch stock data.");
  }

  const data = await response.json();
  //console.log(data.length);
  //console.log(data[0]);
  return data;
};

export const fetchStockDetails = async (symbol) => {
  const cleanedSymbol = symbol.trim().toUpperCase();
  const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${cleanedSymbol}`;
  const apiKey = import.meta.env.VITE_ALPHA_API_KEY;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      //"X-RapidAPI-Key": "a183e3f8fbmsh88a0b7800897231p183d3ejsn311f31d0e8e1",
      //"X-RapidAPI-Key": "68ccbe0c74msh7292dfc8f894f45p1c500djsn626db8f2cce7",
      "X-RapidAPI-Key": "e7f598b7bcmsh2a060b4ba8f0210p14177cjsn77fb1b708d90",
      "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com"
    }
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch stock data.");
  }

  const data = await response.json();
  //console.log(data.length);
  //console.log(data[0]);
  return data;
};

export const fetchMostActiveStocks = async () => {
  const url = "https://yahoo-finance15.p.rapidapi.com/api/v1/markets/options/most-active?type=STOCKS";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      //"X-RapidAPI-Key": "a183e3f8fbmsh88a0b7800897231p183d3ejsn311f31d0e8e1",
      //"X-RapidAPI-Key": "68ccbe0c74msh7292dfc8f894f45p1c500djsn626db8f2cce7",
      "X-RapidAPI-Key": "e7f598b7bcmsh2a060b4ba8f0210p14177cjsn77fb1b708d90",
      "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch most active stocks.");
  }

  const data = await response.json();
  return data;
  /* if (data && Array.isArray(data.body) && data.body.length > 0) {
    return data.body;
  } else {
    throw new Error("No most active stock data found.");
  } */
};

export const fetchStockNews = async (tickers) => {
  const formattedTickers = tickers.join("%2C"); // Example: "AAPL%2CTSLA"
  console.log(formattedTickers);
  const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/news?tickers=${formattedTickers}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      //
      //"X-RapidAPI-Key": "a183e3f8fbmsh88a0b7800897231p183d3ejsn311f31d0e8e1",
      //"X-RapidAPI-Key": "68ccbe0c74msh7292dfc8f894f45p1c500djsn626db8f2cce7",
      "X-RapidAPI-Key": "e7f598b7bcmsh2a060b4ba8f0210p14177cjsn77fb1b708d90",
      "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stock news.");
  }


  const data = await response.json();
  //console.log(data.items);
  return data;
};
