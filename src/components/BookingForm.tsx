import { useState } from "react";
import { reformulateDatetoString } from "../utilities/dateFormatter";

function BookingForm() {
  const currentTime = new Date();
  const { currentHour, currentMinutes } = reformulateDatetoString(
    new Date(1995, 11, 17, 3, 2, 0),
  );
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState(currentTime.toISOString().slice(0, 10));
  const [time, setTime] = useState(`${currentHour}:${currentMinutes}`);

  /*   function handleOnSubmit(e) {
    e.preventDefault();
    console.log("Hej"); 
  } */

  return (
    <>
      <form /* onSubmit={handleOnSubmit} */>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            date > currentTime && setDate(e.target.value);
          }}
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

        {partySize}
      </p>
      <p>{time}</p>
    </>
  );
}

export default BookingForm;
