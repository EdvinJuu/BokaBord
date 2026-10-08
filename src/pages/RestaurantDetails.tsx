import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import "./RestaurantDetails.css";

import { useRead } from "../hooks/useRead";
import DataBoundary from "../components/DataBoundary";

const RestaurantDetails = () => {
  const { id } = useParams();

  const { restaurants, isLoading, error } = useRead();

  if (!id) return <p>Restaurant was not found.</p>; // BYT UT MOT RIKTIG ERROR HANDLING

  return (
    <DataBoundary data={restaurants} isLoading={isLoading} error={error}>
      {(currentRestaurants) => {
        const currentRestaurant = currentRestaurants.find(
          (restaurant) => String(restaurant.id) === id,
        );

        if (!currentRestaurant) {
          return <p>Restaurant was not found.</p>;
        }

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
      }}
    </DataBoundary>
  );
};

export default RestaurantDetails;
