import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useBooking } from "../BookingContext"

const Dashboard = () => {

  const {booking, setBooking} = useBooking()

  return (
    <Card>
      <Card.Body>
        <p>{booking[0].partySize}</p>
        <Button variant="danger" onClick={() => setBooking([{ date: new Date(), partySize: 10 }])}>
          Set Booking
        </Button>
      </Card.Body>
    </Card>
  )
}

export default Dashboard