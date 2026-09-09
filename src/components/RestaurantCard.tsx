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
    <div>
      <h2>{name}</h2>
      <ul>
        {descriptions.map((description) => (
          <li>
            <p>{description}</p>
          </li>
        ))}
      </ul>
      <div>
        <img src="" alt="Pin Icon" />
        <p>{address}</p>
      </div>
    </div>
  );
}


/*Det här är bara något jag testar//Rebecca

function RestaurantList({ restaurants }: RestaurantListProps) {
    return (
        <div>
            {restaurants.map((restaurant) => (
                <RestaurantCard
                    key={restaurant.id}
                    name={restaurant.name}
                    address={restaurant.address}
                    descriptions={restaurant.descriptions}
                />
            ))}
        </div>
    );
}

const restaurants: RestaurantProps[] = [
    {
        id: 1,
        name: "Abc",
        address: "någonstans 1",
        menu: "blaha",
        descriptions: ["lalala", "tralalala", "tralalala"]
    }
];

<RestaurantList restaurants={restaurants} />
*/