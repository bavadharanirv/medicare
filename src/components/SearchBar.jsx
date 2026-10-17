
import { useEffect, useRef } from "react";

function SearchBar({ search, setSearch }) {
  const searchInput = useRef(null);

  useEffect(() => {
    searchInput.current?.focus();
  }, []);

  return (
    <div className="search-box">
      <input
        ref={searchInput}
        type="text"
        placeholder="Search doctor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search doctors"
      />
    </div>
  );
}

export default SearchBar;
