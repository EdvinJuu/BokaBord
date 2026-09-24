import { Navbar } from "./components/Navbar";
import RestaurantList from "./components/RestaurantList";
import BookingForm from "./components/BookingForm";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
