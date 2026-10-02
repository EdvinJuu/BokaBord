import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import type { RestaurantProps } from "../types";

/* if (thing) { kör den här funktionen}
else {kör den här funktionen}
thing == false ? kör den här funktionen : console.log() */

export function RestaurantCard({
  name,
  address,
  descriptions,
  menu,
  openTime,
}: RestaurantProps) {
  if (!descriptions) return null;

  const hours =
    openTime.length >= 2 ? ` · Öppet ${openTime[0]}–${openTime[1]}` : "";

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title as="h2" className="h4">
          {name}
        </Card.Title>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {descriptions.map((description, index) => (
            <Badge bg="secondary" key={`${description}-${index}`}>
              {description}
            </Badge>
          ))}
        </div>
        <Card.Text className="mb-1">{menu}</Card.Text>
        <Card.Text className="text-secondary mb-0">
          {address}
          {hours}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

