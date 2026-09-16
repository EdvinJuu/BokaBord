import type { RestaurantProps } from "../types";

/* if (thing) { kör den här funktionen}
else {kör den här funktionen}
thing == false ? kör den här funktionen : console.log() */

export function RestaurantCard({
  name,
  address,
  descriptions,
}: RestaurantProps) {
  if (!descriptions) return null;

  return (
    <li>
      <h2>{name}</h2>
      <div>
        {descriptions.map((description) => (
          <div>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <div>
        <img src="" alt="Pin Icon" />
        <p>{address}</p>
      </div>
    </li>
  );
}

