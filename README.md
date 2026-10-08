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