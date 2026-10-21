import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import "./Dashboard.css";
import api from "../services/api";

const sessionKey = "bokabord-admin-session";

interface AdminSession {
  token: string;
  username: string;
}

interface AdminBooking {
  restaurantId: number;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  contact?: string;
  sessionInterval?: number;
}

function readSession(): AdminSession | null {
  const raw = sessionStorage.getItem(sessionKey);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.token || !parsed.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

function Dashboard() {
  const [session, setSession] = useState<AdminSession | null>(readSession);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    let ignore = false;

    api
      .get<AdminBooking[]>("/bookings", {
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
      const response = await api.post<{ token: string; username: string }>(
        "/api/sessions",
        {
          username: username.trim(),
          password,
        },
      );
      const nextSession = {
        token: response.data.token,
        username: response.data.username,
      };
      sessionStorage.setItem(sessionKey, JSON.stringify(nextSession));
      setPassword("");
      setBookings(null);
      setBookingsError(null);
      setSession(nextSession);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error
        : null;
      setLoginError(
        typeof message === "string" ? message : "Kunde inte logga in",
      );
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
      await api.delete("/api/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Utloggningen här är redan gjord. Ett misslyckat anrop till servern ändrar inte det.
    }
  }

  const rows = bookings
    ? [...bookings].sort(
        (left, right) =>
          left.restaurantName.localeCompare(right.restaurantName, "sv") ||
          left.date.localeCompare(right.date) ||
          left.time.localeCompare(right.time),
      )
    : [];

  return (
    <article className="dashboard">
      <h1>Mina sidor</h1>
      {session ? (
        <>
          <div className="dashboard-heading">
            <p>Alla bokningar</p>
            <button
              type="button"
              className="dashboard-button dashboard-logout"
              onClick={handleLogout}
            >
              Logga ut
            </button>
          </div>
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
                  <th>Restaurang</th>
                  <th>Datum</th>
                  <th>Tid</th>
                  <th>Gäster</th>
                  <th>Kontakt</th>
                  <th>Längd</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((booking, index) => (
                  <tr
                    key={`${booking.restaurantId}-${booking.date}-${booking.time}-${booking.partySize}-${booking.contact ?? ""}-${index}`}
                  >
                    <td>{booking.restaurantName}</td>
                    <td>{booking.date}</td>
                    <td>{booking.time}</td>
                    <td>{booking.partySize}</td>
                    <td>{booking.contact || "—"}</td>
                    <td>
                      {booking.sessionInterval
                        ? `${booking.sessionInterval} min`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <form className="dashboard-login" onSubmit={handleLogin}>
          <p>Logga in för att se alla restaurangers bokningar.</p>
          <label>
            Användarnamn
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
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
          <button
            type="submit"
            className="dashboard-button"
            disabled={loggingIn}
          >
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
