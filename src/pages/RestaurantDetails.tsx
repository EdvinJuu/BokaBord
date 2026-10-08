
import { useParams } from "react-router-dom";

import "./RestaurantDetails.css";

import { useRead } from "../hooks/useRead";
import DataBoundary from "../components/DataBoundary";
import RestaurantDetailsContainer from "../components/RestaurantDetailsContainer";

const RestaurantDetails = () => {
  const { id } = useParams();

  if (!id) return (<p>Restaurant was not found.</p>) // BYT UT MOT RIKTIG ERROR HANDLING

  const {restaurants, isLoading, error} = useRead();

  


  return (
    <DataBoundary data={restaurants} isLoading={isLoading} error={error}>
      {(currentRestaurants) => <RestaurantDetailsContainer pageId={id} restaurants={currentRestaurants}/>}
    </DataBoundary>
  )

};

export default RestaurantDetails;
