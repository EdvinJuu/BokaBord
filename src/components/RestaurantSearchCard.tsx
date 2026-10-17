
import { Link } from "react-router-dom";
import type { RestaurantProps } from "../types";
import "./RestaurantCard.css";

    interface restaurantSearchCardProps extends RestaurantProps {
        setSearchInput:React.Dispatch<React.SetStateAction<string>>;
    }

export function RestaurantSearchCard({
  id,
  name,
  descriptions,
  menu,
  setSearchInput,
}: restaurantSearchCardProps) {
  if (!descriptions) return null;

    function handleLinkOnClick(e: React.MouseEvent) {
        e.stopPropagation();
        setSearchInput("");

    }

  return (
    <article className="restaurant-card">
      <Link onClick={handleLinkOnClick} to={`/restaurant/${id}`}>
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
