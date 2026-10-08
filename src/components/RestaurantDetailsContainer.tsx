import { Link } from "react-router-dom";
import type { RestaurantProps } from "../types";

interface RestaurantDetailsContainer {
  restaurants: RestaurantProps[];
  pageId: string;
}

const RestaurantDetailsContainer = ({restaurants, pageId}: RestaurantDetailsContainer) => {


  const currentRestaurant = restaurants.find(
    (restaurant) => pageId === restaurant.id.toString(),
  );

  if (!currentRestaurant) return <p>Restaurant was not found.</p>; // BYT UT MOT RIKTIG ERROR HANDLING

    const hours =
    currentRestaurant.openTime.length >= 2
      ? `Öppet ${currentRestaurant.openTime[0]}–${currentRestaurant.openTime[1]}`
      : "";

  return (
    <article className="details">
      <Link className="details-back" to="/">
        Alla restauranger
      </Link>
      <h1>{currentRestaurant.name}</h1>
      <div className="details-chips">
        {currentRestaurant.descriptions.map((description, index) => (
          <span className="details-chip" key={`${description}-${index}`}>
            {description}
          </span>
        ))}
      </div>
      <p className="details-menu">{currentRestaurant.menu}</p>
      <p className="details-meta">
        {currentRestaurant.address}
        {hours ? ` · ${hours}` : ""}
        {` · ${currentRestaurant.totalTables} bord`}
      </p>
    </article>
  );
};

export default RestaurantDetailsContainer
