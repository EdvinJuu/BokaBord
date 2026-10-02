import axios from "axios";
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
}

export default Home;