import { Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Home from "./pages/Home";
import RestaurantDetails from "./pages/RestaurantDetails";
import Dashboard from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Container as="main" className="py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails/>} />
          <Route path="/Dashboard" element={<Dashboard/>}/>
        </Routes>
      </Container>
    </>
  );
}

export default App;
