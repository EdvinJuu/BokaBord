import { useState } from "react";

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

  return dates;
}

function BookingForm() {
  const availableDates = getAvailableDates(14);

  const [date, setDate] = useState(availableDates[0]);
  const [time, setTime] = useState("18:00");
  const [partySize, setPartySize] = useState("2");
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    availableDates.includes(date) &&
    availableTimes.includes(time) &&
    availablePartySizes.includes(partySize);

  function handleChange(setter: (value: string) => void) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSubmitted(false);
      setter(e.target.value);
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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

      {submitted && isValid && <p>Din bokningsförfrågan är skickad</p>}
      {submitted && !isValid && (
        <p>Se över din bokningsförfrågan och prova igen</p>
      )}
    </form>
  );
}

export default BookingForm;
