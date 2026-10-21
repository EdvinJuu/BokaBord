
import type { RestaurantProps } from "../types";
import { RestaurantSearchCard } from "./RestaurantSearchCard";
import "./SearchField.css";

interface SearchFieldProps {
  restaurants: RestaurantProps[];
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchField = ({ restaurants, searchInput, setSearchInput }: SearchFieldProps) => {

    const searchInputFilter = searchInput.trim().toLowerCase();

    const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchInputFilter) ||
      r.menu.toLowerCase().includes(searchInputFilter) ||
      r.descriptions.some((badge) => badge.toLowerCase().includes(searchInputFilter))
  );

  return (
    
    <ul className="search-restaurant-list-container">
      {filteredRestaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <RestaurantSearchCard
            {...restaurant} // Det är samma sak som att skriva alla props som ligger under RestaurantSearchCard
            setSearchInput={setSearchInput}
          />
        </li>
      ))}
    </ul>
  );
};

export default SearchField;