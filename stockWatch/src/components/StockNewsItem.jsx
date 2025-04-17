import React from "react";

const StockNewsItem = ({ newsItem }) => {
  if (!newsItem) return null;

  return (
    <div className="news-item mb-4 p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h5 className="text-dark font-weight-bold mb-2">
        <a
          href={newsItem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark text-decoration-none"
        >
          {newsItem.title}
        </a>
      </h5>
      <p className="text-muted small mb-3">
        <strong>Source:</strong> {newsItem.source} | <strong>Published:</strong>{" "}
        {new Date(newsItem.pubDate).toLocaleDateString()}
      </p>
      <p className="text-dark">{newsItem.summary}</p>
    </div>
  );
};

export default StockNewsItem;
