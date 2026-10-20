import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import type { RestaurantProps } from "../types";
import "./Dashboard.css";

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

    axios
      .get<OwnerBooking[]>(`/api/restaurants/${session.restaurantId}/bookings`, {
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

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    try {
      const response = await axios.post<{
        token: string;
        restaurant: { id: number; name: string };
      }>("/api/sessions", {
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
      setBookings(null);
      setBookingsError(null);
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
    setBookings(null);
    setBookingsError(null);
    setPassword("");

    if (!token) return;

    try {
      await axios.delete("/api/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Utloggningen här är redan gjord. Ett misslyckat anrop till servern ändrar inte det.
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
          {bookings && rows.length === 0 && <p className="dashboard-status">Inga bokningar ännu.</p>}
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
          {restaurants === null && !loginError && (
            <p className="dashboard-status" role="status">
              Hämtar restauranger...
            </p>
          )}
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
