

export function NavbarAlice () {
    return (
      <header className="navbar" style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", width: "50%"}}>
        <div className="logo" style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
            <h2>Boka Bord</h2>
            <img src="" alt="Logo" />
        </div>
        <div className="search-bar">
            <input style={{padding: "0.5rem", border: "1px solid #ccc", borderRadius: "20px"}} type="text" placeholder="Search for restaurants..." />
        </div>
      </header>
    );
}