import { RestaurantCard } from "./components/RestaurantCard"
import TestComponent from "./components/test"
import {reformulateDate} from "./utilities/dateFormatter"

function App() {

  return (
    <>
    <p>{reformulateDate("getHours")}</p>
    <p>{reformulateDate("getSeconds")}</p>
    <TestComponent />
    </>
  )
}

export default App
