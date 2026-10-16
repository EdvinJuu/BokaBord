import { RestaurantCard } from "../components/RestaurantCard";
import type { RestaurantProps } from "../types";
import "./RestaurantList.css";


interface RestaurantListProps {
  restaurants: RestaurantProps[];
}

function RestaurantList({ restaurants }: RestaurantListProps) {
  return (
    <ul className="restaurant-list-container">
      {restaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <RestaurantCard
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
}

export default RestaurantList;
