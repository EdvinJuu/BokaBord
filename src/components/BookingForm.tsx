import { useState } from "react";
import { reformulateDate } from "../utilities/dateFormatter";

function BookingForm() {
  
  const [showPartySizeError, setShowPartySizeError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);

  const [showSubmitApproved, setShowSubmitApproved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [bookingTime, setBookingTime] = useState(new Date()); // vi kommer kanske att behöva använda oss av att den börjar som "null" för att stoppa bokningserrors
  const [partySize, setPartySize] = useState("2");

  function handleOnSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowSubmitApproved(false);
    setIsSubmitted(true);

    if (Number(partySize) >= 1 && showDateError !== true /* && time !== "" */) { // HAR INTE UPPDATERAT ÄN, MÅSTE KOLLAS ÖVER
      setShowSubmitApproved(true);
    }
  }

  function takeAwaySubmitErrors() {
    setShowSubmitApproved(false);
  }

  function handleDateOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    //återställ alla useStates
    takeAwaySubmitErrors();
    setIsSubmitted(false);
    setShowDateError(false);

    // skapa Date objekt för tiden just nu
    const currentDate = new Date();
    // skapa Date objekt för tiden vi kommer ändra till så vi inte skriver över datan i originella variabeln
    const bookingDate = bookingTime;

    //splitta up datum Stringen till 3 olika strings i en lista: [år, månad, datum]
    const dateSplit = e.target.value.split("-");

    // sätt date till datumen från inputet(och konvertera från string till nummer)
    bookingDate.setFullYear(Number(dateSplit[0]));
    bookingDate.setMonth(Number(dateSplit[1])); // setMonth ÄR INDEX 0-11 (Jan = 0), behöver konvertera från 1-12 range
    bookingDate.setDate(Number(dateSplit[2]));

    // jämför tiden just nu med tiden vi vill ändra till
    if (currentDate <= bookingDate) {
      console.log(`Datum är korrekt ${currentDate} > ${bookingDate}`); // tillfällig log för bugfixing, kan vara bra sätt att kolla sin kod

      // om datum är lika eller senare setBookingTime till datumet och return ut från funktionen
      return setBookingTime(bookingDate);
    }
    console.log(`Datum är inte korrekt, återvänder: ${currentDate} < ${bookingDate}`); // tillfällig log för bugfixing
    // om inte korrekt sätt error till true istället
    setShowDateError(true);
  }

  function handleTimeOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    takeAwaySubmitErrors();
    setIsSubmitted(false);
    setShowDateError(false);

    if (e.target.value === "") return // om time input är TOMT så avsluta funktionen tidigt

    // skapa Date objekt för tiden just nu
    const currentDate = new Date();
    // skapa Date objekt för tiden vi kommer ändra till så vi inte skriver över datan i originella variabeln
    const bookingDate = bookingTime;

    //splitta up time Stringen till 2 olika strings i en lista: [timmar, minuter]
    const dateSplit = e.target.value.split(":");

    // sätt date till datumen från inputet(och konvertera från string till nummer)
    bookingDate.setHours(Number(dateSplit[0]));
    bookingDate.setMinutes(Number(dateSplit[1]));

    // jämför tiden just nu med tiden vi vill ändra till
    if (currentDate <= bookingDate) {

      console.log(`Datum är korrekt ${currentDate} > ${bookingDate}`); // tillfällig log för bugfixing

      // om datum är lika eller senare setBookingTime till datumet och return ut från funktionen
      return setBookingTime(bookingDate);
    }

    console.log(`Datum är inte korrekt, återvänder: ${currentDate} < ${bookingDate}`); // tillfällig log för bugfixing

    // om inte korrekt sätt error till true istället
    setShowDateError(true);
  }

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <input
          type="date" // GONNA NEED TYPE VALIDATION
          value={reformulateDate(bookingTime, "getDate")} // Kör våran bokningstid genom våran reformulateDate funktion så vi ger våran <input> rätt value
          onChange={(e) => {
            handleDateOnChange(e);
          }}
        ></input>

        <input
          type="time" // GONNA NEED TYPE VALIDATION
          value={reformulateDate(bookingTime, "getTime")} // Kör våran bokningstid genom våran reformulateDate funktion så vi ger våran <input> rätt value
          onChange={(e) => {
            handleTimeOnChange(e);
          }}
        ></input>

        <input // GONNA NEED TYPE VALIDATION
          type="number"
          min="1"
          value={partySize}
          onChange={(e) => {
            takeAwaySubmitErrors();
            setIsSubmitted(false);

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
        {isSubmitted ? (
          showSubmitApproved ? (
            <p>Din bokningsförfrågan är skickad</p>
          ) : (
            <p>Se över din bokningsförfrågan och prova igen</p>
          )
        ) : (
          <></>
        )}
      </form>
      <p>
        {bookingTime.toDateString()}-{(new Date).toDateString()}
      </p>
    </>
  );
}

export default BookingForm;
