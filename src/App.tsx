import { RestaurantCard } from "./components/RestaurantCard";
import { Navbar } from "./components/Navbar";
import type { RestaurantProps } from "./types";

function App() {
  const testRestaurants: RestaurantProps[] = [
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
  ];

  return (
    <>
      <Navbar />
      <div>
        {testRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            id={restaurant.id}
            name={restaurant.name}
            address={restaurant.address}
            descriptions={restaurant.descriptions}
            menu=""
          />
        ))}
      </div>
    </>
  );
}

export default App;
