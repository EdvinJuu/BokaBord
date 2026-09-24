import { createContext, useContext, useState, type ReactNode } from "react";
import type { ReservationProps } from "./types";

interface BookingContextType {
  booking: ReservationProps[];
  setBooking: React.Dispatch<React.SetStateAction<ReservationProps[]>>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState([{ date: new Date(), partySize: 5 }]); // BYT UT TEST OBJEKT

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined)
    throw new Error("useBooking must be used within a BookingProvider");
  return context;
}
