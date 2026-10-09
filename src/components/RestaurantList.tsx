import { RestaurantCard } from "../components/RestaurantCard";
import type { RestaurantProps } from "../types";

/* const testRestaurants: RestaurantProps[] = [
  {
    id: 1,
    name: "Abc",
    address: "någonstans 1",
    menu: "blaha",
    descriptions: ["asdasdasd"],
  },
  {
    id: 2,
    name: "cvb",
    address: "någonstans 1",
    menu: "blaha",
    descriptions: ["lalala", "tralalala", "tralalala"],
  },
  {
    id: 3,
    name: "ghk",
    address: "någonstans 1",
    menu: "blaha",
    descriptions: ["lalala", "tralalala", "tralalala"],
  },
  {
    id: 4,
    name: "asd",
    address: "någonstans 1",
    menu: "blaha",
    descriptions: ["lalala", "tralalala", "tralalala"],
  },
  {
    id: 5,
    name: "dfh",
    address: "någonstans 1",
    menu: "blaha",
    descriptions: ["lalala", "tralalala", "tralalala"],
  },
]; */

function RestaurantList({ restaurants }: { restaurants: RestaurantProps[] }) {
  return (
    <ul className="restaurant-list">
      {restaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <RestaurantCard
            id={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            descriptions={restaurant.descriptions}
            menu={restaurant.menu}
            image={restaurant.image}
            openTime={restaurant.openTime}
            totalTables={restaurant.totalTables}
          />
        </li>
      ))}
    </ul>
  );
}

export default RestaurantList
