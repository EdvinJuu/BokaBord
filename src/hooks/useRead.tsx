import axios from "axios";
import { useEffect, useState } from "react";
import type { RestaurantProps } from "../types";



export const useRead = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get<RestaurantProps[]>("http://localhost:3001/restaurants")
        const data = await response.data
        setRestaurants(data);
      } catch (error) {
        console.error(error);
        setError("Could not load restaurants. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks()
  }, []);
  return { restaurants, error, isLoading };
}
