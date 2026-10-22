import RestaurantList from "../components/RestaurantList";
import { useRead } from "../hooks/useReadRestaurants";
import DataBoundary from "../components/DataBoundary";
import Hero from "../components/Hero";

function Home() {
  const { restaurants, isLoading, error } = useRead();

  return (
    <main>
      <Hero />
      <div>
        <DataBoundary isLoading={isLoading} data={restaurants} error={error}>
          {(currentRestaurants) => <RestaurantList restaurants={currentRestaurants} />}
        </DataBoundary>
      </div>
    </main>
  );
}

export default Home;
