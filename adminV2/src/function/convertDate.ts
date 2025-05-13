import moment from "moment";
export const convertDate = (date: string) => {
  return moment.utc(date).format("hh:mm:ss MM/DD/YYYY");
};
