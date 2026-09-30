import BookingForm from "../components/BookingForm";
import { Navbar } from "../components/Navbar";
import RestaurantList from "../components/RestaurantList";
import useReadJson from "../hooks/useReadJson";

function Home() {

  const restaurants = useReadJson()

  return <>
  <Navbar />
  <BookingForm />
  <RestaurantList restaurants={restaurants} />
  </>;
}

export default Home;
