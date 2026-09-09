export interface RestaurantProps{
    id: number;
    name: string;
    address: string;
    menu: string;
    descriptions?: string[]; // ["svensk mat", "familiärt", "bar"] Badge.tsx 
}
/* if (thing) { kör den här funktionen}
else {kör den här funktionen}
thing == false ? kör den här funktionen : console.log() */



export function RestaurantCard({name, address, descriptions}: RestaurantProps) {
  
  /*   if (!descriptions) return; */

    return (
    <div>
      <h2>{name}</h2>
      <ul>
        {/* {descriptions.map((description) => {
        <li><p>{description}</p></li>
      })} */}
      {descriptions}
      </ul>
      <div>
        <img src="" alt="Pin Icon" />
        <p>{address}</p>
      </div>
    </div>
  );
}
