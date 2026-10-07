import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { RestaurantProps } from "../types";
import "./RestaurantDetails.css";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<RestaurantProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    setRestaurant(null);
    setError(null);

    fetch(`/api/restaurants/${id}`)
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Restaurangen finns inte");
        }
        if (!response.ok) {
          throw new Error("Kunde inte hämta restaurangen");
        }
        return response.json();
      })
      .then((data: RestaurantProps) => {
        if (!ignore) setRestaurant(data);
      })
      .catch((fetchError: Error) => {
        if (!ignore) setError(fetchError.message);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (error) {
    return (
      <article className="details">
        <p className="details-message" role="alert">
          {error}
        </p>
        <Link className="details-back" to="/">
          Alla restauranger
        </Link>
      </article>
    );
  }

  if (!restaurant) {
    return (
      <article className="details">
        <p className="details-message" role="status">
          Hämtar restaurang...
        </p>
      </article>
    );
  }

  const hours =
    restaurant.openTime.length >= 2
      ? `Öppet ${restaurant.openTime[0]}–${restaurant.openTime[1]}`
      : "";

  return (
    <article className="details">
      <Link className="details-back" to="/">
        Alla restauranger
      </Link>
      <h1>{restaurant.name}</h1>
      <div className="details-chips">
        {restaurant.descriptions.map((description, index) => (
          <span className="details-chip" key={`${description}-${index}`}>
            {description}
          </span>
        ))}
      </div>
      <p className="details-menu">{restaurant.menu}</p>
      <p className="details-meta">
        {restaurant.address}
        {hours ? ` · ${hours}` : ""}
        {` · ${restaurant.totalTables} bord`}
      </p>
    </article>
  );
};

export default RestaurantDetails;
