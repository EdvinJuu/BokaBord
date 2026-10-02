import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";

const testList = [
  { id: 1, title: "test1" },
  { id: 2, title: "test2" },
  { id: 3, title: "test3" },
  { id: 4, title: "test4" },
];

const RestaurantDetails = () => {
  const { id } = useParams();

    if (Number(id) === testList[0].id) {
        return (
          <Card>
            <Card.Body>JAG ÄR ID {id}, {testList[0].title}</Card.Body>
          </Card>
        )
    }

  return (
    <Card>
      <Card.Body>HEEJ!!!</Card.Body>
    </Card>
  );
};

export default RestaurantDetails;
