import axios from "axios";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

const availablePartySizes = ["1", "2", "3", "4", "5", "6", "7", "8"];

function getAvailableTimes(openTime: number[], sessionInterval: number) {
  if (!Array.isArray(openTime) || openTime.length < 2) return [];
  if (!Number.isInteger(openTime[0]) || !Number.isInteger(openTime[1])) return [];
  if (!Number.isInteger(sessionInterval) || sessionInterval < 1) return [];

  const openMinutes = openTime[0] * 60;
  const closeMinutes = openTime[1] * 60;
  if (openMinutes < 0 || closeMinutes > 24 * 60 || openMinutes >= closeMinutes) return [];

  const times: string[] = [];
  for (let start = openMinutes; start + sessionInterval <= closeMinutes; start += sessionInterval) {
    const hours = Math.floor(start / 60);
    const minutes = start % 60;
    times.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
  }

  return times;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isContact(value: string) {
  const contact = value.trim();
  if (!contact || contact.length > 80) return false;

  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone = /^\+?\d{7,15}$/.test(contact.replace(/[\s-]/g, ""));
  return email.test(contact) || phone;
}

function getAvailableDates(daysAhead: number) {
  const dates: Date[] = [];
  const start = new Date();

  for (let i = 0; i < daysAhead; i++) {
    dates.push(
      new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
    );
  }

  return dates;
}

function BookingForm({
  restaurantId,
  restaurantName,
  sessionInterval,
  openTime,
}: {
  restaurantId: number;
  restaurantName: string;
  sessionInterval: number;
  openTime: number[];
}) {
  const availableDates = getAvailableDates(14);
  const availableTimes = getAvailableTimes(openTime, sessionInterval);

  const [date, setDate] = useState(availableDates[0]);
  const [time, setTime] = useState(
    availableTimes.includes("18:00") ? "18:00" : (availableTimes[0] ?? ""),
  );
  const [partySize, setPartySize] = useState("2");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const sending = useRef(false);

  const isValid =
    availableDates.some(
      (availableDate) => toDateKey(availableDate) === toDateKey(date),
    ) &&
    availableTimes.includes(time) &&
    availablePartySizes.includes(partySize) &&
    isContact(contact);

  function handleChange(setter: (value: string) => void) {
    return (e: ChangeEvent<HTMLSelectElement>) => {
      setStatus("idle");
      setter(e.target.value);
    };
  }

  function handleDateChange(e: ChangeEvent<HTMLSelectElement>) {
    setStatus("idle");
    const next = availableDates.find(
      (availableDate) => toDateKey(availableDate) === e.target.value,
    );
    if (next) setDate(next);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (sending.current) return;

    if (!isValid) {
      setStatus("error");
      setErrorMessage(
        isContact(contact)
          ? "Se över din bokningsförfrågan och prova igen"
          : "Ange en e-postadress eller ett telefonnummer",
      );
      return;
    }

    sending.current = true;
    setStatus("sending");

    try {
      await axios.post(`/api/restaurants/${restaurantId}/bookings`, {
        date: toDateKey(date),
        time,
        partySize: Number(partySize),
        contact: contact.trim(),
      });
      setStatus("ok");
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.error : null;
      setStatus("error");
      setErrorMessage(
        typeof message === "string" ? message : "Kunde inte skicka bokningsförfrågan",
      );
    } finally {
      sending.current = false;
    }
  }

  return (
    <aside className="booking" id={`booking-${restaurantId}`}>
      <h2>Boka bord</h2>
      <p>
        Välj tid och antal gäster hos {restaurantName}. En bokning gäller i {sessionInterval}{" "}
        minuter.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="booking-row">
          <label>
            Datum
            <select value={toDateKey(date)} onChange={handleDateChange}>
              {availableDates.map((availableDate) => (
                <option key={toDateKey(availableDate)} value={toDateKey(availableDate)}>
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

        <label>
          E-post eller telefon
          <input
            type="text"
            name="contact"
            value={contact}
            onChange={(event) => {
              setStatus("idle");
              setContact(event.target.value);
            }}
            autoComplete="on"
            required
          />
        </label>

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Skickar..." : "Skicka bokningsförfrågan"}
        </button>

        {status === "ok" && (
          <p className="alert alert-ok" role="status">
            Din bokningsförfrågan till {restaurantName} är skickad
          </p>
        )}
        {status === "error" && (
          <p className="alert alert-error" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </aside>
  );
}

export default BookingForm;
