import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  return (
    <header>
      <img src="" alt="LOGO" />
      <SearchBar />
      <Link to={"/dashboard"}>Dashboard</Link>
      <Link to={"/"}>Home</Link>
    </header>
  );
}
