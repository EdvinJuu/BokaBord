import { useBooking } from "../BookingContext"
import "./Dashboard.css";

const Dashboard = () => {

  const {booking, setBooking} = useBooking()

  return (
    <article className="dashboard">
      <p>{booking[0].partySize}</p>
      <button
        type="button"
        className="dashboard-button"
        onClick={() => setBooking([{ date: new Date(), partySize: 10 }])}
      >
        Set Booking
      </button>
    </article>
  )
}

export default Dashboard
