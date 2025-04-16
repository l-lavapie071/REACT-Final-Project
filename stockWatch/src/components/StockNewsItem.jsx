import React from "react";

const StockNewsItem = ({ newsItem }) => {
  if (!newsItem) return null;

  return (
    <div className="news-item mb-3 p-2 border rounded shadow-sm">
      <h5>
        <a
          href={newsItem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark"
        >
          {newsItem.title}
        </a>
      </h5>
      <p className="text-muted small">
        <strong>Source:</strong> {newsItem.source} | <strong>Published:</strong>{" "}
        {new Date(newsItem.pubDate).toLocaleDateString()}
      </p>
      <p>{newsItem.summary}</p>
    </div>
  );
};

export default StockNewsItem;
