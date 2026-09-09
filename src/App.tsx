import { RestaurantCard } from "./components/RestaurantCard"
import { RestaurantCardÖmer } from "./components/RestaurantCardÖmer"
import TestComponent from "./components/test"
import {reformulateDate} from "./utilities/dateFormatter"

function App() {

  return (
    <>
    <p>{reformulateDate("getHours")}</p>
    <p>{reformulateDate("getSeconds")}</p>
    <RestaurantCard />
    <RestaurantCardÖmer />
    </>
  )
}

export default App
