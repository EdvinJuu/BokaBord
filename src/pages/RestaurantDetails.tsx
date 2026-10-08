import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { RestaurantProps } from "../types";
import "./RestaurantDetails.css";
import useReadJson from "../hooks/useReadJson";

const RestaurantDetails = () => {
  const { id } = useParams();
  const restaurants = useReadJson() // Kommer konverteras till hook som läser från servern

  if (!id) return (<p>Restaurant was not found.</p>) // BYT UT MOT RIKTIG ERROR HANDLING

  const currentRestaurant = restaurants.find(restaurant => id === restaurant.id.toString())

   if (!currentRestaurant) return (<p>Restaurant was not found.</p>) // BYT UT MOT RIKTIG ERROR HANDLING

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
