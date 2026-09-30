import { useState } from "react";
import { useBooking } from "../BookingContext";

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

const availablePartySizes = ["1", "2", "3", "4", "5", "6", "7", "8"]; // Byt ut till Integers, vi kan konvertera till string vid rendering (om det behövs)

function getAvailableDates(daysAhead: number) {
  

  const dates: string[] = [];
  const start = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates; // Se till att vi får en lista med Dates istället för strings
}

const BookingForm = () => {
  const {booking, setBooking} = useBooking()
  const availableDates = getAvailableDates(14);

  const [date, setDate] = useState(availableDates[0]); // Se till att den böjar som en Date
  const [time, setTime] = useState("18:00");
  const [partySize, setPartySize] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    availableDates.includes(date) && //Jämför med datum objekt istället
    availableTimes.includes(time) &&
    availablePartySizes.includes(partySize);

  function validateDate() {
    // Jämför datumet med availableDates(och tiden)
    //jämför datumet med öppettiderna från restaurangen
  }

  function handleChange(setter: (value: string) => void) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSubmitted(false);
      setter(e.target.value);
    };
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setBooking({ date: new Date(), partySize: 5 }) // byt ut date: till det uppdatera och validerade datumet, samma för partySize
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Datum
        <select value={date} onChange={handleChange(setDate)}>
          {availableDates.map((availableDate) => (
            <option key={availableDate} value={availableDate}>
              {availableDate}
            </option>
          ))}
        </select>
      </label>

      <label>
        Tid
        <select value={time} onChange={handleChange(setTime)}>
          {availableTimes.map((availableTime) => (
            <option key={availableTime} value={availableTime}>
              {availableTime}
            </option>
          ))}
        </select>
      </label>

      <label>
        Antal gäster
        <select value={partySize} onChange={handleChange(setPartySize)}>
          {availablePartySizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Skicka bokningsförfrågan</button>

      {submitted && isValid ? (
        <p>Din bokningsförfrågan är skickad</p>
      ) : (
        <p>Se över din bokningsförfrågan och prova igen</p>
      )}
    </form>
  );
}

export default BookingForm;
