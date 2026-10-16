import { useState } from "react";
import "./SearchBar.css";
import { useRead } from "../hooks/useReadRestaurants";
import type { RestaurantProps } from "../types";
import SearchField from "./SearchField";
import DataBoundary from "./DataBoundary";

export function SearchBar() {
  const { restaurants, isLoading, error } = useRead();

  const [searchInput, setSearchInput] = useState("");

  

  return (
    <form
      className="search"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="sr-only" htmlFor="restaurant-search">
        Sök restaurang
      </label>
      <div className="search-container">
        <div className="search-box">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 20L16.5 16.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            id="restaurant-search"
            type="search"
            placeholder="Sök restaurang, beskrivning etc..."
            aria-label="Sök restaurang"
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        {searchInput.trim() && <DataBoundary data={restaurants} isLoading={isLoading} error={error}>
          {(currentRestaurants) => {
            if (!restaurants)
              return <p>Vi har tyvärr inga restauranger just nu</p>;
            return <SearchField
              restaurants={currentRestaurants}
              searchInput={searchInput}
            />;
          }}
        </DataBoundary>}
      </div>
    </form>
  );
}
