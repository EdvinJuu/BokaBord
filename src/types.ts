
export interface RestaurantProps{
    id: number;
    name: string;
    address: string;
    menu: string;
    descriptions: string[]; // ["svensk mat", "familiärt", "bar"] Badge.tsx 
    openTime: number[]; // Specifiera att endast två nummer får vara i listan
    totalTables: number;
}

export interface ReservationProps{
    date: Date; // Osäkra om vi ska använda Date object eller bara string
    partySize: number;
}

export interface UserProps{
    name: string;
    phoneNumber: string; // Kan göra om till object med country code + number
    email: string;
}


