import Form from "react-bootstrap/Form";

export function SearchBar() {
  return (
    <Form role="search" onSubmit={(event) => event.preventDefault()}>
      <Form.Control
        id="restaurant-search"
        type="search"
        placeholder="Sök restaurang, beskrivning etc..."
        aria-label="Sök restaurang"
      />
    </Form>
  );
}