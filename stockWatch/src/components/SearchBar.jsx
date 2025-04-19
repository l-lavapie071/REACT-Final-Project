import React, { useState } from "react";

function SearchBar({
  onSearch,
  buttonLabel = "Search",
  placeholder = "Search Keyword...",
}) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-light">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
