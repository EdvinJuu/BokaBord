import axios from "axios";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

/*
  Det här är bokningsformuläret på restaurangsidan. RestaurantDetails
  ritar ut <BookingForm> och skickar med restaurangens data som props.
  Formuläret hämtar inte restaurangen själv. Någon annan har redan gjort
  det jobbet, vi bara tar emot kuvertet.

  Filen i tre steg, så du slipper läsa den upp och ner:
  1. Funktionerna här ovanför räknar ut datum, tider och om kontakten
     ser rimlig ut. Vanliga funktioner. De ser varken hooks, props
     eller state. Rör inte dem om du vill ha en hook, de kan inte
     hjälpa dig.
  2. useState inne i BookingForm håller det gästen klickat i sig.
     Den staten bor bara här. Andra sidor ser den inte, hur mycket
     de än kisar.
  3. handleSubmit POSTar valet till /api/restaurants/:id/bookings.

  Så kopplar du in en hook, till exempel useBooking i BookingContext:
  - Anropa den här uppe i BookingForm, samma ställe som useState.
    Inte inuti handleSubmit, handleChange eller funktionerna där uppe.
    React gillar inte hooks som dyker upp mitt i en handler, och den
    säger till. Högt.
  - useBooking funkar här ute. main.tsx har redan lagt BookingProvider
    runt hela appen, så du behöver inte jaga providers.
      import { useBooking } from "../BookingContext";
      const { booking, setBooking } = useBooking();
  - useState när bara formuläret bryr sig. useBooking när en annan
    sida också ska se bokningen. Context är den gemensamma whiteboarden.
  - Skriv till den delade staten efter att POST har gått bra. Annars
    visar sidan en bokning som servern aldrig hörde talas om.
  - Context vill ha ReservationProps: { date: Date, partySize }.
    API:t vill ha { date: "YYYY-MM-DD", time, partySize, contact }.
    Samma bokning, två olika outfit. Gör om värdena innan du lägger
    dem i context, annars blir det en sträng som låtsas vara ett Date.
*/

// 1 till 8 gäster. Både formuläret och backend är överens. En nionde person får vänta på nästa sittning.
const availablePartySizes = ["1", "2", "3", "4", "5", "6", "7", "8"];

/*
  Bygger tiderna man kan boka.
  openTime är [öppnar, stänger] i hela timmar, typ [11, 22].
  sessionInterval är hur länge man får sitta, i minuter.
  Första tiden är när de öppnar. Sen hoppar vi ett intervall i taget.
  Sista tiden måste hinna bli klar innan de stänger, så loopen ger
  upp när start + intervall stickar ut förbi stängning.
  Skickar någon in skräp får de en tom lista. Tom meny, inga tider,
  ingen middag. Traurig men säkert.
*/
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

/*
  Date in, "2026-10-16" ut. Det formatet vill backend ha i date.
  Jämför alltid via den här strängen. Två Date kan vara samma dag
  och ändå vägra vara lika. Date-objekt är lite dramatiska.
*/
function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/*
  Sant om texten är en mejl eller ett telefonnummer.
  Samma regler som isContact i backend/server.js, så vi inte säger
  ja här och får nej där. Max 80 tecken. Mejl behöver @ och en punkt.
  Telefon är 7–15 siffror. Mellanslag och bindestreck struntar vi i,
  och ett plus i början är välkommet.
*/
function isContact(value: string) {
  const contact = value.trim();
  if (!contact || contact.length > 80) return false;

  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phone = /^\+?\d{7,15}$/.test(contact.replace(/[\s-]/g, ""));
  return email.test(contact) || phone;
}

