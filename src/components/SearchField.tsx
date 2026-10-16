import type { RestaurantProps } from "../types";
import { RestaurantSearchCard } from "./RestaurantSearchCard";

interface SearchFieldProps {
  restaurants: RestaurantProps[];
  searchInput: string;
}

const SearchField = ({ restaurants, searchInput }: SearchFieldProps) => {
 
    const searchInputFilter = searchInput.trim().toLowerCase();

    const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchInputFilter) ||
      r.menu.toLowerCase().includes(searchInputFilter) ||
      r.descriptions.some((badge) => badge.toLowerCase().includes(searchInputFilter))
  );

  return (
    
    <ul className="restaurant-list-container">
      {filteredRestaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <RestaurantSearchCard
            id={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            descriptions={restaurant.descriptions}
            menu={restaurant.menu}
            image={restaurant.image}
            openTime={restaurant.openTime}
            totalTables={restaurant.totalTables}
          />
        </li>
      ))}
    </ul>
  );
};

export default SearchField;
