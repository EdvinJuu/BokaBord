import { Link } from "react-router-dom";
import type { RestaurantProps } from "../types";
import "./RestaurantCard.css"

/* if (thing) { kör den här funktionen}
else {kör den här funktionen}
thing == false ? kör den här funktionen : console.log() */

export function RestaurantCard({
  id,
  name,
  address,
  descriptions,
}: RestaurantProps) {
  if (!descriptions) return null;

  return (
    <li className="restaurant-card-container">
      <h2>{name}</h2>
      <div>
        {descriptions.map((description, i) => (
          <div key={i}>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <div>
        <img src="" alt="Pin Icon" />
        <p>{address}</p>
      </div>
      <Link to={`/restaurant/${id}`}>Läs mer om {name}</Link>
    </li>
  );
}