/*
  Idag och några dagar framåt. daysAhead stycken. Vi ber om 14,
  alltså idag plus 13 dagar. Backend godkänner samma fönster.
  new Date(år, månad, dag) sätter klockan till midnatt lokal tid,
  så sommartid inte knuffar oss till fel dag. Den fällan är klassisk.
*/
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
  // Räknas om varje render, men bryr sig bara om props och dagens datum. Gästens klick rör inte de här listorna.
  const availableDates = getAvailableDates(14);
  const availableTimes = getAvailableTimes(openTime, sessionInterval);

  /*
    Varje useState är ett värde och en funktion som byter det.
    setDate och kompisarna säger åt React att rita om med det nya.

    Din hook ska in här, innan vi hittar på något annat:
      const { booking, setBooking } = useBooking();
    Ska hooken styra ett fält byter du ut den useState mot hookens
    värde och setter. Annars låter du useState vara ifred och ropar
    på setBooking när bokningen faktiskt är skickad.
  */
  const [date, setDate] = useState(availableDates[0]);
  // 18:00 om de är öppna då. Annars första tiden i listan. Folk vill äta middag, inte frukost, om de får välja.
  const [time, setTime] = useState(
    availableTimes.includes("18:00") ? "18:00" : (availableTimes[0] ?? ""),
  );
  const [partySize, setPartySize] = useState("2");
  const [contact, setContact] = useState("");
  // idle: inget hänt. sending: vi väntar på servern. ok: grattis. error: nåt gick snett, texten ligger i errorMessage.
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  /*
    useRef är en lapp som inte ber React rita om när den ändras.
    sending.current är true medan vi väntar på servern, så ett
    dubbelklick inte skickar två bokningar. Knappen blir också
    disabled, men ref:en hinner före den där extrasnabba klicken
    som kommer innan React hunnit måla om. Människor är snabba
    när de är hungriga.
  */
  const sending = useRef(false);

  /*
    true bara om allt gästen valt faktiskt finns i listorna.
    Datum i availableDates, tid i availableTimes, antal i
    availablePartySizes, och kontakten måste ta sig förbi isContact.
    Servern kollar samma sak en gång till. Litar inte på oss.
    Är isValid falskt skickar vi ingenting.
  */
  const isValid =
    availableDates.some(
      (availableDate) => toDateKey(availableDate) === toDateKey(date),
    ) &&
    availableTimes.includes(time) &&
    availablePartySizes.includes(partySize) &&
    isContact(contact);

  /*
    En onChange som flera select kan dela på. handleChange(setTime)
    ger tillbaka funktionen React anropar när tiden byts.
    setStatus("idle") gömmer gamla "det gick!" och "det gick inte"
    så fort någon rör ett fält. Datum får en egen handler, för där
    är state ett Date och select bara kan lämna ifrån sig en sträng.
    Select och Date pratar inte samma språk.
  */
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

  /*
    Det som händer när gästen trycker på skicka.
    e.preventDefault() säger åt webbläsaren att låta bli att ladda
    om sidan. Vi sköter det här själva.

    Det vi skickar:
      { date: "YYYY-MM-DD", time: "18:00", partySize: 2, contact: "..." }
    partySize måste vara ett nummer. I state är det en sträng, för
    select kan bara strängar. Number(partySize) får översätta.

    Servern svarar 201 och skickar tillbaka bokningen, eller 400,
    404 eller 500 med { error: "..." }. Feltexten hamnar under knappen.

    När status blir "ok" är bokningen sparad. Där petar du in din
    hook om resten av sidan ska få veta:
      const saved = await axios.post(...)
      setBooking((current) => [
        ...current,
        { date, partySize: Number(partySize) },
      ]);
    date i context är ett Date. date till API:t är strängen från
    toDateKey. Blanda inte ihop dem, de låtsas bara vara släkt.
  */
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

  /*
    aside är sidokolumnen. id är till för den som vill länka hit
    med #booking-<restaurangens id>.

    value och onChange gör fälten kontrollerade. React håller i
    värdet, så rutan visar alltid det som ligger i state. Ska din
    hook styra samma fält får den antingen läsa den här staten,
    eller ta över useState helt. Båda kan inte vara chef.
  */
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
