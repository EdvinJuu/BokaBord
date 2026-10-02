import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  return (
    <BootstrapNavbar bg="light" expand="md" sticky="top" className="border-bottom">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          BokaBord
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="main-nav" />
        <BootstrapNavbar.Collapse id="main-nav">
          <div className="flex-grow-1 mx-md-4 my-2 my-md-0">
            <SearchBar />
          </div>
          <Nav>
            <Nav.Link as={Link} to="/Dashboard">
              Mina Sidor
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
