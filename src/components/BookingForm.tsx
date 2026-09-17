import { useState } from "react";

function BookingForm() {
  const [partySize, setPartySize] = useState("2");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("14:00");
  const [showPartySizeError, setShowPartySizeError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);
  const [showSubmitApproved, setShowSubmitApproved] = useState(false);
  const [showSubmitDenied, setShowSubmitDenied] = useState(false);

  function handleOnSubmit(e) {
    e.preventDefault();

    if (Number(partySize) >=1 && showDateError !== true && time !== "") {
      setShowSubmitDenied(false);
      setShowSubmitApproved(true);
      
    } else {
      setShowSubmitApproved(false);
      setShowSubmitDenied(true);
    }
  }

  function takeAwaySubmitErrors (){
        setShowSubmitApproved(false)
        setShowSubmitDenied(false)
  }

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            takeAwaySubmitErrors();

            if (e.target.value >= today) {
              setDate(e.target.value);
              setShowDateError(false);           
            } else {
              setShowDateError(true);
            }
          }}
        ></input>

        <input
          type="time"
          value={time}
          onChange={(e) => {
            takeAwaySubmitErrors();

            if (e.target.value !== "") {
              setTime(e.target.value);
              setShowTimeError(false);
            } else {
              setTime(e.target.value);
              setShowTimeError(true);
            }
          }}
        ></input>

        <input
          type="number"
          min="1"
          value={partySize}
          onChange={(e) => {
            takeAwaySubmitErrors();

            if (Number(e.target.value) >= 1) {
              setPartySize(e.target.value);
              setShowPartySizeError(false);
            } else {
              setPartySize(e.target.value);
              setShowPartySizeError(true);
            }
          }}
        ></input>

        {showDateError && <p>Du kan inte välja ett datum som passerat</p>}
        {showTimeError && <p>Du måste välja en tid</p>}
        {showPartySizeError && <p>Du måste välja minst 1 gäst</p>}

        <button type="submit">Skicka bokningsförfrågan</button>
        
        {showSubmitApproved && <p>Din bokningsförfrågan är skickad</p>}
        {showSubmitDenied && <p>Se över din bokningsförfrågan och prova igen</p>}
      
      </form>
    </>
  );
}

export default BookingForm;
