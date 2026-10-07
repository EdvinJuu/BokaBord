import { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import RestaurantList from "../components/RestaurantList";
import type { RestaurantProps } from "../types";
import "./Home.css";

function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch("/api/restaurants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kunde inte hämta restauranger");
        }
        return response.json();
      })
      .then((data: RestaurantProps[]) => {
        if (!ignore) setRestaurants(data);
      })
      .catch(() => {
        if (!ignore) setError("Kunde inte hämta restauranger");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="home">
      <section className="home-results">
        <h1>Restauranger</h1>
        {restaurants === null && !error && (
          <p className="status" role="status">
            <span className="spinner" aria-hidden="true" />
            Hämtar restauranger...
          </p>
        )}
        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}
        {restaurants && <RestaurantList restaurants={restaurants} />}
      </section>
      <div className="home-booking">
        <BookingForm />
      </div>
    </div>
  );
}

export default Home;
