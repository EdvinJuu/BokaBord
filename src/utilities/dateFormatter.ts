
function addZero(number: number) { // kom på bättre namn!
    // Om numret som kommer in i funktionen är mindre än 10 så lägg till en nolla före
    return  number < 10 ? `0${number}` : number.toString(); 
}

export const reformulateDate = (date: Date, dateType: string) => {
  // dateType's type måste strikt endast tillåta en string som heter "getDate" eller "getTime"

  if (dateType === "getDate") {
    //  kör numret genom våran addZero funktion utifall om minuterna från vårat Date objekt är mindre än 10 (så typ "13:9" istället för "13:09")
    return `${date.getFullYear()}-${addZero(date.getMonth())}-${addZero(date.getDate())}`;
  }
  if (dateType === "getTime") {
    
    return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  }
};
