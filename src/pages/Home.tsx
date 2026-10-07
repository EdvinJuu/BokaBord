import axios from "axios";
import { useState, useEffect } from "react";
import type { RestaurantProps } from "../types";
import RestaurantList from "../components/RestaurantList";
import { useRead } from "../hooks/useRead";
import DataBoundary from "../components/DataBoundary";

function Home() {
  const { restaurants, isLoading, error } = useRead();

  return (
    <main>
      <div>
        <DataBoundary isLoading={isLoading} data={restaurants} error={error}>
          {(currentRestaurants) => <RestaurantList restaurants={currentRestaurants} />}
        </DataBoundary>
      </div>
    </main>
  );
}

export default Home;
