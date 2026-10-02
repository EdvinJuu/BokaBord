import { Link } from "react-router-dom";
import type { RestaurantProps } from "../types";
import "./RestaurantCard.css"


interface RestaurantCardProps {
  restaurant: RestaurantProps;
}

export function RestaurantCard({restaurant} : RestaurantCardProps) {

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card">
      <h2>{restaurant.name}</h2>
      <p>
        <strong>{restaurant.descriptions.join(" • ")}</strong>
      </p>
      <p>{restaurant.address}</p>
    </Link>
  );
}

