export interface RestaurantProps {
  id: number;
  name: string;
  address: string;
  menu: string;
  image: string;
  descriptions: string[]; // ["svensk mat", "familiärt", "bar"] Badge.tsx
  openTime: number[]; // Specifiera att endast två nummer får vara i listan
  totalTables: number;
  sessionInterval: number; // Hur många minuter en bokning gäller
}

export interface ReservationProps {
  date: Date;
  partySize: number;
}

export interface UserProps {
  name: string;
  phoneNumber: string; // Kan göra om till object med country code + number
  email: string;
}

// En type som plockar ut urvalda props från RestaurantProps
export type BookingFormRestaurant = Pick<
  RestaurantProps,
  "id" | "name" | "sessionInterval" | "openTime"
>;
