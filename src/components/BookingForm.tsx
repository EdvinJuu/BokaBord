import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const availableTimes = [
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

const availablePartySizes = ["1", "2", "3", "4", "5", "6", "7", "8"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getAvailableDates(daysAhead: number) {
  const dates: Date[] = [];
  const start = new Date();

  for (let i = 0; i < daysAhead; i++) {
    dates.push(
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
    );
  }

  return dates;
}

function BookingForm() {
  const availableDates = getAvailableDates(14);

  const [date, setDate] = useState(availableDates[0]);
  const [time, setTime] = useState("18:00");
  const [partySize, setPartySize] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    availableDates.some(
      (availableDate) => toDateKey(availableDate) === toDateKey(date),
    ) &&
    availableTimes.includes(time) &&
    availablePartySizes.includes(partySize);

  function handleChange(setter: (value: string) => void) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSubmitted(false);
      setter(e.target.value);
    };
  }

  function handleDateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSubmitted(false);
    const next = availableDates.find(
      (availableDate) => toDateKey(availableDate) === e.target.value,
    );
    if (next) setDate(next);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Card className="shadow-sm sticky-lg-top" style={{ top: "5.5rem" }}>
      <Card.Body>
        <Card.Title as="h2">Boka bord</Card.Title>
        <Card.Text className="text-secondary">Välj tid och antal gäster.</Card.Text>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="booking-date">
                <Form.Label>Datum</Form.Label>
                <Form.Select value={toDateKey(date)} onChange={handleDateChange}>
                  {availableDates.map((availableDate) => (
                    <option key={toDateKey(availableDate)} value={toDateKey(availableDate)}>
                      {toDateKey(availableDate)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="booking-time">
                <Form.Label>Tid</Form.Label>
                <Form.Select value={time} onChange={handleChange(setTime)}>
                  {availableTimes.map((availableTime) => (
                    <option key={availableTime} value={availableTime}>
                      {availableTime}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3" controlId="booking-party">
            <Form.Label>Antal gäster</Form.Label>
            <Form.Select value={partySize} onChange={handleChange(setPartySize)}>
              {availablePartySizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="danger" className="mt-3 w-100">
            Skicka bokningsförfrågan
          </Button>

          {submitted && isValid && (
            <Alert variant="success" className="mt-3 mb-0">
              Din bokningsförfrågan är skickad
            </Alert>
          )}
          {submitted && !isValid && (
            <Alert variant="danger" className="mt-3 mb-0">
              Se över din bokningsförfrågan och prova igen
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default BookingForm;
