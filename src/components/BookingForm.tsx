import { useState } from "react";

function BookingForm() {
  const [partySize, setPartySize] = useState("2");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("18:00");

  function handleOnSubmit(e) {
    e.preventDefault();
    console.log("Hej");
  }

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></input>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        ></input>
        <input
          type="number"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
        ></input>
        <button type="submit">Skicka bokningsförfrågan</button>
      </form>

      <p>
        {date} 
        {time}
        {partySize}
      </p>
    </>
  );
}

export default BookingForm;
