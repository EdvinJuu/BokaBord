import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import BookingForm from "../components/BookingForm";
import RestaurantList from "../components/RestaurantList";
import type { RestaurantProps } from "../types";
import restaurantsUrl from "../assets/restaurants.json?url";

function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    fetch(restaurantsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kunde inte hämta restauranger");
        }
        return response.json();
      })
      .then((data: RestaurantProps[]) => {
        if (!ignore) setRestaurants(data);
      })
      .catch(() => {
        if (!ignore) setError("Kunde inte hämta restauranger");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Row className="g-4">
      <Col lg={5} className="order-1 order-lg-2">
        <BookingForm />
      </Col>
      <Col lg={7} className="order-2 order-lg-1">
        <h1 className="mb-4">Restauranger</h1>
        {restaurants === null && !error && (
          <p className="text-secondary">
            <Spinner animation="border" size="sm" className="me-2" role="status" />
            Hämtar restauranger...
          </p>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {restaurants && <RestaurantList restaurants={restaurants} />}
      </Col>
    </Row>
  );
}

export default Home;
