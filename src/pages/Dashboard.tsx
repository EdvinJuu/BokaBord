import { useBooking } from "../BookingContext"

const Dashboard = () => {

  const {booking, setBooking} = useBooking()

  return (
  <>
  <p>{booking[0].partySize}</p>
  <button onClick={() => setBooking([{ date: new Date(), partySize: 10 }])}>Set Booking</button>
  </>
  )
}

export default Dashboard