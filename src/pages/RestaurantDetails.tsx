import { useParams } from "react-router-dom";
import useReadJson from "../hooks/useReadJson";


const RestaurantDetails = () => {
  const { id } = useParams();
  const restaurants = useReadJson() // Kommer konverteras till hook som läser från servern

  if (!id) return (<p>Restaurant was not found.</p>) // BYT UT MOT RIKTIG ERROR HANDLING

  const currentRestaurant = restaurants.find(restaurant => id === restaurant.id.toString())

   if (!currentRestaurant) return (<p>Restaurant was not found.</p>) // BYT UT MOT RIKTIG ERROR HANDLING

  return (
    <div>
      <h2>{currentRestaurant.name}</h2>
      <div>
        {currentRestaurant.descriptions.map((description, i) => (
          <div key={i}>
            <p>{description}</p>
          </div>
        ))}
      </div>
      <div>
        <img src="" alt="Pin Icon" />
        <p>{currentRestaurant.address}</p>
      </div>
    </div>
  );
};

export default RestaurantDetails;
