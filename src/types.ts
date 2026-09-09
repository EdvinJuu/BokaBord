
export interface RestaurantProps{
    id: number;
    name: string;
    address: string;
    menu: string;
    descriptions: string[]; // ["svensk mat", "familiärt", "bar"] Badge.tsx 
}

export interface ReservationProps{
    date: Date; // Osäkra om vi ska använda Date object eller bara string
    partySize: number;
}

export interface UserProps{
    name: string;
    phoneNumber: number; // Kan göra om till object med country code + number
    email: string;
}





/* export interface AdminReservationProps{
    restaurant: RestaurantProps
    guest: UserProps;
    reservation: ReservationProps;
} */


