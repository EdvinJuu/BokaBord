import { RestaurantCard } from "../components/RestaurantCard";
import type { RestaurantProps } from "../types";
import "./RestaurantList.css";

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

interface RestaurantListProps {
  restaurants: RestaurantProps[];
}

function RestaurantList({ restaurants }: RestaurantListProps) {
  return (
    <ul className="restaurant-list-container">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </ul>
  );
}

export default RestaurantList;
