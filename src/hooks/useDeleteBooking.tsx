import { useState } from "react";
import api from "../services/api";


export const useDeleteBooking = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteBooking = async (id: number): Promise<number[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      
      const response = await api.delete<{ deletedIds: number[]}>((`/tasks/${id}`));

      console.log("Task(s) succesfully deleted", response.data.deletedIds);
      return response.data.deletedIds;
    } catch (error) {
      console.error(error);
      setError("Could not delete the task.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteBooking, error, isLoading };
};
