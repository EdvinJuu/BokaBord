import axios from "axios";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { RestaurantProps } from "../types";
import "./Dashboard.css";
import api, { resolveApiUrl } from "../services/api";

const sessionKey = "bokabord-owner-session";

interface OwnerSession {
  token: string;
  restaurantId: number;
  restaurantName: string;
}

interface OwnerBooking {
  date: string;
  time: string;
  partySize: number;
  contact?: string;
  sessionInterval?: number;
}

interface RestaurantDraft {
  name: string;
  address: string;
  menu: string;
  descriptions: string;
  opens: string;
  closes: string;
  totalTables: string;
  sessionInterval: string;
}

function draftFromRestaurant(restaurant: RestaurantProps): RestaurantDraft {
  return {
    name: restaurant.name,
    address: restaurant.address,
    menu: restaurant.menu,
    descriptions: restaurant.descriptions.join(", "),
    opens: String(restaurant.openTime[0] ?? ""),
    closes: String(restaurant.openTime[1] ?? ""),
    totalTables: String(restaurant.totalTables),
    sessionInterval: String(restaurant.sessionInterval),
  };
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function readSession(): OwnerSession | null {
  const raw = sessionStorage.getItem(sessionKey);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as OwnerSession;
    if (!parsed.token || !Number.isInteger(parsed.restaurantId) || !parsed.restaurantName) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function Dashboard() {
  const [session, setSession] = useState<OwnerSession | null>(readSession);
  const [restaurants, setRestaurants] = useState<RestaurantProps[] | null>(null);
  const [restaurantId, setRestaurantId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [bookings, setBookings] = useState<OwnerBooking[] | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantProps | null>(null);
  const [draft, setDraft] = useState<RestaurantDraft | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [savingRestaurant, setSavingRestaurant] = useState(false);
  const [restaurantMessage, setRestaurantMessage] = useState<string | null>(null);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);

  useEffect(() => {
    if (session) return;

    let ignore = false;

    axios
      .get<RestaurantProps[]>("/api/restaurants")
      .then((response) => {
        if (!ignore) setRestaurants(response.data);
      })
      .catch(() => {
        if (!ignore) setLoginError("Kunde inte hämta restauranger");
      });

    return () => {
      ignore = true;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;

    let ignore = false;

    api
      .get<OwnerBooking[]>(`/restaurants/${session.restaurantId}/bookings`, {
        headers: { Authorization: `Bearer ${session.token}` },
      })
      .then((response) => {
        if (!ignore) setBookings(response.data);
      })
      .catch((error) => {
        if (ignore) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          sessionStorage.removeItem(sessionKey);
          setSession(null);
          setLoginError("Logga in igen");
          return;
        }
        setBookingsError("Kunde inte hämta bokningar");
      });

    return () => {
      ignore = true;
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;

    let ignore = false;

    axios
      .get<RestaurantProps>(`/api/restaurants/${session.restaurantId}`)
      .then((response) => {
        if (ignore) return;
        setRestaurant(response.data);
        setDraft(draftFromRestaurant(response.data));
      })
      .catch(() => {
        if (!ignore) setRestaurantError("Kunde inte hämta restaurangen");
      });

    return () => {
      ignore = true;
    };
  }, [session]);

  function clearOwnerState() {
    setBookings(null);
    setBookingsError(null);
    setRestaurant(null);
    setDraft(null);
    setImageFile(null);
    setImagePreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return "";
    });
    setRestaurantMessage(null);
    setRestaurantError(null);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    try {
      const response = await api.post<{
        token: string;
        restaurant: { id: number; name: string };
      }>("/sessions", {
        restaurantId: Number(restaurantId),
        password,
      });
      const nextSession = {
        token: response.data.token,
        restaurantId: response.data.restaurant.id,
        restaurantName: response.data.restaurant.name,
      };
      sessionStorage.setItem(sessionKey, JSON.stringify(nextSession));
      setPassword("");
      clearOwnerState();
      setSession(nextSession);
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.error : null;
      setLoginError(typeof message === "string" ? message : "Kunde inte logga in");
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleLogout() {
    const token = session?.token;
    sessionStorage.removeItem(sessionKey);
    setSession(null);
    clearOwnerState();
    setPassword("");

    if (!token) return;

    try {
      await api.delete("/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // The local session is already gone. A failed revoke still logs the owner out here.
    }
  }

  function updateDraft(field: keyof RestaurantDraft, value: string) {
    setRestaurantMessage(null);
    setRestaurantError(null);
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setRestaurantMessage(null);
    setRestaurantError(null);

    if (file && (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5_000_000)) {
      setImageFile(null);
      setRestaurantError("Bilden måste vara jpg, png eller webp och högst 5 MB");
      return;
    }

    setImageFile(file);
    setImagePreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : "";
    });
  }

  async function handleSaveRestaurant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !draft) return;

    const descriptions = draft.descriptions
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const opens = Number(draft.opens);
    const closes = Number(draft.closes);
    const totalTables = Number(draft.totalTables);
    const sessionInterval = Number(draft.sessionInterval);

    if (!draft.name.trim() || !draft.address.trim() || !draft.menu.trim() || descriptions.length === 0) {
      setRestaurantError("Fyll i namn, adress, meny och minst en beskrivning");
      return;
    }

    setSavingRestaurant(true);
    setRestaurantMessage(null);
    setRestaurantError(null);

    try {
      const image = imageFile ? await fileToDataUrl(imageFile) : undefined;
      const response = await api.put<RestaurantProps>(
        `/restaurants/${session.restaurantId}`,
        {
          name: draft.name,
          address: draft.address,
          menu: draft.menu,
          descriptions,
          openTime: [opens, closes],
          totalTables,
          sessionInterval,
          ...(image ? { image } : {}),
        },
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const saved = response.data;
      const nextSession = { ...session, restaurantName: saved.name };
      sessionStorage.setItem(sessionKey, JSON.stringify(nextSession));
      setSession(nextSession);
      setRestaurant(saved);
      setDraft(draftFromRestaurant(saved));
      setImageFile(null);
      setImagePreview((current) => {
        if (current.startsWith("blob:")) URL.revokeObjectURL(current);
        return "";
      });
      setRestaurantMessage("Uppgifterna är sparade");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        sessionStorage.removeItem(sessionKey);
        setSession(null);
        clearOwnerState();
        setLoginError("Logga in igen");
        return;
      }
      const message = axios.isAxiosError(error) ? error.response?.data?.error : null;
      setRestaurantError(typeof message === "string" ? message : "Kunde inte spara restaurangen");
    } finally {
      setSavingRestaurant(false);
    }
  }

  const rows = bookings
    ? [...bookings].sort(
        (left, right) =>
          left.date.localeCompare(right.date) || left.time.localeCompare(right.time),
      )
    : [];

  return (
    <article className="dashboard">
      <h1>Mina sidor</h1>
      {session ? (
        <>
          <div className="dashboard-heading">
            <p>
              Bokningar för <strong>{session.restaurantName}</strong>
            </p>
            <button type="button" className="dashboard-button dashboard-logout" onClick={handleLogout}>
              Logga ut
            </button>
          </div>
          <h2>Uppgifter</h2>
          {!draft && !restaurantError && (
            <p className="dashboard-status" role="status">
              Hämtar restaurangen...
            </p>
          )}
          {draft && (
            <form className="dashboard-edit" onSubmit={handleSaveRestaurant}>
              <img
                className="dashboard-photo"
                src={imagePreview || resolveApiUrl(restaurant?.image ?? "")}
                alt={draft.name}
              />
              <label>
                Bild
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} />
              </label>
              <label>
                Namn
                <input value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} required />
              </label>
              <label>
                Adress
                <input
                  value={draft.address}
                  onChange={(event) => updateDraft("address", event.target.value)}
                  required
                />
              </label>
              <label>
                Meny
                <textarea
                  value={draft.menu}
                  onChange={(event) => updateDraft("menu", event.target.value)}
                  required
                />
              </label>
              <label>
                Beskrivningar, separera med kommatecken
                <input
                  value={draft.descriptions}
                  onChange={(event) => updateDraft("descriptions", event.target.value)}
                  required
                />
              </label>
              <div className="dashboard-hours">
                <label>
                  Öppnar
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={draft.opens}
                    onChange={(event) => updateDraft("opens", event.target.value)}
                    required
                  />
                </label>
                <label>
                  Stänger
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={draft.closes}
                    onChange={(event) => updateDraft("closes", event.target.value)}
                    required
                  />
                </label>
              </div>
              <label>
                Antal bord
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={draft.totalTables}
                  onChange={(event) => updateDraft("totalTables", event.target.value)}
                  required
                />
              </label>
              <label>
                Bokningen gäller (minuter)
                <input
                  type="number"
                  min={15}
                  max={240}
                  value={draft.sessionInterval}
                  onChange={(event) => updateDraft("sessionInterval", event.target.value)}
                  required
                />
              </label>
              <button type="submit" className="dashboard-button" disabled={savingRestaurant}>
                {savingRestaurant ? "Sparar..." : "Spara uppgifter"}
              </button>
              {restaurantMessage && (
                <p className="dashboard-alert dashboard-alert-ok" role="status">
                  {restaurantMessage}
                </p>
              )}
              {restaurantError && (
                <p className="dashboard-alert dashboard-alert-error" role="alert">
                  {restaurantError}
                </p>
              )}
            </form>
          )}
          <h2>Bokningar</h2>
          {bookings === null && !bookingsError && (
            <p className="dashboard-status" role="status">
              Hämtar bokningar...
            </p>
          )}
          {bookingsError && (
            <p className="dashboard-alert dashboard-alert-error" role="alert">
              {bookingsError}
            </p>
          )}
          {bookings && rows.length === 0 && (
            <p className="dashboard-status">Inga bokningar ännu.</p>
          )}
          {rows.length > 0 && (
            <table className="dashboard-bookings">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Tid</th>
                  <th>Gäster</th>
                  <th>Kontakt</th>
                  <th>Längd</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((booking, index) => (
                  <tr key={`${booking.date}-${booking.time}-${booking.partySize}-${booking.contact ?? ""}-${index}`}>
                    <td>{booking.date}</td>
                    <td>{booking.time}</td>
                    <td>{booking.partySize}</td>
                    <td>{booking.contact || "—"}</td>
                    <td>{booking.sessionInterval ? `${booking.sessionInterval} min` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <form className="dashboard-login" onSubmit={handleLogin}>
          <p>Logga in som innehavare för att se restaurangens bokningar.</p>
          <label>
            Restaurang
            <select
              value={restaurantId}
              onChange={(event) => setRestaurantId(event.target.value)}
              required
            >
              <option value="" disabled>
                Välj restaurang
              </option>
              {restaurants?.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Lösenord
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="dashboard-button" disabled={loggingIn || !restaurants}>
            {loggingIn ? "Loggar in..." : "Logga in"}
          </button>
          {loginError && (
            <p className="dashboard-alert dashboard-alert-error" role="alert">
              {loginError}
            </p>
          )}
        </form>
      )}
    </article>
  );
}

export default Dashboard;
