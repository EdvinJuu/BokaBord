import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  return (
    <header className="site-header">
      <Link className="logo" to="/">
        BokaBord
      </Link>
      <SearchBar />
      <Link className="nav-link" to="/Dashboard">
        Mina Sidor
      </Link>
    </header>
  );
}
