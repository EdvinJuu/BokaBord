Restaurant list inspiration: https://www.bokabord.se/restauranger/stockholm

REFERENSFILER LIGGER I PUBLIC, VERIFIERA ATT DET ÄR RÄTT STÄLLE FÖR DEM ATT LIGGA.

## Starta

Frontend och backend körs i varsin terminal. Starta backend först.

### Backend

```bash
cd backend
npm install
npm start
```

API:t lyssnar på http://localhost:5001. Restaurangerna läses från `backend/assets/restaurants.json`.

`npm run dev` i `backend` startar samma server med nodemon, så den startar om när `server.js` ändras.

### Frontend

Kör det här från projektets rot:

```bash
npm install
npm run dev
```

Appen öppnas på http://localhost:5173. Anrop till `/api` skickas vidare till backend på port 5001, så båda servrarna behöver köra.


UI/UX
Design och struktur
Varje komponent har en CSS-fil och det finns en 
index.css för globala stilar.
Det gör koden enklare att underhålla och gör det lättare att ändra enskilda komponenters utseende samt säkerställer en konsekvent design i hela applikationen.

Användarvänlighet
Gränssnittet är utformat för att göra det enkelt för användaren att navigera i applikationen och genomföra en bokning.

Vi har fokuserat på:
- Igenkänning: En enhetlig design gör gränssnittet lättare att förstå och använda.
- Tydlighet: Meddelanden hjälper användaren att förstå resultatet av sina handlingar och uppmärksammar eventuella fel.
- Enkel navigering: React Router används för att hantera navigeringen mellan applikationens olika sidor.

Bokningsformuläret är utformat för att guida användaren genom bokningsprocessen och förhindra ogiltiga val.
- Användaren kan inte välja datum som har passerat, ogiltlig tid eller boka bord för 0 personer.
- Tydliga meddelanden hjälper användaren att förstå om något behöver korrigeras.
Dessa funktioner bidrar till en tydligare och smidigare bokningsupplevelse.

Designmål
Våra huvudsakliga designmål är att skapa ett gränssnitt som är:
- Användarvänligt – enkelt att förstå och navigera i.
- Konsekvent – med en enhetlig stil i hela applikationen.
- Tydligt – med begripliga meddelanden och återkoppling.
- Lätt att underhålla – genom en strukturerad uppdelning av CSS-stylingen.


Testning

I de tester vi utfört så använder vi oss av Jest. Testerna kontrollerar att datum och klockslag formateras korrekt, samt att inledande nollor läggs till när det behövs. exempelvis att dag 5 blir 05 och att klockan 09:05 inte blir 9:5. På så sätt kan vi kontrollera att funktionen ger rätt restultat för olika datum och tider. 


Validering

Vi har arbetat med validering både i frontend och backend för att säkerställa att bokningarna blir korrekta. Själva bokningsformuläret begränsar användaren till förvalda datum, tider och antal personer.
- Användaren kan bara välja datum som stäcker sig 14 dagar framöver.
- Användaren kan bara välja förbestämda tider, som även ligger inom restaurangens öppetider.
- Användaren kan bara boka för 1 till 8 personer.

Backend kontrollerar bland annat att restaurangen finns, att datum och tid har rätt format, att antalet gäster är mellan 1 och 8 samt att gästen fyllt i en godkännd kontaktuppgift. Vi har även lagt till en kontroll som förhindrar att fler bokningar görs vid samma tid än vad restaurangens kapacitet tillåter.