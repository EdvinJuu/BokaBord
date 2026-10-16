import { describe, it, expect} from "vitest";
import { reformulateDate } from "./dateFormatter";

// describe talar om vilken funktion vi testar. Fungerar som "mapp" till alla tester vi utför på funktionen.
// kan uteslutas, men gör testerna mer strukturerade om man han många tester till samma funktion. 
describe("reformulateDate", () => {
    
    //Kollar att datumet blir 2026-10-15
    it("Should format a date correctly", () => { 
        const date = new Date(2026, 9, 15); //månad 9 blir 10. Januari = 0

        const result = reformulateDate(date, "getDate");

        expect(result).toBe("2026-10-15");

        //"it" talar om att vi ska köra ett test, 
        // ("Should format a date correctly", är bara text för att förklara vad testet ska göra) 
        // Sedan arrow funktion som körs när testet utförs.
        // const date skapar en ny variabel med värdet av ett datum som vi bestämmer, ett testvärde
        // const result skapar en variabel där våra resultat sparas, sedan anropar vi functionen vi vill testa (reformulateDate)
        // och sickar med testvärdet vi skapade och "getDate" så vi får datum och inte klockslag.
        // expect är vad vi förväntar oss att värdet ska bli. Genom expect(result) ber vi koden att titta på värdet
        // som finns i variabeln result, sedan kör vi toBe("2026-10-15") vilket ber koden att kolla så att värdet i result är
        // exakt lika med det som står i parantesen. 
    });

    //Kollar att dag 5 blir 05 istället för bara 5
    it("Should add a leading zero to the day", () => {
        const date = new Date(2026, 9, 5);

        const result = reformulateDate(date, "getDate");

        expect(result).toBe("2026-10-05")
    });

    //Kollar att 14:30 blir 14:30
    it("Should format the time correctly", () => {
        const date = new Date(2026, 9, 15, 14, 30);

        const result = reformulateDate(date, "getTime");

        expect(result).toBe("14:30");
    });

    //Kollar så att det blir 09:05 inte 9:5
    it("Should add leading zeros to hours and minutes", () => {
        const date = new Date(2026, 9, 15, 9, 5);

        const result = reformulateDate(date, "getTime");

        expect(result).toBe("09:05");
    });
})

