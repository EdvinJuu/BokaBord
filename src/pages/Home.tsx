import axios from "axios";
<<<<<<< HEAD
import { useState, useEffect} from "react";
import type { RestaurantProps } from "../types";
import RestaurantList from "../components/RestaurantList";


function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
       .get<RestaurantProps[]>("http://localhost:3001/restaurants")
       .then((response) => {
        setTimeout(() => {
        setRestaurants(response.data);
        setLoading(false)
       }, 1000)
       })
       .catch((error) => {
        console.error(error);
        setError("Kunde inte hämta restauranger");
        setLoading(false)
       })
  }, []);

  if (loading) {
    return <p>Laddar Restauranger...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
  <main>
    <div>
      <RestaurantList restaurants={restaurants}/>
    </div>
  </main>
  )
=======
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

    axios
      .get<RestaurantProps[]>("/api/restaurants")
      .then((response) => {
        if (!ignore) setRestaurants(response.data);
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
>>>>>>> Magnus
}

export default Home;