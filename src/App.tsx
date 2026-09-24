import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantDetails from "./pages/RestaurantDetails";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails/>} />
        <Route path="/Dashboard" element={<Dashboard/>}/>
      </Routes>
    </>
  );
}

export default App;
