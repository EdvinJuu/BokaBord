import { useEffect, useState } from "react";
import type { RestaurantProps } from "../types";
import api from "../services/api";

export const useRead = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [restaurants, setRestaurants] = useState<RestaurantProps[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);

      try {
        const response = await api.get<RestaurantProps[]>(
          "/restaurants",
        );
        setRestaurants(response.data);
      } catch (error) {
        console.error(error);
        setError("Could not load restaurants. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);
  return { restaurants, error, isLoading };
};
