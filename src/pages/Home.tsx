import axios from "axios";
import { useEffect, useState } from "react";
import RestaurantList from "../components/RestaurantList";
import type { RestaurantProps } from "../types";
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
