import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { RestaurantProps } from "../types";

/* if (thing) { kör den här funktionen}
else {kör den här funktionen}
thing == false ? kör den här funktionen : console.log() */

export function RestaurantCard({
  id,
  name,
  address,
  descriptions,
  menu,
  image,
  openTime,
}: RestaurantProps) {
  if (!descriptions) return null;

  const hours =
    openTime.length >= 2 ? ` · Öppet ${openTime[0]}–${openTime[1]}` : "";

  const cardStyle = {
    "--card-photo": `url("${image}")`,
  } as CSSProperties;

  return (
    <article className="restaurant-card" style={cardStyle}>
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
