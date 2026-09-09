import { RestaurantCard } from "./components/RestaurantCard"
import TestComponent from "./components/test"
import {reformulateDate} from "./utilities/dateFormatter"

function App() {

  return (
    <>
    <p>{reformulateDate("getHours")}</p>
    <p>{reformulateDate("getSeconds")}</p>
    <RestaurantCard name="ASD" address="Testvägen 13, Stockholm" />
    <RestaurantCard name="ASD" address="HAHAHA 32, Stockholm" descriptions={["Barhäng", "Elegant", "Mysigt"]}/>
    </>
  )
}

export default App
