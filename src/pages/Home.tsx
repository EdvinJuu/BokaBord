import RestaurantList from "../components/RestaurantList";
import { useRead } from "../hooks/useReadRestaurants";
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
