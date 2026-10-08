import { useBooking } from "../BookingContext";
import { useState, type ChangeEvent, type FormEvent } from "react";
import "./BookingForm.css";

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

  return dates; // Se till att vi får en lista med Dates istället för strings
}

const BookingForm = () => {
  const { booking, setBooking } = useBooking();
  const availableDates = getAvailableDates(14);

  const [date, setDate] = useState(availableDates[0]); // Se till att den böjar som en Date
  const [time, setTime] = useState("18:00");
  const [partySize, setPartySize] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    availableDates.some(
      (availableDate) => toDateKey(availableDate) === toDateKey(date),
    ) &&
    availableTimes.includes(time) &&
    availablePartySizes.includes(partySize);

  function validateDate() {
    // Jämför datumet med availableDates(och tiden)
    //jämför datumet med öppettiderna från restaurangen
  }

  function handleChange(setter: (value: string) => void) {
    return (e: ChangeEvent<HTMLSelectElement>) => {
      setSubmitted(false);
      setter(e.target.value);
    };
  }

  function handleDateChange(e: ChangeEvent<HTMLSelectElement>) {
    setSubmitted(false);
    const next = availableDates.find(
      (availableDate) => toDateKey(availableDate) === e.target.value,
    );
    if (next) setDate(next);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBooking({ date: new Date(), partySize: 5 }); // byt ut date: till det uppdatera och validerade datumet, samma för partySize
    setSubmitted(true);
  }

  return (
    <aside className="booking">
      <h2>Boka bord</h2>
      <p>Välj tid och antal gäster.</p>
      <form onSubmit={handleSubmit}>
        <div className="booking-row">
          <label>
            Datum
            <select value={toDateKey(date)} onChange={handleDateChange}>
              {availableDates.map((availableDate) => (
                <option
                  key={toDateKey(availableDate)}
                  value={toDateKey(availableDate)}
                >
                  {toDateKey(availableDate)}
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
        </div>

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

        {submitted &&
          (isValid ? ( // validera att den visar rätt state
            <p className="alert alert-ok" role="status">
              Din bokningsförfrågan är skickad
            </p>
          ) : (
            <p className="alert alert-error" role="alert">
              Se över din bokningsförfrågan och prova igen
            </p>
          ))}
      </form>
    </aside>
  );
};

export default BookingForm;
