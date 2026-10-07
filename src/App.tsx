import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantDetails from "./pages/RestaurantDetails";
import Dashboard from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails/>} />
          <Route path="/Dashboard" element={<Dashboard/>}/>
        </Routes>
      </main>
    </>
  );
}

export default App;
