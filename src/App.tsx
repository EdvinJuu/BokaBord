import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantDetails from "./pages/RestaurantDetails";
import Dashboard from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
