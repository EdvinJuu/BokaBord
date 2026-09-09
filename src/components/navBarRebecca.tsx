export function NavBar () {
    return (
        <div>
            <img src="" alt= "Företagslogga"></img>

            <SearchBar />

            <button>Mitt konto</button>

        </div>

    );
};

function SearchBar () {
    return (
        <input type="text" placeholder ="Sök restaurang, beskrivning etc..."/>
    );
    
};

function UserAccount () {
    return (
        <div>
            <input type="text" placeholder ="Användarnamn"/>
            <input type="password" placeholder ="Lösenord"/>
            <button>Logga in</button>
        </div>
    );
};