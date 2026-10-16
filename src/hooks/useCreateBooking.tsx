import { useState } from "react";
import api from "../services/api";
import type { BookingFormRestaurant } from "../types";

export const useCreateBooking = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (
    id: number,
    name: string,
    sessionInterval: number,
    openTime: number[],
  ): Promise<BookingFormRestaurant | null> => {
    setIsLoading(true);
    setError(null);

    try {
        // api hämtar bas URLen från api.ts
        //  Jag hämtade restaurants/ URL från server men ändra gärna om det behövs
      const response = await api.post(`/restaurants/${id}/bookings`, {
        id,
        name,
        sessionInterval,
        openTime,
      });

      console.log("Booking succesfully added", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      setError("Could not load tasks. Is the backend running?");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createBooking, error, isLoading };
};
