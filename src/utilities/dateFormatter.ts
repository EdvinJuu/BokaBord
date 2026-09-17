/* export const reformulateDate = ({ date, time }) => {
  return Din bokade tid är: ${date} kl ${time};
}; */

export const reformulateDatetoString = (date:Date) => {
  let currentHour = date.getHours().toString();
  if (date.getHours() < 10) currentHour = `0${currentHour}`
  let currentMinutes = date.getMinutes().toString();
  if (date.getMinutes() < 10) currentMinutes = `0${currentMinutes}`
  let currentSeconds = date.getSeconds().toString();
  if (date.getSeconds() < 10) currentSeconds = `0${currentSeconds}`

  return { currentHour, currentMinutes, currentSeconds };
};

export const reformulateStringtoDate = (StrFromInput:string) => {

    return Date(StrFromInput)
}