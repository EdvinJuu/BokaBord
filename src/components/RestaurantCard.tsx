import { Link } from "react-router-dom";
import type { RestaurantProps } from "../types";
import "./RestaurantCard.css";

interface restaurant {
  restaurant: RestaurantProps;
}

export function RestaurantCard({ restaurant }: restaurant) {
  /*   if (!descriptions) return null; */

  const { openTime, id, name, descriptions, menu, address } = restaurant;

  const hours =
    restaurant.openTime.length >= 2
      ? ` · Öppet ${openTime[0]}–${openTime[1]}`
      : "";

  return (
    <article className="restaurant-card">
      <h2>
        <Link to={`/restaurant/${id}`}>{name}</Link>
      </h2>
      <div className="chips">
        {descriptions.map((description, index) => (
          <span className="chip" key={`${description}-${index}`}>
            {description}
          </span>
        ))}
      </div>
      <p className="menu">{menu}</p>
      <p className="address">
        {address}
        {hours}
      </p>
    </article>
  );
}
