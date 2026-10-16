
import { Link } from "react-router-dom";
import type { RestaurantProps } from "../types";
import "./RestaurantCard.css";

export function RestaurantSearchCard({
  id,
  name,
  descriptions,
  menu,
}: Omit<RestaurantProps, "sessionInterval">) {
  if (!descriptions) return null;



  return (
    <article className="restaurant-card">
      <Link to={`/restaurant/${id}`}>
        <h2>{name}</h2>
        <div className="chips">
          {descriptions.map((description, index) => (
            <span className="chip" key={`${description}-${index}`}>
              {description}
            </span>
          ))}
        </div>
        <p className="menu">{menu}</p>
      </Link>
    </article>
  );
}
